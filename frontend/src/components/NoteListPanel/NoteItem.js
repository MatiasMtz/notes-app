import React from 'react';
import './NoteItem.css';

const NoteItem = ({ note, onDelete, onArchiveToggle, onSelectNote }) => {

  return (
    <div
      className={`note-item ${note.isArchived ? 'archived' : ''}`}
      onClick={() => onSelectNote(note)}
    >
      <div className="note-header">
        <h4>{note.title}</h4>
        <div className="note-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArchiveToggle(note.id);
            }}
          >
            {note.isArchived ? 'Unarchive' : 'Archive'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {(note.categories || []).length > 0 && (
        <div className="categories">
          {(note.categories || []).map((category) => (
            <span
              key={category.id ?? category.name}
              className="category"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteItem;
