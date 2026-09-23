import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { OrdensComponent } from './ordens.component';
import { OrdensService } from './ordens.service';
import { CatalogoService } from '../catalogo.service';
import { Equipamento, OrdemManutencao, Upv } from '../models';

const upvs = [
  { id: 1, nome: 'UPV A' },
  { id: 2, nome: 'UPV B' },
] as Upv[];

const equipamentos = [
  { id: 10, tag: 'A-CAL-01', upv: upvs[0] },
  { id: 20, tag: 'B-TUR-01', upv: upvs[1] },
] as Equipamento[];

const ordens = [
  {
    id: 100,
    numero: 'OM-100',
    status: 'aberta',
    tipo: 'preventiva',
    prioridade: 1,
    equipamento: equipamentos[0],
  },
  {
    id: 200,
    numero: 'OM-200',
    status: 'concluida',
    tipo: 'corretiva',
    prioridade: 2,
    equipamento: equipamentos[1],
  },
] as OrdemManutencao[];

describe('OrdensComponent', () => {
  let fixture: ComponentFixture<OrdensComponent>;
  let component: OrdensComponent;
  let ordensService: jasmine.SpyObj<OrdensService>;
  let catalogoService: jasmine.SpyObj<CatalogoService>;

  beforeEach(async () => {
    ordensService = jasmine.createSpyObj<OrdensService>('OrdensService', [
      'listar',
      'criar',
    ]);
    catalogoService = jasmine.createSpyObj<CatalogoService>('CatalogoService', [
      'listarUpvs',
      'listarEquipamentos',
    ]);

    ordensService.listar.and.returnValue(of(ordens));
    catalogoService.listarUpvs.and.returnValue(of(upvs));
    catalogoService.listarEquipamentos.and.returnValue(of(equipamentos));

    await TestBed.configureTestingModule({
      imports: [OrdensComponent],
      providers: [
        provideRouter([]),
        { provide: OrdensService, useValue: ordensService },
        { provide: CatalogoService, useValue: catalogoService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('carrega UPVs, equipamentos e ordens ao iniciar', () => {
    expect(component.upvs).toEqual(upvs);
    expect(component.equipamentos).toEqual(equipamentos);
    expect(component.ordens).toEqual(ordens);
  });

  it('pré-seleciona o primeiro equipamento no formulário', () => {
    expect(component.nova.equipamentoId).toBe(10);
  });

  it('mostra todas as ordens quando não há filtro', () => {
    expect(component.ordensFiltradas.length).toBe(2);
  });

  it('renderiza uma linha por ordem filtrada', () => {
    const linhas = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(linhas.length).toBe(2);
  });

  it('filtra por UPV', () => {
    component.filtroUpvId = 2;
    component.aplicarFiltros();

    expect(component.ordensFiltradas.map((o) => o.id)).toEqual([200]);
  });

  it('filtra por status', () => {
    component.filtroStatus = 'aberta';
    component.aplicarFiltros();

    expect(component.ordensFiltradas.map((o) => o.id)).toEqual([100]);
  });

  it('combina os dois filtros', () => {
    component.filtroUpvId = 1;
    component.filtroStatus = 'concluida';
    component.aplicarFiltros();

    expect(component.ordensFiltradas).toEqual([]);
  });

  it('alterna a exibição do formulário', () => {
    expect(component.mostrarFormulario).toBeFalse();

    const botao: HTMLButtonElement =
      fixture.nativeElement.querySelector('.cabecalho .btn');
    botao.click();
    fixture.detectChanges();

    expect(component.mostrarFormulario).toBeTrue();
    expect(fixture.nativeElement.querySelector('.form-nova')).not.toBeNull();
  });

  it('insere a ordem criada no topo da lista e fecha o formulário', () => {
    const criada = {
      id: 300,
      numero: 'OM-300',
      status: 'aberta',
      equipamento: equipamentos[0],
    } as OrdemManutencao;
    ordensService.criar.and.returnValue(of(criada));
    component.mostrarFormulario = true;

    component.criarOrdem();

    expect(ordensService.criar).toHaveBeenCalledWith(component.nova);
    expect(component.ordens[0]).toBe(criada);
    expect(component.ordensFiltradas[0]).toBe(criada);
    expect(component.mostrarFormulario).toBeFalse();
  });
});
