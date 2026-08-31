const categoryRepository = require('../layer_repositories/categoryRepository');

const getCategories = async () => {
  try {
    const categories = await categoryRepository.getAllCategories();
    return categories;
  } catch (error) {
    console.error('Error in categoryService:', error);
    throw error;
  }
};

module.exports = { getCategories };
