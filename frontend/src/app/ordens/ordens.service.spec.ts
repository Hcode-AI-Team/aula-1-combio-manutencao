import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { OrdensService } from './ordens.service';
import { environment } from '../../environments/environment';
import { OrdemManutencao } from '../models';

describe('OrdensService', () => {
  let service: OrdensService;
  let http: HttpTestingController;
  const url = `${environment.apiUrl}/ordens`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(OrdensService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('lista as ordens', () => {
    const esperado = [{ id: 1, numero: 'OM-00001' }] as OrdemManutencao[];
    let recebido: OrdemManutencao[] | undefined;

    service.listar().subscribe((ordens) => (recebido = ordens));

    const req = http.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(esperado);

    expect(recebido).toEqual(esperado);
  });

  it('obtém uma ordem pelo id', () => {
    service.obter(7).subscribe();

    const req = http.expectOne(`${url}/7`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 7 });
  });

  it('envia o payload completo ao criar', () => {
    const payload = {
      numero: 'OM-00099',
      descricao: 'Troca de rolamento',
      tipo: 'corretiva' as const,
      prioridade: 2 as const,
      equipamentoId: 2,
      custoEstimado: 4500,
    };

    service.criar(payload).subscribe();

    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 9, ...payload });
  });

  it('usa PATCH no endpoint de status', () => {
    service.atualizarStatus(5, 'concluida').subscribe();

    const req = http.expectOne(`${url}/5/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'concluida' });
    req.flush({ id: 5, status: 'concluida' });
  });

  it('propaga erro HTTP ao chamador', () => {
    let status: number | undefined;

    service.obter(999).subscribe({
      error: (erro: { status: number }) => (status = erro.status),
    });

    http
      .expectOne(`${url}/999`)
      .flush('não encontrada', { status: 404, statusText: 'Not Found' });

    expect(status).toBe(404);
  });
});
