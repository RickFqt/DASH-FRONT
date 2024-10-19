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
