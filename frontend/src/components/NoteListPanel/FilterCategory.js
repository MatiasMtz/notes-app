import React from 'react';
import './FilterCategory.css';

const FilterCategory = ({ tags, onFilter }) => {
  return (
    <div className="filter-category">
      <h4>Filter by Category:</h4>
      <div className="tags-container">
        {tags.map((tag, index) => (
          <button
            key={index}
            className="tag-button"
            onClick={() => onFilter(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterCategory;