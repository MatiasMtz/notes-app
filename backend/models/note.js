/*
* Defines the "Note" entity which represents a note in the app.
* Many-to-many relationship with the "Category" model through the 
* "NoteCategories" join table.
*/

module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define('Note', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Note.associate = (models) => {
    // many-to-many relationship with "Category" model
    Note.belongsToMany(models.Category, {
      through: 'NoteCategories',
      as: 'categories',
      foreignKey: 'noteId',
    });
  };

  return Note;
};