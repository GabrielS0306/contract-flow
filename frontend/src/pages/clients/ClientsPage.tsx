import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'

import {
    cadastrarCliente,
    listarClientes,
} from '../../services/clientsService'

import type { Client } from '../../types/client'

export default function ClientsPage() {
    const [clientes, setClientes] = useState<Client[]>([])
    const [busca, setBusca] = useState('')
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')

    const [modalAberto, setModalAberto] = useState(false)
    const [salvando, setSalvando] = useState(false)
    const [erroCadastro, setErroCadastro] = useState('')

    const [formulario, setFormulario] = useState({
        nome: '',
        documento: '',
        representante: '',
        email: '',
        telefone: '',
        endereco: '',
        observacoes: '',
    })

    useEffect(() => {
        async function carregarClientes() {
            try {
                setErro('')
                const dados = await listarClientes()
                setClientes(dados)
            } catch (error) {
                setErro(
                    error instanceof Error
                        ? error.message
                        : 'Não foi possível carregar os clientes.',
                )
            } finally {
                setCarregando(false)
            }
        }

        void carregarClientes()
    }, [])

    const clientesFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase()

        if (!termo) {
            return clientes
        }

        return clientes.filter((cliente) =>
            [cliente.nome, cliente.documento, cliente.email].some(
                (valor) => valor?.toLowerCase().includes(termo),
            ),
        )
    }, [clientes, busca])

    async function handleCadastrarCliente(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()
        setErroCadastro('')

        if (!formulario.nome.trim() || !formulario.documento.trim()) {
            setErroCadastro('Preencha o nome e o documento do cliente.')
            return
        }

        setSalvando(true)

        try {
            await cadastrarCliente({
                nome: formulario.nome.trim(),
                documento: formulario.documento.trim(),
                representante: formulario.representante.trim(),
                email: formulario.email.trim(),
                telefone: formulario.telefone.trim(),
                endereco: formulario.endereco.trim(),
                observacoes: formulario.observacoes.trim(),
            })

            const clientesAtualizados = await listarClientes()
            setClientes(clientesAtualizados)

            setFormulario({
                nome: '',
                documento: '',
                representante: '',
                email: '',
                telefone: '',
                endereco: '',
                observacoes: '',
            })

            setModalAberto(false)
        } catch (error) {
            setErroCadastro(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível cadastrar o cliente.',
            )
        } finally {
            setSalvando(false)
        }
    }

    function abrirModal() {
        setErroCadastro('')
        setModalAberto(true)
    }

    function fecharModal() {
        if (salvando) {
            return
        }

        setModalAberto(false)
        setErroCadastro('')
    }

    return (
        <div className="mx-auto max-w-7xl">
            <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">
                        Clientes
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Consulte e gerencie os clientes cadastrados.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Total de clientes
                        </p>

                        <p className="text-2xl font-bold text-slate-900">
                            {clientes.length}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={abrirModal}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                    >
                        <span className="text-lg">+</span>
                        Novo cliente
                    </button>
                </div>
            </header>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-5">
                    <label
                        htmlFor="busca-clientes"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Buscar cliente
                    </label>

                    <input
                        id="busca-clientes"
                        type="search"
                        value={busca}
                        onChange={(event) => setBusca(event.target.value)}
                        placeholder="Digite o nome, documento ou e-mail..."
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                </div>

                {carregando ? (
                    <p className="p-8 text-center text-slate-500">
                        Carregando clientes...
                    </p>
                ) : erro ? (
                    <div
                        role="alert"
                        className="m-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        {erro}
                    </div>
                ) : clientesFiltrados.length === 0 ? (
                    <div className="p-10 text-center">
                        <h3 className="font-semibold text-slate-800">
                            {clientes.length === 0
                                ? 'Nenhum cliente cadastrado'
                                : 'Nenhum resultado encontrado'}
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            {clientes.length === 0
                                ? 'Os clientes cadastrados aparecerão aqui.'
                                : 'Tente pesquisar por outro nome ou documento.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">
                                        Cliente
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Documento
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Contato
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Situação
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {clientesFiltrados.map((cliente) => (
                                    <tr
                                        key={cliente._id}
                                        className="transition hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-slate-800">
                                                {cliente.nome}
                                            </p>

                                            {cliente.representante && (
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {cliente.representante}
                                                </p>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {cliente.documento}
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="text-slate-700">
                                                {cliente.email || '—'}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {cliente.telefone || 'Sem telefone'}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={[
                                                    'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                                                    cliente.ativo
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-slate-100 text-slate-600',
                                                ].join(' ')}
                                            >
                                                {cliente.ativo
                                                    ? 'Ativo'
                                                    : 'Inativo'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!carregando &&
                    !erro &&
                    clientesFiltrados.length > 0 && (
                        <footer className="border-t border-slate-100 px-6 py-4 text-sm text-slate-500">
                            Exibindo {clientesFiltrados.length} de{' '}
                            {clientes.length} clientes
                        </footer>
                    )}
            </section>

            {modalAberto && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            fecharModal()
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="titulo-modal-cliente"
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                            <div>
                                <h3
                                    id="titulo-modal-cliente"
                                    className="text-xl font-bold text-slate-900"
                                >
                                    Novo cliente
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Preencha os dados para cadastrar um cliente.
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled={salvando}
                                onClick={fecharModal}
                                className="rounded-lg px-3 py-2 text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                                aria-label="Fechar modal"
                            >
                                ×
                            </button>
                        </div>

                        <form
                            onSubmit={handleCadastrarCliente}
                            className="space-y-5 p-6"
                        >
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="nome"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Nome do cliente *
                                    </label>

                                    <input
                                        id="nome"
                                        required
                                        maxLength={150}
                                        value={formulario.nome}
                                        onChange={(event) =>
                                            setFormulario({
                                                ...formulario,
                                                nome: event.target.value,
                                            })
                                        }
                                        placeholder="Nome completo ou razão social"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="documento"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        CPF ou CNPJ *
                                    </label>

                                    <input
                                        id="documento"
                                        required
                                        maxLength={30}
                                        value={formulario.documento}
                                        onChange={(event) =>
                                            setFormulario({
                                                ...formulario,
                                                documento: event.target.value,
                                            })
                                        }
                                        placeholder="Digite o documento"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="representante"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Representante
                                    </label>

                                    <input
                                        id="representante"
                                        maxLength={150}
                                        value={formulario.representante}
                                        onChange={(event) =>
                                            setFormulario({
                                                ...formulario,
                                                representante: event.target.value,
                                            })
                                        }
                                        placeholder="Nome do representante"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        E-mail
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        maxLength={254}
                                        value={formulario.email}
                                        onChange={(event) =>
                                            setFormulario({
                                                ...formulario,
                                                email: event.target.value,
                                            })
                                        }
                                        placeholder="cliente@exemplo.com"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="telefone"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Telefone
                                    </label>

                                    <input
                                        id="telefone"
                                        type="tel"
                                        maxLength={30}
                                        value={formulario.telefone}
                                        onChange={(event) =>
                                            setFormulario({
                                                ...formulario,
                                                telefone: event.target.value,
                                            })
                                        }
                                        placeholder="(00) 00000-0000"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="endereco"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Endereço
                                    </label>

                                    <input
                                        id="endereco"
                                        maxLength={250}
                                        value={formulario.endereco}
                                        onChange={(event) =>
                                            setFormulario({
                                                ...formulario,
                                                endereco: event.target.value,
                                            })
                                        }
                                        placeholder="Rua, número, cidade..."
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="observacoes"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Observações
                                    </label>

                                    <textarea
                                        id="observacoes"
                                        rows={3}
                                        maxLength={1000}
                                        value={formulario.observacoes}
                                        onChange={(event) =>
                                            setFormulario({
                                                ...formulario,
                                                observacoes: event.target.value,
                                            })
                                        }
                                        placeholder="Informações adicionais sobre o cliente..."
                                        className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                            {erroCadastro && (
                                <div
                                    role="alert"
                                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                                >
                                    {erroCadastro}
                                </div>
                            )}

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    disabled={salvando}
                                    onClick={fecharModal}
                                    className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={salvando}
                                    className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {salvando
                                        ? 'Salvando...'
                                        : 'Cadastrar cliente'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
