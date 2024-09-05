import { Sequelize } from 'sequelize-typescript';
import { ActionTypes } from 'src/app/db/actionTypes/actionTypes.entity';

require('dotenv').config(); // this is important!

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: process.env.DB_TYPE as any,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      });
      sequelize.addModels([ActionTypes]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
