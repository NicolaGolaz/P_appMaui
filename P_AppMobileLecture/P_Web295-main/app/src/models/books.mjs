// https://sequelize.org/docs/v7/models/data-types/
const BookModel = (sequelize, DataTypes) => {
  return sequelize.define("Book", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numberOfPages: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    extract: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nameEditor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    yearOfPublication: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    averageOfReviews: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};

export { BookModel };
