import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator'
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer'
import { DoesNotExist } from 'src/utils/validators/does-not-exist.validator'

export class RegisterRequest {
  @ApiProperty({
    example: 'owl@gmail.com',
    description: "Wise 🦉 owl's email address.",
  })
  @Transform(lowerCaseTransformer)
  @Validate(DoesNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  readonly email: string

  @ApiProperty({
    example: 'secret-password',
    description: "🔒 top-secret password, don't tell anyone!",
  })
  @IsString()
  @MinLength(6)
  readonly password: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly firstName: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly lastName: string
}
