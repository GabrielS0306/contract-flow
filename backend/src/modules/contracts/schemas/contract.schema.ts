import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type ContractDocument = HydratedDocument<Contract>

export enum ContractStatus {
    ATIVO = 'ATIVO',
    ENCERRADO = 'ENCERRADO',
    CANCELADO = 'CANCELADO',
}

export enum ContractPeriodicity {
    MENSAL = 'MENSAL',
    ANUAL = 'ANUAL',
    UNICO = 'UNICO',
}

@Schema({
    timestamps: true,
})
export class Contract {
    @Prop({
        required: true,
        unique: true,
        trim: true,
    })
    numero: string

    @Prop({
        type: Types.ObjectId,
        ref: 'Client',
        required: true,
    })
    clienteId: Types.ObjectId

    @Prop({
        type: Types.ObjectId,
        ref: 'System',
        required: true,
    })
    sistemaId: Types.ObjectId

    @Prop({
        required: true,
        enum: ContractPeriodicity,
    })
    periodicidade: ContractPeriodicity

    @Prop({
        required: true,
        min: 0,
    })
    valor: number

    @Prop({
        default: 0,
        min: 0,
    })
    valorImplantacao: number

    @Prop({
        required: true,
    })
    dataInicio: Date

    @Prop({
        required: true,
    })
    dataFim: Date

    @Prop({
        min: 1,
        max: 31,
    })
    diaVencimento?: number

    @Prop({
        trim: true,
    })
    observacoes?: string

    @Prop({
        enum: ContractStatus,
        default: ContractStatus.ATIVO,
    })
    status: ContractStatus
}

export const ContractSchema = SchemaFactory.createForClass(Contract)