    import { useNavigate } from 'react-router-dom'

import { logout } from '../services/authService'
import type { Usuario } from '../services/authService'

export default function Header() {
    const navigate = useNavigate()

    let usuario: Usuario | null = null

    try {
        const usuarioSalvo = localStorage.getItem('contractflow_user')
        usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) as Usuario : null
    } catch {
        usuario = null
    }

    function handleLogout() {
        logout()
        navigate('/login', { replace: true })
    }

    return (
        <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:px-10">
            <div>
                <h1 className="text-xl font-bold text-slate-900">
                    ContractFlow
                </h1>
                <p className="text-sm text-slate-500">
                    Gerenciamento de contratos e licenças
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="font-medium text-slate-800">
                        {usuario?.nome ?? 'Usuário'}
                    </p>
                    <p className="text-sm text-slate-500">
                        {usuario?.email ?? ''}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                    Sair
                </button>
            </div>
        </header>
    )
}
