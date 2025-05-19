# P_Web295
Groupe : Krasniqi Emir et Golaz Nicola

## Liens

- MCD et MLD : https://github.com/EmirKrasniqi06/P_Web295/blob/main/docs/MCD-MLD_Books.lo1

- Journal de travaille Emir : https://github.com/EmirKrasniqi06/P_Web295/blob/main/docs/T-P_Web295-Krasniqi-JournalDeTravail.xlsm

- Journal de travaille Nicola : https://github.com/EmirKrasniqi06/P_Web295/blob/main/docs/T-P_Web295-Golaz-JournalDeTravail.xlsm

- Schema des intéractions : https://github.com/EmirKrasniqi06/P_Web295/blob/main/docs/Schema-des-interactions.png

- Liste des routes : https://github.com/EmirKrasniqi06/P_Web295/blob/main/docs/liste_routes.xlsx 

- Code source de l'api : https://github.com/EmirKrasniqi06/P_Web295/tree/main/app

## Arborescence des fichiers

```
P_Web295
│   .gitignore
│   package-lock.json
│   README.md
│
├── app  # code source de l'API
│   │   package-lock.json
│   │   package.json
│   │
│   ├── src
│   │   │   app.mjs
│   │   │   swagger.mjs
│   │   │
│   │   ├── auth
│   │   │   │   auth.mjs
│   │   │   │   private_key.mjs
│   │   │
│   │   ├── db
│   │   │   │   mock-author.mjs
│   │   │   │   mock-book.mjs
│   │   │   │   mock-category.mjs
│   │   │   │   mock-comment.mjs
│   │   │   │   mock-note.mjs
│   │   │   │   mock-user.mjs
│   │   │   │   sequelize.mjs
│   │   │
│   │   ├── models
│   │   │   │   authors.mjs
│   │   │   │   books.mjs
│   │   │   │   categories.mjs
│   │   │   │   comments.mjs
│   │   │   │   notes.mjs
│   │   │   │   users.mjs
│   │   │
│   │   ├── routes
│   │   │   │   authors.mjs
│   │   │   │   books.mjs
│   │   │   │   categories.mjs
│   │   │   │   helper.mjs
│   │   │   │   login.mjs
│   │   │   │   register.mjs
│   │
│   ├── tests
│   │   │   Tests-Routes.json
│
└── docs  # documentation
    │   liste_routes.xlsx
    │   MCD-MLD_Books.lo1
    │   MCD-MLD_Books.loo
    │   Schema-des-iteractions.png
    │   T-P_Web295-Golaz-JournalDeTravail.xlsm
    │   T-P_Web295-Krasniqi-JournalDeTravail.xlsm
```

## Point d'éco-conception

Le serveur renvoie à l'utilisateur les messages d'erreur et codes HTTP approprié, ce qui permet
de réduire le nombre de requête et optimise le traitement côté client.

