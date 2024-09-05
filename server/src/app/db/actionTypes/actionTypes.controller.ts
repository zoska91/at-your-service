import { Controller, Get } from '@nestjs/common';
import { ActionTypesService } from './actionTypes.service';

@Controller('action-types')
export class ActionTypesController {
  constructor(private readonly actionTypesService: ActionTypesService) {}

  @Get()
  async findAll() {
    return this.actionTypesService.findAll();
  }
}
