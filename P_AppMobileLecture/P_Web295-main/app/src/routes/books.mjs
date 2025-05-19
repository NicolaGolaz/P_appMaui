import express from "express";
import { Book, User, Comment, Note } from "../db/sequelize.mjs";
import { success } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";

const booksRouter = express();

/**
 * @swagger
 * /api/books:
 *   get:
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve all books.
 *     description: Retrieve all books. Can be used to populate a select HTML tag.
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: The title of the book to search for.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of books to retrieve.
 *     responses:
 *       200:
 *         description: A list of books.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */

////////////// LIVRES /////////////////////////////////////////////////////////////////////////////////////

// Permet de récupérer la liste des livres, et de rechercher des livre en fonction de leur nom, en ayant la possibilité de choisir la limite
booksRouter.get("/", (req, res) => {
  // Vérifie si l'utilisateur a entré un nom de livre
  if (req.query.title) {
    // Vérifie si le nom est plus petit que 0 (si c'est le cas => erreur, car la recherche pourrait être trop gourmande ou peu utile)
    if (req.query.title.length < 2) {
      const message = `Le terme de la recherche doit contenir au moins 2 caractères`;
      return res.status(400).json({ message });
    }
    let limit = 3;
    // Si l'utilisateur a entré une limite, la valeur entrée est assigné à la variable "limit"
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }
    // Trouve et compte tous les livres
    return Book.findAndCountAll({
      where: { title: { [Op.like]: `%${req.query.title}%` } },
      // Ordonne les livres dans l'ordre alphabétique en fonction du nom
      order: ["title"],
      limit: limit,
    }).then((books) => {
      const message = `Il y a ${books.count} livres qui correspondent au terme de la recherche`;
      res.json(success(message, books));
    });
  }
  // Trouve tous les livres
  Book.findAll({ order: ["title"] })
    .then((books) => {
      const message = "La liste des livres a bien été récupérée.";
      res.json(success(message, books));
    })
    .catch((error) => {
      const message =
        "La liste des livres n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a book by ID.
 *     description: Retrieve a book by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the book to retrieve.
 *     responses:
 *       200:
 *         description: A book object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found.
 */

// Recherche grace a l'id le bon livre, si le livre est null, une erreur est levée
booksRouter.get("/:id", auth, (req, res) => {
  Book.findByPk(req.params.id)
    .then((book) => {
      if (book === null) {
        const message =
          "Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
        // A noter ici le return pour interrompre l'exécution du code
        return res.status(404).json({ message });
      }
      const message = `Le livre dont l'id vaut ${book.id} a bien été récupéré.`;
      res.json(success(message, book));
    })
    .catch((error) => {
      const message =
        "Le livre n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/books:
 *   post:
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new book.
 *     description: Create a new book.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validation error.
 */

booksRouter.post("/", auth, (req, res) => {
  Book.create(req.body).then((createdBook) => {
    // Trouver l'utilisateur qui a créé le livre
    return (
      User.findByPk(req.body.userId)
        .then((user) => {
          if (!user) {
            const message = `L'utilisateur n'existe pas.`;
            return res.status(404).json({ message });
          }
          // Incrémenter la variable numberOfBooks de l'utilisateur
          user.numberOfBooks += 1;
          return user.save().then(() => {
            // Définir un message pour le consommateur de l'API REST
            const message = `Le livre ${createdBook.title} a bien été créé !`;
            // Retourner la réponse HTTP en json avec le msg et le livre créé
            res.json(success(message, createdBook));
          });
        })
        // vérifie si l'erreur est de tyoe "ValidationError", et retourne la bonne erreur
        .catch((error) => {
          if (error instanceof ValidationError) {
            return res
              .status(400)
              .json({ message: error.message, data: error });
          }
          const message =
            "Le livre n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
          res.status(500).json({ message, data: error });
        })
    );
  });
});

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a book by ID.
 *     description: Delete a book by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the book to delete.
 *     responses:
 *       200:
 *         description: The deleted book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found.
 */

booksRouter.delete("/:id", auth, (req, res) => {
  Book.findByPk(req.params.id)
    .then((deletedBook) => {
      // Vérifie si le livre indiqué éxiste
      if (deletedBook === null) {
        const message =
          "Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
        // A noter ici le return pour interrompre l'exécution du code
        return res.status(404).json({ message });
      }
      // Supprime le livres dont l'id a été indiqué
      return Book.destroy({
        where: { id: deletedBook.id },
      }).then((_) => {
        // Définir un message pour le consommateur de l'API REST
        const message = `Le livre ${deletedBook.title} a bien été supprimé !`;
        // Retourner la réponse HTTP en json avec le msg et le livre créé
        res.json(success(message, deletedBook));
      });
    })
    .catch((error) => {
      const message =
        "Le livre n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     summary: Update a book by ID.
 *     description: Update a book by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the book to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The updated book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found.
 */

// Route permettant de mettre a jour le livre dont l'id a été indiqué
booksRouter.put("/:id", auth, (req, res) => {
  const bookId = req.params.id;
  // Si il y a un problème pendant le update, ou dans le "then" du update, on fait le "catch"
  Book.update(req.body, { where: { id: bookId } })
    .then((_) => {
      return Book.findByPk(bookId).then((updatedBook) => {
        if (updatedBook === null) {
          const message =
            "Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
          // A noter ici le return pour interrompre l'exécution du code
          return res.status(404).json({ message });
        }
        // Définir un message pour l'utilisateur de l'API REST
        const message = `Le livre ${updatedBook.title} dont l'id vaut ${updatedBook.id} a été mis à jour avec succès !`;
        // Retourner la réponse HTTP en json avec le msg et le livre créé
        res.json(success(message, updatedBook));
      });
    })
    .catch((error) => {
      const message =
        "Le livre n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

////////////// COMMENTAIRES /////////////////////////////////////////////////////////////////////////////////////

/**
 * @swagger
 * /api/books/{id}/comments:
 *   get:
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve comments for a book.
 *     description: Retrieve comments for a book by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the book.
 *     responses:
 *       200:
 *         description: A list of comments.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */

// Route permettant de récupérer la liste des commentaires en fonction du livre
booksRouter.get("/:id/comments", auth, (req, res) => {
  Comment.findAll({ where: { bookFk: req.params.id } })
    .then((comments) => {
      const message = `La liste des commentaires du livre ${req.params.id} a bien été récupérée.`;
      res.json(success(message, comments));
    })
    .catch((error) => {
      const message = `La liste des commentaires du livre ${req.params.id} n'a pas pu être récupérée. Merci de réessayer dans quelques instants.`;
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/books/{id}/comments:
 *   post:
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     summary: Create a comment for a book.
 *     description: Create a comment for a book by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the book.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: The created comment.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */

// Route permettant de créer un commentaire
booksRouter.post("/:id/comments", auth, (req, res) => {
  Comment.create(req.body).then((createdComment) => {
    const message = `Le commentaire ${createdComment.content} a bien été créé !`;
    res.json(success(message, createdComment));
  });
});

////////////// NOTES /////////////////////////////////////////////////////////////////////////////////////

/**
 * @swagger
 * /api/books/{id}/notes:
 *   get:
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve notes for a book.
 *     description: Retrieve notes for a book by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the book.
 *     responses:
 *       200:
 *         description: A list of notes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 */

// Route permettant de récupérer la liste des notes en fonction du livre
booksRouter.get("/:id/notes", auth, (req, res) => {
  Note.findAll({ where: { bookFk: req.params.id } })
    .then((notes) => {
      const message = `La liste des notes du livre ${req.params.id} a bien été récupérée.`;
      res.json(success(message, notes));
    })
    .catch((error) => {
      const message = `La liste des notes du livre ${req.params.id} n'a pas pu être récupérée. Merci de réessayer dans quelques instants.`;
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/books/{id}/notes:
 *   post:
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     summary: Create a note for a book.
 *     description: Create a note for a book by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the book.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *     responses:
 *       201:
 *         description: The created note.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *       500:
 *         description: Internal server error.
 */

// Route permettant de créer une note
booksRouter.post("/:id/notes", auth, (req, res) => {
  Note.create(req.body).then((createdNote) => {
    const message = `La note ${createdNote.value} a bien été créée !`;
    res.json(success(message, createdNote));
  });
});

export { booksRouter };
