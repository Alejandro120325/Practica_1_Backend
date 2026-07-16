# GastosDB Frontend Angular

Frontend Angular completo para GastosDB, conectado al backend AWS `http://18.191.247.48:3000`.

## Instalar

```powershell
npm install
```

## Ejecutar en local

```powershell
ng serve
```

## Ejecutar conectado a AWS

```powershell
ng serve --configuration aws
```

## Compilar

```powershell
ng build
ng build --configuration aws
```

## Rutas

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

## Tecnologías

- Angular
- RouterModule
- FormsModule + ngModel
- HttpClient
- Node.js + Express
- MongoDB Atlas
- AWS EC2

## Cumplimiento de prácticas

- PW2.9.1 Formulario: formularios de gastos y usuarios con `FormsModule` y `ngModel`.
- PW2.10 Routing: rutas reales con `RouterModule`, `routerLink`, `routerLinkActive` y `router-outlet`.
- PW2.11 HttpClient: servicios Angular para API REST, JSON local y JSONPlaceholder.
