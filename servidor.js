const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const sqlite3 = require('sqlite3').verbose();

// Conectar con la base de datos SQLite
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
    db.run(`
      CREATE TABLE IF NOT EXISTS characters (
        name TEXT NOT NULL,
        movie TEXT NOT NULL
      )
    `);
  }
});

// Definir el esquema de GraphQL
const schema = buildSchema(`
  type Character {
    name: String
    movie: String
  }

  type Query {
    characters: [Character]
    character(name: String!): Character
  }

  type Mutation {
    addCharacter(name: String!, movie: String!): Character
    updateCharacter(name: String!, movie: String!): Character
    deleteCharacter(name: String!): String
  }
`);

// Funciones para interactuar con la base de datos
const getCharacters = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM characters', [], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
};

const getCharacter = (name) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM characters WHERE name = ?', [name], (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  });
};

const addCharacter = (name, movie) => {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO characters (name, movie) VALUES (?, ?)', [name, movie], function(err) {
      if (err) {
        reject(err);
      }
      resolve({ name, movie });
    });
  });
};

const updateCharacter = (name, movie) => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE characters SET movie = ? WHERE name = ?', [movie, name], function(err) {
      if (err) {
        reject(err);
      }
      resolve({ name, movie });
    });
  });
};

const deleteCharacter = (name) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM characters WHERE name = ?', [name], function(err) {
      if (err) {
        reject(err);
      }
      resolve(`Personaje ${name} eliminado`);
    });
  });
};

// Definir los resolvers de GraphQL
const root = {
  characters: () => getCharacters(),
  character: ({ name }) => getCharacter(name),
  addCharacter: ({ name, movie }) => addCharacter(name, movie),
  updateCharacter: ({ name, movie }) => updateCharacter(name, movie),
  deleteCharacter: ({ name }) => deleteCharacter(name),
};

// Configurar el servidor Express
const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Interface gráfica para probar las queries y mutations
}));

// Iniciar el servidor
app.listen(4000, () => {
  console.log('Servidor GraphQL ejecutándose en http://localhost:4000/graphql');
});
