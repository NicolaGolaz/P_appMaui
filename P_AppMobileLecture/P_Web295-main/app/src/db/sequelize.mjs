import { Sequelize, DataTypes } from "sequelize";
import { BookModel } from "../models/books.mjs";
import { CategoryModel } from "../models/categories.mjs";
import { UserModel } from "../models/users.mjs";
import { books } from "./mock-book.mjs";
import { categories } from "./mock-category.mjs";
import { users } from "./mock-user.mjs";
import { comments } from "./mock-comment.mjs";
import { CommentModel } from "../models/comments.mjs";
import { AuthorModel } from "../models/authors.mjs";
import { authors } from "./mock-author.mjs";
import { notes } from "./mock-note.mjs";
import { NoteModel } from "../models/notes.mjs";
import bcrypt from "bcrypt";

const sequelize = new Sequelize(
  "db_books", // Nom de la DB qui doit exister
  "root", // Nom de l'utilisateur
  "root", // Mot de passe de l'utilisateur
  {
    host: "localhost",
    dialect: "mysql",
    port: 6033,
    logging: false,
  }
);

// Le modèle product
const Book = BookModel(sequelize, DataTypes);
// Le modèle user
const User = UserModel(sequelize, DataTypes);
// Le modèle category
const Category = CategoryModel(sequelize, DataTypes);
// Le modèle comment
const Comment = CommentModel(sequelize, DataTypes);
// Le modèle author
const Author = AuthorModel(sequelize, DataTypes);
// Le modèle note
const Note = NoteModel(sequelize, DataTypes);

// Définir les relations////////////////////////////////////////////////////////////////

// Relation entre les livres et les utilisateurs
Book.belongsTo(User, {
  foreignKey: "userFk",
});
User.hasMany(Book, {
  foreignKey: "userFk",
});

// Relation entre les livres et les catégories
Book.belongsTo(Category, {
  foreignKey: "categoryFk",
});
Category.hasMany(Book, {
  foreignKey: "categoryFk",
});

// Relation entre les commentaires et les livres
Book.hasMany(Comment, {
  foreignKey: "bookFk",
});
Comment.belongsTo(Book, {
  foreignKey: "bookFk",
});

// Relation entre les commentaires et les utilisateurs
User.hasMany(Comment, {
  foreignKey: "userFk",
});
Comment.belongsTo(User, {
  foreignKey: "userFk",
});

// Relation entre les livres et les auteurs
Author.hasMany(Book, {
  foreignKey: "authorFk",
});
Book.belongsTo(Author, {
  foreignKey: "authorFk",
});

// Relation entre les notes et les livres
Book.hasMany(Note, {
  foreignKey: "bookFk",
});
Note.belongsTo(Book, {
  foreignKey: "bookFk",
});

// Relation entre les notes et les utilisateurs
User.hasMany(Note, {
  foreignKey: "userFk",
});
Note.belongsTo(User, {
  foreignKey: "userFk",
});
////////////////////////////////////////////////////////////////////////////////////////

let initDb = () => {
  return sequelize
    .sync({ force: true }) // Force la synchro => donc supprime les données également
    .then((_) => {
      importCategories()
        .then(() => importAuthors())
        .then(() => importUsers())
        .then(() => importBooks())
        .then(() => importComments())
        .then(() => importNotes())
        .then(() => {
          console.log("La base de données db_books a bien été synchronisée");
        });
    });
};

const importBooks = () => {
  return Promise.all(
    books.map((book) => {
      return Book.create({
        id: book.id,
        title: book.title,
        numberOfPages: book.numberOfPages,
        extract: book.extract,
        summary: book.summary,
        nameEditor: book.nameEditor,
        coverImage: book.coverImage,
        yearOfPublication: book.yearOfPublication,
        averageOfReviews: book.averageOfReviews,
        categoryFk: book.category_fk,
        authorFk: book.author_fk,
        userFk: book.userFk,
      }).then((book) => console.log(book.toJSON()));
    })
  );
};

const importCategories = () => {
  return Promise.all(
    categories.map((category) => {
      return Category.create({
        name: category.name,
      }).then((category) => console.log(category.toJSON()));
    })
  );
};

const importUsers = () => {
  return Promise.all(
    users.map((user) => {
      return bcrypt
        .hash(user.password, 10) // temps pour hasher = du sel
        .then((hash) =>
          User.create({
            id: user.id,
            username: user.username,
            password: hash,
            isAdmin: user.isAdmin,
            joinDate: user.joinDate,
            numberOfBooks: user.numberOfBooks,
            numberOfReviews: user.numberOfReviews,
            numberOfComments: user.numberOfComments,
          }).then((user) => console.log(user.toJSON()))
        );
    })
  );
};

const importComments = () => {
  return Promise.all(
    comments.map((comment) => {
      return Comment.create({
        id: comment.id,
        content: comment.content,
        bookFk: comment.bookFk,
        userFk: comment.userFk,
      }).then((comment) => console.log(comment.toJSON()));
    })
  );
};

const importAuthors = () => {
  return Promise.all(
    authors.map((author) => {
      return Author.create({
        id: author.id,
        name: author.name,
        firstname: author.firstname,
      }).then((author) => console.log(author.toJSON()));
    })
  );
};

const importNotes = () => {
  return Promise.all(
    notes.map((note) => {
      return Note.create({
        id: note.id,
        value: note.value,
        bookFk: note.bookFk,
        userFk: note.userFk,
      }).then((note) => console.log(note.toJSON()));
    })
  );
};

export {
  sequelize,
  importUsers,
  User,
  initDb,
  importBooks,
  importCategories,
  Book,
  Category,
  Comment,
  Author,
  importComments,
  importAuthors,
  Note,
  importNotes,
};
