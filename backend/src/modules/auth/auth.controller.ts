import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common'
import type { Request } from 'express'

import { AuthService } from './auth.service.js'
import { CreateUserDto } from './dto/create-user.dto.js'
import { LoginDto } from './dto/login.dto.js'
import { JwtAuthGuard } from '../../common/guards/jwt-auth/jwt-auth.guard.js'

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('register')
    async register(
        @Body() createUserDto: CreateUserDto,
    ) {
        return this.authService.createUser(createUserDto)
    }

    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
    ) {
        return this.authService.login(loginDto)
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me(@Req() request: Request) {
        return request.user
    }
}