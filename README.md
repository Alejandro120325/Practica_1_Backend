# Práctica Express.js + MongoDB - Gastos

Proyecto listo para abrir en WebStorm. La práctica implementa un backend con Node.js, Express.js, MongoDB y arquitectura MVC para manejar usuarios y gastos.

## Qué incluye

- Servidor Express en el puerto 3000.
- Rutas base de la práctica: `/misitio`, `/misitio/about`, `/misitio/contactos`.
- CRUD de gastos con MongoDB.
- CRUD de usuarios con MongoDB.
- Colección de Postman lista para importar.
- Archivo `.env.example` para configurar la conexión.
- Script opcional para iniciar MongoDB local en Windows.
- Documentación de instalación y pruebas.

## Cómo abrirlo en WebStorm

1. Descomprime el ZIP.
2. Abre WebStorm.
3. Selecciona `Open`.
4. Escoge la carpeta `gastos-mongodb-practica`.
5. Abre la terminal de WebStorm.
6. Entra al backend:

```powershell
cd backend
```

7. Instala dependencias:

```powershell
npm install
```

8. Copia el archivo de variables:

```powershell
copy .env.example .env
```

9. Ejecuta el proyecto:

```powershell
npm run dev
```

10. Abre en el navegador:

```text
http://localhost:3000/misitio
```

## Comando rápido

```powershell
cd backend
npm install
copy .env.example .env
npm run dev
```

## Base de datos

Por defecto usa:

```text
mongodb://127.0.0.1:27017/gastos_db
```

MongoDB crea automáticamente la base de datos `gastos_db` cuando insertas el primer documento.

## Archivos importantes

```text
gastos-mongodb-practica/
└── backend/
    ├── servidor.js
    ├── package.json
    ├── .env.example
    ├── src/
    │   ├── database.js
    │   ├── routes/server.routes.js
    │   ├── controllers/gastos.controllers.js
    │   ├── controllers/usuarios.controllers.js
    │   ├── models/Gasto.js
    │   ├── models/Usuario.js
    │   └── seed/seed.js
    ├── docs/
    │   ├── mongodb-comandos.md
    │   ├── capturas-necesarias.md
    │   ├── informe-practica.md
    │   └── postman/
    │       ├── Gastos_MongoDB_Practica.postman_collection.json
    │       └── Gastos_MongoDB_Environment.postman_environment.json
    └── scripts/start-mongodb.ps1
```
