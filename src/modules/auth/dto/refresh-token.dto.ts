import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class RefreshTokenRequest {
  @ApiProperty({
    example: 'refresh-token-string',
    description: 'The refreshing token you received before.',
  })
  @IsString()
  @IsNotEmpty()
  readonly refreshToken: string
}

export class RefreshTokenResponse {
  @ApiProperty({
    example: 'access-token-string',
    description: '🎟️ new golden ticket to continue the journey.',
  })
  readonly accessToken: string
}
