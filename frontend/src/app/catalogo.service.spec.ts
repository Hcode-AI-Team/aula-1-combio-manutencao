import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { CatalogoService } from './catalogo.service';
import { environment } from '../environments/environment';
import { RelatorioUpv, Upv } from './models';

describe('CatalogoService', () => {
  let service: CatalogoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CatalogoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('lista as UPVs', () => {
    const esperado = [{ id: 1, nome: 'UPV Teste' }] as Upv[];
    let recebido: Upv[] | undefined;

    service.listarUpvs().subscribe((upvs) => (recebido = upvs));

    const req = http.expectOne(`${environment.apiUrl}/upvs`);
    expect(req.request.method).toBe('GET');
    req.flush(esperado);

    expect(recebido).toEqual(esperado);
  });

  it('lista equipamentos sem filtro quando não recebe upvId', () => {
    service.listarEquipamentos().subscribe();

    const req = http.expectOne(`${environment.apiUrl}/equipamentos`);
    expect(req.request.urlWithParams).toBe(
      `${environment.apiUrl}/equipamentos`,
    );
    req.flush([]);
  });

  it('inclui o upvId na query string quando informado', () => {
    service.listarEquipamentos(3).subscribe();

    const req = http.expectOne(`${environment.apiUrl}/equipamentos?upvId=3`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  // upvId 0 é falsy, então o filtro é omitido mesmo tendo sido passado.
  it('omite o filtro quando o upvId é 0', () => {
    service.listarEquipamentos(0).subscribe();

    const req = http.expectOne(`${environment.apiUrl}/equipamentos`);
    expect(req.request.urlWithParams).not.toContain('upvId');
    req.flush([]);
  });

  it('busca o relatório de ordens por UPV', () => {
    const esperado: RelatorioUpv[] = [
      {
        nome: 'UPV Teste',
        totalOrdens: 2,
        ordensAbertas: 1,
        custoEstimadoTotal: 3500,
      },
    ];
    let recebido: RelatorioUpv[] | undefined;

    service.relatorioOrdensPorUpv().subscribe((dados) => (recebido = dados));

    const req = http.expectOne(
      `${environment.apiUrl}/relatorios/ordens-por-upv`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(esperado);

    expect(recebido).toEqual(esperado);
  });
});
