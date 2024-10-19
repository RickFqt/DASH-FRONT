import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Opcao } from './opcao';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpcaoService {

  url = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Opcao[]> {
    return this.http.get<Opcao[]>(`/api/opcao`);
  }

  getById(id: number): Observable<Opcao> {
    return this.http.get<Opcao>(`/api/opcao/${id}`);
  }
}
