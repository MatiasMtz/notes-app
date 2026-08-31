const noteRepository = require('../layer_repositories/noteRepository');
const { Category } = require('../models');

const createNote = async (noteData, categoryData) => {
  try {
    const note = await noteRepository.createNote({
      title: noteData.title,
      content: noteData.content,
      isArchived: noteData.isArchived,
    });

    if (categoryData && categoryData.length > 0) {
      const categories = await Promise.all(
        categoryData.map(async (category) => {
          const [categoryInstance, created] = await Category.findOrCreate({
            where: { name: category.name },
            defaults: { color: category.color },
          });
      
          if (!created && categoryInstance.color !== category.color) {
            categoryInstance.color = category.color;
            await categoryInstance.save();
          }
      
          return categoryInstance;
        })
      );

      await note.setCategories(categories);
    }
    
    return note;
    
  } catch (error) {
    console.error("Error creando la nota:", error);
    throw new Error("Error creando la nota");
  }
};

const getAllNotes = async () => {
  try {
    const notes = await noteRepository.getAllNotes();
    return notes.map(note => ({
      ...note.get(),
      categories: note.categories.map(category => ({
        name: category.name,
        color: category.color,
      })),
    }));
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw new Error('Error fetching notes');
  }
};

const getNoteById = async (id) => {
  try {
    const note = await noteRepository.getNoteById(id);
    return note;
  } catch (error) {
    console.error('Error fetching note:', error);
    throw new Error('Error fetching note');
  }
};

const updateNote = async (id, fieldsToUpdate) => {
  try {
    const { categories } = fieldsToUpdate;
    const note = await noteRepository.getNoteById(id);

    if (!note) {
      console.log("No note found with the given ID.");
      return null;
    }

    if (categories && Array.isArray(categories)) {
      // Pasamos las categorías directamente al repositorio
      return await noteRepository.updateNote(id, fieldsToUpdate);
    }

    // Si no se actualizan categorías, solo actualizamos los demás campos
    return await noteRepository.updateNote(id, fieldsToUpdate);

  } catch (error) {
    console.error("Error updating note:", error);
    throw new Error('Error updating note');
  }
};



const deleteNote = async (id) => {
  try {
    const note = await noteRepository.getNoteById(id);

    if (!note) {
      return null;
    }
    const categories = note.categories;

    console.log('Categories associated with the note:', categories);

    const deletedNote = await noteRepository.deleteNote(id);

    if (deletedNote && categories && categories.length > 0) {
      for (const category of categories) {
        console.log(`Checking category ${category.id} (${category.name}) for orphan status`);
        const otherNotesCount = await noteRepository.countNotesByCategoryId(category.id);

        if (otherNotesCount === 0) {
          console.log(`Category ${category.id} (${category.name}) is orphan, deleting it`);
          await noteRepository.deleteCategory(category.id);
        } else {
          console.log(`Category ${category.id} (${category.name}) is used by ${otherNotesCount} other notes`);
        }
      }
    }

    return deletedNote;
  } catch (error) {
    console.error("Error deleting note:", error);
    throw new Error("Error deleting note");
  }
};


module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
