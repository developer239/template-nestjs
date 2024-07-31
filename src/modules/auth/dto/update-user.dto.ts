import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Validate,
} from 'class-validator'
import { UserRole } from 'src/modules/auth/roles/roles.types'
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer'
import { DoesNotExist } from 'src/utils/validators/does-not-exist.validator'

export class UpdateUserRequest {
  @ApiProperty({ required: false, example: 'new@email.com' })
  @Transform(lowerCaseTransformer)
  @Validate(DoesNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  @IsOptional()
  readonly email?: string

  @ApiProperty({ required: false })
  @MinLength(6)
  @IsString()
  @IsOptional()
  readonly password?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly firstName?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly lastName?: string

  @ApiProperty({ enum: UserRole, required: false })
  @IsOptional()
  readonly role?: UserRole
}
