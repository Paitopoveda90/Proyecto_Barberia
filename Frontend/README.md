# Hacha y Barba - Sistema de Gestión para Barbería
Este proyecto es una aplicación web completa para la gestión de una barbería, compuesta por un frontend en React y un backend en Node.js/Express.

## Características principales
- Reserva de turnos online para clientes.
- Panel de administración para gestionar servicios, usuarios, turnos y fechas bloqueadas.
- Autenticación de usuarios y administradores.
- Visualización de servicios y disponibilidad.
- Diseño moderno y responsivo.

## Estructura del proyecto
```
Proyecto_Barberia/
│
├── Backend/
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       └── scripts/
│
└── Frontend/
	├── package.json
	├── vite.config.js
	├── index.html
	└── src/
		├── App.jsx
		├── main.jsx
		├── assets/
		├── components/
		├── pages/
		├── routes/
		├── services/
		├── store/
		└── styles/
```

## Instalación y ejecución
### Backend

1. Entra a la carpeta Backend:
	```bash
	cd Backend
	```
2. Instala las dependencias:
	```bash
	npm install
	```
3. Configura la base de datos en `src/config/database.js`.
4. Inicia el servidor:
	```bash
	npm start
	```

### Frontend
1. Entra a la carpeta Frontend:
	```bash
	cd Frontend
	```
2. Instala las dependencias:
	```bash
	npm install
	```
3. Inicia la aplicación:
	```bash
	npm run dev
	```

## Tecnologías utilizadas
- **Frontend:** React, Vite, Zustand, CSS
- **Backend:** Node.js, Express, Sequelize, JWT
- **Base de datos:** PostgreSQL

## Estructura de carpetas destacada

- `Frontend/src/components/`: Componentes reutilizables de la interfaz.
- `Frontend/src/pages/`: Vistas principales de la aplicación.
- `Frontend/src/services/`: Lógica de conexión con la API.
- `Backend/src/controllers/`: Lógica de negocio y endpoints.
- `Backend/src/models/`: Definición de modelos de datos.

## Notas

- El favicon y recursos estáticos deben ir en la carpeta `Frontend/public`.
- Personaliza los estilos en `Frontend/src/styles/`.
- Para crear un usuario administrador, ejecuta el script `Backend/src/scripts/createAdmin.js`.

## Licencia

Este proyecto es de uso privado para la gestión de la barbería Hacha y Barba.
