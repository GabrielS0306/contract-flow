import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type SystemDocument = HydratedDocument<System>

@Schema({
    timestamps: true,
})
export class System {
    @Prop({
        required: true,
        trim: true,
    })
    nome: string

    @Prop({
        trim: true,
    })
    descricao?: string

    @Prop({
        required: true,
        trim: true,
    })
    versao: string

    @Prop({
        default: true,
    })
    ativo: boolean
}

export const SystemSchema = SchemaFactory.createForClass(System)