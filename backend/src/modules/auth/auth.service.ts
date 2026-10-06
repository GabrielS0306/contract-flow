import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'

import { User, UserDocument, UserRole } from './schemas/user.schema.js'
import { CreateUserDto } from './dto/create-user.dto.js'
import { LoginDto } from './dto/login.dto.js'

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
    ) {}

    async createUser(createUserDto: CreateUserDto) {
        const { nome, email, senha } = createUserDto

        const senhaHash = await bcrypt.hash(senha, 10)

        const user = new this.userModel({
            nome,
            email,
            senha: senhaHash,
            role: UserRole.USER,
            ativo: true,
        })

        return user.save()
    }

    async login(loginDto: LoginDto) {
        const { email, senha } = loginDto

        const user = await this.userModel.findOne({
            email: email.toLowerCase(),
        })

        if (!user) {
            throw new UnauthorizedException('E-mail ou senha inválidos')
        }

        const senhaValida = await bcrypt.compare(
            senha,
            user.senha,
        )

        if (!senhaValida) {
            throw new UnauthorizedException('E-mail ou senha inválidos')
        }

        if (!user.ativo) {
            throw new UnauthorizedException('Usuário inativo')
        }

        const payload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
        }

        const accessToken = await this.jwtService.signAsync(payload)

        return {
            access_token: accessToken,
            user: {
                id: user._id,
                nome: user.nome,
                email: user.email,
                role: user.role,
            },
        }
    }
}