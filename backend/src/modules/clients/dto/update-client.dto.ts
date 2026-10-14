import {
    IsEmail,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator'

export class UpdateClientDto {
    @IsOptional()
    @IsString()
    @MaxLength(150)
    nome?: string

    @IsOptional()
    @IsString()
    @MaxLength(30)
    documento?: string

    @IsOptional()
    @IsString()
    @MaxLength(255)
    endereco?: string

    @IsOptional()
    @IsString()
    @MaxLength(150)
    representante?: string

    @IsOptional()
    @IsEmail()
    email?: string

    @IsOptional()
    @IsString()
    @MaxLength(30)
    telefone?: string

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    observacoes?: string
}