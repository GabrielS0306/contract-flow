import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AppLayout from './components/AppLayout'
import ContractsPage from './pages/contracts/ContractsPage'
import LoginPage from './pages/auth/LoginPage'
import { obterToken } from './services/authService'
import ClientsPage from './pages/clients/ClientsPage'

function RotaProtegida() {
    if (!obterToken()) {
        return <Navigate to="/login" replace />
    }

    return <AppLayout />
}

function DashboardPage() {
    return (
        <section>
            <h2 className="text-2xl font-bold text-slate-900">
                Dashboard
            </h2>
            <p className="mt-2 text-slate-500">
                Bem-vindo ao painel de gerenciamento do ContractFlow.
            </p>
        </section>
    )
}

function PaginaEmDesenvolvimento({ titulo }: { titulo: string }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
                {titulo}
            </h2>
            <p className="mt-2 text-slate-500">
                Esta área será implementada nas próximas etapas.
            </p>
        </section>
    )
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route element={<RotaProtegida />}>
                    <Route
                        path="/dashboard"
                        element={<DashboardPage />}
                    />

                    <Route
                        path="/contratos"
                        element={<ContractsPage />}
                    />

                    <Route
                        path="/clientes"
                        element={<ClientsPage />}
                    />

                    <Route
                        path="/sistemas"
                        element={<PaginaEmDesenvolvimento titulo="Sistemas" />}
                    />
                </Route>

                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
