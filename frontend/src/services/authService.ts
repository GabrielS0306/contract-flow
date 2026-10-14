const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export interface Usuario {
    id: string
    nome: string
    email: string
    role: string
}

interface LoginResponse {
    access_token: string
    user: Usuario
}

export async function login(
    email: string,
    senha: string,
): Promise<LoginResponse> {
    const resposta = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
    })

    if (!resposta.ok) {
        if (resposta.status === 401) {
            throw new Error('E-mail ou senha inválidos.')
        }

        throw new Error('Não foi possível realizar o login.')
    }

    const dados: LoginResponse = await resposta.json()

    localStorage.setItem('contractflow_token', dados.access_token)
    localStorage.setItem('contractflow_user', JSON.stringify(dados.user))

    return dados
}

export function logout(): void {
    localStorage.removeItem('contractflow_token')
    localStorage.removeItem('contractflow_user')
}

export function obterToken(): string | null {
    return localStorage.getItem('contractflow_token')
}
