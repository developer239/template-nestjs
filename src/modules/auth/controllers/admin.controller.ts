import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AuthService } from 'src/modules/auth/auth.service'
import { UpdateUserRequest } from 'src/modules/auth/dto/update-user.dto'
import { User } from 'src/modules/auth/dto/user.dto'
import { Roles } from 'src/modules/auth/roles/roles.decorator'
import { RolesGuard } from 'src/modules/auth/roles/roles.guard'
import { UserRole } from 'src/modules/auth/roles/roles.types'

@Roles(UserRole.ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
@ApiTags('Admin')
@SerializeOptions({
  groups: ['admin'],
})
@Controller({
  path: 'admin',
  version: '1',
})
export class AdminController {
  constructor(public service: AuthService) {}

  @Get('users')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: User,
    isArray: true,
  })
  findAll(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return this.service.findUsers({
      offset,
      limit,
    })
  }

  @Patch('users/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: User,
  })
  async update(
    @Param('id') id: number,
    @Body() updateProfileDto: UpdateUserRequest
  ) {
    const user = await this.service.updateUser(id, updateProfileDto)

    return user
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.service.deleteUser(id)
  }
}
