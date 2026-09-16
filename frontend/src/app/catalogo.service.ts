import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Equipamento, RelatorioUpv, Upv } from './models';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  constructor(private readonly http: HttpClient) {}

  listarUpvs(): Observable<Upv[]> {
    return this.http.get<Upv[]>(`${environment.apiUrl}/upvs`);
  }

  listarEquipamentos(upvId?: number): Observable<Equipamento[]> {
    const params = upvId ? `?upvId=${upvId}` : '';
    return this.http.get<Equipamento[]>(
      `${environment.apiUrl}/equipamentos${params}`,
    );
  }

  relatorioOrdensPorUpv(): Observable<RelatorioUpv[]> {
    return this.http.get<RelatorioUpv[]>(
      `${environment.apiUrl}/relatorios/ordens-por-upv`,
    );
  }
}
