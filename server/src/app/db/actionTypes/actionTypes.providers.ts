import { ActionTypes } from './actionTypes.entity';

export const actionTypesProviders = [
  {
    provide: 'ACTION_TYPES_REPOSITORY',
    useValue: ActionTypes,
  },
];
