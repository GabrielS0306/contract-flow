
export type ContractPeriodicity = 'MENSAL' | 'ANUAL' | 'UNICO'

export type ContractStatus = 'ATIVO' | 'ENCERRADO' | 'CANCELADO'

export interface Contract {
    _id: string
    numero: string
    clienteId: {
        _id: string
        nome: string
        documento: string
    }
    sistemaId: {
        _id: string
        nome: string
        versao: string
    }
    periodicidade: ContractPeriodicity
    valor: number
    valorImplantacao?: number
    dataInicio: string
    dataFim: string
    diaVencimento?: number
    observacoes?: string
    status: ContractStatus
    arquivoNome?: string
    arquivoTamanho?: number
}
