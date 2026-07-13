# GastosDB Frontend

Frontend desarrollado con React + Vite para consumir el backend REST de GastosDB.

## Ejecutar en modo local

```powershell
npm run dev -- --mode localdev
```

## Ejecutar en modo AWS

```powershell
npm run dev -- --mode aws
```

## Rutas disponibles

- `/dashboard`
- `/gastos`
- `/usuarios`
- `/informacion`
- `/reporte`
- `/contacto`

## Equivalencias con Angular

- React Router reemplaza el routing de Angular (`RouterModule`, `Routes`, `routerLink`, `router-outlet`, `routerLinkActive`) mediante `BrowserRouter`, `Routes`, `Route`, `Outlet` y `NavLink`.
- Axios reemplaza el uso de `HttpClient` de Angular para consumir la API REST, el JSON local y el JSON externo.

## Conexión API

El frontend mantiene `VITE_API_URL` y funciona con el backend local o con AWS EC2 según el modo seleccionado.
