import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

@Schema({
    timestamps: true,
})
export class User {
    @Prop({
        required: true,
        trim: true,
    })
    nome: string

    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    })
    email: string

    @Prop({
        required: true,
    })
    senha: string

    @Prop({
        required: true,
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole

    @Prop({
        default: true,
    })
    ativo: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)