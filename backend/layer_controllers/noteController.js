const noteService = require('../layer_services/noteService');

const createNote = async (req, res) => {
  try {
    const { title, content, isArchived = false, categories } = req.body;
    
    if (categories && Array.isArray(categories)) {
      for (const category of categories) {
        if (!category.name || !category.color) {
          return res.status(400).json({ message: 'Categories must have a name and color established.' });
        }
      }
    }

    const newNote = await noteService.createNote({ title, content, isArchived }, categories);
    return res.status(201).json(newNote);

  } catch (error) {
    console.error("Error found in createNote:", error);
    return res.status(500).json({ message: 'Error while attempting note creation', error: error.message });
  }
};

const getAllNotes = async (req, res) => {
  try {
    const notes = await noteService.getAllNotes();
    notes.forEach(note => {
      if (note.categories) {
        note.categories.forEach(category => {
          console.log(`Category Name: ${category.name}, Color: ${category.color}`);
        });
      } else {
        console.log('No categories for this note');
      }
    });
    
    return res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching notes' });
  }
};

const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await noteService.getNoteById(id);
    if (note) {
      return res.status(200).json(note);
    } else {
      return res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching note' });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const fieldsToUpdate = req.body;

    const updatedNote = await noteService.updateNote(id, fieldsToUpdate);

    if (updatedNote) {
      return res.status(200).json(updatedNote);
    } else {
      return res.status(404).json({ message: 'No note found with the given ID' });
    }
  } catch (error) {
    console.error('Error in controller:', error);
    return res.status(500).json({ message: 'Error updating note' });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await noteService.deleteNote(id);

    if (deletedNote) {
      return res.status(200).json({ message: 'Note deleted successfully', note: deletedNote });
    } else {
      return res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting note' });
  }
};

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
