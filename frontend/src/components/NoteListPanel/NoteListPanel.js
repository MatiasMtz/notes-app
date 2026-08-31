import React, { useState } from 'react';
import NoteItem from './NoteItem';
import './NoteListPanel.css';

const NoteListPanel = ({
  notes,
  isArchived,
  onToggleArchived,
  onSelectNote,
  onDelete,
  onArchiveToggle,
  categories,
  onCategoryToggle,
  selectedCategories,
}) => {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  return (
    <div className="NoteListPanel">
      <div className="ToggleButtonContainer">
        <button
          className={`ToggleButton ${!isArchived ? 'active' : ''}`}
          onClick={() => onToggleArchived(false)}
        >
          Active
        </button>
        <button
          className={`ToggleButton ${isArchived ? 'active' : ''}`}
          onClick={() => onToggleArchived(true)}
        >
          Archived
        </button>
      </div>
      
      <div className="FilterButtonContainer">
        <button
          className="FilterButton"
          onClick={() => setIsFilterMenuOpen((prev) => !prev)}
        >
          Filter by Category
        </button>

        {isFilterMenuOpen && Array.isArray(categories) && categories.length > 0 && (
          <div className="FilterMenu">
            {categories.map((category) => (
              <label key={category.id} className="FilterOption">
                <input
                  type="checkbox"
                  checked={Array.isArray(selectedCategories) && selectedCategories.includes(category.name)}
                  onChange={() => onCategoryToggle(category.name)}
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        )}
        
        <div className="SelectedCategories">
          {Array.isArray(selectedCategories) && selectedCategories.length > 0 && selectedCategories.map((category, index) => {
            const categoryObj = categories.find((cat) => cat.name === category);
            return (
              <span
                key={index}
                className="CategoryTag"
                style={{ backgroundColor: categoryObj?.color }}
              >
                {category}
                <button
                  className="RemoveCategory"
                  onClick={() => onCategoryToggle(category)}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      </div>

      <div className="NoteList">
        {notes.length === 0 ? (
          <p className="NoNotesMessage">No notes available</p>
        ) : (
          notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onSelectNote={onSelectNote}
              onDelete={onDelete}
              onArchiveToggle={onArchiveToggle}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NoteListPanel;
