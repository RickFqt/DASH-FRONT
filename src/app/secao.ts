export interface Secao {
    id: number;
    titulo: string;
    ordem: number;
    nivel: number;
    subSecoesIds: number[];
    superSecaoId: number;
    prontuarioId: number;
    quesitosIds: number[];
}

export class SecaoData implements Secao {
    id: number;
    titulo: string;
    ordem: number;
    nivel: number;
    subSecoesIds: number[];
    superSecaoId: number;
    prontuarioId: number;
    quesitosIds: number[];

    quesitos: any[];
    subSecoes: any[];

    constructor(
        id: number = 0,
        titulo: string = '',
        ordem: number = 0,
        nivel: number = 0,
        subSecoesIds: number[] = [],
        superSecaoId: number = 0,
        prontuarioId: number = 0,
        quesitosIds: number[] = [],
        quesitos: any[] = [],
        subSecoes: any[] = []
    ) {
        this.id = id;
        this.titulo = titulo;
        this.ordem = ordem;
        this.nivel = nivel;
        this.subSecoesIds = subSecoesIds;
        this.superSecaoId = superSecaoId;
        this.prontuarioId = prontuarioId;
        this.quesitosIds = quesitosIds;
        this.quesitos = quesitos;
        this.subSecoes = subSecoes;
    }
}
