import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Secao, SecaoUpdate } from './secao';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecaoService {

  url = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Secao[]> {
    return this.http.get<Secao[]>(`/api/secao`);
  }

  getById(id: number): Observable<Secao> {
    return this.http.get<Secao>(`/api/secao/${id}`);
  }

  update(id:number, secao: SecaoUpdate): Observable<Secao> {
    return this.http.put<Secao>(`/api/secao/${id}`, secao);
  }
}
