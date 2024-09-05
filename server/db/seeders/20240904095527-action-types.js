'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'ActionTypes',
      [
        {
          name: 'None',
          number: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Notes',
          number: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Calendar',
          number: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
