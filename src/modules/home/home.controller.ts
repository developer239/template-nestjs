import { Controller, Get, Header } from '@nestjs/common'
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger'

import { HomeService } from 'src/modules/home/home.service'

@ApiTags('Home')
@Controller()
export class HomeController {
  constructor(private readonly service: HomeService) {}

  @Get() appInfo() {
    return this.service.appInfo()
  }

  @ApiExcludeEndpoint()
  @Get('robots.txt')
  @Header('Content-Type', 'text/plain')
  @Header('Cache-Control', 'public, max-age=86400')
  robots() {
    return 'User-agent: *\nDisallow: /'
  }
}
