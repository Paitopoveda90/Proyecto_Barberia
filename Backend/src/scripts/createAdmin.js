// Script para crear o actualizar un usuario administrador por consola
require('dotenv').config();
const sequelize = require('../config/database');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    // Sincronizar la base de datos
    await sequelize.sync();

    // Verificar si ya existe un admin con ese email
    const existingAdmin = await User.findOne({ where: { email: 'admin@prueba' } });
    
    if (existingAdmin) {
      // Si existe, actualizar a admin
      existingAdmin.role = 'admin';
      const hash = await bcrypt.hash('prueba123', 10);
      existingAdmin.password = hash;
      await existingAdmin.save();
      console.log('✅ Usuario admin actualizado exitosamente');
    } else {
      // Si no existe, crear nuevo admin
      const hash = await bcrypt.hash('prueba123', 10);
      const admin = await User.create({
        name: 'Administrador',
        email: 'admin@prueba',
        password: hash,
        role: 'admin'
      });
      console.log('✅ Usuario admin creado exitosamente');
      console.log('📧 Email: admin@prueba');
      console.log('🔑 Contraseña: prueba123');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear usuario admin:', error);
    process.exit(1);
  }
}

createAdmin();
