import {
    IsDateString,
    IsEnum,
    IsMongoId,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
} from 'class-validator'

import {
    ContractPeriodicity,
    ContractStatus,
} from '../schemas/contract.schema.js'

export class UpdateContractDto {
    @IsOptional()
    @IsString()
    @MaxLength(50)
    numero?: string

    @IsOptional()
    @IsMongoId()
    clienteId?: string

    @IsOptional()
    @IsMongoId()
    sistemaId?: string

    @IsOptional()
    @IsEnum(ContractPeriodicity)
    periodicidade?: ContractPeriodicity

    @IsOptional()
    @IsNumber()
    @Min(0)
    valor?: number

    @IsOptional()
    @IsNumber()
    @Min(0)
    valorImplantacao?: number

    @IsOptional()
    @IsDateString()
    dataInicio?: string

    @IsOptional()
    @IsDateString()
    dataFim?: string

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(31)
    diaVencimento?: number

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    observacoes?: string

    @IsOptional()
    @IsEnum(ContractStatus)
    status?: ContractStatus
}   