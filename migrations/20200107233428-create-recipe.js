'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('recipes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      source: {
        type: Sequelize.STRING
      },
      sourceUrl: {
        type: Sequelize.STRING
      },
      imageUrl: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.INTEGER
      },
      servings: {
        type: Sequelize.INTEGER
      },
      ingredientsText: {
        type: Sequelize.TEXT
      },
      ingredientsObj: {
        type: Sequelize.JSONB
      },
      instructionsText: {
        type: Sequelize.TEXT
      },
      instructionsObj: {
        type: Sequelize.JSONB
      },
      dishTypes: {
        type: Sequelize.JSONB
      },
      dietLabels: {
        type: Sequelize.JSONB
      },
      healthLabels: {
        type: Sequelize.JSONB
      },
      calories: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('recipes');
  }
};