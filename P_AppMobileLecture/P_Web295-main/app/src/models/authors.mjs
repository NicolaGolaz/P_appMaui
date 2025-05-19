const AuthorModel = (sequelize, DataTypes) => {
  return sequelize.define("Author", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};

export { AuthorModel };
