
import { useEffect, useMemo, useState } from 'react'

import { listarContratos } from '../../services/contractsService'
import type { Contract } from '../../types/contract'

export default function ContractsPage() {
    const [contratos, setContratos] = useState<Contract[]>([])
    const [busca, setBusca] = useState('')
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')

    useEffect(() => {
        async function carregarContratos() {
            try {
                setErro('')

                const dados = await listarContratos()

                setContratos(dados)
            } catch (erro) {
                setErro(
                    erro instanceof Error
                        ? erro.message
                        : 'Não foi possível carregar os contratos.',
                )
            } finally {
                setCarregando(false)
            }
        }

        void carregarContratos()
    }, [])

    const contratosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase()

        if (!termo) {
            return contratos
        }

        return contratos.filter((contrato) =>
            [
                contrato.numero,
                contrato.clienteId?.nome,
                contrato.sistemaId?.nome,
            ].some((valor) => valor?.toLowerCase().includes(termo)),
        )
    }, [contratos, busca])

    const contratosAtivos = contratos.filter(
        (contrato) => contrato.status === 'ATIVO',
    ).length

    const contratosInativos = contratos.length - contratosAtivos

    function formatarData(data: string) {
        return new Date(data).toLocaleDateString('pt-BR', {
            timeZone: 'UTC',
        })
    }

    function formatarValor(valor: number) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })
    }

    return (
        <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Contratos
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Gerencie os contratos e as licenças dos seus sistemas.
                    </p>
                </header>

                <section className="mb-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Total de contratos
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {contratos.length}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Contratos ativos
                        </p>

                        <p className="mt-2 text-3xl font-bold text-emerald-600">
                            {contratosAtivos}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Contratos encerrados ou cancelados
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-500">
                            {contratosInativos}
                        </p>
                    </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <div className="mb-6">
                        <label
                            htmlFor="busca"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Pesquisar contratos
                        </label>

                        <input
                            id="busca"
                            type="search"
                            value={busca}
                            onChange={(evento) => setBusca(evento.target.value)}
                            placeholder="Número, cliente ou sistema..."
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {carregando ? (
                        <p className="py-12 text-center text-slate-500">
                            Carregando contratos...
                        </p>
                    ) : erro ? (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                            <p>{erro}</p>

                            {erro.includes('sessão expirou') && (
                                <p className="mt-2 text-sm">
                                    Será necessário entrar novamente quando
                                    implementarmos a tela de login.
                                </p>
                            )}
                        </div>
                    ) : contratosFiltrados.length === 0 ? (
                        <div className="flex min-h-48 flex-col items-center justify-center text-center">
                            <div className="mb-3 rounded-full bg-slate-100 p-4 text-2xl">
                                📄
                            </div>

                            <h2 className="font-semibold text-slate-800">
                                {contratos.length === 0
                                    ? 'Nenhum contrato cadastrado'
                                    : 'Nenhum resultado encontrado'}
                            </h2>

                            <p className="mt-2 max-w-md text-sm text-slate-500">
                                {contratos.length === 0
                                    ? 'Quando houver contratos cadastrados, eles aparecerão aqui.'
                                    : 'Tente pesquisar usando outro número, cliente ou sistema.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <thead className="border-b border-slate-200 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Contrato
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Cliente
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Sistema
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Valor
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Vigência
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {contratosFiltrados.map((contrato) => (
                                        <tr
                                            key={contrato._id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="px-4 py-4 font-semibold text-slate-800">
                                                {contrato.numero}
                                            </td>

                                            <td className="px-4 py-4 text-slate-600">
                                                {contrato.clienteId?.nome ?? 'Cliente não informado'}
                                            </td>

                                            <td className="px-4 py-4 text-slate-600">
                                                {contrato.sistemaId?.nome ?? 'Sistema não informado'}
                                            </td>

                                            <td className="px-4 py-4 text-slate-600">
                                                {formatarValor(contrato.valor)}
                                            </td>

                                            <td className="px-4 py-4 text-slate-600">
                                                {formatarData(contrato.dataInicio)}
                                                {' - '}
                                                {formatarData(contrato.dataFim)}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                        contrato.status === 'ATIVO'
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : contrato.status === 'ENCERRADO'
                                                                ? 'bg-slate-100 text-slate-600'
                                                                : 'bg-red-100 text-red-700'
                                                    }`}
                                                >
                                                    {contrato.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
