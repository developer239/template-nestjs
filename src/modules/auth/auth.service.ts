import * as crypto from 'crypto'
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { DeepPartial } from 'typeorm'
import { authConfig, AuthConfigType } from 'src/config/auth.config'
import { RegisterRequest } from 'src/modules/auth/dto/register.dto'
import { RefreshTokenRepository } from 'src/modules/auth/entities/refresh-token-repository'
import { User } from 'src/modules/auth/entities/user.entity'
import { UsersRepository } from 'src/modules/auth/entities/users.repository'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject(authConfig.KEY)
    private readonly authConfigValues: AuthConfigType
  ) {}

  async validateUserByEmailPassword(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.usersRepository.findOne({ email })

    if (user) {
      const isValidPassword = await bcrypt.compare(password, user?.password)
      if (isValidPassword) {
        return user
      }
    }

    return null
  }

  async validateUserById(userId: number) {
    const user = await this.usersRepository.findOne({ id: userId })

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }

  async login(user: User, ipAddress: string) {
    const token = this.jwtService.sign(
      {
        id: user.id,
        roleId: user.role,
      },
      {
        expiresIn: this.authConfigValues.accessTokenExpiresIn,
      }
    )
    const refreshToken = this.jwtService.sign(
      {
        id: user.id,
        roleId: user.role,
        jti: crypto.randomBytes(16).toString('hex'),
      },
      {
        expiresIn: '1y',
      }
    )
    await this.refreshTokenRepository.addRefreshToken(
      user.id,
      refreshToken,
      ipAddress
    )

    return {
      accessToken: token,
      refreshToken,
      user,
    }
  }

  register(dto: RegisterRequest) {
    return this.usersRepository.create({
      ...dto,
    })
  }

  refreshAccessToken(user: User) {
    const accessToken = this.jwtService.sign(
      {
        id: user.id,
        roleId: user.role,
      },
      {
        expiresIn: this.authConfigValues.accessTokenExpiresIn,
      }
    )

    return { accessToken }
  }

  findUsers(paginationOptions: { offset: number; limit: number }) {
    return this.usersRepository.findManyWithPagination(paginationOptions)
  }

  async updateUser(id: number, payload: DeepPartial<User>) {
    const result = await this.usersRepository.update(id, payload)
    if (!result) {
      throw new NotFoundException('User not found')
    }

    return result
  }

  async deleteUser(id: number) {
    const hasDeleted = await this.usersRepository.softDelete(id)

    if (!hasDeleted) {
      throw new NotFoundException('User not found')
    }
  }
}
