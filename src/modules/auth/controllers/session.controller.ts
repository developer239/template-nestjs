import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { AuthService } from 'src/modules/auth/auth.service'
import {
  EmailLoginRequest,
  EmailLoginResponse,
} from 'src/modules/auth/dto/email-login.dto'
import {
  RefreshTokenRequest,
  RefreshTokenResponse,
} from 'src/modules/auth/dto/refresh-token.dto'
import { User } from 'src/modules/auth/entities/user.entity'
import { GetUserPayload } from 'src/modules/auth/strategies/user.decorator'
import { IpAddress } from 'src/utils/decorators/ip-address.decorator'

@ApiTags('Session')
@Controller({
  path: 'session',
  version: '1',
})
export class SessionController {
  constructor(public service: AuthService) {}

  @Throttle({
    default: {
      ttl: 60000,
      limit: 6,
    },
  })
  @UseGuards(AuthGuard('local'))
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('email')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: EmailLoginResponse,
  })
  public login(
    @Body() loginDto: EmailLoginRequest,
    @GetUserPayload() user: User,
    @IpAddress() ipAddress
  ) {
    return this.service.login(user, ipAddress)
  }

  @UseGuards(AuthGuard('jwt-refresh-token'))
  @Post('refresh')
  @ApiOkResponse({
    type: RefreshTokenResponse,
  })
  public refreshToken(
    @Body() refreshTokenDto: RefreshTokenRequest,
    @GetUserPayload() user: User
  ): { accessToken: string } {
    return this.service.refreshAccessToken(user)
  }
}
