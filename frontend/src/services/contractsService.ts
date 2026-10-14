
import type { Contract } from '../types/contract'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

function obterCabecalhos(): HeadersInit {
    const token = localStorage.getItem('contractflow_token')

    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
}

export async function listarContratos(): Promise<Contract[]> {
    const resposta = await fetch(`${API_URL}/contracts`, {
        headers: obterCabecalhos(),
    })

    if (!resposta.ok) {
        if (resposta.status === 401) {
            throw new Error('Sua sessão expirou. Entre novamente.')
        }

        throw new Error('Não foi possível carregar os contratos.')
    }

    return resposta.json() as Promise<Contract[]>
}
