import type { Client } from '../types/client'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

function obterCabecalhos(): HeadersInit {
    const token = localStorage.getItem('contractflow_token')

    return {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
}

export async function listarClientes(): Promise<Client[]> {
    const resposta = await fetch(`${API_URL}/clients`, {
        headers: obterCabecalhos(),
    })

    if (!resposta.ok) {
        if (resposta.status === 401) {
            throw new Error('Sua sessão expirou. Entre novamente.')
        }

        throw new Error('Não foi possível carregar os clientes.')
    }

    return resposta.json() as Promise<Client[]>
}

export interface CreateClientData {
    nome: string
    documento: string
    endereco?: string
    representante?: string
    email?: string
    telefone?: string
    observacoes?: string
}

export async function cadastrarCliente(
    dados: CreateClientData,
): Promise<Client> {
    const resposta = await fetch(`${API_URL}/clients`, {
        method: 'POST',
        headers: {
            ...obterCabecalhos(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    })

    if (!resposta.ok) {
        if (resposta.status === 401) {
            throw new Error('Sua sessão expirou. Entre novamente.')
        }

        const erro = await resposta.json().catch(() => null)

        throw new Error(
            Array.isArray(erro?.message)
                ? erro.message.join(', ')
                : erro?.message || 'Não foi possível cadastrar o cliente.',
        )
    }

    return resposta.json() as Promise<Client>
}