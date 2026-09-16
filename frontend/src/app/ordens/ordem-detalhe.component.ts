import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrdensService } from './ordens.service';
import { OrdemManutencao } from '../models';

@Component({
  selector: 'app-ordem-detalhe',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="card" *ngIf="ordem">
      <h1>{{ ordem.numero }}</h1>
      <p>{{ ordem.descricao }}</p>
      <ul>
        <li>Status: <strong>{{ ordem.status }}</strong></li>
        <li>Tipo: {{ ordem.tipo }}</li>
        <li>Prioridade: {{ ordem.prioridade }}</li>
        <li>UPV: {{ ordem.equipamento?.upv?.nome }}</li>
        <li>Equipamento: {{ ordem.equipamento?.tag }}</li>
        <li>Custo estimado: {{ ordem.custoEstimado | currency: 'BRL' }}</li>
      </ul>
      <div class="acoes">
        <button
          class="btn"
          type="button"
          *ngFor="let status of proximosStatus"
          (click)="mudarStatus(status)"
        >
          Marcar como {{ status }}
        </button>
      </div>
    </section>
  `,
  styles: [
    `
      .acoes {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
    `,
  ],
})
export class OrdemDetalheComponent implements OnInit {
  ordem?: OrdemManutencao;
  readonly proximosStatus: OrdemManutencao['status'][] = [
    'aberta',
    'em_execucao',
    'concluida',
    'cancelada',
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly ordensService: OrdensService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.ordensService.obter(id).subscribe((ordem) => {
      this.ordem = ordem;
    });
  }

  mudarStatus(status: OrdemManutencao['status']): void {
    if (!this.ordem) {
      return;
    }
    this.ordensService.atualizarStatus(this.ordem.id, status).subscribe((ordem) => {
      this.ordem = ordem;
    });
  }
}
