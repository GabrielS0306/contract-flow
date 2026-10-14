import {
    IsDateString,
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
} from 'class-validator'

import {
    ContractPeriodicity,
} from '../schemas/contract.schema.js'

export class CreateContractDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    numero: string

    @IsMongoId()
    clienteId: string

    @IsMongoId()
    sistemaId: string

    @IsEnum(ContractPeriodicity)
    periodicidade: ContractPeriodicity

    @IsNumber()
    @Min(0)
    valor: number

    @IsOptional()
    @IsNumber()
    @Min(0)
    valorImplantacao?: number

    @IsDateString()
    dataInicio: string

    @IsDateString()
    dataFim: string

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(31)
    diaVencimento?: number

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    observacoes?: string
}