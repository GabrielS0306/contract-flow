import {
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Client, ClientDocument } from './schemas/client.schema.js'
import { CreateClientDto } from './dto/create-client.dto.js'
import { UpdateClientDto } from './dto/update-client.dto.js'

@Injectable()
export class ClientsService {
    constructor(
        @InjectModel(Client.name)
        private readonly clientModel: Model<ClientDocument>,
    ) {}

    async create(createClientDto: CreateClientDto) {
        const client = new this.clientModel(createClientDto)

        return client.save()
    }

    async findAll() {
        return this.clientModel.find().sort({
            createdAt: -1,
        })
    }

    async findOne(id: string) {
        const client = await this.clientModel.findById(id)

        if (!client) {
            throw new NotFoundException('Cliente não encontrado')
        }

        return client
    }

    async update(
        id: string,
        updateClientDto: UpdateClientDto,
    ) {
        const client = await this.clientModel.findByIdAndUpdate(
            id,
            updateClientDto,
            {
                returnDocument: 'after',
                runValidators: true,
            },
        )

        if (!client) {
            throw new NotFoundException('Cliente não encontrado')
        }

        return client
    }

    async deactivate(id: string) {
        const client = await this.clientModel.findByIdAndUpdate(
            id,
            {
                ativo: false,
            },
            {
                returnDocument: 'after',
            },
        )

        if (!client) {
            throw new NotFoundException('Cliente não encontrado')
        }

        return client
    }
}