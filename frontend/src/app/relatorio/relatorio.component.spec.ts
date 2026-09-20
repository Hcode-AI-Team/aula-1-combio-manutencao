import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RelatorioComponent } from './relatorio.component';
import { CatalogoService } from '../catalogo.service';
import { RelatorioUpv } from '../models';

const relatorio: RelatorioUpv[] = [
  {
    nome: 'UPV A',
    totalOrdens: 3,
    ordensAbertas: 1,
    custoEstimadoTotal: 4500,
  },
  {
    nome: 'UPV B',
    totalOrdens: 0,
    ordensAbertas: 0,
    custoEstimadoTotal: 0,
  },
];

describe('RelatorioComponent', () => {
  let fixture: ComponentFixture<RelatorioComponent>;
  let component: RelatorioComponent;
  let catalogoService: jasmine.SpyObj<CatalogoService>;

  beforeEach(async () => {
    catalogoService = jasmine.createSpyObj<CatalogoService>('CatalogoService', [
      'relatorioOrdensPorUpv',
    ]);
    catalogoService.relatorioOrdensPorUpv.and.returnValue(of(relatorio));

    await TestBed.configureTestingModule({
      imports: [RelatorioComponent],
      providers: [{ provide: CatalogoService, useValue: catalogoService }],
    }).compileComponents();

    fixture = TestBed.createComponent(RelatorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('carrega o relatório ao iniciar', () => {
    expect(catalogoService.relatorioOrdensPorUpv).toHaveBeenCalledTimes(1);
    expect(component.relatorio).toEqual(relatorio);
  });

  it('renderiza um card por UPV', () => {
    const cards = fixture.nativeElement.querySelectorAll('.grid-cards .card');
    expect(cards.length).toBe(2);
  });

  it('exibe os totais e o custo formatado em reais', () => {
    const primeiro: HTMLElement =
      fixture.nativeElement.querySelector('.grid-cards .card');

    expect(primeiro.textContent).toContain('UPV A');
    expect(primeiro.textContent).toContain('3');
    expect(primeiro.textContent).toContain('4,500.00');
  });
});
