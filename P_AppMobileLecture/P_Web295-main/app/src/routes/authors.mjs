import express from "express";
import { success } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";
import { Author } from "../db/sequelize.mjs";
import { Book } from "../db/sequelize.mjs";
const authorsRouter = express();

/**
 * @swagger
 * /api/authors:
 *   get:
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve all authors.
 *     description: Retrieve all authors.
 *     responses:
 *       200:
 *         description: A list of authors.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 */
authorsRouter.get("/", auth, (req, res) => {
  Author.findAll({ order: ["id"] })
    .then((authors) => {
      const message = "La liste des auteurs a bien été récupérée.";
      res.json(success(message, authors));
    })
    .catch((error) => {
      const message =
        "La liste des auteurs n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/authors/{id}:
 *   get:
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve an author by ID.
 *     description: Retrieve an author by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the author to retrieve.
 *     responses:
 *       200:
 *         description: An author object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found.
 */
authorsRouter.get("/:id", auth, (req, res) => {
  Author.findByPk(req.params.id)
    .then((author) => {
      if (author === null) {
        const message = `L'auteur demandée n'existe pas.`;
        return res.status(404).json({ message });
      }
      const message = `L'auteur ${author.name} a bien été récupérée.`;
      res.json(success(message, author));
    })
    .catch((error) => {
      const message = `L'auteur n'a pas pu être récupérée. Merci de réessayer dans quelques instants.`;
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/authors/{id}/books:
 *   get:
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve books by author ID.
 *     description: Retrieve books by author ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the author.
 *     responses:
 *       200:
 *         description: A list of books.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       404:
 *         description: Author not found.
 */
authorsRouter.get("/:id/books", auth, (req, res) => {
  Book.findAll({ where: { authorFk: req.params.id } })
    .then((books) => {
      Author.findByPk(req.params.id).then((author) => {
        if (author === null) {
          const message = `L'auteur demandé n'existe pas.`;
          return res.status(404).json({ message });
        }
        const message = `La liste des livres de l'auteur ${author.name} a bien été récupérée.`;
        res.json(success(message, books));
      });
    })
    .catch((error) => {
      const message =
        "La liste des livres n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

export { authorsRouter };
