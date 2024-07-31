import { HttpException, Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments'
import { DataSource } from 'typeorm'

type ValidationEntity =
  | {
      id?: number | string
    }
  | undefined

@Injectable()
@ValidatorConstraint({ name: 'DoesNotExist', async: true })
export class DoesNotExist implements ValidatorConstraintInterface {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    const repository = validationArguments.constraints[0] as string
    const currentValue = validationArguments.object as ValidationEntity
    const entity = (await this.dataSource.getRepository(repository).findOne({
      where: {
        [validationArguments.property]: value,
      },
    })) as ValidationEntity

    // TODO: if updating ignore current user email or reconsider not using at all

    const isNotExist = entity?.id === currentValue?.id || !entity

    if (!isNotExist) {
      throw new HttpException('Entity already exists', 422)
    }

    return isNotExist
  }
}
