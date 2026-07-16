import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Gasto, GastoPayload } from '../models/gasto';
import { ApiResponse } from './api-response';

@Injectable({
  providedIn: 'root',
})
export class GastoService {
  private readonly apiUrl = environment.apiUrl;
  private readonly jsonOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private readonly http: HttpClient) {
    console.log('API URL usada:', this.apiUrl);
  }

  verificarHealth(): Observable<ApiResponse<unknown>> {
    return this.http.get<ApiResponse<unknown>>(`${this.apiUrl}/misitio/health`);
  }

  listarGastos(): Observable<Gasto[]> {
    const url = `${this.apiUrl}/misitio/gastos`;
    console.log('GET gastos URL:', url);

    return this.http
      .get<ApiResponse<Gasto[]>>(url)
      .pipe(
        tap((response) => console.log('RESPUESTA GASTOS API:', response)),
        map((response) => (Array.isArray(response.data) ? response.data : [])),
        catchError((error) => {
          console.error('ERROR GASTOS API:', error);
          return of([]);
        }),
      );
  }

  listarGastosPorCedula(cedula: string): Observable<Gasto[]> {
    const url = `${this.apiUrl}/misitio/gastos/${cedula}`;
    console.log('GET gastos por cedula URL:', url);

    return this.http
      .get<ApiResponse<Gasto[]>>(url)
      .pipe(
        tap((response) => console.log('RESPUESTA GASTOS POR CEDULA API:', response)),
        map((response) => (Array.isArray(response.data) ? response.data : [])),
        catchError((error) => {
          console.error('ERROR GASTOS POR CEDULA API:', error);
          return of([]);
        }),
      );
  }

  crearGasto(gasto: GastoPayload | Gasto): Observable<Gasto> {
    return this.http
      .post<ApiResponse<Gasto>>(`${this.apiUrl}/misitio/gastos`, gasto, this.jsonOptions)
      .pipe(map((response) => response.data));
  }

  actualizarGasto(id: string, gasto: Partial<Gasto>): Observable<Gasto> {
    return this.http
      .put<ApiResponse<Gasto>>(`${this.apiUrl}/misitio/gastos/${id}`, gasto, this.jsonOptions)
      .pipe(map((response) => response.data));
  }

  eliminarGasto(id: string): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${this.apiUrl}/misitio/gastos/${id}`);
  }
}
