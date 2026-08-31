import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteFormPanel from './components/NoteFormPanel/NoteFormPanel.js';
import NoteListPanel from './components/NoteListPanel/NoteListPanel.js';
import Header from './components/Header/Header.js';
import Footer from './components/Footer/Footer.js';
import './App.css';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [isArchived, setIsArchived] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentNote, setCurrentNote] = useState({
    title: '',
    content: '',
    categories: [],
  });

  const handleClearForm = () => {
    setCurrentNote({
      title: '',
      content: '',
      categories: [],
    });
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/notes');
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchNotes();
    fetchCategories();
  }, []);

  const filteredNotes = React.useMemo(() => {
    return notes.filter(note => 
      note.isArchived === isArchived && 
      (selectedCategories.length === 0 || 
        note.categories.some(category => selectedCategories.includes(category.name)))
    );
  }, [notes, isArchived, selectedCategories]);

  const handleInputChange = (field, value) => {
    setCurrentNote(prevNote => ({
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
      await axios.delete(`http://localhost:5000/api/notes/${noteId}`);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleArchiveToggle = async (noteId) => {
    try {
      const noteToToggle = notes.find(note => note.id === noteId);
      if (!noteToToggle) return;
  
      const updatedIsArchived = !noteToToggle.isArchived;
      await axios.put(`http://localhost:5000/api/notes/${noteId}`, { isArchived: updatedIsArchived });
  
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === noteId ? { ...note, isArchived: updatedIsArchived } : note
        )
      );
    } catch (error) {
      console.error('Error toggling archive status:', error);
    }
  };

  const handleSave = async (noteData, noteId = null) => {
    try {
      let response;
      if (noteId) {
        response = await axios.put(`http://localhost:5000/api/notes/${noteId}`, noteData);
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === noteId ? { ...note, ...response.data } : note
          )
        );
      } else {
        response = await axios.post('http://localhost:5000/api/notes', noteData);
  
        const newNote = await axios.get(`http://localhost:5000/api/notes/${response.data.id}`);
        setNotes((prevNotes) => [...prevNotes, newNote.data]);
      }
  
      const allCategories = [...categories];
      noteData.categories.forEach((newCat) => {
        if (!allCategories.some((cat) => cat.name === newCat.name)) {
          allCategories.push(newCat);
        }
      });
      setCategories(allCategories); 
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
        <div className="panel note-form-panel">
          <NoteFormPanel
            note={currentNote}
            onInputChange={handleInputChange}
            handleSave={handleSave}
            onClearForm={handleClearForm}
          />
        </div>
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
