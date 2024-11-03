import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Resposta, RespostaCreate } from '../resposta';
import { RespostaService } from '../resposta.service';
import { firstValueFrom } from 'rxjs';
import { QuesitoService } from '../quesito.service';
import { Opcao } from '../opcao';
import { QuesitoData } from '../quesito';

@Component({
  selector: 'app-quesito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quesito.component.html',
  styleUrl: './quesito.component.css'
})
export class QuesitoComponent {
  @Input() quesito: QuesitoData = new QuesitoData();
  @Input() quesitoIndex: string = '';
  @Input() estadoProntuario: string = '';
  quesitoService : QuesitoService = inject(QuesitoService);
  respostaService : RespostaService = inject(RespostaService);
  selectedOpcoesIds: number[] = [];
  selectedConteudo: string[] = [];

  resposta: Resposta = {
    id: 0,
    conteudo: [],
    opcoesMarcadasIds: [],
    idQuesito: 0
  }

  ngOnInit() {
    if(this.estadoProntuario === 'visualizacao' || this.estadoProntuario === 'respondendo') {
      const respostaId = this.quesito.respostaId;

      if(respostaId) {
        this.getResposta(respostaId).then(
          (resposta) => {
            this.resposta = resposta;
            this.selectedOpcoesIds = resposta.opcoesMarcadasIds;
            this.selectedConteudo = resposta.conteudo;
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
  @Output() respostaAtualizada = new EventEmitter();
  @Output() criarResposta = new EventEmitter<{quesitoId:number, resposta:RespostaCreate, opcaoId:number}>();

  async isQuesitoHabilitado(quesitoId: number) {
    const habilitado = await firstValueFrom(this.quesitoService.estaHabilitado(quesitoId));
    this.quesitoHabilitado = habilitado;
  }

  salvarRespostaSimples(opcao: Opcao) {

    this.selectedOpcoesIds = [opcao.id];
    this.selectedConteudo = [opcao.textoAlternativa];

    const resposta : RespostaCreate = {
      conteudo: [opcao.textoAlternativa]
    }
    
    this.salvarResposta(resposta, opcao);
  }

  salvarRespostaMultipla(opcao: Opcao, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if(isChecked) {
      if(this.selectedOpcoesIds.includes(opcao.id)) {
        return;
      }
      this.selectedOpcoesIds.push(opcao.id);
      this.selectedConteudo.push(opcao.textoAlternativa);
    }
    else {
      this.selectedOpcoesIds = this.selectedOpcoesIds.filter(id => id !== opcao.id);
      this.selectedConteudo = this.selectedConteudo.filter(conteudo => conteudo !== opcao.textoAlternativa);
    }

    const resposta : RespostaCreate = {
      conteudo: this.selectedConteudo
    }

    this.salvarResposta(resposta, opcao);
  }

  salvarResposta(resposta : RespostaCreate, opcao: Opcao) {
    if(this.resposta.id === 0) {
      this.criarResposta.emit({quesitoId: this.quesito.id, resposta: resposta, opcaoId: opcao.id});
    }
    else {
      this.respostaService.update(this.resposta.id, resposta).subscribe(
        (resposta) => {
          const opcoesMarcadasIds = {opcoesMarcadasIds: this.selectedOpcoesIds};
          this.respostaService.setOpcoesMarcadas(this.resposta.id, opcoesMarcadasIds).subscribe(
            (opcaoList) => {
              this.resposta = resposta;
              this.resposta.opcoesMarcadasIds = opcaoList.map(opcao => opcao.id);
              // this.respostaAtualizada.emit();
            }
          );
        }
      );
    }
  }

  respostaAtualizadaPropagate() {
    this.respostaAtualizada.emit();
  }

  criarRespostaPropagate(event : {quesitoId:number, resposta:RespostaCreate, opcaoId:number}) {
    this.criarResposta.emit(event);
  }


}
