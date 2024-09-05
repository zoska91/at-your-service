'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ActionTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ActionTypes.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      number: {
        type: DataTypes.INTEGER, // Poprawiony typ dla liczby całkowitej
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ActionTypes',
    },
  );
  return ActionTypes;
};
