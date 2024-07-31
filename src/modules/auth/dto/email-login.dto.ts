import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { User } from 'src/modules/auth/dto/user.dto'
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer'

export class EmailLoginRequest {
  @ApiProperty({
    example: 'owl@gmail.com',
    description: "Wise 🦉 owl's email address.",
  })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  readonly email: string

  @ApiProperty({
    example: 'secret-password',
    description: "🔒 top-secret password, don't tell anyone!",
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string
}

export class EmailLoginResponse {
  @ApiProperty({
    example: 'access-token-string',
    description: '🎟️ golden ticket to access our services.',
  })
  readonly accessToken: string

  @ApiProperty({
    example: 'refresh-token-string',
    description: '💦 refreshing token to keep you logged in.',
  })
  readonly refreshToken: string

  @ApiProperty({
    description: 'It is you! 👈👀👈',
  })
  readonly user: User
}
