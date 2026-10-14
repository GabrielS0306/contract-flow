export interface Client {
    _id: string
    nome: string
    documento: string
    endereco?: string
    representante?: string
    email?: string
    telefone?: string
    observacoes?: string
    ativo: boolean
    createdAt?: string
    updatedAt?: string
}
