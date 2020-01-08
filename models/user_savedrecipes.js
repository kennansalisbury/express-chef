'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_savedrecipes = sequelize.define('user_savedrecipes', {
    userId: DataTypes.INTEGER,
    recipeId: DataTypes.INTEGER
  }, {});
  user_savedrecipes.associate = function(models) {
    // associations can be defined here
  };
  return user_savedrecipes;
};