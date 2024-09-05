import {
  Column,
  Table,
  PrimaryKey,
  AutoIncrement,
  DataType,
  Model,
} from 'sequelize-typescript';

// Model ActionTypes
@Table
export class ActionTypes extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id!: number;

  @Column({ type: DataType.STRING })
  name!: string;

  @Column({ type: DataType.INTEGER })
  number!: number;
}
