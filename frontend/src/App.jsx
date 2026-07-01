import { useEffect, useMemo, useState } from "react";
import { api, endpoints } from "./api/api";
import "./index.css";

const gastoInicial = {
  cedula: "",
  tipo: "salud",
  monto: "",
  montoMaximoDeducible: "",
  informacion: "",
  periodo: new Date().getFullYear(),
};

const usuarioInicial = {
  nombre: "",
  cedula: "",
  email: "",
  periodo: new Date().getFullYear(),
  ingresos: "",
};

function extraerLista(respuesta) {
  if (Array.isArray(respuesta)) return respuesta;
  if (Array.isArray(respuesta?.data)) return respuesta.data;
  if (Array.isArray(respuesta?.data?.data)) return respuesta.data.data;
  return [];
}

function App() {
  const [vista, setVista] = useState("dashboard");
  const [estadoServidor, setEstadoServidor] = useState("Verificando...");
  const [gastos, setGastos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [gastoForm, setGastoForm] = useState(gastoInicial);
  const [usuarioForm, setUsuarioForm] = useState(usuarioInicial);
  const [gastoEditando, setGastoEditando] = useState(null);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);

    try {
      const [healthRes, gastosRes, usuariosRes] = await Promise.all([
        api.get(endpoints.health),
        api.get(endpoints.gastos),
        api.get(endpoints.usuarios),
      ]);

      setEstadoServidor(healthRes.data?.message || "Servidor activo");
      setGastos(extraerLista(gastosRes.data));
      setUsuarios(extraerLista(usuariosRes.data));
    } catch (error) {
      setEstadoServidor("Backend no disponible");
      setMensaje("No se pudo conectar con el backend. Verifica MongoDB y npm run dev.");
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const totalGastos = useMemo(() => {
    return gastos.reduce((total, gasto) => total + Number(gasto.monto || 0), 0);
  }, [gastos]);

  const guardarGasto = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...gastoForm,
        monto: Number(gastoForm.monto),
        montoMaximoDeducible: Number(gastoForm.montoMaximoDeducible),
        periodo: Number(gastoForm.periodo),
      };

      if (gastoEditando) {
        await api.put(`${endpoints.gastos}/${gastoEditando}`, payload);
        setMensaje("Gasto actualizado correctamente.");
      } else {
        await api.post(endpoints.gastos, payload);
        setMensaje("Gasto registrado correctamente.");
      }

      setGastoForm(gastoInicial);
      setGastoEditando(null);
      await cargarDatos();
    } catch (error) {
      setMensaje(error.response?.data?.message || "Error al guardar el gasto.");
      console.error(error);
    }
  };

  const editarGasto = (gasto) => {
    setGastoEditando(gasto._id);
    setGastoForm({
      cedula: gasto.cedula || "",
      tipo: gasto.tipo || "salud",
      monto: gasto.monto || "",
      montoMaximoDeducible: gasto.montoMaximoDeducible || "",
      informacion: gasto.informacion || "",
      periodo: gasto.periodo || new Date().getFullYear(),
    });
    setVista("gastos");
  };

  const eliminarGasto = async (id) => {
    const confirmar = confirm("¿Seguro que deseas eliminar este gasto?");
    if (!confirmar) return;

    try {
      await api.delete(`${endpoints.gastos}/${id}`);
      setMensaje("Gasto eliminado correctamente.");
      await cargarDatos();
    } catch (error) {
      setMensaje("Error al eliminar el gasto.");
      console.error(error);
    }
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...usuarioForm,
        periodo: Number(usuarioForm.periodo),
        ingresos: Number(usuarioForm.ingresos),
        gastos: [],
      };

      if (usuarioEditando) {
        await api.put(`${endpoints.usuarios}/${usuarioEditando}`, payload);
        setMensaje("Usuario actualizado correctamente.");
      } else {
        await api.post(endpoints.usuarios, payload);
        setMensaje("Usuario registrado correctamente.");
      }

      setUsuarioForm(usuarioInicial);
      setUsuarioEditando(null);
      await cargarDatos();
    } catch (error) {
      setMensaje(error.response?.data?.message || "Error al guardar el usuario.");
      console.error(error);
    }
  };

  const editarUsuario = (usuario) => {
    setUsuarioEditando(usuario._id);
    setUsuarioForm({
      nombre: usuario.nombre || "",
      cedula: usuario.cedula || "",
      email: usuario.email || "",
      periodo: usuario.periodo || new Date().getFullYear(),
      ingresos: usuario.ingresos || "",
    });
    setVista("usuarios");
  };

  const eliminarUsuario = async (id) => {
    const confirmar = confirm("¿Seguro que deseas eliminar este usuario?");
    if (!confirmar) return;

    try {
      await api.delete(`${endpoints.usuarios}/${id}`);
      setMensaje("Usuario eliminado correctamente.");
      await cargarDatos();
    } catch (error) {
      setMensaje("Error al eliminar el usuario.");
      console.error(error);
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div>
          <div className="brand">
            <div className="brand-logo">G</div>
            <div>
              <h1>GastosDB</h1>
              <p>Express + MongoDB</p>
            </div>
          </div>

          <nav>
            <button className={vista === "dashboard" ? "active" : ""} onClick={() => setVista("dashboard")}>
              Dashboard
            </button>
            <button className={vista === "gastos" ? "active" : ""} onClick={() => setVista("gastos")}>
              Gastos
            </button>
            <button className={vista === "usuarios" ? "active" : ""} onClick={() => setVista("usuarios")}>
              Usuarios
            </button>
            <button className={vista === "info" ? "active" : ""} onClick={() => setVista("info")}>
              Información
            </button>
          </nav>
        </div>

        <div className="server-status">
          <span>Estado del backend</span>
          <strong>{estadoServidor}</strong>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <h2>Panel de Gestión de Gastos</h2>
            <p>Frontend profesional conectado al backend local con MongoDB.</p>
          </div>

          <button className="primary-btn" onClick={cargarDatos}>
            {cargando ? "Cargando..." : "Actualizar"}
          </button>
        </header>

        {mensaje && <div className="alert">{mensaje}</div>}

        {vista === "dashboard" && (
          <>
            <section className="stats">
              <div className="stat-card">
                <span>Total de gastos</span>
                <strong>{gastos.length}</strong>
              </div>

              <div className="stat-card">
                <span>Total de usuarios</span>
                <strong>{usuarios.length}</strong>
              </div>

              <div className="stat-card">
                <span>Monto registrado</span>
                <strong>${totalGastos.toFixed(2)}</strong>
              </div>

              <div className="stat-card">
                <span>Base de datos</span>
                <strong>gastos_db</strong>
              </div>
            </section>

            <section className="panel">
              <h3>Resumen del proyecto</h3>
              <p>
                Este sistema permite gestionar usuarios y gastos mediante un backend REST
                desarrollado con Node.js, Express.js y MongoDB. Desde este panel se pueden
                consultar, crear, actualizar y eliminar registros.
              </p>
            </section>
          </>
        )}

        {vista === "gastos" && (
          <section className="layout">
            <form className="form-card" onSubmit={guardarGasto}>
              <h3>{gastoEditando ? "Actualizar gasto" : "Registrar gasto"}</h3>

              <input
                placeholder="Cédula"
                value={gastoForm.cedula}
                onChange={(e) => setGastoForm({ ...gastoForm, cedula: e.target.value })}
                required
              />

              <select
                value={gastoForm.tipo}
                onChange={(e) => setGastoForm({ ...gastoForm, tipo: e.target.value })}
              >
                <option value="salud">Salud</option>
                <option value="educacion">Educación</option>
                <option value="vivienda">Vivienda</option>
                <option value="alimentacion">Alimentación</option>
                <option value="vestimenta">Vestimenta</option>
              </select>

              <input
                type="number"
                placeholder="Monto"
                value={gastoForm.monto}
                onChange={(e) => setGastoForm({ ...gastoForm, monto: e.target.value })}
                required
              />

              <input
                type="number"
                placeholder="Monto máximo deducible"
                value={gastoForm.montoMaximoDeducible}
                onChange={(e) => setGastoForm({ ...gastoForm, montoMaximoDeducible: e.target.value })}
                required
              />

              <input
                placeholder="Información"
                value={gastoForm.informacion}
                onChange={(e) => setGastoForm({ ...gastoForm, informacion: e.target.value })}
                required
              />

              <input
                type="number"
                placeholder="Periodo"
                value={gastoForm.periodo}
                onChange={(e) => setGastoForm({ ...gastoForm, periodo: e.target.value })}
                required
              />

              <button type="submit" className="primary-btn">
                {gastoEditando ? "Guardar cambios" : "Crear gasto"}
              </button>
            </form>

            <div className="table-card">
              <h3>Listado de gastos</h3>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Cédula</th>
                      <th>Tipo</th>
                      <th>Monto</th>
                      <th>Periodo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {gastos.map((gasto) => (
                      <tr key={gasto._id}>
                        <td>{gasto.cedula}</td>
                        <td>{gasto.tipo}</td>
                        <td>${Number(gasto.monto || 0).toFixed(2)}</td>
                        <td>{gasto.periodo}</td>
                        <td className="actions">
                          <button onClick={() => editarGasto(gasto)}>Editar</button>
                          <button className="danger" onClick={() => eliminarGasto(gasto._id)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}

                    {gastos.length === 0 && (
                      <tr>
                        <td colSpan="5">No hay gastos registrados.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {vista === "usuarios" && (
          <section className="layout">
            <form className="form-card" onSubmit={guardarUsuario}>
              <h3>{usuarioEditando ? "Actualizar usuario" : "Registrar usuario"}</h3>

              <input
                placeholder="Nombre"
                value={usuarioForm.nombre}
                onChange={(e) => setUsuarioForm({ ...usuarioForm, nombre: e.target.value })}
                required
              />

              <input
                placeholder="Cédula"
                value={usuarioForm.cedula}
                onChange={(e) => setUsuarioForm({ ...usuarioForm, cedula: e.target.value })}
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={usuarioForm.email}
                onChange={(e) => setUsuarioForm({ ...usuarioForm, email: e.target.value })}
                required
              />

              <input
                type="number"
                placeholder="Periodo"
                value={usuarioForm.periodo}
                onChange={(e) => setUsuarioForm({ ...usuarioForm, periodo: e.target.value })}
                required
              />

              <input
                type="number"
                placeholder="Ingresos"
                value={usuarioForm.ingresos}
                onChange={(e) => setUsuarioForm({ ...usuarioForm, ingresos: e.target.value })}
                required
              />

              <button type="submit" className="primary-btn">
                {usuarioEditando ? "Guardar cambios" : "Crear usuario"}
              </button>
            </form>

            <div className="table-card">
              <h3>Listado de usuarios</h3>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Cédula</th>
                      <th>Email</th>
                      <th>Ingresos</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario._id}>
                        <td>{usuario.nombre}</td>
                        <td>{usuario.cedula}</td>
                        <td>{usuario.email}</td>
                        <td>${Number(usuario.ingresos || 0).toFixed(2)}</td>
                        <td className="actions">
                          <button onClick={() => editarUsuario(usuario)}>Editar</button>
                          <button className="danger" onClick={() => eliminarUsuario(usuario._id)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}

                    {usuarios.length === 0 && (
                      <tr>
                        <td colSpan="5">No hay usuarios registrados.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {vista === "info" && (
          <section className="panel">
            <h3>Información del sistema</h3>
            <p>
              Aplicación académica desarrollada para demostrar el consumo de una API REST
              con operaciones CRUD. El backend trabaja con Express.js y MongoDB, mientras
              que este frontend fue desarrollado con React y Vite.
            </p>

            <div className="tech-list">
              <span>Node.js</span>
              <span>Express.js</span>
              <span>MongoDB</span>
              <span>React</span>
              <span>Vite</span>
              <span>Postman</span>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;

