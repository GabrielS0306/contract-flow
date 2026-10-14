import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'node:path'
import { randomUUID } from 'node:crypto'
import { unlink } from 'node:fs/promises'
import { fileTypeFromFile } from 'file-type'

import { ContractsService } from './contracts.service.js'
import { CreateContractDto } from './dto/create-contract.dto.js'
import { UpdateContractDto } from './dto/update-contract.dto.js'
import { JwtAuthGuard } from '../../common/guards/jwt-auth/jwt-auth.guard.js'

import {
    createReadStream,
} from 'node:fs'
import {
    basename,
} from 'node:path'
import type {
    Response,
} from 'express'
import {
    Res,
    StreamableFile,
} from '@nestjs/common'

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
    async activate(
        @Param('id') id: string,
    ) {
        return this.contractsService.activate(id)
    }

    @Patch(':id/deactivate')
    async deactivate(
        @Param('id') id: string,
    ) {
        return this.contractsService.deactivate(id)
    }

    @Post(':id/upload')
    @UseInterceptors(
        FileInterceptor('arquivo', {
            storage: diskStorage({
                destination: './uploads/contracts',
                filename: (_req, file, callback) => {
                    callback(
                        null,
                        `${randomUUID()}${extname(file.originalname).toLowerCase()}`,
                    )
                },
            }),
            limits: {
                fileSize: 10 * 1024 * 1024,
                files: 1,
            },
            fileFilter: (_req, file, callback) => {
                if (
                    file.mimetype !== 'application/pdf' ||
                    extname(file.originalname).toLowerCase() !== '.pdf'
                ) {
                    return callback(
                        new BadRequestException(
                            'Envie apenas arquivos PDF.',
                        ),
                        false,
                    )
                }

                callback(null, true)
            },
        }),
    )
    async upload(
        @Param('id') id: string,
        @UploadedFile() arquivo: Express.Multer.File,
    ) {
        if (!arquivo) {
            throw new BadRequestException(
                'Nenhum arquivo PDF válido foi enviado.',
            )
        }

        try {
            const tipoArquivo = await fileTypeFromFile(
                arquivo.path,
            )

            if (tipoArquivo?.mime !== 'application/pdf') {
                await unlink(arquivo.path)

                throw new BadRequestException(
                    'O conteúdo do arquivo não é um PDF válido.',
                )
            }

            return await this.contractsService.uploadArquivo(id, {
                arquivoNome: arquivo.originalname,
                arquivoCaminho: arquivo.filename,
                arquivoMimeType: 'application/pdf',
                arquivoTamanho: arquivo.size,
            })
        } catch (erro) {
            if (erro instanceof BadRequestException) {
                throw erro
            }

            await unlink(arquivo.path).catch(() => undefined)

            throw erro
        }
    }

    @Get(':id/download')
    async download(
        @Param('id') id: string,
        @Res({ passthrough: true }) response: Response,
    ) {
        const arquivo =
            await this.contractsService.obterCaminhoArquivo(id)

        response.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${basename(arquivo.nomeOriginal).replace(/["\r\n]/g, '_')}"`,
            'Cache-Control': 'private, no-store',
            'X-Content-Type-Options': 'nosniff',
        })

        return new StreamableFile(
            createReadStream(arquivo.caminhoArquivo),
        )
    }
}