import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common'

import { SystemsService } from './systems.service.js'
import { CreateSystemDto } from './dto/create-system.dto.js'
import { JwtAuthGuard } from '../../common/guards/jwt-auth/jwt-auth.guard.js'
import { UpdateSystemDto } from './dto/update-system.dto.js'        

@Controller('systems')
@UseGuards(JwtAuthGuard)
export class SystemsController {
    constructor(
        private readonly systemsService: SystemsService,
    ) {}

    @Post()
    async create(
        @Body() createSystemDto: CreateSystemDto,
    ) {
        return this.systemsService.create(
            createSystemDto,
        )
    }

    @Get()
    async findAll() {
        return this.systemsService.findAll()
    }

    @Get(':id')
    async findOne(
        @Param('id') id: string,
    ) {
        return this.systemsService.findOne(id)
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateSystemDto: UpdateSystemDto,
    ) {
        return this.systemsService.update(
            id,
            updateSystemDto,
        )
    }

    @Patch(':id/deactivate')
    async deactivate(
        @Param('id') id: string,
    ) {
        return this.systemsService.deactivate(id)
    }

    
    @Patch(':id/activate')
    activate(@Param('id') id: string) {
        return this.systemsService.activate(id)
    }
}