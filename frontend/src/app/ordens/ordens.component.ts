import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OrdensService } from './ordens.service';
import { CatalogoService } from '../catalogo.service';
import { Equipamento, OrdemManutencao, Upv } from '../models';

@Component({
  selector: 'app-ordens',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="card">
      <header class="cabecalho">
        <h1>Ordens de manutenção</h1>
        <button class="btn" type="button" (click)="mostrarFormulario = !mostrarFormulario">
          Nova ordem
        </button>
      </header>

      <div class="filtros">
        <label>
          UPV
          <select [(ngModel)]="filtroUpvId" (ngModelChange)="aplicarFiltros()">
            <option [ngValue]="null">Todas</option>
            <option *ngFor="let upv of upvs" [ngValue]="upv.id">{{ upv.nome }}</option>
          </select>
        </label>
        <label>
          Status
          <select [(ngModel)]="filtroStatus" (ngModelChange)="aplicarFiltros()">
            <option value="">Todos</option>
            <option value="aberta">Aberta</option>
            <option value="em_execucao">Em execução</option>
            <option value="concluida">Concluída</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </label>
      </div>

      <form *ngIf="mostrarFormulario" class="form-nova" (ngSubmit)="criarOrdem()">
        <label>
          Número
          <input name="numero" [(ngModel)]="nova.numero" required />
        </label>
        <label>
          Descrição
          <input name="descricao" [(ngModel)]="nova.descricao" required />
        </label>
        <label>
          Tipo
          <select name="tipo" [(ngModel)]="nova.tipo">
            <option value="preventiva">Preventiva</option>
            <option value="corretiva">Corretiva</option>
            <option value="preditiva">Preditiva</option>
          </select>
        </label>
        <label>
          Prioridade
          <select name="prioridade" [(ngModel)]="nova.prioridade">
            <option [ngValue]="1">1</option>
            <option [ngValue]="2">2</option>
            <option [ngValue]="3">3</option>
          </select>
        </label>
        <label>
          Equipamento
          <select name="equipamentoId" [(ngModel)]="nova.equipamentoId" required>
            <option *ngFor="let eq of equipamentos" [ngValue]="eq.id">
              {{ eq.tag }} ({{ eq.upv?.nome }})
            </option>
          </select>
        </label>
        <label>
          Custo estimado
          <input
            type="number"
            name="custoEstimado"
            [(ngModel)]="nova.custoEstimado"
            required
          />
        </label>
        <button class="btn" type="submit">Salvar</button>
      </form>

      <table class="tabela">
        <thead>
          <tr>
            <th>Número</th>
            <th>UPV</th>
            <th>Equipamento</th>
            <th>Tipo</th>
            <th>Status</th>
            <th>Prioridade</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let ordem of ordensFiltradas">
            <td>
              <a [routerLink]="['/ordens', ordem.id]">{{ ordem.numero }}</a>
            </td>
            <td>{{ ordem.equipamento?.upv?.nome }}</td>
            <td>{{ ordem.equipamento?.tag }}</td>
            <td>{{ ordem.tipo }}</td>
            <td>{{ ordem.status }}</td>
            <td>{{ ordem.prioridade }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  `,
  styles: [
    `
      .cabecalho {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      h1 {
        margin: 0;
        font-size: 1.4rem;
      }
      .form-nova {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 0.75rem;
        margin-bottom: 1.25rem;
      }
      .form-nova label {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-size: 0.85rem;
      }
    `,
  ],
})
export class OrdensComponent implements OnInit {
  upvs: Upv[] = [];
  equipamentos: Equipamento[] = [];
  ordens: OrdemManutencao[] = [];
  ordensFiltradas: OrdemManutencao[] = [];
  filtroUpvId: number | null = null;
  filtroStatus = '';
  mostrarFormulario = false;
  nova = {
    numero: '',
    descricao: '',
    tipo: 'preventiva' as OrdemManutencao['tipo'],
    prioridade: 2 as OrdemManutencao['prioridade'],
    equipamentoId: 0,
    custoEstimado: 1000,
  };

  constructor(
    private readonly ordensService: OrdensService,
    private readonly catalogoService: CatalogoService,
  ) {}

  ngOnInit(): void {
    this.catalogoService.listarUpvs().subscribe((upvs) => {
      this.upvs = upvs;
    });
    this.catalogoService.listarEquipamentos().subscribe((equipamentos) => {
      this.equipamentos = equipamentos;
      if (equipamentos.length && !this.nova.equipamentoId) {
        this.nova.equipamentoId = equipamentos[0].id;
      }
    });
    this.ordensService.listar().subscribe((ordens) => {
      this.ordens = ordens;
      this.aplicarFiltros();
    });
  }

  aplicarFiltros(): void {
    this.ordensFiltradas = this.ordens.filter((ordem) => {
      const upvOk =
        this.filtroUpvId === null ||
        ordem.equipamento?.upv?.id === this.filtroUpvId;
      const statusOk = !this.filtroStatus || ordem.status === this.filtroStatus;
      return upvOk && statusOk;
    });
  }

  criarOrdem(): void {
    this.ordensService.criar(this.nova).subscribe((ordem) => {
      this.ordens = [ordem, ...this.ordens];
      this.mostrarFormulario = false;
      this.aplicarFiltros();
    });
  }
}
