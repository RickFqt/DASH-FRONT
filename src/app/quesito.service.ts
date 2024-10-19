import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quesito } from './quesito';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuesitoService {

  url = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Quesito[]> {
    return this.http.get<Quesito[]>(`/api/quesito`);
  }

  getById(id: number): Observable<Quesito> {
    return this.http.get<Quesito>(`/api/quesito/${id}`);
  }
}
