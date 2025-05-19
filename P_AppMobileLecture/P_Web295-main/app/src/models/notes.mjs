const NoteModel = (sequelize, DataTypes) => {
  return sequelize.define("Note", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userFk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    bookFk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Books",
        key: "id",
      },
    },
  });
};

export { NoteModel };
