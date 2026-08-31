import React, { useState } from 'react';
import { IoIosCloseCircleOutline, IoIosSave } from "react-icons/io";
import { MdOutlineCategory } from "react-icons/md";
import { LuEraser } from "react-icons/lu";
import './NoteFormPanel.css';

const NoteFormPanel = ({ note, onInputChange, handleSave, onClearForm }) => {
  const [showCategory, setShowCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const { title, content, categories = [] } = note || {};

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleAddCategory = (e) => {
    if (e.key === 'Enter' && newCategory.trim() !== '') {
      const trimmedCategory = newCategory.trim();
      if (!categories.some(category => category.name === trimmedCategory)) {
        const updatedCategories = [...categories, { name: trimmedCategory, color: getRandomColor() }];
        onInputChange('categories', updatedCategories); 
      }
      setNewCategory('');
      e.preventDefault();
    }
  };

  const handleRemoveCategory = (categoryName) => {
    const updatedCategories = categories.filter(cat => cat.name !== categoryName);
    onInputChange('categories', updatedCategories);
  };

  const isValid = (title || '').trim() !== '' && (content || '').trim() !== '';

  const handleSaveNote = async () => {
    if (!isValid) {
      alert('Please add a title and some content before saving.');
      return;
    }

    // Include a category that was typed but not confirmed with Enter.
    let finalCategories = categories;
    const pending = newCategory.trim();
    if (pending && !categories.some(category => category.name === pending)) {
      finalCategories = [...categories, { name: pending, color: getRandomColor() }];
    }

    const noteData = {
      title: title.trim(),
      content: content.trim(),
      categories: finalCategories,
    };

    if (note.id) {
      await handleSave(noteData, note.id);
    } else {
      await handleSave(noteData);
    }

    setNewCategory('');
    setShowCategory(false);
  };

  const handleClearForm = () => {
    setNewCategory('');
    setShowCategory(false);
    onClearForm();
  };

  return (
    <div className="panel note-form-panel">
      <div className="form-row title-row">
        <div className="title-container">
          <input
            type="text"
            value={title || ''}
            placeholder="Title"
            onChange={e => onInputChange('title', e.target.value)}
          />
          <button className="category-toggle" onClick={() => setShowCategory(!showCategory)}>
            <MdOutlineCategory />
          </button>
        </div>
      </div>
      {showCategory && (
        <div className="form-row category-row">
          <input
            type="text"
            value={newCategory}
            placeholder="Add Category"
            onChange={e => setNewCategory(e.target.value)}
            onKeyDown={handleAddCategory}
            className="category-input"
          />
          <div className="categories-list">
            {categories.map(category => (
              <button
                key={category.name}
                className="category-button"
                style={{ backgroundColor: category.color }}
                onClick={() => handleRemoveCategory(category.name)}
              >
                {category.name} <span className="remove-btn"><IoIosCloseCircleOutline /></span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="form-row content-row">
        <textarea
          value={content || ''}
          onChange={e => onInputChange('content', e.target.value)}
          placeholder="Write your note here..."
        />
      </div>
      <div className="form-row button-row">
        <button className="add-btn" onClick={handleClearForm}>
          <LuEraser /> New Note
        </button>
        <button
          className={`next-btn ${note.id ? 'edit-mode' : ''}`}
          onClick={handleSaveNote}
          disabled={!isValid}
        >
          {note.id ? 'Save Changes' : 'Save'} <IoIosSave />
        </button>
      </div>
    </div>
  );
};

export default NoteFormPanel;