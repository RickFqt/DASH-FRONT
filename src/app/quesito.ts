export interface Quesito {
    id: number;
    enunciado: string;
    obrigatorio: boolean;
    ordem: number;
    nivel: number;
    tipoResposta: string;
    superQuesitoId: number;
    secaoId: number;
    respostaId: number;
    opcoesHabilitadorasIds: number[];
    subQuesitosIds: number[];
    opcoesIds: number[];
}

export class QuesitoData implements Quesito {
    id: number;
    enunciado: string;
    obrigatorio: boolean;
    ordem: number;
    nivel: number;
    tipoResposta: string;
    superQuesitoId: number;
    secaoId: number;
    respostaId: number;
    opcoesHabilitadorasIds: number[];
    subQuesitosIds: number[];
    opcoesIds: number[];

    opcoes: any[];
    subQuesitos: any[];

    constructor(
        id: number,
        enunciado: string,
        obrigatorio: boolean,
        ordem: number,
        nivel: number,
        tipoResposta: string,
        superQuesitoId: number,
        secaoId: number,
        respostaId: number,
        opcoesHabilitadorasIds: number[],
        subQuesitosIds: number[],
        opcoesIds: number[],
        opcoes: any[] = [],
        subQuesitos: any[] = []
    ) {
        this.id = id;
        this.enunciado = enunciado;
        this.obrigatorio = obrigatorio;
        this.ordem = ordem;
        this.nivel = nivel;
        this.tipoResposta = tipoResposta;
        this.superQuesitoId = superQuesitoId;
        this.secaoId = secaoId;
        this.respostaId = respostaId;
        this.opcoesHabilitadorasIds = opcoesHabilitadorasIds;
        this.subQuesitosIds = subQuesitosIds;
        this.opcoesIds = opcoesIds;
        this.opcoes = opcoes;
        this.subQuesitos = subQuesitos;
    }
}
