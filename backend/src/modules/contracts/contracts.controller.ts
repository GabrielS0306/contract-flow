import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common'

import { ContractsService } from './contracts.service.js'
import { CreateContractDto } from './dto/create-contract.dto.js'
import { UpdateContractDto } from './dto/update-contract.dto.js'
import { JwtAuthGuard } from '../../common/guards/jwt-auth/jwt-auth.guard.js'

@Controller('contracts')
@UseGuards(JwtAuthGuard)
export class ContractsController {
    constructor(
        private readonly contractsService: ContractsService,
    ) {}

    @Post()
    async create(
        @Body() createContractDto: CreateContractDto,
    ) {
        return this.contractsService.create(
            createContractDto,
        )
    }

    @Get()
    async findAll() {
        return this.contractsService.findAll()
    }

    @Get(':id')
    async findOne(
        @Param('id') id: string,
    ) {
        return this.contractsService.findOne(id)
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateContractDto: UpdateContractDto,
    ) {
        return this.contractsService.update(
            id,
            updateContractDto,
        )
    }
    
    @Patch(':id/activate')
    activate(@Param('id') id: string) {
        return this.contractsService.activate(id)
    }

    @Patch(':id/deactivate')
    async deactivate(
        @Param('id') id: string,
    ) {
        return this.contractsService.deactivate(id)
    }
}
