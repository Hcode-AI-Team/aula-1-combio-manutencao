import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrdemManutencao } from '../models';

@Injectable({ providedIn: 'root' })
export class OrdensService {
  private readonly url = `${environment.apiUrl}/ordens`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<OrdemManutencao[]> {
    return this.http.get<OrdemManutencao[]>(this.url);
  }

  obter(id: number): Observable<OrdemManutencao> {
    return this.http.get<OrdemManutencao>(`${this.url}/${id}`);
  }

  criar(payload: {
    numero: string;
    descricao: string;
    tipo: OrdemManutencao['tipo'];
    prioridade: OrdemManutencao['prioridade'];
    equipamentoId: number;
    custoEstimado: number;
  }): Observable<OrdemManutencao> {
    return this.http.post<OrdemManutencao>(this.url, payload);
  }

  atualizarStatus(
    id: number,
    status: OrdemManutencao['status'],
  ): Observable<OrdemManutencao> {
    return this.http.patch<OrdemManutencao>(`${this.url}/${id}/status`, {
      status,
    });
  }
}
