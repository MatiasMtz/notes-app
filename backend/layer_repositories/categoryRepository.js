const { Category } = require('../models');

const getAllCategories = async () => {
  try {
    return await Category.findAll();
  } catch (error) {
    console.error('Error in categoryRepository:', error);
    throw error;
  }
};

module.exports = { getAllCategories };
