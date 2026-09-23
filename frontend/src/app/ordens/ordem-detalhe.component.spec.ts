import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { OrdemDetalheComponent } from './ordem-detalhe.component';
import { OrdensService } from './ordens.service';
import { OrdemManutencao } from '../models';

const ordem = {
  id: 7,
  numero: 'OM-007',
  descricao: 'Inspeção da caldeira',
  tipo: 'preventiva',
  status: 'aberta',
  prioridade: 1,
  custoEstimado: 1500,
  equipamento: { id: 10, tag: 'A-CAL-01', upv: { id: 1, nome: 'UPV A' } },
} as OrdemManutencao;

describe('OrdemDetalheComponent', () => {
  let fixture: ComponentFixture<OrdemDetalheComponent>;
  let component: OrdemDetalheComponent;
  let ordensService: jasmine.SpyObj<OrdensService>;

  async function montar(idDaRota: string | null) {
    ordensService = jasmine.createSpyObj<OrdensService>('OrdensService', [
      'obter',
      'atualizarStatus',
    ]);
    ordensService.obter.and.returnValue(of(ordem));

    await TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [OrdemDetalheComponent],
        providers: [
          { provide: OrdensService, useValue: ordensService },
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: { paramMap: { get: () => idDaRota } },
            },
          },
        ],
      })
      .compileComponents();

    fixture = TestBed.createComponent(OrdemDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('busca a ordem usando o id da rota', async () => {
    await montar('7');

    expect(ordensService.obter).toHaveBeenCalledWith(7);
    expect(component.ordem).toEqual(ordem);
  });

  it('renderiza os dados da ordem', async () => {
    await montar('7');

    const texto: string = fixture.nativeElement.textContent;
    expect(texto).toContain('OM-007');
    expect(texto).toContain('Inspeção da caldeira');
    expect(texto).toContain('UPV A');
  });

  it('oferece um botão para cada status possível', async () => {
    await montar('7');

    const botoes = fixture.nativeElement.querySelectorAll('.acoes .btn');
    expect(botoes.length).toBe(4);
  });

  it('atualiza a ordem exibida ao mudar o status', async () => {
    await montar('7');
    const concluida = { ...ordem, status: 'concluida' } as OrdemManutencao;
    ordensService.atualizarStatus.and.returnValue(of(concluida));

    component.mudarStatus('concluida');

    expect(ordensService.atualizarStatus).toHaveBeenCalledWith(7, 'concluida');
    expect(component.ordem?.status).toBe('concluida');
  });

  it('não chama o service quando ainda não há ordem carregada', async () => {
    await montar('7');
    component.ordem = undefined;

    component.mudarStatus('cancelada');

    expect(ordensService.atualizarStatus).not.toHaveBeenCalled();
  });

  // Sem id na rota o Number(null) vira 0 e a busca é disparada mesmo assim.
  it('converte id ausente para 0', async () => {
    await montar(null);

    expect(ordensService.obter).toHaveBeenCalledWith(0);
  });
});
