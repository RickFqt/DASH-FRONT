export interface Opcao {
    id: number;
    textoAlternativa: string;
    ordem: number;
    quesitoId: number;
    quesitosHabilitadosIds: number[];
}

export class OpcaoComplete {
    id: number;
    textoAlternativa: string;
    ordem: number;
    quesitoId: number;
    quesitosHabilitadosIds: number[];

    constructor(
        id: number = 0,
        textoAlternativa: string = '',
        ordem: number = 0,
        quesitoId: number = 0,
        quesitosHabilitadosIds: number[] = []
    ) {
        this.id = id;
        this.textoAlternativa = textoAlternativa;
        this.ordem = ordem;
        this.quesitoId = quesitoId;
        this.quesitosHabilitadosIds = quesitosHabilitadosIds;
    }
}
