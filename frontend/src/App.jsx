import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, NavLink, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { api, connectionInfo, endpoints } from "./api/api";
import datosLocales from "./assets/datos.json";
import "./index.css";

const currentYear = new Date().getFullYear();

const gastoInicial = {
  cedula: "",
  tipo: "salud",
  monto: "",
  montoMaximoDeducible: "",
  informacion: "",
  periodo: currentYear,
};

const usuarioInicial = {
  nombre: "",
  cedula: "",
  email: "",
  periodo: currentYear,
  ingresos: "",
};

const currencyFormatter = new Intl.NumberFormat("es-EC", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("es-EC", {
  dateStyle: "medium",
  timeStyle: "short",
});

const typeLabels = {
  alimentacion: "Alimentación",
  educacion: "Educación",
  salud: "Salud",
  vivienda: "Vivienda",
};

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "grid", end: true },
  { to: "/gastos", label: "Gastos", icon: "receipt" },
  { to: "/usuarios", label: "Usuarios", icon: "users" },
  { to: "/reporte", label: "Reporte", icon: "report" },
  { to: "/informacion", label: "Información", icon: "info" },
  { to: "/contacto", label: "Contacto", icon: "contact" },
];

const pageCopy = {
  "/dashboard": {
    title: "Panel de Gestión de Gastos",
    description: "Resumen operativo del sistema y estado de conexión.",
  },
  "/gastos": {
    title: "Gestión de Gastos",
    description: "CRUD completo conectado a la API REST del proyecto.",
  },
  "/usuarios": {
    title: "Gestión de Usuarios",
    description: "Administración de contribuyentes registrados.",
  },
  "/informacion": {
    title: "Información Técnica",
    description: "Arquitectura, routing SPA y consumo HTTP con Axios.",
  },
  "/reporte": {
    title: "Reporte de Gestión de Gastos",
    description: "Datos consolidados desde API AWS, JSON local y JSON externo.",
  },
  "/contacto": {
    title: "Contacto / Desarrollador",
    description: "Datos académicos y tecnologías utilizadas en GastosDB.",
  },
};

function Icon({ name, size = 20 }) {
  const paths = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    receipt: (
      <>
        <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
        <path d="M9 8h6M9 12h6M9 16h3" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),
    report: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <rect x="7" y="11" width="3" height="5" rx="1" />
        <rect x="12" y="8" width="3" height="8" rx="1" />
        <rect x="17" y="5" width="3" height="11" rx="1" />
      </>
    ),
    contact: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="4" />
        <path d="m16 11 2 2 4-5" />
      </>
    ),
    refresh: (
      <>
        <path d="M20 6v5h-5" />
        <path d="M4 18v-5h5" />
        <path d="M18.4 9A7 7 0 0 0 6.1 6.1L4 8M5.6 15A7 7 0 0 0 17.9 17.9L20 16" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    alert: (
      <>
        <path d="M10.3 3.4 2.4 17a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.4a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v5M14 11v5" />
      </>
    ),
    close: <path d="M18 6 6 18M6 6l12 12" />,
    wallet: (
      <>
        <path d="M20 7V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v12H5a3 3 0 0 1-3-3V6" />
        <path d="M16 14h.01" />
      </>
    ),
    database: (
      <>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
      </>
    ),
    cloud: <path d="M17.5 19H6a4 4 0 0 1-.7-7.9A7 7 0 0 1 19 9a5 5 0 0 1-1.5 10Z" />,
    activity: (
      <>
        <path d="M3 12h4l2-7 4 14 2-7h6" />
      </>
    ),
    code: (
      <>
        <path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14" />
      </>
    ),
  };

  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function extraerLista(respuesta) {
  if (Array.isArray(respuesta)) return respuesta;
  if (Array.isArray(respuesta?.data)) return respuesta.data;
  if (Array.isArray(respuesta?.data?.data)) return respuesta.data.data;
  return [];
}

function extraerRegistro(respuesta) {
  return respuesta?.data?.data || respuesta?.data || null;
}

function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    (error?.request ? "El backend no respondió. Verifica la conexión e inténtalo nuevamente." : fallback)
  );
}

function FieldError({ message }) {
  return message ? <small className="field-error">{message}</small> : null;
}

function EmptyState({ loading, message, colSpan }) {
  return (
    <tr>
      <td className="empty-cell" colSpan={colSpan}>
        {loading ? (
          <>
            <span className="spinner spinner-dark" /> Cargando datos...
          </>
        ) : (
          message
        )}
      </td>
    </tr>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

function AppLayout({
  actualizando,
  cargando,
  cargarDatos,
  connectionLabel,
  environmentLabel,
  estadoServidor,
  toast,
  setToast,
}) {
  const { pathname } = useLocation();
  const currentPage = pageCopy[pathname] || pageCopy["/dashboard"];

  return (
    <div className="app-shell">
      <ScrollToTop />
      <aside className="sidebar">
        <div>
          <div className="brand">
            <div className="brand-logo">G</div>
            <div>
              <h1>GastosDB</h1>
              <p>Gestión financiera</p>
            </div>
          </div>

          <p className="nav-label">Navegación</p>
          <nav aria-label="Navegación principal">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                <Icon name={item.icon} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className={`server-status ${estadoServidor.online === false ? "offline" : ""}`}>
          <div className="status-heading">
            <span className="status-dot" />
            <span>Estado del backend</span>
          </div>
          <strong>{estadoServidor.message}</strong>
          <small>{connectionLabel}</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" /> {environmentLabel}
            </div>
            <h2>{currentPage.title}</h2>
            <p>{currentPage.description}</p>
          </div>
          <button
            className="button button-primary refresh-button"
            onClick={() => cargarDatos({ notify: true })}
            disabled={actualizando || cargando}
          >
            {actualizando || cargando ? <span className="spinner" /> : <Icon name="refresh" />}
            {actualizando || cargando ? "Actualizando..." : "Actualizar datos"}
          </button>
        </header>

        {toast && (
          <div className={`toast toast-${toast.type}`} role="status" aria-live="polite">
            <span className="toast-icon">
              <Icon name={toast.type === "success" ? "check" : "alert"} />
            </span>
            <div>
              <strong>{toast.type === "success" ? "Operación completada" : "Ocurrió un problema"}</strong>
              <p>{toast.message}</p>
            </div>
            <button aria-label="Cerrar notificación" onClick={() => setToast(null)}>
              <Icon name="close" size={18} />
            </button>
          </div>
        )}

        <Outlet />
      </main>
    </div>
  );
}

function DashboardPage({ cargando, connectionLabel, environmentLabel, estadoServidor, gastos, totalGastos, usuarios }) {
  return (
    <div className="view-stack">
      <section className="section-heading">
        <div>
          <span className="section-kicker">Vista general</span>
          <h3>Resumen del sistema</h3>
        </div>
        <p>Indicadores actualizados directamente desde la API.</p>
      </section>

      <section className="stats-grid" aria-label="Resumen de indicadores">
        <article className="stat-card">
          <span className="stat-icon blue">
            <Icon name="receipt" />
          </span>
          <div>
            <span>Total de gastos</span>
            <strong>{cargando ? "—" : gastos.length}</strong>
            <small>Registros almacenados</small>
          </div>
        </article>
        <article className="stat-card">
          <span className="stat-icon cyan">
            <Icon name="users" />
          </span>
          <div>
            <span>Total de usuarios</span>
            <strong>{cargando ? "—" : usuarios.length}</strong>
            <small>Usuarios registrados</small>
          </div>
        </article>
        <article className="stat-card">
          <span className="stat-icon green">
            <Icon name="wallet" />
          </span>
          <div>
            <span>Monto registrado</span>
            <strong>{cargando ? "—" : formatCurrency(totalGastos)}</strong>
            <small>Suma total de gastos</small>
          </div>
        </article>
        <article className="stat-card">
          <span className="stat-icon violet">
            <Icon name="database" />
          </span>
          <div>
            <span>Base de datos</span>
            <strong>MongoDB</strong>
            <small>Atlas · gastos_db</small>
          </div>
        </article>
        <article className="stat-card">
          <span className={`stat-icon ${estadoServidor.online === false ? "red" : "green"}`}>
            <Icon name="activity" />
          </span>
          <div>
            <span>Estado del backend</span>
            <strong className="status-value">
              {estadoServidor.online === true ? "Servidor activo" : estadoServidor.online === false ? "Backend no disponible" : "Verificando"}
            </strong>
            <small>{estadoServidor.message}</small>
          </div>
        </article>
        <article className="stat-card">
          <span className="stat-icon blue">
            <Icon name="cloud" />
          </span>
          <div>
            <span>Entorno activo</span>
            <strong>{environmentLabel}</strong>
            <small>{connectionLabel}</small>
          </div>
        </article>
      </section>

      <section className="overview-grid">
        <article className="panel project-panel">
          <div className="panel-heading">
            <span className="panel-icon">
              <Icon name="code" />
            </span>
            <div>
              <span className="section-kicker">Arquitectura</span>
              <h3>Stack del proyecto</h3>
            </div>
          </div>
          <div className="stack-list">
            <div>
              <span>Frontend</span>
              <strong>React + Vite</strong>
            </div>
            <div>
              <span>Routing SPA</span>
              <strong>React Router</strong>
            </div>
            <div>
              <span>Cliente HTTP</span>
              <strong>Axios</strong>
            </div>
            <div>
              <span>Base de datos</span>
              <strong>MongoDB Atlas</strong>
            </div>
          </div>
        </article>
        <article className="panel flow-panel">
          <span className="section-kicker">Integración</span>
          <h3>Datos sincronizados</h3>
          <p>
            Las operaciones realizadas desde Postman y desde esta interfaz consumen el mismo backend. Por eso,
            cualquier cambio guardado en MongoDB Atlas se refleja al actualizar este panel.
          </p>
          <div className="flow-tags">
            <span>Postman</span>
            <b>→</b>
            <span>API REST</span>
            <b>→</b>
            <span>MongoDB Atlas</span>
          </div>
        </article>
      </section>
    </div>
  );
}

function GastosPage({
  cargando,
  editarGasto,
  eliminarGasto,
  eliminando,
  erroresGasto,
  cancelarEdicionGasto,
  gastoEditando,
  gastoForm,
  gastos,
  guardando,
  guardarGasto,
  resaltado,
  setGastoForm,
}) {
  return (
    <div className="view-stack">
      <section className="section-heading">
        <div>
          <span className="section-kicker">Operaciones CRUD</span>
          <h3>Gestión de gastos</h3>
        </div>
        <p>Crea, consulta, actualiza y elimina gastos registrados.</p>
      </section>
      <section className="content-layout">
        <form className="form-card" onSubmit={guardarGasto} noValidate>
          <div className="card-heading">
            <div>
              <span className="form-step">01</span>
              <div>
                <h3>{gastoEditando ? "Editar gasto" : "Nuevo gasto"}</h3>
                <p>{gastoEditando ? "Modifica los datos seleccionados." : "Completa los datos del registro."}</p>
              </div>
            </div>
            {gastoEditando && <span className="editing-badge">Editando</span>}
          </div>

          <div className="field">
            <label htmlFor="gasto-cedula">
              Cédula <b>*</b>
            </label>
            <input
              id="gasto-cedula"
              placeholder="Ej. 0102030405"
              value={gastoForm.cedula}
              onChange={(event) => setGastoForm({ ...gastoForm, cedula: event.target.value })}
              aria-invalid={Boolean(erroresGasto.cedula)}
            />
            <FieldError message={erroresGasto.cedula} />
          </div>
          <div className="field">
            <label htmlFor="gasto-tipo">
              Tipo de gasto <b>*</b>
            </label>
            <select
              id="gasto-tipo"
              value={gastoForm.tipo}
              onChange={(event) => setGastoForm({ ...gastoForm, tipo: event.target.value })}
              aria-invalid={Boolean(erroresGasto.tipo)}
            >
              <option value="salud">Salud</option>
              <option value="educacion">Educación</option>
              <option value="vivienda">Vivienda</option>
            </select>
            <FieldError message={erroresGasto.tipo} />
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="gasto-monto">
                Monto <b>*</b>
              </label>
              <div className="input-prefix">
                <span>$</span>
                <input
                  id="gasto-monto"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={gastoForm.monto}
                  onChange={(event) => setGastoForm({ ...gastoForm, monto: event.target.value })}
                  aria-invalid={Boolean(erroresGasto.monto)}
                />
              </div>
              <FieldError message={erroresGasto.monto} />
            </div>
            <div className="field">
              <label htmlFor="gasto-maximo">Máximo deducible</label>
              <div className="input-prefix">
                <span>$</span>
                <input
                  id="gasto-maximo"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={gastoForm.montoMaximoDeducible}
                  onChange={(event) => setGastoForm({ ...gastoForm, montoMaximoDeducible: event.target.value })}
                  aria-invalid={Boolean(erroresGasto.montoMaximoDeducible)}
                />
              </div>
              <FieldError message={erroresGasto.montoMaximoDeducible} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="gasto-info">Información adicional</label>
            <textarea
              id="gasto-info"
              rows="3"
              placeholder="Descripción breve del gasto"
              value={gastoForm.informacion}
              onChange={(event) => setGastoForm({ ...gastoForm, informacion: event.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="gasto-periodo">
              Periodo fiscal <b>*</b>
            </label>
            <input
              id="gasto-periodo"
              type="number"
              min="2000"
              max="2100"
              placeholder={String(currentYear)}
              value={gastoForm.periodo}
              onChange={(event) => setGastoForm({ ...gastoForm, periodo: event.target.value })}
              aria-invalid={Boolean(erroresGasto.periodo)}
            />
            <FieldError message={erroresGasto.periodo} />
          </div>
          <div className="form-actions">
            <button type="submit" className="button button-primary" disabled={guardando === "gasto"}>
              {guardando === "gasto" && <span className="spinner" />}
              {gastoEditando ? "Guardar cambios" : "Crear gasto"}
            </button>
            {gastoEditando && (
              <button type="button" className="button button-secondary" onClick={cancelarEdicionGasto}>
                Cancelar edición
              </button>
            )}
          </div>
        </form>

        <div className="table-card">
          <div className="table-heading">
            <div>
              <h3>Gastos registrados</h3>
              <p>
                {gastos.length} {gastos.length === 1 ? "registro" : "registros"} en total
              </p>
            </div>
            <span className="count-badge">{gastos.length}</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Cédula</th>
                  <th>Tipo</th>
                  <th>Monto</th>
                  <th>Máximo deducible</th>
                  <th>Información</th>
                  <th>Periodo</th>
                  <th>Creado</th>
                  <th>Actualizado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {gastos.map((gasto) => (
                  <tr key={gasto._id} className={resaltado?.type === "gasto" && resaltado.id === gasto._id ? "row-highlight" : ""}>
                    <td className="cell-primary">{gasto.cedula}</td>
                    <td>
                      <span className={`type-badge type-${gasto.tipo}`}>{typeLabels[gasto.tipo] || gasto.tipo}</span>
                    </td>
                    <td className="money-cell">{formatCurrency(gasto.monto)}</td>
                    <td>{formatCurrency(gasto.montoMaximoDeducible)}</td>
                    <td className="info-cell" title={gasto.informacion}>
                      {gasto.informacion || "—"}
                    </td>
                    <td>{gasto.periodo || "—"}</td>
                    <td className="date-cell">{formatDate(gasto.createdAt)}</td>
                    <td className="date-cell">{formatDate(gasto.updatedAt)}</td>
                    <td>
                      <div className="actions">
                        <button
                          className="icon-button edit-button"
                          aria-label={`Editar gasto de ${gasto.cedula}`}
                          title="Editar"
                          onClick={() => editarGasto(gasto)}
                        >
                          <Icon name="edit" size={17} />
                        </button>
                        <button
                          className="icon-button delete-button"
                          aria-label={`Eliminar gasto de ${gasto.cedula}`}
                          title="Eliminar"
                          onClick={() => eliminarGasto(gasto._id)}
                          disabled={eliminando === gasto._id}
                        >
                          {eliminando === gasto._id ? <span className="spinner spinner-dark" /> : <Icon name="trash" size={17} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {gastos.length === 0 && <EmptyState loading={cargando} message="No hay gastos registrados todavía." colSpan={9} />}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function UsuariosPage({
  cargando,
  cancelarEdicionUsuario,
  editarUsuario,
  eliminarUsuario,
  eliminando,
  erroresUsuario,
  guardando,
  guardarUsuario,
  resaltado,
  setUsuarioForm,
  usuarioEditando,
  usuarioForm,
  usuarios,
}) {
  return (
    <div className="view-stack">
      <section className="section-heading">
        <div>
          <span className="section-kicker">Operaciones CRUD</span>
          <h3>Gestión de usuarios</h3>
        </div>
        <p>Administra los contribuyentes vinculados al sistema.</p>
      </section>
      <section className="content-layout">
        <form className="form-card" onSubmit={guardarUsuario} noValidate>
          <div className="card-heading">
            <div>
              <span className="form-step">01</span>
              <div>
                <h3>{usuarioEditando ? "Editar usuario" : "Nuevo usuario"}</h3>
                <p>{usuarioEditando ? "Modifica los datos seleccionados." : "Completa los datos del usuario."}</p>
              </div>
            </div>
            {usuarioEditando && <span className="editing-badge">Editando</span>}
          </div>
          <div className="field">
            <label htmlFor="usuario-nombre">
              Nombre completo <b>*</b>
            </label>
            <input
              id="usuario-nombre"
              placeholder="Ej. María Andrade"
              value={usuarioForm.nombre}
              onChange={(event) => setUsuarioForm({ ...usuarioForm, nombre: event.target.value })}
              aria-invalid={Boolean(erroresUsuario.nombre)}
            />
            <FieldError message={erroresUsuario.nombre} />
          </div>
          <div className="field">
            <label htmlFor="usuario-cedula">
              Cédula <b>*</b>
            </label>
            <input
              id="usuario-cedula"
              placeholder="Ej. 0102030405"
              value={usuarioForm.cedula}
              onChange={(event) => setUsuarioForm({ ...usuarioForm, cedula: event.target.value })}
              aria-invalid={Boolean(erroresUsuario.cedula)}
            />
            <FieldError message={erroresUsuario.cedula} />
          </div>
          <div className="field">
            <label htmlFor="usuario-email">
              Correo electrónico <b>*</b>
            </label>
            <input
              id="usuario-email"
              type="email"
              placeholder="nombre@correo.com"
              value={usuarioForm.email}
              onChange={(event) => setUsuarioForm({ ...usuarioForm, email: event.target.value })}
              aria-invalid={Boolean(erroresUsuario.email)}
            />
            <FieldError message={erroresUsuario.email} />
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="usuario-periodo">
                Periodo <b>*</b>
              </label>
              <input
                id="usuario-periodo"
                type="number"
                min="2000"
                max="2100"
                placeholder={String(currentYear)}
                value={usuarioForm.periodo}
                onChange={(event) => setUsuarioForm({ ...usuarioForm, periodo: event.target.value })}
                aria-invalid={Boolean(erroresUsuario.periodo)}
              />
              <FieldError message={erroresUsuario.periodo} />
            </div>
            <div className="field">
              <label htmlFor="usuario-ingresos">
                Ingresos <b>*</b>
              </label>
              <div className="input-prefix">
                <span>$</span>
                <input
                  id="usuario-ingresos"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={usuarioForm.ingresos}
                  onChange={(event) => setUsuarioForm({ ...usuarioForm, ingresos: event.target.value })}
                  aria-invalid={Boolean(erroresUsuario.ingresos)}
                />
              </div>
              <FieldError message={erroresUsuario.ingresos} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="button button-primary" disabled={guardando === "usuario"}>
              {guardando === "usuario" && <span className="spinner" />}
              {usuarioEditando ? "Guardar cambios" : "Crear usuario"}
            </button>
            {usuarioEditando && (
              <button type="button" className="button button-secondary" onClick={cancelarEdicionUsuario}>
                Cancelar edición
              </button>
            )}
          </div>
        </form>

        <div className="table-card">
          <div className="table-heading">
            <div>
              <h3>Usuarios registrados</h3>
              <p>
                {usuarios.length} {usuarios.length === 1 ? "registro" : "registros"} en total
              </p>
            </div>
            <span className="count-badge">{usuarios.length}</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cédula</th>
                  <th>Email</th>
                  <th>Periodo</th>
                  <th>Ingresos</th>
                  <th>Creado</th>
                  <th>Actualizado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr
                    key={usuario._id}
                    className={resaltado?.type === "usuario" && resaltado.id === usuario._id ? "row-highlight" : ""}
                  >
                    <td className="cell-primary">{usuario.nombre}</td>
                    <td>{usuario.cedula}</td>
                    <td>
                      <a className="email-link" href={`mailto:${usuario.email}`}>
                        {usuario.email}
                      </a>
                    </td>
                    <td>{usuario.periodo || "—"}</td>
                    <td className="money-cell">{formatCurrency(usuario.ingresos)}</td>
                    <td className="date-cell">{formatDate(usuario.createdAt)}</td>
                    <td className="date-cell">{formatDate(usuario.updatedAt)}</td>
                    <td>
                      <div className="actions">
                        <button
                          className="icon-button edit-button"
                          aria-label={`Editar usuario ${usuario.nombre}`}
                          title="Editar"
                          onClick={() => editarUsuario(usuario)}
                        >
                          <Icon name="edit" size={17} />
                        </button>
                        <button
                          className="icon-button delete-button"
                          aria-label={`Eliminar usuario ${usuario.nombre}`}
                          title="Eliminar"
                          onClick={() => eliminarUsuario(usuario._id)}
                          disabled={eliminando === usuario._id}
                        >
                          {eliminando === usuario._id ? <span className="spinner spinner-dark" /> : <Icon name="trash" size={17} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {usuarios.length === 0 && <EmptyState loading={cargando} message="No hay usuarios registrados todavía." colSpan={8} />}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function InformacionPage({ connectionLabel }) {
  return (
    <div className="view-stack">
      <section className="section-heading">
        <div>
          <span className="section-kicker">Documentación</span>
          <h3>Información del sistema</h3>
        </div>
        <p>Resumen técnico para la presentación del proyecto.</p>
      </section>
      <section className="info-hero panel">
        <span className="info-hero-icon">
          <Icon name="database" size={28} />
        </span>
        <div>
          <span className="section-kicker">GastosDB</span>
          <h3>Aplicación web de gestión financiera</h3>
          <p>
            Proyecto académico que demuestra routing SPA, consumo HTTP con Axios, operaciones CRUD completas,
            persistencia en MongoDB Atlas y backend desplegado en AWS EC2.
          </p>
        </div>
      </section>
      <section className="tech-grid">
        <article className="tech-card">
          <span>01</span>
          <h4>Routing SPA</h4>
          <strong>React Router</strong>
          <p>Reemplaza el routing de Angular con BrowserRouter, Routes, Route y NavLink activo.</p>
        </article>
        <article className="tech-card">
          <span>02</span>
          <h4>Cliente HTTP</h4>
          <strong>Axios</strong>
          <p>Cumple el rol de HttpClient para consumir la API REST y JSON externos.</p>
        </article>
        <article className="tech-card">
          <span>03</span>
          <h4>Base de datos</h4>
          <strong>MongoDB Atlas</strong>
          <p>Persistencia documental segura y disponible desde la nube.</p>
        </article>
        <article className="tech-card">
          <span>04</span>
          <h4>Despliegue</h4>
          <strong>AWS EC2</strong>
          <p>Servidor remoto para exponer el backend y centralizar los datos.</p>
        </article>
      </section>

      <section className="practice-compliance panel">
        <div className="panel-heading">
          <span className="panel-icon">
            <Icon name="check" />
          </span>
          <div>
            <span className="section-kicker">Evidencia académica</span>
            <h3>Cumplimiento de prácticas</h3>
          </div>
        </div>
        <div className="practice-grid">
          <article className="practice-card">
            <span className="practice-code">PW2.10</span>
            <h4>Routing</h4>
            <ul>
              <li>Se implementó una SPA con React Router.</li>
              <li>
                Se crearon rutas reales: <code>/dashboard</code>, <code>/gastos</code>, <code>/usuarios</code>,{" "}
                <code>/informacion</code>, <code>/reporte</code> y <code>/contacto</code>.
              </li>
              <li>El menú lateral usa NavLink y la opción activa queda resaltada.</li>
              <li>Equivale a RouterModule, routerLink, routerLinkActive y router-outlet en Angular.</li>
            </ul>
          </article>
          <article className="practice-card">
            <span className="practice-code">PW2.11</span>
            <h4>HttpClient</h4>
            <ul>
              <li>Se usa Axios como equivalente a HttpClient.</li>
              <li>Se consumen endpoints REST del backend desplegado en AWS EC2.</li>
              <li>Se usan métodos GET, POST, PUT y DELETE para el CRUD.</li>
              <li>El reporte muestra datos obtenidos desde la API REST.</li>
              <li>Se agregó un JSON local en <code>src/assets/datos.json</code>.</li>
              <li>Se consume JSON externo desde JSONPlaceholder.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="panel sync-panel">
        <div className="panel-heading">
          <span className="panel-icon">
            <Icon name="refresh" />
          </span>
          <div>
            <span className="section-kicker">Flujo de datos</span>
            <h3>Una sola fuente de información</h3>
          </div>
        </div>
        <p>
          {connectionLabel}. El frontend consume una API REST mediante Axios. Postman y esta interfaz usan el
          mismo backend, por eso crear, modificar o eliminar registros desde cualquiera de los dos clientes queda
          almacenado en MongoDB Atlas y se refleja al actualizar datos.
        </p>
        <div className="endpoint-list">
          <code>GET /misitio/health</code>
          <code>GET /misitio/gastos</code>
          <code>POST /misitio/gastos</code>
          <code>PUT /misitio/gastos/:id</code>
          <code>DELETE /misitio/gastos/:id</code>
          <code>GET /misitio/usuarios</code>
          <code>POST /misitio/usuarios</code>
          <code>PUT /misitio/usuarios/:id</code>
          <code>DELETE /misitio/usuarios/:id</code>
        </div>
      </section>
    </div>
  );
}

function ReportePage({
  actualizando,
  cargando,
  cargarDatos,
  connectionLabel,
  environmentLabel,
  estadoServidor,
  gastos,
  mostrarToast,
  totalGastos,
  usuarios,
}) {
  const [usuariosExternos, setUsuariosExternos] = useState([]);
  const [cargandoExternos, setCargandoExternos] = useState(true);
  const [errorExterno, setErrorExterno] = useState("");
  const [errorReporte, setErrorReporte] = useState("");

  const cargarUsuariosExternos = useCallback(async () => {
    setCargandoExternos(true);
    setErrorExterno("");
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/users", { timeout: 12000 });
      setUsuariosExternos(Array.isArray(response.data) ? response.data : []);
      return true;
    } catch {
      setUsuariosExternos([]);
      setErrorExterno("No se pudieron cargar usuarios desde JSONPlaceholder.");
      return false;
    } finally {
      setCargandoExternos(false);
    }
  }, []);

  useEffect(() => {
    const externalLoad = window.setTimeout(() => cargarUsuariosExternos(), 0);
    return () => window.clearTimeout(externalLoad);
  }, [cargarUsuariosExternos]);

  const actualizarReporte = async () => {
    setErrorReporte("");
    const [apiOk, externosOk] = await Promise.all([cargarDatos({ notify: false }), cargarUsuariosExternos()]);

    if (apiOk && externosOk) {
      mostrarToast("success", "Datos actualizados correctamente.");
      return;
    }

    setErrorReporte(
      apiOk
        ? "El reporte de la API se actualizó, pero falló el JSON externo."
        : "Error al cargar datos desde la API AWS. Revisa la conexión e inténtalo nuevamente.",
    );
  };

  return (
    <div className="view-stack">
      <section className="section-heading">
        <div>
          <span className="section-kicker">Reporte</span>
          <h3>Reporte de Gestión de Gastos</h3>
        </div>
        <button className="button button-primary" onClick={actualizarReporte} disabled={actualizando || cargando || cargandoExternos}>
          {actualizando || cargando || cargandoExternos ? <span className="spinner" /> : <Icon name="refresh" />}
          Actualizar reporte
        </button>
      </section>

      <section className="report-evidence panel">
        <span className="panel-icon">
          <Icon name="code" />
        </span>
        <div>
          <span className="section-kicker">PW2.11 HttpClient</span>
          <h3>Consumo HTTP con Axios</h3>
          <p>Esta sección demuestra el uso de Axios como cliente HTTP para consultar datos desde diferentes fuentes.</p>
        </div>
      </section>

      <section className="stats-grid" aria-label="Resumen del reporte">
        <article className="stat-card">
          <span className="stat-icon blue">
            <Icon name="receipt" />
          </span>
          <div>
            <span>Total de gastos</span>
            <strong>{cargando ? "—" : gastos.length}</strong>
            <small>Registros desde la API AWS</small>
          </div>
        </article>
        <article className="stat-card">
          <span className="stat-icon cyan">
            <Icon name="users" />
          </span>
          <div>
            <span>Total de usuarios</span>
            <strong>{cargando ? "—" : usuarios.length}</strong>
            <small>Usuarios desde la API AWS</small>
          </div>
        </article>
        <article className="stat-card">
          <span className="stat-icon green">
            <Icon name="wallet" />
          </span>
          <div>
            <span>Monto total registrado</span>
            <strong>{cargando ? "—" : formatCurrency(totalGastos)}</strong>
            <small>Suma de gastos registrados</small>
          </div>
        </article>
        <article className="stat-card">
          <span className={`stat-icon ${estadoServidor.online === false ? "red" : "violet"}`}>
            <Icon name="cloud" />
          </span>
          <div>
            <span>Entorno activo</span>
            <strong>{environmentLabel}</strong>
            <small>{connectionLabel}</small>
          </div>
        </article>
      </section>

      {errorReporte && <div className="inline-alert">{errorReporte}</div>}

      <section className="report-grid">
        <div className="report-source-heading">
          <span className="section-kicker">Fuente 01</span>
          <h3>Reporte desde API REST AWS</h3>
          <p>Gastos y usuarios consultados desde los endpoints REST del backend desplegado en AWS EC2.</p>
        </div>

        <div className="table-card">
          <div className="table-heading">
            <div>
              <h3>Gastos consumidos desde la API</h3>
              <p>{cargando ? "Cargando datos..." : `${gastos.length} registros consultados`}</p>
            </div>
            <span className="count-badge">{gastos.length}</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Cédula</th>
                  <th>Tipo</th>
                  <th>Monto</th>
                  <th>Máximo deducible</th>
                  <th>Información</th>
                  <th>Periodo</th>
                  <th>Creado</th>
                  <th>Actualizado</th>
                </tr>
              </thead>
              <tbody>
                {gastos.map((gasto) => (
                  <tr key={gasto._id}>
                    <td className="cell-primary">{gasto.cedula}</td>
                    <td>
                      <span className={`type-badge type-${gasto.tipo}`}>{typeLabels[gasto.tipo] || gasto.tipo}</span>
                    </td>
                    <td className="money-cell">{formatCurrency(gasto.monto)}</td>
                    <td>{formatCurrency(gasto.montoMaximoDeducible)}</td>
                    <td className="info-cell" title={gasto.informacion}>
                      {gasto.informacion || "—"}
                    </td>
                    <td>{gasto.periodo || "—"}</td>
                    <td className="date-cell">{formatDate(gasto.createdAt)}</td>
                    <td className="date-cell">{formatDate(gasto.updatedAt)}</td>
                  </tr>
                ))}
                {gastos.length === 0 && (
                  <EmptyState loading={cargando} message="Error al cargar datos o no existen gastos registrados." colSpan={8} />
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-card">
          <div className="table-heading">
            <div>
              <h3>Usuarios consumidos desde la API</h3>
              <p>{cargando ? "Cargando datos..." : `${usuarios.length} registros consultados`}</p>
            </div>
            <span className="count-badge">{usuarios.length}</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cédula</th>
                  <th>Email</th>
                  <th>Periodo</th>
                  <th>Ingresos</th>
                  <th>Creado</th>
                  <th>Actualizado</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario._id}>
                    <td className="cell-primary">{usuario.nombre}</td>
                    <td>{usuario.cedula}</td>
                    <td>
                      <a className="email-link" href={`mailto:${usuario.email}`}>
                        {usuario.email}
                      </a>
                    </td>
                    <td>{usuario.periodo || "—"}</td>
                    <td className="money-cell">{formatCurrency(usuario.ingresos)}</td>
                    <td className="date-cell">{formatDate(usuario.createdAt)}</td>
                    <td className="date-cell">{formatDate(usuario.updatedAt)}</td>
                  </tr>
                ))}
                {usuarios.length === 0 && (
                  <EmptyState loading={cargando} message="Error al cargar datos o no existen usuarios registrados." colSpan={7} />
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-card compact-table">
          <div className="table-heading">
            <div>
              <h3>Reporte desde JSON local</h3>
              <p>Reporte desde JSON local leído desde src/assets/datos.json</p>
            </div>
            <span className="count-badge">{datosLocales.length}</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Tipo Gasto</th>
                  <th>RUC</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {datosLocales.map((dato) => (
                  <tr key={dato.id}>
                    <td className="cell-primary">{dato.id}</td>
                    <td>
                      <span className={`type-badge type-${dato.tipo}`}>{typeLabels[dato.tipo] || dato.tipo}</span>
                    </td>
                    <td>{dato.ruc}</td>
                    <td className="money-cell">{formatCurrency(dato.valor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-card compact-table">
          <div className="table-heading">
            <div>
              <h3>Usuarios desde JSON externo</h3>
              <p>Usuarios desde JSONPlaceholder consumidos con Axios</p>
            </div>
            <span className="count-badge">{usuariosExternos.length}</span>
          </div>
          {errorExterno && <div className="table-alert">{errorExterno}</div>}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nombre</th>
                  <th>Usuario/Login</th>
                  <th>Correo</th>
                </tr>
              </thead>
              <tbody>
                {usuariosExternos.map((usuario) => (
                  <tr key={usuario.id}>
                    <td className="cell-primary">{usuario.id}</td>
                    <td>{usuario.name}</td>
                    <td>{usuario.username}</td>
                    <td>
                      <a className="email-link" href={`mailto:${usuario.email}`}>
                        {usuario.email}
                      </a>
                    </td>
                  </tr>
                ))}
                {usuariosExternos.length === 0 && (
                  <EmptyState loading={cargandoExternos} message="Error al cargar datos desde JSONPlaceholder." colSpan={4} />
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactoPage() {
  return (
    <div className="view-stack">
      <section className="section-heading">
        <div>
          <span className="section-kicker">Desarrollador</span>
          <h3>Contacto / Desarrollador</h3>
        </div>
        <p>Información solicitada para la presentación académica.</p>
      </section>

      <section className="contact-hero panel">
        <span className="info-hero-icon">
          <Icon name="contact" size={28} />
        </span>
        <div>
          <span className="section-kicker">Estudiante</span>
          <h3>Jairo Alejandro Ojeda Herrera</h3>
          <p>
            Proyecto GastosDB desarrollado como frontend profesional en React + Vite, conectado a un backend REST
            en AWS EC2 con persistencia en MongoDB Atlas.
          </p>
        </div>
      </section>

      <section className="developer-panel panel">
        <div className="panel-heading">
          <span className="panel-icon">
            <Icon name="contact" />
          </span>
          <div>
            <span className="section-kicker">Ficha técnica</span>
            <h3>Datos del desarrollador</h3>
          </div>
        </div>
        <div className="developer-list">
          <div>
            <span>Nombre</span>
            <strong>Jairo Alejandro Ojeda Herrera</strong>
          </div>
          <div>
            <span>Carrera</span>
            <strong>Computación</strong>
          </div>
          <div>
            <span>Proyecto</span>
            <strong>Proyecto GastosDB</strong>
          </div>
          <div>
            <span>Frontend</span>
            <strong>React + Vite</strong>
          </div>
          <div>
            <span>Backend</span>
            <strong>Node.js + Express</strong>
          </div>
          <div>
            <span>Base de datos</span>
            <strong>MongoDB Atlas</strong>
          </div>
          <div>
            <span>Despliegue</span>
            <strong>AWS EC2</strong>
          </div>
        </div>
      </section>

      <section className="contact-grid">
        <article className="contact-card">
          <span>Nombre</span>
          <strong>Jairo Alejandro Ojeda Herrera</strong>
        </article>
        <article className="contact-card">
          <span>Carrera</span>
          <strong>Computación</strong>
        </article>
        <article className="contact-card">
          <span>Proyecto</span>
          <strong>GastosDB</strong>
        </article>
        <article className="contact-card">
          <span>Tecnologías usadas</span>
          <strong>React + Vite · Node.js + Express · MongoDB Atlas · AWS EC2</strong>
        </article>
      </section>
    </div>
  );
}

function App() {
  const [estadoServidor, setEstadoServidor] = useState({ online: null, message: "Verificando conexión..." });
  const [gastos, setGastos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [gastoForm, setGastoForm] = useState(gastoInicial);
  const [usuarioForm, setUsuarioForm] = useState(usuarioInicial);
  const [gastoEditando, setGastoEditando] = useState(null);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [erroresGasto, setErroresGasto] = useState({});
  const [erroresUsuario, setErroresUsuario] = useState({});
  const [toast, setToast] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [guardando, setGuardando] = useState(null);
  const [eliminando, setEliminando] = useState(null);
  const [resaltado, setResaltado] = useState(null);

  const mostrarToast = useCallback((type, message) => {
    setToast({ id: Date.now(), type, message });
  }, []);

  const cargarDatos = useCallback(
    async ({ notify = false, initial = false } = {}) => {
      if (initial) setCargando(true);
      else setActualizando(true);

      try {
        const [healthRes, gastosRes, usuariosRes] = await Promise.all([
          api.get(endpoints.health),
          api.get(endpoints.gastos),
          api.get(endpoints.usuarios),
        ]);

        setEstadoServidor({ online: true, message: healthRes.data?.message || "Servidor activo" });
        setGastos(extraerLista(gastosRes.data));
        setUsuarios(extraerLista(usuariosRes.data));
        if (notify) mostrarToast("success", "Datos actualizados correctamente.");
        return true;
      } catch (error) {
        setEstadoServidor({ online: false, message: "Backend no disponible" });
        mostrarToast("error", getErrorMessage(error, "Error al cargar datos."));
        return false;
      } finally {
        setCargando(false);
        setActualizando(false);
      }
    },
    [mostrarToast],
  );

  useEffect(() => {
    const initialLoad = window.setTimeout(() => cargarDatos({ initial: true }), 0);
    return () => window.clearTimeout(initialLoad);
  }, [cargarDatos]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!resaltado) return undefined;
    const timer = window.setTimeout(() => setResaltado(null), 3200);
    return () => window.clearTimeout(timer);
  }, [resaltado]);

  const totalGastos = useMemo(() => gastos.reduce((total, gasto) => total + Number(gasto.monto || 0), 0), [gastos]);

  const validarGasto = () => {
    const errors = {};
    if (!String(gastoForm.cedula).trim()) errors.cedula = "La cédula es obligatoria.";
    if (!["educacion", "salud", "vivienda"].includes(gastoForm.tipo)) errors.tipo = "Selecciona un tipo válido.";
    if (!gastoForm.monto || Number(gastoForm.monto) <= 0) errors.monto = "El monto debe ser mayor a 0.";
    if (gastoForm.montoMaximoDeducible !== "" && Number(gastoForm.montoMaximoDeducible) < 0) {
      errors.montoMaximoDeducible = "El monto máximo no puede ser negativo.";
    }
    if (!gastoForm.periodo || Number(gastoForm.periodo) < 2000) errors.periodo = "Ingresa un periodo válido (desde 2000).";
    setErroresGasto(errors);
    return Object.keys(errors).length === 0;
  };

  const validarUsuario = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!usuarioForm.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
    if (!usuarioForm.cedula.trim()) errors.cedula = "La cédula es obligatoria.";
    if (!usuarioForm.email.trim()) errors.email = "El email es obligatorio.";
    else if (!emailRegex.test(usuarioForm.email)) errors.email = "Ingresa un email válido.";
    if (usuarioForm.ingresos === "" || Number(usuarioForm.ingresos) < 0) errors.ingresos = "Los ingresos deben ser mayores o iguales a 0.";
    if (!usuarioForm.periodo || Number(usuarioForm.periodo) < 2000) errors.periodo = "Ingresa un periodo válido (desde 2000).";
    setErroresUsuario(errors);
    return Object.keys(errors).length === 0;
  };

  const guardarGasto = async (event) => {
    event.preventDefault();
    if (!validarGasto()) {
      mostrarToast("error", "Revisa los campos marcados antes de continuar.");
      return;
    }

    setGuardando("gasto");
    const esEdicion = Boolean(gastoEditando);
    try {
      const payload = {
        cedula: gastoForm.cedula.trim(),
        tipo: gastoForm.tipo,
        monto: Number(gastoForm.monto),
        montoMaximoDeducible: Number(gastoForm.montoMaximoDeducible || 0),
        informacion: gastoForm.informacion.trim() || "Sin información adicional",
        periodo: Number(gastoForm.periodo),
      };
      const response = esEdicion
        ? await api.put(`${endpoints.gastos}/${gastoEditando}`, payload)
        : await api.post(endpoints.gastos, payload);
      const savedId = extraerRegistro(response)?._id || gastoEditando;

      setGastoForm(gastoInicial);
      setGastoEditando(null);
      setErroresGasto({});
      await cargarDatos();
      if (savedId) setResaltado({ type: "gasto", id: savedId });
      mostrarToast("success", esEdicion ? "Gasto actualizado correctamente." : "Gasto registrado correctamente.");
    } catch (error) {
      mostrarToast("error", getErrorMessage(error, "No se pudo guardar el gasto. Verifica los campos."));
    } finally {
      setGuardando(null);
    }
  };

  const editarGasto = (gasto) => {
    setGastoEditando(gasto._id);
    setGastoForm({
      cedula: gasto.cedula || "",
      tipo: ["educacion", "salud", "vivienda"].includes(gasto.tipo) ? gasto.tipo : "salud",
      monto: gasto.monto ?? "",
      montoMaximoDeducible: gasto.montoMaximoDeducible ?? "",
      informacion: gasto.informacion || "",
      periodo: gasto.periodo || currentYear,
    });
    setErroresGasto({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelarEdicionGasto = () => {
    setGastoEditando(null);
    setGastoForm(gastoInicial);
    setErroresGasto({});
  };

  const eliminarGasto = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este gasto? Esta acción no se puede deshacer.")) return;
    setEliminando(id);
    try {
      await api.delete(`${endpoints.gastos}/${id}`);
      await cargarDatos();
      mostrarToast("success", "Gasto eliminado correctamente.");
    } catch (error) {
      mostrarToast("error", getErrorMessage(error, "No se pudo eliminar el gasto."));
    } finally {
      setEliminando(null);
    }
  };

  const guardarUsuario = async (event) => {
    event.preventDefault();
    if (!validarUsuario()) {
      mostrarToast("error", "Revisa los campos marcados antes de continuar.");
      return;
    }

    setGuardando("usuario");
    const esEdicion = Boolean(usuarioEditando);
    try {
      const payload = {
        nombre: usuarioForm.nombre.trim(),
        cedula: usuarioForm.cedula.trim(),
        email: usuarioForm.email.trim().toLowerCase(),
        periodo: Number(usuarioForm.periodo),
        ingresos: Number(usuarioForm.ingresos),
        ...(!esEdicion ? { gastos: [] } : {}),
      };
      const response = esEdicion
        ? await api.put(`${endpoints.usuarios}/${usuarioEditando}`, payload)
        : await api.post(endpoints.usuarios, payload);
      const savedId = extraerRegistro(response)?._id || usuarioEditando;

      setUsuarioForm(usuarioInicial);
      setUsuarioEditando(null);
      setErroresUsuario({});
      await cargarDatos();
      if (savedId) setResaltado({ type: "usuario", id: savedId });
      mostrarToast("success", esEdicion ? "Usuario actualizado correctamente." : "Usuario registrado correctamente.");
    } catch (error) {
      mostrarToast("error", getErrorMessage(error, "No se pudo guardar el usuario. Verifica los campos."));
    } finally {
      setGuardando(null);
    }
  };

  const editarUsuario = (usuario) => {
    setUsuarioEditando(usuario._id);
    setUsuarioForm({
      nombre: usuario.nombre || "",
      cedula: usuario.cedula || "",
      email: usuario.email || "",
      periodo: usuario.periodo || currentYear,
      ingresos: usuario.ingresos ?? "",
    });
    setErroresUsuario({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelarEdicionUsuario = () => {
    setUsuarioEditando(null);
    setUsuarioForm(usuarioInicial);
    setErroresUsuario({});
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.")) return;
    setEliminando(id);
    try {
      await api.delete(`${endpoints.usuarios}/${id}`);
      await cargarDatos();
      mostrarToast("success", "Usuario eliminado correctamente.");
    } catch (error) {
      mostrarToast("error", getErrorMessage(error, "No se pudo eliminar el usuario."));
    } finally {
      setEliminando(null);
    }
  };

  const environmentLabel = connectionInfo.isAws ? "AWS EC2" : "Local";
  const connectionLabel = connectionInfo.isAws
    ? "Conectado a AWS EC2 con MongoDB Atlas"
    : "Conectado a backend local con MongoDB";

  const sharedPageProps = {
    actualizando,
    cargando,
    cargarDatos,
    connectionLabel,
    environmentLabel,
    estadoServidor,
    gastos,
    mostrarToast,
    totalGastos,
    usuarios,
  };

  return (
    <Routes>
      <Route
        element={
          <AppLayout
            actualizando={actualizando}
            cargando={cargando}
            cargarDatos={cargarDatos}
            connectionLabel={connectionLabel}
            environmentLabel={environmentLabel}
            estadoServidor={estadoServidor}
            toast={toast}
            setToast={setToast}
          />
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage {...sharedPageProps} />} />
        <Route
          path="/gastos"
          element={
            <GastosPage
              cargando={cargando}
              cancelarEdicionGasto={cancelarEdicionGasto}
              editarGasto={editarGasto}
              eliminarGasto={eliminarGasto}
              eliminando={eliminando}
              erroresGasto={erroresGasto}
              gastoEditando={gastoEditando}
              gastoForm={gastoForm}
              gastos={gastos}
              guardando={guardando}
              guardarGasto={guardarGasto}
              resaltado={resaltado}
              setGastoForm={setGastoForm}
            />
          }
        />
        <Route
          path="/usuarios"
          element={
            <UsuariosPage
              cargando={cargando}
              cancelarEdicionUsuario={cancelarEdicionUsuario}
              editarUsuario={editarUsuario}
              eliminarUsuario={eliminarUsuario}
              eliminando={eliminando}
              erroresUsuario={erroresUsuario}
              guardando={guardando}
              guardarUsuario={guardarUsuario}
              resaltado={resaltado}
              setUsuarioForm={setUsuarioForm}
              usuarioEditando={usuarioEditando}
              usuarioForm={usuarioForm}
              usuarios={usuarios}
            />
          }
        />
        <Route path="/informacion" element={<InformacionPage connectionLabel={connectionLabel} />} />
        <Route path="/reporte" element={<ReportePage {...sharedPageProps} />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
