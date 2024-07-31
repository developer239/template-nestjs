import { ApiProperty } from '@nestjs/swagger'

export class User {
  @ApiProperty()
  readonly id: number

  @ApiProperty({
    example: 'owl@gmail.com',
    description: 'Your wise owl email address.',
  })
  readonly email: string

  @ApiProperty()
  readonly firstName: string

  @ApiProperty()
  readonly lastName: string
}
