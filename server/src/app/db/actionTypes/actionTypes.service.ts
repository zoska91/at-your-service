import { Injectable, Inject } from '@nestjs/common';
import { ActionTypes } from './actionTypes.entity';

@Injectable()
export class ActionTypesService {
  constructor(
    @Inject('ACTION_TYPES_REPOSITORY')
    private actionTypesRepository: typeof ActionTypes,
  ) {}

  async findAll(): Promise<ActionTypes[]> {
    return this.actionTypesRepository.findAll<ActionTypes>();
  }
}
