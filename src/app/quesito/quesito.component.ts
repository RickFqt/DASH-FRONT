import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Resposta } from '../resposta';
import { RespostaService } from '../resposta.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-quesito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quesito.component.html',
  styleUrl: './quesito.component.css'
})
export class QuesitoComponent {
  @Input() quesito: any;
  @Input() quesitoIndex: string = '';
  @Input() estadoProntuario: string = '';
  // quesitoService : QuesitoService = inject(QuesitoService);
  respostaService : RespostaService = inject(RespostaService);

  resposta: Resposta = {
    id: 0,
    conteudo: [],
    opcoesMarcadasIds: [],
    idQuesito: 0
  }

  constructor() {
    if(this.estadoProntuario === 'visualizacao') {
      const respostaId = this.quesito.respostaId;

      if(respostaId) {
        this.getResposta(respostaId).then(
          (resposta) => {
            this.resposta = resposta;
          });
      }
    }
  }


  async getResposta(respostaId : number) : Promise<Resposta> {
    const resposta = await firstValueFrom(this.respostaService.getById(respostaId));
    return resposta;
  }

}
