import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Prontuario } from './prontuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProntuarioService {

  url = 'http://localhost:8080';


  constructor(private http: HttpClient) { }


  getAllProntuarios(): Observable<Prontuario[]> {
    return this.http.get<Prontuario[]>(`/api/prontuario`);
  }

  getProntuarioById(id: number): Observable<Prontuario> {
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


}
