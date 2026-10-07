import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common'

import { ClientsService } from './clients.service.js'
import { CreateClientDto } from './dto/create-client.dto.js'
import { UpdateClientDto } from './dto/update-client.dto.js'
import { JwtAuthGuard } from '../../common/guards/jwt-auth/jwt-auth.guard.js'

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
    constructor(
        private readonly clientsService: ClientsService,
    ) {}

    @Post()
    async create(
        @Body() createClientDto: CreateClientDto,
    ) {
        return this.clientsService.create(createClientDto)
    }

    @Get()
    async findAll() {
        return this.clientsService.findAll()
    }

    @Get(':id')
    async findOne(
        @Param('id') id: string,
    ) {
        return this.clientsService.findOne(id)
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateClientDto: UpdateClientDto,
    ) {
        return this.clientsService.update(
            id,
            updateClientDto,
        )
    }

    @Patch(':id/deactivate')
    async deactivate(
        @Param('id') id: string,
    ) {
        return this.clientsService.deactivate(id)
    }
}