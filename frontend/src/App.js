import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import NoteFormPanel from './components/NoteFormPanel/NoteFormPanel.js';
import NoteListPanel from './components/NoteListPanel/NoteListPanel.js';
import Header from './components/Header/Header.js';
import Footer from './components/Footer/Footer.js';
import './App.css';

const API_URL = 'http://localhost:5000/api';

const EMPTY_NOTE = { title: '', content: '', categories: [] };

const App = () => {
  const [notes, setNotes] = useState([]);
  const [isArchived, setIsArchived] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentNote, setCurrentNote] = useState(EMPTY_NOTE);

  const handleClearForm = useCallback(() => {
    setCurrentNote(EMPTY_NOTE);
  }, []);

  const fetchNotes = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      const fetched = response.data;
      setCategories(fetched);
      // Drop any selected filters whose category no longer exists
      // (e.g. it was removed as an orphan when its last note was deleted).
      setSelectedCategories((prev) =>
        prev.filter((name) => fetched.some((cat) => cat.name === name))
      );
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
    fetchCategories();
  }, [fetchNotes, fetchCategories]);

  const filteredNotes = React.useMemo(() => {
    return notes.filter((note) => {
      const noteCategories = note.categories || [];
      const matchesArchived = note.isArchived === isArchived;
      const matchesCategory =
        selectedCategories.length === 0 ||
        noteCategories.some((category) => selectedCategories.includes(category.name));
      return matchesArchived && matchesCategory;
    });
  }, [notes, isArchived, selectedCategories]);

  const handleInputChange = (field, value) => {
    setCurrentNote((prevNote) => ({
      ...prevNote,
      [field]: value,
    }));
  };

  const handleToggleArchived = (archived) => {
    setIsArchived(archived);
  };

  const handleSelectNote = (note) => {
    setCurrentNote(note);
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`${API_URL}/notes/${noteId}`);
      if (currentNote.id === noteId) {
        handleClearForm();
      }
      await Promise.all([fetchNotes(), fetchCategories()]);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleArchiveToggle = async (noteId) => {
    try {
      const noteToToggle = notes.find((note) => note.id === noteId);
      if (!noteToToggle) return;

      const updatedIsArchived = !noteToToggle.isArchived;
      await axios.put(`${API_URL}/notes/${noteId}`, { isArchived: updatedIsArchived });

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId ? { ...note, isArchived: updatedIsArchived } : note
        )
      );
    } catch (error) {
      console.error('Error toggling archive status:', error);
    }
  };

  const handleSave = async (noteData, noteId = null) => {
    try {
      if (noteId) {
        await axios.put(`${API_URL}/notes/${noteId}`, noteData);
      } else {
        await axios.post(`${API_URL}/notes`, noteData);
      }
      // Re-sync from the server so edited categories, new categories and
      // orphan cleanup are always reflected in the list and the filters.
      await Promise.all([fetchNotes(), fetchCategories()]);
      handleClearForm();
    } catch (error) {
      console.error('Error saving note:', error);
      alert('There was an error saving your note. Please try again later.');
    }
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="app">
      <Header />
      <div className="app-container">
        <NoteFormPanel
          note={currentNote}
          onInputChange={handleInputChange}
          handleSave={handleSave}
          onClearForm={handleClearForm}
        />
        <div className="panel note-list-panel">
          <NoteListPanel
            notes={filteredNotes}
            isArchived={isArchived}
            onToggleArchived={handleToggleArchived}
            onSelectNote={handleSelectNote}
            onDelete={handleDeleteNote}
            onArchiveToggle={handleArchiveToggle}
            categories={categories}
            onCategoryToggle={handleCategoryToggle}
            selectedCategories={selectedCategories}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
