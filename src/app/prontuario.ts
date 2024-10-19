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