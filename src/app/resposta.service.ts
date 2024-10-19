import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resposta } from './resposta';

@Injectable({
  providedIn: 'root'
})
export class RespostaService {

  url = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Resposta[]> {
    return this.http.get<Resposta[]>(`/api/resposta`);
  }

  getById(id: number): Observable<Resposta> {
    return this.http.get<Resposta>(`/api/resposta/${id}`);
  }
}
