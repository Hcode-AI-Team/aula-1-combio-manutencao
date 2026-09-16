import { Routes } from '@angular/router';
import { OrdensComponent } from './ordens/ordens.component';
import { OrdemDetalheComponent } from './ordens/ordem-detalhe.component';
import { RelatorioComponent } from './relatorio/relatorio.component';

export const routes: Routes = [
  { path: '', redirectTo: 'ordens', pathMatch: 'full' },
  { path: 'ordens', component: OrdensComponent },
  { path: 'ordens/:id', component: OrdemDetalheComponent },
  { path: 'relatorio', component: RelatorioComponent },
];
