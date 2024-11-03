export interface Opcao {
    id: number;
    textoAlternativa: string;
    ordem: number;
    quesitoId: number;
    quesitosHabilitadosIds: number[];
}
