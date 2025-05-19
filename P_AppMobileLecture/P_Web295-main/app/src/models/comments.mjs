const CommentModel = (sequelize, DataTypes) => {
  return sequelize.define("Comment", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true,
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

export { CommentModel };
