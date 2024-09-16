const sqlite3 = require('sqlite3').verbose();

// Conectar con la base de datos SQLite
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
    
    // Poblar la tabla con datos de personajes
    const characters = [
      { name: 'Harry Potter', movie: 'Harry Potter and the Sorcerer\'s Stone' },
      { name: 'Frodo Baggins', movie: 'The Lord of the Rings: The Fellowship of the Ring' },
      { name: 'Darth Vader', movie: 'Star Wars: A New Hope' },
      { name: 'Tony Stark', movie: 'Iron Man' },
      { name: 'Bruce Wayne', movie: 'The Dark Knight' },
      { name: 'James Bond', movie: 'Casino Royale' },
      { name: 'Ellen Ripley', movie: 'Alien' },
      { name: 'Neo', movie: 'The Matrix' },
      { name: 'Wonder Woman', movie: 'Wonder Woman' },
      { name: 'Sherlock Holmes', movie: 'Sherlock Holmes' }
    ];

    db.serialize(() => {
      const stmt = db.prepare('INSERT INTO characters (name, movie) VALUES (?, ?)');

      characters.forEach(({ name, movie }) => {
        stmt.run(name, movie);
      });

      stmt.finalize();

      console.log('Datos insertados exitosamente en la base de datos.');
      
      // Cerrar la base de datos
      db.close((err) => {
        if (err) {
          console.error('Error al cerrar la base de datos:', err.message);
        } else {
          console.log('Base de datos cerrada.');
        }
      });
    });
  }
});
