import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="topo">
      <strong>Combio Manutenção</strong>
      <nav>
        <a routerLink="/ordens">Ordens</a>
        <a routerLink="/relatorio">Relatório</a>
      </nav>
    </header>
    <main class="container">
      <router-outlet />
    </main>
  `,
  styles: [
    `
      .topo {
        background: #15492a;
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.9rem 1.5rem;
      }
      nav {
        display: flex;
        gap: 1rem;
      }
      a {
        opacity: 0.9;
      }
      a:hover {
        opacity: 1;
      }
    `,
  ],
})
export class AppComponent {}
