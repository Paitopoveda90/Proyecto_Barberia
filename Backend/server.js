// Punto de entrada del backend: inicia el servidor y conecta la base de datos
require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/database');
require('./src/models');

const PORT = process.env.PORT || 4000;

// Sincroniza la base de datos y arranca el servidor
sequelize.sync().then(() => {
  console.log('DB connected');
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});
