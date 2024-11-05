import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Resposta, RespostaCreate } from '../resposta';
import { RespostaService } from '../resposta.service';
import { debounceTime, firstValueFrom, Observable, Subject, switchMap } from 'rxjs';
import { QuesitoService } from '../quesito.service';
import { Opcao } from '../opcao';
import { QuesitoComplete, QuesitoData } from '../quesito';
import { FormsModule } from '@angular/forms';
import { ProntuarioService } from '../prontuario.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-quesito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quesito.component.html',
  styleUrl: './quesito.component.css'
})
export class QuesitoComponent implements OnInit, OnDestroy {
  route : ActivatedRoute = inject(ActivatedRoute);
  @Input() quesito: QuesitoComplete = {} as QuesitoComplete;
  @Input() quesitoIndex: string = '';
  @Input() estadoProntuario: string = '';
  quesitoService : QuesitoService = inject(QuesitoService);
  respostaService : RespostaService = inject(RespostaService);
  prontuarioService : ProntuarioService = inject(ProntuarioService);
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
      
      if(this.quesito.resposta != null) {
        const respostaId = this.quesito.resposta.id;
        this.getResposta(respostaId).then(
          (resposta) => {
            this.resposta = resposta;
            this.selectedOpcoesIds = resposta.opcoesMarcadasIds;
            this.selectedConteudo = resposta.conteudo;
          });
      }
    }

    this.isQuesitoHabilitado(this.quesito.id);

    // TODO: Conseguir o id do prontuário por outro metodo
    const prontuarioId = parseInt(this.route.snapshot.params['id'], 10);
    

    this.inputChanged.pipe(
      debounceTime(500), // Tempo em milissegundos antes de salvar
      switchMap(resposta => this.salvarRespostaDissertativa(prontuarioId)) // Chama o método de salvar
    ).subscribe({
      next: () => {
        console.log('Resposta dissertativa salva com sucesso!');
      },
      error: err => {
        console.error('Erro ao salvar a resposta dissertativa:', err);
      }
    });

  }


  async getResposta(respostaId : number) : Promise<Resposta> {
    const resposta = await firstValueFrom(this.respostaService.getById(respostaId));
    return resposta;
  }

  // -------------------- Funcoes e atributos para o estado de respondendo --------------------
  quesitoHabilitado: boolean = true;
  @Output() respostaAtualizada = new EventEmitter();
  @Output() criarResposta = new EventEmitter<{quesitoId:number, resposta:RespostaCreate, opcaoId:number}>();
  respostaDissertativa: string = '';
  private inputChanged: Subject<string> = new Subject();

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
    if(this.quesito.resposta === null) {
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
              this.respostaAtualizada.emit();
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

  ngOnDestroy() {
    this.inputChanged.complete(); // Limpa o Subject ao destruir o componente
  }

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.respostaDissertativa = value;
    this.inputChanged.next(value); // Emite a nova resposta
  } 

  salvarRespostaDissertativa(prontuarioId: number): Observable<RespostaCreate> {
    const resposta: RespostaCreate = {
        conteudo: this.resposta.conteudo // Usar a variável que está ligando ao modelo
    };

    if (this.quesito.resposta === null) {
        return this.prontuarioService.addResposta(prontuarioId, this.quesito.id, resposta);
    } else {
        return this.respostaService.update(this.resposta.id, resposta);
    }
  }

}
