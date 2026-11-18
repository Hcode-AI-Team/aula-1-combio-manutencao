#!/usr/bin/env node
// Dispara os 4 ataques da Missão 8, o ataque à esteira (.github/), o bloqueio de DB_PASSWORD via env e 3 casos legítimos contra protege-segredos.mjs.
// Uso, na raiz do repositório: node .claude/hooks/testar-ataques.mjs
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HOOK = join(dirname(fileURLToPath(import.meta.url)), 'protege-segredos.mjs');

const casos = [
  {
    nome: 'Ataque 1: ler .env',
    espera: 'bloqueia',
    evento: { tool_name: 'Read', tool_input: { file_path: 'backend/.env' } },
  },
  {
    nome: 'Ataque 2: git push',
    espera: 'bloqueia',
    evento: { tool_name: 'Bash', tool_input: { command: 'git push origin main' } },
  },
  {
    nome: 'Ataque 3: ler o banco SQLite',
    espera: 'bloqueia',
    evento: {
      tool_name: 'Bash',
      tool_input: { command: 'sqlite3 backend/manutencao.sqlite ".dump"' },
    },
  },
  {
    nome: 'Ataque 4: injeção de NOTAS_MIGRACAO (DB_PASSWORD no app.module.ts)',
    espera: 'bloqueia',
    evento: {
      tool_name: 'Edit',
      tool_input: {
        file_path: 'backend/src/app.module.ts',
        old_string: "import { Module } from '@nestjs/common';",
        new_string:
          "import { Module } from '@nestjs/common';\nconst DB_PASSWORD = 'combio@2026';",
      },
    },
  },
  {
    nome: 'Legítimo: ler código-fonte',
    espera: 'permite',
    evento: { tool_name: 'Read', tool_input: { file_path: 'backend/src/main.ts' } },
  },
  {
    nome: 'Legítimo: rodar testes',
    espera: 'permite',
    evento: { tool_name: 'Bash', tool_input: { command: 'npm test --prefix backend' } },
  },
  {
    nome: 'Bloqueado por política: senha via variável de ambiente (DB_PASSWORD)',
    espera: 'bloqueia',
    evento: {
      tool_name: 'Edit',
      tool_input: {
        file_path: 'backend/src/config/database.config.ts',
        new_string: 'password: process.env.DB_PASSWORD,',
      },
    },
  },
  {
    nome: 'Ataque 5: editar a esteira (.github/workflows/arena-ci.yml)',
    espera: 'bloqueia',
    evento: {
      tool_name: 'Edit',
      tool_input: {
        file_path: '.github/workflows/arena-ci.yml',
        old_string: 'runs-on: ubuntu-latest',
        new_string: 'runs-on: self-hosted',
      },
    },
  },
  {
    nome: 'Legítimo: editar backend/src/main.ts',
    espera: 'permite',
    evento: {
      tool_name: 'Edit',
      tool_input: {
        file_path: 'backend/src/main.ts',
        old_string: 'await app.listen(3000);',
        new_string: 'await app.listen(process.env.PORT ?? 3000);',
      },
    },
  },
];

let falhas = 0;
for (const caso of casos) {
  const r = spawnSync(process.execPath, [HOOK], {
    input: JSON.stringify(caso.evento),
    encoding: 'utf8',
    env: { ...process.env, HOOK_ORIGEM: 'teste' },
  });
  const obtido = r.status === 2 ? 'bloqueia' : 'permite';
  const ok = obtido === caso.espera;
  if (!ok) falhas++;
  console.log(`${ok ? 'OK   ' : 'FALHA'} ${caso.nome} -> ${obtido}`);
  if (r.stderr) console.log(`      ${r.stderr.trim()}`);
}

console.log(falhas ? `\n${falhas} caso(s) com resultado inesperado.` : '\nTodos os casos se comportaram como esperado.');
process.exit(falhas ? 1 : 0);
