import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import Header from './Header'

const itensMenu = [
    { to: '/dashboard', label: 'Dashboard', icon: '▦' },
    { to: '/contratos', label: 'Contratos', icon: '▤' },
    { to: '/clientes', label: 'Clientes', icon: '♙' },
    { to: '/sistemas', label: 'Sistemas', icon: '▣' },
]

export default function AppLayout() {
    const [menuAberto, setMenuAberto] = useState(false)

    function classeLink(ativo: boolean) {
        return [
            'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition',
            ativo
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white',
        ].join(' ')
    }

    return (
        <div className="min-h-screen bg-slate-100">
            {menuAberto && (
                <button
                    type="button"
                    aria-label="Fechar menu"
                    onClick={() => setMenuAberto(false)}
                    className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
                />
            )}

            <aside
                className={[
                    'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 p-5 transition-transform duration-200',
                    menuAberto ? 'translate-x-0' : '-translate-x-full',
                    'md:translate-x-0',
                ].join(' ')}
            >
                <div className="mb-10 flex items-center gap-3 px-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                        C
                    </div>

                    <div>
                        <h1 className="text-lg font-bold text-white">
                            ContractFlow
                        </h1>
                        <p className="text-xs text-slate-400">
                            Gestão de licenças
                        </p>
                    </div>
                </div>

                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Menu principal
                </p>

                <nav className="space-y-2">
                    {itensMenu.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end
                            onClick={() => setMenuAberto(false)}
                            className={({ isActive }) => classeLink(isActive)}
                        >
                            <span className="w-5 text-center text-lg">
                                {item.icon}
                            </span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto rounded-xl border border-slate-800 bg-slate-900 p-4">
                    <p className="text-sm font-medium text-white">
                        ContractFlow
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        Gerencie suas licenças em um só lugar.
                    </p>
                </div>
            </aside>

            <div className="min-h-screen md:ml-64">
                <div className="flex items-center border-b border-slate-200 bg-white md:hidden">
                    <button
                        type="button"
                        onClick={() => setMenuAberto(true)}
                        aria-label="Abrir menu"
                        className="px-5 py-3 text-2xl text-slate-700"
                    >
                        ☰
                    </button>
                    <span className="font-semibold text-slate-800">
                        Menu
                    </span>
                </div>

                <Header />

                <main className="p-4 sm:p-6 md:p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
