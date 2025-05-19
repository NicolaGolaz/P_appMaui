import express from "express"; // Importation du module express
import { loginRouter } from "./routes/login.mjs";
import { booksRouter } from "./routes/books.mjs";
import { registerRouter } from "./routes/register.mjs";
import { categoriesRouter } from "./routes/categories.mjs";
import { authorsRouter } from "./routes/authors.mjs";
import { swaggerSpec } from "./swagger.mjs";
import swaggerUi from "swagger-ui-express";
import cors from "cors"; // Importation du module cors

import { sequelize, initDb } from "./db/sequelize.mjs";

const app = express(); // Création de l'application express
app.use(cors()); // Utilisation de CORS pour autoriser les requêtes cross-origin

app.use(express.json()); // Ajoute d'un Middleware pour parser les requêtes en JSON

const port = 3000; // Port d'écoute du serveur

sequelize
  .authenticate()
  // Si la connexion est établie, on affiche un message de confirmation
  .then((_) =>
    console.log("La connexion à la base de données a bien été établie")
  )
  // Si la connexion échoue, on affiche une erreur
  .catch((error) => console.error("Impossible de se connecter à la DB"));

initDb();

app.use("/api/books", booksRouter);

app.use("/api/categories", categoriesRouter);

// Utilisation du routeur pour l'authentification
app.use("/api/login", loginRouter);

// Utilisation du routeur pour l'inscription
app.use("/api/register", registerRouter);

app.use("/api/authors", authorsRouter);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

// Lancement du serveur
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
