import { ConfigType, registerAs } from '@nestjs/config'
import * as Joi from 'joi'

export const authConfigSchema = {
  AUTH_JWT_SECRET: Joi.string().required(),
  AUTH_JWT_TOKEN_EXPIRES_IN: Joi.string().required(),
}

export const authConfig = registerAs('auth', () => ({
  jwtSecret: process.env.AUTH_JWT_SECRET,
  accessTokenExpiresIn: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
}))

export type AuthConfigType = ConfigType<typeof authConfig>
