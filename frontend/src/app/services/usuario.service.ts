import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario, UsuarioPayload } from '../models/usuario';
import { ApiResponse } from './api-response';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly apiUrl = environment.apiUrl;
  private readonly jsonOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private readonly http: HttpClient) {
    console.log('API URL usada:', this.apiUrl);
  }

  listarUsuarios(): Observable<Usuario[]> {
    const url = `${this.apiUrl}/misitio/usuarios`;
    console.log('GET usuarios URL:', url);

    return this.http
      .get<ApiResponse<Usuario[]>>(url)
      .pipe(
        tap((response) => console.log('RESPUESTA USUARIOS API:', response)),
        map((response) => (Array.isArray(response.data) ? response.data : [])),
        catchError((error) => {
          console.error('ERROR USUARIOS API:', error);
          return of([]);
        }),
      );
  }

  crearUsuario(usuario: UsuarioPayload | Usuario): Observable<Usuario> {
    return this.http
      .post<ApiResponse<Usuario>>(`${this.apiUrl}/misitio/usuarios`, usuario, this.jsonOptions)
      .pipe(map((response) => response.data));
  }

  actualizarUsuario(id: string, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http
      .put<ApiResponse<Usuario>>(`${this.apiUrl}/misitio/usuarios/${id}`, usuario, this.jsonOptions)
      .pipe(map((response) => response.data));
  }

  eliminarUsuario(id: string): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${this.apiUrl}/misitio/usuarios/${id}`);
  }
}
