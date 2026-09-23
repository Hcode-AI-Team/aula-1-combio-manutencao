#!/usr/bin/env node
// Hook PostToolUse: roda o ESLint (com --fix) no arquivo .ts que o agente acabou de editar.
// Se sobrar erro, sai com código 2 e o stderr volta para o agente corrigir.
import { spawnSync } from 'node:child_process';
import { appendFileSync, existsSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const LOG = join(RAIZ, '.claude', 'hooks', 'hooks.log');

function lerStdin() {
  return new Promise((resolveStdin) => {
    let dados = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (parte) => (dados += parte));
    process.stdin.on('end', () => resolveStdin(dados));
  });
}

function registrar(decisao, detalhe) {
  try {
    appendFileSync(
      LOG,
      `${new Date().toISOString()} [lint-arquivo] ${decisao} ${detalhe}\n`,
    );
  } catch {
    // sem log não é motivo para travar o agente
  }
}

let entrada = {};
try {
  entrada = JSON.parse((await lerStdin()) || '{}');
} catch {
  process.exit(0);
}

const ti = entrada.tool_input ?? entrada.toolInput ?? {};
const caminho = ti.file_path ?? ti.filePath ?? ti.path;
if (typeof caminho !== 'string' || !caminho.endsWith('.ts')) process.exit(0);

const absoluto = resolve(entrada.cwd ?? RAIZ, caminho);
const relativo = relative(RAIZ, absoluto);
const [projeto] = relativo.split(sep);
if (!['backend', 'frontend'].includes(projeto) || relativo.includes('node_modules')) {
  process.exit(0);
}

const pastaProjeto = join(RAIZ, projeto);
const eslint = join(pastaProjeto, 'node_modules', 'eslint', 'bin', 'eslint.js');
if (!existsSync(eslint)) process.exit(0);

// eslint.js direto, sem npx: no Windows o npx soma ~25s a cada edição
const resultado = spawnSync(
  process.execPath,
  [eslint, '--fix', relative(pastaProjeto, absoluto)],
  { cwd: pastaProjeto, encoding: 'utf8', timeout: 55_000 },
);

if (resultado.status === 0) {
  registrar('ok', relativo);
  process.exit(0);
}

registrar('ERROS', relativo);
process.stderr.write(
  `[lint-arquivo] ESLint encontrou problemas em ${relativo}:\n${resultado.stdout}${resultado.stderr}`,
);
process.exit(2);
