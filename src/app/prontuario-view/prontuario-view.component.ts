import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SectionComponent } from '../section/section.component';
import { ProntuarioService } from '../prontuario.service';
import { SecaoService } from '../secao.service';
import { QuesitoService } from '../quesito.service';
import { OpcaoService } from '../opcao.service';
import { RespostaService } from '../resposta.service';
import { Prontuario, ProntuarioComplete, ProntuarioData } from '../prontuario';
import { SecaoComplete, SecaoCreate, SecaoData } from '../secao';
import { QuesitoComplete, QuesitoData } from '../quesito';
import { Opcao } from '../opcao';
import { concatMap, firstValueFrom, Observable, switchMap, tap } from 'rxjs';
import { UsuarioService } from '../usuario.service';
import { Usuario, UsuarioCreate } from '../usuario';
import { FormsModule } from '@angular/forms';
import { RespostaCreate } from '../resposta';
import { ItemOutput } from '../itemoutput';

@Component({
  selector: 'app-prontuario-view',
  standalone: true,
  imports: [RouterModule, CommonModule, SectionComponent, FormsModule],
  templateUrl: './prontuario-view.component.html',
  styleUrl: './prontuario-view.component.css'
})
export class ProntuarioViewComponent {
  route : ActivatedRoute = inject(ActivatedRoute);
  buttonSrc: string = 'button.png';
  estadoProntuario: string = 'visualizacao';
  usuarioService: UsuarioService = inject(UsuarioService);
  prontuarioService: ProntuarioService = inject(ProntuarioService);
  secaoService: SecaoService = inject(SecaoService);
  quesitoService: QuesitoService = inject(QuesitoService);
  opcaoService: OpcaoService = inject(OpcaoService);
  respostaService: RespostaService = inject(RespostaService);
  router: Router = inject(Router);


  prontuario : ProntuarioComplete = {} as ProntuarioComplete;
  displayedText: string = '';
  displayedDiagnosticoText: string = '';

  mensagemSucesso: string | null = null;
  mostrarPopUp: boolean = false;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.estadoProntuario = params['estado'] || 'visualizacao'; // Valor padrão
    });

    this.refreshProntuarioAsync().subscribe(() => {
      this.displayedText = this.prontuario.diagnosticoLLM || "";
    });
  }

  refreshProntuario(id: number = 0) {
    const prontuarioId = (id != 0 ? id : parseInt(this.route.snapshot.params['id'], 10));

    const incluirDesabilitados : boolean = this.estadoProntuario === 'editando' ? true : false;

    this.prontuarioService.getByIdComplete(prontuarioId, incluirDesabilitados).subscribe(
      (prontuarioData) => {
        this.prontuario = prontuarioData;
      }
    );
  }

  onHoverButton() {
    this.buttonSrc = 'button_hover.png';
  }

  onLeaveButton() {
    this.buttonSrc = 'button.png';
  }

  changeProntuarioState(estado: string) {
    // Possiveis estados: visualizacao, respondendo, editando
    this.estadoProntuario = estado;
    // this.refreshProntuarioAsync().subscribe(() => {});
  }
  
  // DEBUG ONLY FUNCTION; REMOVE LATER
  changeProntuarioStateDebug() {
    this.estadoProntuario = this.estadoProntuario === 'visualizacao' ? 'respondendo' : 'visualizacao';
  }

  async makeProntuarioCopy(): Promise<void> {
    // const newUsuario : UsuarioCreate = {
    //   nome: 'Usuario Fantasma',
    //   login: 'login',
    //   senha: 'senha',
    //   tipoUsuario: 'PADRAO'
    // };
    // const usuarioCriado = await firstValueFrom(this.usuarioService.create(newUsuario));

    // const idUsuarioCriado = usuarioCriado.id;
    // TODO: Get the id of the user that is logged in
    const idUsuarioCriado = 1;

    const prontuarioCopiado = await firstValueFrom(this.prontuarioService.duplicar(this.prontuario.id, idUsuarioCriado));
    this.router.navigate(['/prontuario', prontuarioCopiado.id]);
    this.refreshProntuario(prontuarioCopiado.id);
    // this.prontuario = await this.mapProntuarioById(prontuarioCopiado.id);
    console.log('Prontuario copiado!');
    console.log(prontuarioCopiado);
    this.mensagemSucesso = 'Prontuário copiado com sucesso!';
    this.mostrarPopUp = true;

    // Fechar automaticamente o pop-up após 3 segundos (opcional)
    setTimeout(() => {
      this.fecharPopUp();
    }, 3000);
  }

  fecharPopUp() {
    this.mostrarPopUp = false;
  }

  async makeProntuarioFromTemplate(): Promise<void> {
    const prontuarioId = parseInt(this.route.snapshot.params['id'], 10);

    const prontuarioCriado = await firstValueFrom(this.prontuarioService.addFromTemplate(prontuarioId));
    // this.prontuario = await this.mapProntuarioById(prontuarioCriado.id);
    this.router.navigate(['/prontuario', prontuarioCriado.id]);
    this.refreshProntuario(prontuarioCriado.id);
    console.log('Prontuario criado a partir de template!');
    console.log(prontuarioCriado);
    this.mensagemSucesso = 'Prontuário criado a partir de template!';
    this.mostrarPopUp = true;

    // Fechar automaticamente o pop-up após 3 segundos (opcional)
    setTimeout(() => {
      this.fecharPopUp();
    }, 3000);
  }
  // -------------------- Funcoes e atributos para o estado de visualizacao --------------------
  gerarDiagnosticoLLM() {
    const textarea = document.getElementById("diagnosticoLLM") as HTMLTextAreaElement;
    textarea.value = "Gerando diagnóstico..."; 
    this.prontuarioService.gerarDiagnosticoLLM(this.prontuario.id).subscribe(() => {
      // Aguarda o refresh do prontuário antes de iniciar a animação
      this.refreshProntuarioAsync().subscribe(() => {
        const text = this.prontuario.diagnosticoLLM;
        
        let index = 0;
        const textarea = document.getElementById("diagnosticoLLM") as HTMLTextAreaElement;
        textarea.value = "";; // Limpa o conteúdo exibido para começar a animação

        function type() {
          if (index < text.length) {
            textarea.value += text.charAt(index);
            textarea.scrollTop = textarea.scrollHeight;
            index++;
            setTimeout(type, 10); // Ajuste a velocidade conforme necessário
          }
        }

        // Inicia a animação de digitação
        type();
      });
    });
  }

  gerarDiagnosticoPreCadastrado() {
    this.prontuarioService.gerarDiagnostico(this.prontuario.id).subscribe((diagnostico) => {
      const textarea = document.getElementById("diagnosticoPreCadastrado") as HTMLTextAreaElement;
      textarea.value = diagnostico.descricao;
      this.displayedDiagnosticoText = diagnostico.descricao;
    });
  }
    
    

  refreshProntuarioAsync(id: number = 0): Observable<void> {
    const prontuarioId = (id !== 0 ? id : parseInt(this.route.snapshot.params['id'], 10));
    const incluirDesabilitados: boolean = this.estadoProntuario === 'editando';

    return new Observable<void>((observer) => {
      this.prontuarioService.getByIdComplete(prontuarioId, incluirDesabilitados).subscribe(
        (prontuarioData) => {
          this.prontuario = prontuarioData;
          observer.next();
          observer.complete();
        }
      );
    });
  }
  // -------------------- Funcoes e atributos para o estado de edicao --------------------

  novaSecaoTitulo: string = ''; // para armazenar o título da nova seção temporariamente

  async adicionarSecao(): Promise<void> {
    if (this.novaSecaoTitulo.trim()) {
      
      const novaSecao : SecaoCreate = {
        titulo: this.novaSecaoTitulo
      };

      // Adiciona a nova seção ao prontuário
      const novaSecaoCriada = await firstValueFrom(this.prontuarioService.addSecao(this.prontuario.id, novaSecao));
      this.refreshProntuario(novaSecaoCriada.id);
      // Atualiza o prontuário local
      // this.prontuario.secoesIds.push(novaSecaoCriada.id);
      // this.prontuario.secoes.push(await this.mapSecaoById(novaSecaoCriada.id));
      this.novaSecaoTitulo = ''; // limpa o campo após a adição
    } else {
      alert('Por favor, insira um título para a seção.');
    }
  }

  adicionarSubSecao(event : {superSecaoId : number, subSecao : SecaoData}) {
    this.refreshProntuario();
  }

  atualizarSecao(event : {superSecaoId: number, secaoAtualizada: SecaoData}) {
    this.refreshProntuario();
  }

  // -------------------------------------------------------------------------------------

  // -------------------- Funcoes e atributos para o estado de respondendo --------------------
  @ViewChildren(SectionComponent) secaoComponents!: QueryList<SectionComponent>;
  // @Output() salvarRespostasDissertativas = new EventEmitter();

  salvarRespostasDissertativas() {

    const prontuarioId = this.prontuario.id;
    
    const salvarRequisicoes = this.secaoComponents.map(secaoComponent => secaoComponent.salvarRespostasDissertativas(prontuarioId));

    Promise.all(salvarRequisicoes).then(() => {
      // this.refreshProntuario();
      console.log('Respostas salvas!');
      this.mensagemSucesso = 'Respostas salvas com sucesso!';
      this.mostrarPopUp = true;

      this.changeProntuarioState('visualizacao');

    });
  }

  salvarResposta(event : {quesitoId:number, resposta:RespostaCreate, opcaoId:number}) {
    
    this.prontuarioService.addResposta(this.prontuario.id, event.quesitoId, event.resposta).subscribe(
      (resposta) => {
        
        this.respostaService.addOpcaoMarcada(resposta.id, event.opcaoId).subscribe(
          (resposta) => {
            this.refreshProntuario();
            console.log('Resposta salva!');
          }
        );
      }
    );
  }
  


}
