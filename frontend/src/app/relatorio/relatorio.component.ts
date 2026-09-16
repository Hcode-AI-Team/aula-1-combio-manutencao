import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogoService } from '../catalogo.service';
import { RelatorioUpv } from '../models';

@Component({
  selector: 'app-relatorio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Relatório de ordens por UPV</h1>
    <div class="grid-cards">
      <article class="card" *ngFor="let item of relatorio">
        <h2>{{ item.nome }}</h2>
        <p>Total de ordens: <strong>{{ item.totalOrdens }}</strong></p>
        <p>Ordens abertas: <strong>{{ item.ordensAbertas }}</strong></p>
        <p>
          Custo estimado total:
          <strong>{{ item.custoEstimadoTotal | currency: 'BRL' }}</strong>
        </p>
      </article>
    </div>
  `,
})
export class RelatorioComponent implements OnInit {
  relatorio: RelatorioUpv[] = [];

  constructor(private readonly catalogoService: CatalogoService) {}

  ngOnInit(): void {
    this.catalogoService.relatorioOrdensPorUpv().subscribe((dados) => {
      this.relatorio = dados;
    });
  }
}
