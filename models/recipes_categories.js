'use strict';
module.exports = (sequelize, DataTypes) => {
  const recipes_categories = sequelize.define('recipes_categories', {
    recipeId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {});
  recipes_categories.associate = function(models) {
    // associations can be defined here
  };
  return recipes_categories;
};