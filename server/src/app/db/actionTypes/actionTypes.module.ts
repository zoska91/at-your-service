import { Module } from '@nestjs/common';
import { actionTypesProviders } from './actionTypes.providers';
import { ActionTypesService } from './actionTypes.service';
import { DatabaseModule } from 'db/database.module';
import { ActionTypesController } from './actionTypes.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ActionTypesController],
  providers: [ActionTypesService, ...actionTypesProviders],
  exports: [ActionTypesService],
})
export class ActionTypesModule {}
