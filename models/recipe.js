'use strict';
module.exports = (sequelize, DataTypes) => {
  const recipe = sequelize.define('recipe', {
    title: DataTypes.STRING,
    source: DataTypes.STRING,
    sourceUrl: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    time: DataTypes.INTEGER,
    servings: DataTypes.INTEGER,
    ingredientsObj: DataTypes.JSONB,
    instructionsText: DataTypes.TEXT,
    instructionsObj: DataTypes.JSONB,
    dishTypes: DataTypes.JSONB,
    dietLabels: DataTypes.JSONB,
    healthLabels: DataTypes.JSONB,
    calories: DataTypes.INTEGER,
  }, {});
  recipe.associate = function(models) {
    models.recipe.belongsToMany(models.user, {
      through: 'user_savedrecipes',
      onDelete: 'CASCADE'
    })
    models.recipe.belongsToMany(models.category, {
      through: 'recipes_categories',
      onDelete: 'CASCADE'
    })
  };
  return recipe;
};