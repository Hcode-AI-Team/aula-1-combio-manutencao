import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('cria o componente raiz', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('exibe o nome da aplicação no topo', () => {
    expect(fixture.nativeElement.querySelector('.topo strong').textContent)
      .toContain('Combio Manutenção');
  });

  it('oferece navegação para ordens e relatório', () => {
    const links: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('nav a'),
    );

    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '/ordens',
      '/relatorio',
    ]);
  });

  it('reserva o ponto de montagem das rotas', () => {
    expect(fixture.nativeElement.querySelector('router-outlet')).not.toBeNull();
  });
});
