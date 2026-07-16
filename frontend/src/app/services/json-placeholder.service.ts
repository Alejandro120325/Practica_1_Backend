import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExternalUser } from '../models/external-user';

@Injectable({
  providedIn: 'root',
})
export class JsonPlaceholderService {
  private readonly url = 'https://jsonplaceholder.typicode.com/users';

  constructor(private readonly http: HttpClient) {}

  listarUsuariosExternos(): Observable<ExternalUser[]> {
    return this.http.get<ExternalUser[]>(this.url);
  }
}
