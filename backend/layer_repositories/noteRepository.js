/*
* Handles all database operations related to notes. 
* It provides methods to create, retrieve, update, and delete notes, 
* Workflow: Frontend <-> Routes <-> Controller <-> Service <-> Repository <-> Database
*/

const { Note, Category } = require('../models');

const createNote = async ({ title, content, isArchived }) => {
  try {
    const newNote = await Note.create({ title, content, isArchived });
    return newNote;
  } catch (error) {
    console.error('Error creating note:', error);
    throw new Error('Error creating note');
  }
};

const getAllNotes = async () => {
  try {
    console.log("Fetching all notes with categories...");
    const notes = await Note.findAll({
      include: [
        {
          model: Category,
          as: 'categories', 
          attributes: ['name', 'color'],
          through: { attributes: [] },
        },
      ],
    });
    return notes;
  } catch (error) {
    console.error("Error in getAllNotes:", error);
    throw new Error('Error fetching notes: ' + error.message);
  }
};

const getNoteById = async (id) => {
  try {
    const note = await Note.findOne({
      where: { id: id },
      include: [
        {
          model: Category,
          as: 'categories',
          attributes: ['id', 'name', 'color'],
          through: { attributes: [] },
        },
      ],
    });
    return note;
  } catch (error) {
    console.error('Error fetching note:', error);
    throw new Error('Error fetching note');
  }
};

const updateNote = async (id, fieldsToUpdate) => {
  try {
    const [updatedCount] = await Note.update(fieldsToUpdate, { where: { id } });

    if (updatedCount > 0) {
      const updatedNote = await Note.findOne({ where: { id } });

      if (fieldsToUpdate.categories) {
        const currentCategories = await updatedNote.getCategories();

        // Filtrar las categorías que se deben eliminar
        const categoriesToRemove = currentCategories.filter(
          (category) => !fieldsToUpdate.categories.some(c => c.name === category.name)
        );

        // Eliminar categorías no necesarias de la nota
        await updatedNote.removeCategories(categoriesToRemove);

        // Eliminar categorías si ya no están asociadas a otras notas
        for (let category of categoriesToRemove) {
          const associatedNotes = await category.getNotes(); // Obtén todas las notas asociadas a esta categoría
          if (associatedNotes.length === 0) {
            // Si no hay otras notas asociadas, eliminar la categoría
            await category.destroy();
          }
        }

        // Agregar las nuevas categorías
        const newCategories = await Promise.all(
          fieldsToUpdate.categories.map(async (category) => {
            const [categoryInstance] = await Category.findOrCreate({
              where: { name: category.name },
              defaults: { color: category.color },
            });

            // Si la categoría ya existe y el color ha cambiado, actualízalo
            if (categoryInstance.color !== category.color) {
              categoryInstance.color = category.color;
              await categoryInstance.save();
            }

            return categoryInstance;
          })
        );

        await updatedNote.addCategories(newCategories);
      }

      return updatedNote;
    }

    return null;
  } catch (error) {
    console.error('Error updating note:', error);
    throw new Error('Error updating note');
  }
};


const countNotesByCategoryId = async (categoryId) => {
  try {
    const count = await Note.count({
      include: {
        model: Category,
        as: 'categories',
        where: { id: categoryId },
      },
    });
    return count;
  } catch (error) {
    console.error('Error counting notes by category:', error);
    throw new Error('Error counting notes by category');
  }
};

const deleteCategory = async (categoryId) => {
  try {
    await Category.destroy({ where: { id: categoryId } });
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Error deleting category');
  }
};

const deleteNote = async (id) => {
  try {
    const noteToDelete = await Note.findOne({ where: { id } });

    if (!noteToDelete) {
      return null;
    }

    const deletedCount = await Note.destroy({
      where: { id },
    });

    if (deletedCount > 0) {
      return noteToDelete;
    }

    return null;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw new Error('Error deleting note');
  }
};

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  countNotesByCategoryId,
  deleteCategory,
};
