import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../db/sequelize.mjs";
import { privateKey } from "../auth/private_key.mjs";

const registerRouter = express();

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags: [Register]
 *     summary: User registration.
 *     description: User registration.
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
 *               isAdmin:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: User registered successfully.
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
 *       500:
 *         description: Internal server error.
 */
registerRouter.post("/", (req, res) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    User.create({
      username: req.body.username,
      password: hash,
      isAdmin: req.body.isAdmin || false,
      joinDate: new Date(),
      numberOfBooks: 0,
      numberOfReviews: 0,
      numberOfComments: 0,
    })
      .then((user) => {
        const token = jwt.sign({ userId: user.id }, privateKey, {
          expiresIn: "1y",
        });
        const message = `L'utilisateur a été créé avec succès`;
        return res.status(201).json({ message, data: user, token });
      })
      .catch((error) => {
        const message = `L'utilisateur n'a pas pu être créé. Réessayez dans quelques instants`;
        return res.status(500).json({ message, data: error });
      });
  });
});

export { registerRouter };
