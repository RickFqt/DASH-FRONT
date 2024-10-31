import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SectionComponent } from '../section/section.component';
import { ProntuarioService } from '../prontuario.service';
import { SecaoService } from '../secao.service';
import { QuesitoService } from '../quesito.service';
import { OpcaoService } from '../opcao.service';
import { RespostaService } from '../resposta.service';
import { Prontuario, ProntuarioData } from '../prontuario';
import { SecaoCreate, SecaoData } from '../secao';
import { QuesitoData } from '../quesito';
import { Opcao } from '../opcao';
import { firstValueFrom } from 'rxjs';
import { UsuarioService } from '../usuario.service';
import { Usuario, UsuarioCreate } from '../usuario';
import { FormsModule } from '@angular/forms';

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

  prontuario : ProntuarioData = {} as ProntuarioData;

  mensagemSucesso: string | null = null;
  mostrarPopUp: boolean = false;

  ngOnInit() {
    const prontuarioId = parseInt(this.route.snapshot.params['id'], 10);

    this.mapProntuarioById(prontuarioId).then(
      (prontuarioData) => {
        this.prontuario = prontuarioData;
        // prontuarioData.ehTemplate = true;
        // console.log(this.prontuario);
      }
    );
  }

  private async mapProntuarioById(prontuarioId: number): Promise<ProntuarioData> {
    const prontuario = await firstValueFrom(this.prontuarioService.getById(prontuarioId));
    const prontuarioData : ProntuarioData = {
      id: prontuario.id,
      nome: prontuario.nome,
      descricao: prontuario.descricao,
      finalizado: prontuario.finalizado,
      ehPublico: prontuario.ehPublico,
      ehTemplate: prontuario.ehTemplate,
      usuarioId: prontuario.usuarioId,
      secoesIds: prontuario.secoesIds,
      secoes: await Promise.all(prontuario.secoesIds.map(secaoId => this.mapSecaoById(secaoId)))
    }
    return prontuarioData;
  }


  private async mapSecaoById(secaoId: number): Promise<any> {
    const secao = await firstValueFrom(this.secaoService.getById(secaoId));

    const secaoData: SecaoData = {
      id: secao.id,
      titulo: secao.titulo,
      ordem: secao.ordem,
      nivel: secao.nivel,
      subSecoesIds: secao.subSecoesIds,
      superSecaoId: secao.superSecaoId,
      prontuarioId: secao.prontuarioId,
      quesitosIds: secao.quesitosIds,
      quesitos: await Promise.all(secao.quesitosIds.map(quesitoId => this.mapQuesitoById(quesitoId))),
      subSecoes: await Promise.all(secao.subSecoesIds.map(subSecaoId => this.mapSecaoById(subSecaoId)))
    };

    return secaoData;
  }

  private async mapQuesitoById(quesitoId: number): Promise<any> {
    const quesito = await firstValueFrom(this.quesitoService.getById(quesitoId));
    const quesitoData: QuesitoData = {
      id: quesito.id,
      enunciado: quesito.enunciado,
      obrigatorio: quesito.obrigatorio,
      ordem: quesito.ordem,
      nivel: quesito.nivel,
      tipoResposta: quesito.tipoResposta,
      superQuesitoId: quesito.superQuesitoId,
      secaoId: quesito.secaoId,
      respostaId: quesito.respostaId,
      opcoesHabilitadorasIds: quesito.opcoesHabilitadorasIds,
      subQuesitosIds: quesito.subQuesitosIds,
      opcoesIds: quesito.opcoesIds,
      opcoes: await Promise.all(quesito.opcoesIds.map(opcaoId => this.mapOpcaoById(opcaoId))),
      subQuesitos: await Promise.all(quesito.subQuesitosIds.map(subQuesitoId => this.mapQuesitoById(subQuesitoId)))
    };
    return quesitoData;
  }

  private async mapOpcaoById(opcaoId: number): Promise<any> {
    const opcao = await firstValueFrom(this.opcaoService.getById(opcaoId));
    const opcaoData: Opcao = {
      id: opcao.id,
      textoAlternativa: opcao.textoAlternativa,
      ordem: opcao.ordem,
      quesitoId: opcao.quesitoId
    };
    return opcaoData;
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
    this.prontuario = await this.mapProntuarioById(prontuarioCopiado.id);
    this.router.navigate(['/prontuario', prontuarioCopiado.id]);
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
    this.prontuario = await this.mapProntuarioById(prontuarioCriado.id);
    this.router.navigate(['/prontuario', prontuarioCriado.id]);
    console.log('Prontuario criado a partir de template!');
    console.log(prontuarioCriado);
    this.mensagemSucesso = 'Prontuário criado a partir de template!';
    this.mostrarPopUp = true;

    // Fechar automaticamente o pop-up após 3 segundos (opcional)
    setTimeout(() => {
      this.fecharPopUp();
    }, 3000);

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

      // Atualiza o prontuário local
      this.prontuario.secoesIds.push(novaSecaoCriada.id);
      this.prontuario.secoes.push(await this.mapSecaoById(novaSecaoCriada.id));
      this.novaSecaoTitulo = ''; // limpa o campo após a adição
    } else {
      alert('Por favor, insira um título para a seção.');
    }
  }

  adicionarSubSecao(event : {superSecaoId : number, subSecao : SecaoData}) {
    const queue = [...this.prontuario.secoes];
    let superSecao: SecaoData | undefined;

    while (queue.length > 0) {
      const currentSecao = queue.shift();
      if (currentSecao.id === event.superSecaoId) {
        superSecao = currentSecao;
        break;
      }
      queue.push(...currentSecao.subSecoes);
    }

    if (!superSecao) {
      throw new Error('Super seção não encontrada');
    }
    superSecao.subSecoesIds.push(event.subSecao.id);
    superSecao.subSecoes.push(event.subSecao);
  }

  atualizarSecao(event : {superSecaoId: number, secaoAtualizada: SecaoData}) {
    if(event.superSecaoId === 0) {
      const index = this.prontuario.secoes.findIndex(s => s.id === event.secaoAtualizada.id);
      this.prontuario.secoes[index] = event.secaoAtualizada;
    }

    const queue = [...this.prontuario.secoes];
    let superSecao: SecaoData | undefined;

    while (queue.length > 0) {
      const currentSecao = queue.shift();
      if (currentSecao.id === event.superSecaoId) {
        superSecao = currentSecao;
        break;
      }
      queue.push(...currentSecao.subSecoes);
    }
    if (!superSecao) {
      throw new Error('Super seção não encontrada');
    }

    const subSecaoIndex = superSecao.subSecoes.findIndex(s => s.id === event.secaoAtualizada.id);
    if (subSecaoIndex !== -1) {
      superSecao.subSecoes[subSecaoIndex] = event.secaoAtualizada;
    }

    const updateSuperSecao = (secoes: SecaoData[], superSecao: SecaoData) => {
      for (let i = 0; i < secoes.length; i++) {
        if (secoes[i].id === superSecao.id) {
          secoes[i] = superSecao;
          return;
        }
      updateSuperSecao(secoes[i].subSecoes, superSecao);
      }
    };

    updateSuperSecao(this.prontuario.secoes, superSecao);
  }
}
