export interface Resposta {
    id : number;
    conteudo : string[];
    opcoesMarcadasIds : number[];
    idQuesito : number;
}

export class RespostaCreate {
    conteudo: string[];

    constructor(conteudo: string[] = []) {
        this.conteudo = conteudo;
    }
}