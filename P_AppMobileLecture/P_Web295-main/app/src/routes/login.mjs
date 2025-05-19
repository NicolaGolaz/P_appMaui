import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../db/sequelize.mjs";
import { privateKey } from "../auth/private_key.mjs";

const loginRouter = express();

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags: [Login]
 *     summary: User login.
 *     description: User login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials.
 *       404:
 *         description: User not found.
 */
loginRouter.post("/", (req, res) => {
  User.findOne({ where: { username: req.body.username } })
    .then((user) => {
      if (!user) {
        const message = `L'utilisateur demandé n'existe pas`;
        return res.status(404).json({ message });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((isPasswordValid) => {
          if (!isPasswordValid) {
            const message = `Le mot de passe est incorrecte.`;
            return res.status(401).json({ message });
          } else {
            // JWT
            const token = jwt.sign({ userId: user.id }, privateKey, {
              expiresIn: "1y",
            });
            const message = `L'utilisateur a été connecté avec succès`;
            return res.json({ message, data: user, token });
          }
        });
    })
    .catch((error) => {
      const message = `L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants`;
      return res.json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/login:
 *   get:
 *     tags: [Login]
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve all users.
 *     description: Retrieve all users.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
loginRouter.get("/", (req, res) => {
  User.findAll()
    .then((users) => {
      const message = `La liste des utilisateurs a bien été récupérée.`;
      return res.json({ message, data: users });
    })
    .catch((error) => {
      const message = `La liste des utilisateurs n'a pas pu être récupérée. Réessayez dans quelques instants.`;
      return res.json({ message, data: error });
    });
});

export { loginRouter };
