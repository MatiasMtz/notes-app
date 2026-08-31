module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '#6F013F',
      },
    },
    {
      timestamps: true,
    }
  );

  Category.associate = (models) => {
    Category.belongsToMany(models.Note, {
      through: 'NoteCategories',
      as: 'notes',
      foreignKey: 'CategoryId',
    });
  };

  return Category;
};
