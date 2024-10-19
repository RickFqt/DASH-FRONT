export interface Prontuario {
    id: number;
    nome: string;
    descricao: string;
    finalizado: boolean;
    ehPublico: boolean;
    ehTemplate: boolean;
    usuarioId: number;
    secoesIds: number[];
}

export class ProntuarioData implements Prontuario {
    id: number;
    nome: string;
    descricao: string;
    finalizado: boolean;
    ehPublico: boolean;
    ehTemplate: boolean;
    usuarioId: number;
    secoesIds: number[];

    secoes: any[];

    constructor(
        id: number,
        nome: string,
        descricao: string,
        finalizado: boolean,
        ehPublico: boolean,
        ehTemplate: boolean,
        usuarioId: number,
        secoesIds: number[],
        secoes: any[] = []
    ) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.finalizado = finalizado;
        this.ehPublico = ehPublico;
        this.ehTemplate = ehTemplate;
        this.usuarioId = usuarioId;
        this.secoesIds = secoesIds;
        this.secoes = secoes;
    }
}