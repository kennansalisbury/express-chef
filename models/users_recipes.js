'use strict';
module.exports = (sequelize, DataTypes) => {
  const users_recipes = sequelize.define('users_recipes', {
    userId: DataTypes.INTEGER,
    recipeId: DataTypes.INTEGER
  }, {});
  users_recipes.associate = function(models) {
    // associations can be defined here
  };
  return users_recipes;
};