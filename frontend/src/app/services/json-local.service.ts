import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GastoJson } from '../models/gasto-json';

@Injectable({
  providedIn: 'root',
})
export class JsonLocalService {
  constructor(private readonly http: HttpClient) {}

  listarDatosLocales(): Observable<GastoJson[]> {
    return this.http.get<GastoJson[]>('assets/datos.json');
  }
}
