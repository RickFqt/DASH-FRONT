import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Prontuario } from './prontuario';
import { Observable } from 'rxjs';
import { Secao, SecaoCreate } from './secao';

@Injectable({
  providedIn: 'root'
})
export class ProntuarioService {

  url = 'http://localhost:8080';


  constructor(private http: HttpClient) { }


  getAll(): Observable<Prontuario[]> {
    return this.http.get<Prontuario[]>(`/api/prontuario`);
  }

  getById(id: number): Observable<Prontuario> {
    return this.http.get<Prontuario>(`/api/prontuario/${id}`);
  }

  addProntuario(nome: string, descricao: string, ): void {
    const prontuario = { 
      nome: nome,
      descricao: descricao,
      ehPublico: false,
      ehTemplate: false
    };

    this.http.post(`/api/prontuario`, prontuario).subscribe(
      (response) => {
        console.log(response);
      }
    );
  }

  duplicar(idProntuario: number, idUsuario: number): Observable<Prontuario> {
    const params = { 'idUsuario': idUsuario.toString() };
    return this.http.post<Prontuario>(`/api/prontuario/${idProntuario}/duplicar`, null, {params});
  }

  addFromTemplate(idProntuario: number): Observable<Prontuario> {
    return this.http.post<Prontuario>(`/api/prontuario/template/${idProntuario}/addProntuario`, null);
  }

  addSecao(idProntuario: number, secao: SecaoCreate): Observable<Secao> {
    return this.http.post<Secao>(`/api/prontuario/${idProntuario}/addSecao`, secao);
  }


}
