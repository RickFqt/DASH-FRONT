import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Resposta } from '../resposta';
import { RespostaService } from '../resposta.service';
import { firstValueFrom } from 'rxjs';
import { QuesitoService } from '../quesito.service';

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
  quesitoService : QuesitoService = inject(QuesitoService);
  respostaService : RespostaService = inject(RespostaService);

  resposta: Resposta = {
    id: 0,
    conteudo: [],
    opcoesMarcadasIds: [],
    idQuesito: 0
  }

  ngOnInit() {
    // console.log(this.estadoProntuario);
    // console.log(this.quesito);
    // console.log(this.quesito.respostaId);
    if(this.estadoProntuario === 'visualizacao') {
      // console.log("Oi");
      // console.log(this.resposta);
      const respostaId = this.quesito.respostaId;

      if(respostaId) {
        this.getResposta(respostaId).then(
          (resposta) => {
            this.resposta = resposta;
            // console.log(this.resposta);
          });
      }
    }

    this.isQuesitoHabilitado(this.quesito.id);

  }


  async getResposta(respostaId : number) : Promise<Resposta> {
    const resposta = await firstValueFrom(this.respostaService.getById(respostaId));
    return resposta;
  }

  // -------------------- Funcoes e atributos para o estado de respondendo --------------------
  quesitoHabilitado: boolean = true;

  async isQuesitoHabilitado(quesitoId: number) {
    const habilitado = await firstValueFrom(this.quesitoService.estaHabilitado(quesitoId));
    this.quesitoHabilitado = habilitado;
  }

}
