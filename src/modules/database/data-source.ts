/* eslint-disable @typescript-eslint/no-misused-promises, no-async-promise-executor */
import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { DataSource } from 'typeorm'
import { SeedModule as ModuleWithDataSource } from 'src/modules/database/seeds/seeed.module'

export const AppDataSource: Promise<DataSource> = new Promise(
  async (resolve) => {
    // this file is used from command line
    // if we are in dev mode then
    //   we need to set the host to 0.0.0.0 in case the app is running in a Docker container
    if (process.env.NODE_ENV === 'dev') {
      process.env.DATABASE_HOST = '0.0.0.0'
    }

    const app = await NestFactory.create(ModuleWithDataSource)
    const dataSource = app.get(DataSource)
    await app.close()

    resolve(dataSource)
  }
)
