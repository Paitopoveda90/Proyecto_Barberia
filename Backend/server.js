// Punto de entrada del backend: inicia el servidor y conecta la base de datos
require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/database');
require('./src/models');

const PORT = process.env.PORT || 4000;

// Sincroniza la base de datos y arranca el servidor
// alter: true modifica las tablas existentes para que coincidan con los modelos
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ DB connected y sincronizada');
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ Error al sincronizar la base de datos:', err.message);
    process.exit(1);
  });
