import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type ClientDocument = HydratedDocument<Client>

@Schema({
    timestamps: true,
})
export class Client {
    @Prop({
        required: true,
        trim: true,
    })
    nome: string

    @Prop({
        required: true,
        unique: true,
        trim: true,
    })
    documento: string

    @Prop({
        trim: true,
    })
    endereco?: string

    @Prop({
        trim: true,
    })
    representante?: string

    @Prop({
        trim: true,
    })
    email?: string

    @Prop({
        trim: true,
    })
    telefone?: string

    @Prop({
        trim: true,
    })
    observacoes?: string

    @Prop({
        default: true,
    })
    ativo: boolean
}

export const ClientSchema = SchemaFactory.createForClass(Client)