import express from "express";
import { Book, Category } from "../db/sequelize.mjs";
import { success } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";
const categoriesRouter = express();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve all categories.
 *     description: Retrieve all categories.
 *     responses:
 *       200:
 *         description: A list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
categoriesRouter.get("/", auth, (req, res) => {
  Category.findAll({ order: ["id"] })
    .then((categories) => {
      const message = "La liste des catégories a bien été récupérée.";
      res.json(success(message, categories));
    })
    .catch((error) => {
      const message =
        "La liste des catégories n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a category by ID.
 *     description: Retrieve a category by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the category to retrieve.
 *     responses:
 *       200:
 *         description: A category object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found.
 */
categoriesRouter.get("/:id", auth, (req, res) => {
  Category.findByPk(req.params.id)
    .then((category) => {
      if (category === null) {
        const message = `La catégorie demandée n'existe pas.`;
        return res.status(404).json({ message });
      }
      const message = `La catégorie ${category.name} a bien été récupérée.`;
      res.json(success(message, category));
    })
    .catch((error) => {
      const message = `La catégorie n'a pas pu être récupérée. Merci de réessayer dans quelques instants.`;
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/categories:
 *   post:
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new category.
 *     description: Create a new category.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: The created category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validation error.
 */
categoriesRouter.post("/", auth, (req, res) => {
  Category.create(req.body)
    .then((category) => {
      const message = `La catégorie ${category.name} a bien été créée.`;
      res.json(success(message, category));
    })
    .catch((error) => {
      if (error instanceof ValidationError) {
        const message = "La catégorie n'a pas pu être créée.";
        return res.status(400).json({ message, data: error });
      }
      const message =
        "La catégorie n'a pas pu être créée. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a category by ID.
 *     description: Delete a category by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the category to delete.
 *     responses:
 *       200:
 *         description: The deleted category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found.
 */
categoriesRouter.delete("/:id", auth, (req, res) => {
  Category.destroy({ where: { id: req.params.id } })
    .then((deletedCategory) => {
      if (deletedCategory === 0) {
        const message = `La catégorie demandée n'existe pas.`;
        return res.status(404).json({ message });
      }
      const message = `La catégorie a bien été supprimée.`;
      res.json(success(message, deletedCategory));
    })
    .catch((error) => {
      const message = `La catégorie n'a pas pu être supprimée. Merci de réessayer dans quelques instants.`;
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/categories/{id}/books:
 *   get:
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve books by category ID.
 *     description: Retrieve books by category ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the category.
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
 *         description: Category not found.
 */
categoriesRouter.get("/:id/books", auth, (req, res) => {
  Book.findAll({ where: { categoryFk: req.params.id } })
    .then((books) => {
      Category.findByPk(req.params.id).then((category) => {
        if (category === null) {
          const message = `La catégorie demandée n'existe pas.`;
          return res.status(404).json({ message });
        }
        const message = `La liste des livres de la catégorie ${category.name} a bien été récupérée.`;
        res.json(success(message, books));
      });
    })
    .catch((error) => {
      const message =
        "La liste des livres n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

export { categoriesRouter };
