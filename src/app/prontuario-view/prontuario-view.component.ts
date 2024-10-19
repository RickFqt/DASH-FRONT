import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SectionComponent } from '../section/section.component';
import { ProntuarioService } from '../prontuario.service';
import { SecaoService } from '../secao.service';
import { QuesitoService } from '../quesito.service';
import { OpcaoService } from '../opcao.service';
import { RespostaService } from '../resposta.service';
import { Prontuario, ProntuarioData } from '../prontuario';
import { SecaoData } from '../secao';
import { QuesitoData } from '../quesito';
import { Opcao } from '../opcao';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-prontuario-view',
  standalone: true,
  imports: [RouterModule, CommonModule, SectionComponent],
  templateUrl: './prontuario-view.component.html',
  styleUrl: './prontuario-view.component.css'
})
export class ProntuarioViewComponent {
  route : ActivatedRoute = inject(ActivatedRoute);
  buttonSrc: string = 'button.png';
  estadoProntuario: string = 'visualizacao';
  prontuarioService: ProntuarioService = inject(ProntuarioService);
  secaoService: SecaoService = inject(SecaoService);
  quesitoService: QuesitoService = inject(QuesitoService);
  opcaoService: OpcaoService = inject(OpcaoService);
  respostaService: RespostaService = inject(RespostaService);

  prontuario : ProntuarioData = {} as ProntuarioData;

  ngOnInit() {
    const prontuarioId = parseInt(this.route.snapshot.params['id'], 10);

    this.mapProntuarioById(prontuarioId).then(
      (prontuarioData) => {
        this.prontuario = prontuarioData;
        console.log(this.prontuario);
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

  changeProntuarioState() {
    this.estadoProntuario = this.estadoProntuario === 'visualizacao' ? 'respondendo' : 'visualizacao';
  }
}
