import {
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { System, SystemDocument } from './schemas/system.schema.js'
import { CreateSystemDto } from './dto/create-system.dto.js'
import { UpdateSystemDto } from './dto/update-system.dto.js'

@Injectable()
export class SystemsService {
    constructor(
        @InjectModel(System.name)
        private readonly systemModel: Model<SystemDocument>,
    ) {}

    async create(createSystemDto: CreateSystemDto) {
        const system = new this.systemModel({
            ...createSystemDto,
            ativo: true,
        })

        return system.save()
    }

    async findAll() {
        return this.systemModel.find().sort({
            createdAt: -1,
        })
    }

    async findOne(id: string) {
        const system = await this.systemModel.findById(id)

        if (!system) {
            throw new NotFoundException('Sistema não encontrado')
        }

        return system
    }

    async update(
        id: string,
        updateSystemDto: UpdateSystemDto,
    ) {
        const system = await this.systemModel.findByIdAndUpdate(
            id,
            updateSystemDto,
            {
                new: true,
                runValidators: true,
            },
        )

        if (!system) {
            throw new NotFoundException('Sistema não encontrado')
        }

        return system
    }

    async deactivate(id: string) {
        const system = await this.systemModel.findByIdAndUpdate(
            id,
            {
                ativo: false,
            },
            {
                new: true,
            },
        )

        if (!system) {
            throw new NotFoundException('Sistema não encontrado')
        }

        return system
    }
}