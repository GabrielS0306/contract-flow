import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { unlink } from 'node:fs/promises'
import { resolve, basename } from 'node:path'

import {
    createReadStream,
    existsSync,
} from 'node:fs'

import {
    Contract,
    ContractDocument,
} from './schemas/contract.schema.js'
import { CreateContractDto } from './dto/create-contract.dto.js'
import { UpdateContractDto } from './dto/update-contract.dto.js'
import {
    Client,
    ClientDocument,
} from '../clients/schemas/client.schema.js'
import {
    System,
    SystemDocument,
} from '../systems/schemas/system.schema.js'

@Injectable()
export class ContractsService {
    constructor(
        @InjectModel(Contract.name)
        private readonly contractModel: Model<ContractDocument>,

        @InjectModel(Client.name)
        private readonly clientModel: Model<ClientDocument>,

        @InjectModel(System.name)
        private readonly systemModel: Model<SystemDocument>,
    ) {}

    private async validarReferencias(
        clienteId: string,
        sistemaId: string,
    ) {
        if (!Types.ObjectId.isValid(clienteId)) {
            throw new BadRequestException('ID do cliente inválido')
        }

        if (!Types.ObjectId.isValid(sistemaId)) {
            throw new BadRequestException('ID do sistema inválido')
        }

        const cliente = await this.clientModel.findById(clienteId)

        if (!cliente || !cliente.ativo) {
            throw new BadRequestException(
                'Cliente não encontrado ou inativo',
            )
        }

        const sistema = await this.systemModel.findById(sistemaId)

        if (!sistema || !sistema.ativo) {
            throw new BadRequestException(
                'Sistema não encontrado ou inativo',
            )
        }
    }

    async create(createContractDto: CreateContractDto) {
        const {
            clienteId,
            sistemaId,
            dataInicio,
            dataFim,
        } = createContractDto

        if (new Date(dataFim) < new Date(dataInicio)) {
            throw new BadRequestException(
                'A data final não pode ser anterior à data inicial',
            )
        }

        await this.validarReferencias(clienteId, sistemaId)

        const contract = new this.contractModel({
            ...createContractDto,
            clienteId: new Types.ObjectId(clienteId),
            sistemaId: new Types.ObjectId(sistemaId),
        })

        return contract.save()
    }

    async findAll() {
        return this.contractModel
            .find()
            .populate('clienteId', 'nome documento')
            .populate('sistemaId', 'nome versao')
            .sort({ createdAt: -1 })
    }

    async findOne(id: string) {
        const contract = await this.contractModel
            .findById(id)
            .populate('clienteId', 'nome documento')
            .populate('sistemaId', 'nome versao')

        if (!contract) {
            throw new NotFoundException('Contrato não encontrado')
        }

        return contract
    }

    async update(id: string, updateContractDto: UpdateContractDto) {
        const contract = await this.contractModel.findById(id)

        if (!contract) {
            throw new NotFoundException('Contrato não encontrado')
        }

        const dataInicio = updateContractDto.dataInicio
            ? new Date(updateContractDto.dataInicio)
            : contract.dataInicio

        const dataFim = updateContractDto.dataFim
            ? new Date(updateContractDto.dataFim)
            : contract.dataFim

        if (dataFim < dataInicio) {
            throw new BadRequestException(
                'A data final não pode ser anterior à data inicial',
            )
        }

        const clienteId =
            updateContractDto.clienteId ?? contract.clienteId.toString()

        const sistemaId =
            updateContractDto.sistemaId ?? contract.sistemaId.toString()

        if (updateContractDto.clienteId || updateContractDto.sistemaId) {
            await this.validarReferencias(clienteId, sistemaId)
        }

        const dadosAtualizacao = {
            ...updateContractDto,
            ...(updateContractDto.dataInicio && { dataInicio }),
            ...(updateContractDto.dataFim && { dataFim }),
        }

        const contratoAtualizado = await this.contractModel.findByIdAndUpdate(
            id,
            dadosAtualizacao,
            {
                returnDocument: 'after',
                runValidators: true,
            },
        )

        if (!contratoAtualizado) {
            throw new NotFoundException('Contrato não encontrado')
        }

        return this.findOne(id)
    }

    
    async activate(id: string) {
        const contract = await this.contractModel.findByIdAndUpdate(
            id,
            {
                status: 'ATIVO',
            },
            {
                returnDocument: 'after',
                runValidators: true,
            },
        )

        if (!contract) {
            throw new NotFoundException('Contrato não encontrado')
        }

        return contract
    }

    async deactivate(id: string) {
        const contract = await this.contractModel.findByIdAndUpdate(
            id,
            {
                status: 'ENCERRADO',
            },
            {
                returnDocument: 'after',
                runValidators: true,
            },
        )

        if (!contract) {
            throw new NotFoundException('Contrato não encontrado')
        }

        return contract
    }

    async uploadArquivo(
        id: string,
        arquivo: {
            arquivoNome: string
            arquivoCaminho: string
            arquivoMimeType: string
            arquivoTamanho: number
        },
    ) {
        if (!Types.ObjectId.isValid(id)) {
            await unlink(
                resolve('uploads/contracts', arquivo.arquivoCaminho),
            ).catch(() => undefined)

            throw new BadRequestException(
                'ID do contrato inválido',
            )
        }

        const contrato = await this.contractModel.findById(id)

        if (!contrato) {
            await unlink(
                resolve('uploads/contracts', arquivo.arquivoCaminho),
            ).catch(() => undefined)

            throw new NotFoundException(
                'Contrato não encontrado',
            )
        }

        const arquivoAnterior = contrato.arquivoCaminho

        try {
            contrato.set({
                arquivoNome: arquivo.arquivoNome,
                arquivoCaminho: arquivo.arquivoCaminho,
                arquivoMimeType: arquivo.arquivoMimeType,
                arquivoTamanho: arquivo.arquivoTamanho,
            })

            await contrato.save()
        } catch (erro) {
            await unlink(
                resolve('uploads/contracts', arquivo.arquivoCaminho),
            ).catch(() => undefined)

            throw erro
        }

        if (
            arquivoAnterior &&
            arquivoAnterior !== arquivo.arquivoCaminho
        ) {
            await unlink(
                resolve('uploads/contracts', arquivoAnterior),
            ).catch(() => undefined)
        }

        return this.findOne(id)
    }

        async obterCaminhoArquivo(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(
                'ID do contrato inválido',
            )
        }

        const contrato = await this.contractModel.findById(id)

        if (!contrato) {
            throw new NotFoundException(
                'Contrato não encontrado',
            )
        }

        if (!contrato.arquivoCaminho) {
            throw new NotFoundException(
                'Este contrato não possui um PDF associado',
            )
        }

        const nomeArquivo = basename(contrato.arquivoCaminho)
        const caminhoArquivo = resolve(
            'uploads/contracts',
            nomeArquivo,
        )

        if (!existsSync(caminhoArquivo)) {
            throw new NotFoundException(
                'O arquivo PDF não foi encontrado no armazenamento',
            )
        }

        return {
            caminhoArquivo,
            nomeOriginal: contrato.arquivoNome ?? 'contrato.pdf',
        }
    }
}
