import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API self-service-machine",
      version: "1.0.0",
      description:
        "API REST permettant de gérer l'application self-service-machine",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["username", "password", "isAdmin", "joinDate"],
          properties: {
            id: {
              type: "integer",
              description: "L'identifiant unique de l'utilisateur.",
            },
            username: {
              type: "string",
              description: "Le nom d'utilisateur.",
            },
            password: {
              type: "string",
              description: "Le mot de passe de l'utilisateur.",
            },
            isAdmin: {
              type: "boolean",
              description: "Indique si l'utilisateur est un administrateur.",
            },
            joinDate: {
              type: "string",
              format: "date-time",
              description:
                "La date et l'heure de l'inscription de l'utilisateur.",
            },
            numberOfBooks: {
              type: "integer",
              description: "Le nombre de livres proposés par l'utilisateur.",
            },
            numberOfReviews: {
              type: "integer",
              description:
                "Le nombre d'appréciations reçues par l'utilisateur.",
            },
            numberOfComments: {
              type: "integer",
              description:
                "Le nombre de commentaires postés par l'utilisateur.",
            },
          },
        },
        Book: {
          type: "object",
          required: [
            "title",
            "numberOfPages",
            "extract",
            "summary",
            "nameEditor",
            "coverImage",
            "yearOfPublication",
            "averageOfReviews",
            "categoryFk",
            "authorFk",
            "userFk",
          ],
          properties: {
            id: {
              type: "integer",
              description: "L'identifiant unique du livre.",
            },
            title: {
              type: "string",
              description: "Le titre du livre.",
            },
            numberOfPages: {
              type: "integer",
              description: "Le nombre de pages du livre.",
            },
            extract: {
              type: "string",
              description: "Un extrait du livre.",
            },
            summary: {
              type: "string",
              description: "Un résumé du livre.",
            },
            nameEditor: {
              type: "string",
              description: "Le nom de l'éditeur.",
            },
            coverImage: {
              type: "string",
              description: "L'URL de l'image de couverture.",
            },
            yearOfPublication: {
              type: "integer",
              description: "L'année de publication.",
            },
            averageOfReviews: {
              type: "integer",
              description: "La moyenne des avis.",
            },
            categoryFk: {
              type: "integer",
              description: "L'identifiant de la catégorie.",
            },
            authorFk: {
              type: "integer",
              description: "L'identifiant de l'auteur.",
            },
            userFk: {
              type: "integer",
              description: "L'identifiant de l'utilisateur.",
            },
          },
        },
        Author: {
          type: "object",
          required: ["name", "firstname"],
          properties: {
            id: {
              type: "integer",
              description: "L'identifiant unique de l'auteur.",
            },
            name: {
              type: "string",
              description: "Le nom de l'auteur.",
            },
            firstname: {
              type: "string",
              description: "Le prénom de l'auteur.",
            },
          },
        },
        Category: {
          type: "object",
          required: ["name"],
          properties: {
            id: {
              type: "integer",
              description: "L'identifiant unique de la catégorie.",
            },
            name: {
              type: "string",
              description: "Le nom de la catégorie.",
            },
          },
        },
        Comment: {
          type: "object",
          required: ["content", "userFk", "bookFk"],
          properties: {
            id: {
              type: "integer",
              description: "L'identifiant unique du commentaire.",
            },
            content: {
              type: "string",
              description: "Le contenu du commentaire.",
            },
            userFk: {
              type: "integer",
              description: "L'identifiant de l'utilisateur.",
            },
            bookFk: {
              type: "integer",
              description: "L'identifiant du livre.",
            },
          },
        },
        Note: {
          type: "object",
          required: ["value", "userFk", "bookFk"],
          properties: {
            id: {
              type: "integer",
              description: "L'identifiant unique de la note.",
            },
            value: {
              type: "integer",
              description: "La valeur de la note.",
            },
            userFk: {
              type: "integer",
              description: "L'identifiant de l'utilisateur.",
            },
            bookFk: {
              type: "integer",
              description: "L'identifiant du livre.",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.mjs"],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec };
