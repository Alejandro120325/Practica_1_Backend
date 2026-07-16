# GastosDB Frontend Angular

Frontend Angular para el proyecto GastosDB. Implementa una SPA con Routing, formularios con `FormsModule`/`ngModel` y consumo HTTP con Angular `HttpClient`.

## Instalación

```bash
npm install
```

## Ejecutar en local

```bash
ng serve
```

Usa `src/environments/environment.ts`:

```text
http://localhost:3000
```

## Ejecutar conectado a AWS

```bash
ng serve --configuration aws
```

Usa `src/environments/environment.aws.ts`:

```text
http://18.191.247.48:3000
```

## Compilar

```bash
ng build
ng build --configuration aws
```

## Rutas disponibles

- `/dashboard`
- `/gastos`
- `/usuarios`
- `/reporte`
- `/informacion`
- `/contacto`

## Endpoints consumidos

- `GET /misitio/health`
- `GET /misitio/gastos`
- `GET /misitio/gastos/:cedula`
- `POST /misitio/gastos`
- `PUT /misitio/gastos/:id`
- `DELETE /misitio/gastos/:id`
- `GET /misitio/usuarios`
- `POST /misitio/usuarios`
- `PUT /misitio/usuarios/:id`
- `DELETE /misitio/usuarios/:id`

## Tecnologías usadas

- Angular
- RouterModule
- FormsModule + ngModel
- HttpClient
- Node.js + Express
- MongoDB Atlas
- AWS EC2

## Evidencia de cumplimiento

- PW2.9.1 Formulario: formularios de gastos y usuarios con validación visual.
- PW2.10 Routing: rutas reales, `routerLink`, `routerLinkActive` y `router-outlet`.
- PW2.11 HttpClient: servicios Angular para API REST, JSON local y JSON externo.

## Reporte

El reporte consume:

- datos desde API AWS;
- datos desde `src/assets/datos.json`;
- usuarios externos desde `https://jsonplaceholder.typicode.com/users`.
