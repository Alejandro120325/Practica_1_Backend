import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Usuario, UsuarioPayload } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.component.html',
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  form: UsuarioPayload = this.nuevoUsuario();
  editandoId = '';
  errores: Record<string, string> = {};
  mensaje = '';
  mensajeTipo: 'success' | 'error' = 'success';
  loading = false;
  error = '';
  guardando = false;
  eliminandoId = '';
  resaltadoId = '';

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.error = '';

    this.usuarioService.listarUsuarios().subscribe({
      next: (usuarios) => {
        console.log('USUARIOS EN COMPONENTE:', usuarios);
        this.usuarios = usuarios;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('ERROR USUARIOS COMPONENTE:', error);
        this.error = 'No se pudieron cargar los usuarios desde la API AWS.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  guardarUsuario(): void {
    if (!this.validarFormulario()) {
      this.mostrarMensaje('error', 'Revisa los campos marcados antes de continuar.');
      return;
    }

    this.guardando = true;
    const payload: UsuarioPayload = {
      nombre: this.form.nombre.trim(),
      cedula: this.form.cedula.trim(),
      email: this.form.email.trim().toLowerCase(),
      periodo: Number(this.form.periodo),
      ingresos: Number(this.form.ingresos),
      ...(!this.editandoId ? { gastos: [] } : {}),
    };

    const request$ = this.editandoId
      ? this.usuarioService.actualizarUsuario(this.editandoId, payload)
      : this.usuarioService.crearUsuario(payload);

    request$.pipe(finalize(() => (this.guardando = false))).subscribe({
      next: (usuarioGuardado) => {
        const idResaltado = usuarioGuardado._id || this.editandoId;
        this.mostrarMensaje('success', this.editandoId ? 'Usuario actualizado correctamente.' : 'Usuario registrado correctamente.');
        this.cancelarEdicion();
        this.cargarUsuarios();
        this.resaltarFila(idResaltado);
      },
      error: (error) => {
        console.error('ERROR GUARDAR USUARIO:', error);
        this.mostrarMensaje('error', 'No se pudo guardar el usuario. Verifica los datos ingresados.');
        this.cdr.detectChanges();
      },
    });
  }

  editarUsuario(usuario: Usuario): void {
    this.editandoId = usuario._id || '';
    this.form = {
      nombre: usuario.nombre || '',
      cedula: usuario.cedula || '',
      email: usuario.email || '',
      periodo: Number(usuario.periodo || new Date().getFullYear()),
      ingresos: Number(usuario.ingresos || 0),
    };
    this.errores = {};
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarUsuario(usuario: Usuario): void {
    if (!usuario._id) return;
    if (!confirm('¿Seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.')) return;

    this.eliminandoId = usuario._id;
    this.usuarioService
      .eliminarUsuario(usuario._id)
      .pipe(finalize(() => (this.eliminandoId = '')))
      .subscribe({
        next: () => {
          this.mostrarMensaje('success', 'Usuario eliminado correctamente.');
          this.cargarUsuarios();
        },
        error: (error) => {
          console.error('ERROR ELIMINAR USUARIO:', error);
          this.mostrarMensaje('error', 'No se pudo eliminar el usuario.');
          this.cdr.detectChanges();
        },
      });
  }

  cancelarEdicion(): void {
    this.form = this.nuevoUsuario();
    this.editandoId = '';
    this.errores = {};
  }

  private nuevoUsuario(): UsuarioPayload {
    return {
      nombre: '',
      cedula: '',
      email: '',
      periodo: new Date().getFullYear(),
      ingresos: 0,
      gastos: [],
    };
  }

  private validarFormulario(): boolean {
    const errores: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.form.nombre.trim()) errores['nombre'] = 'El nombre es obligatorio.';
    if (!this.form.cedula.trim()) errores['cedula'] = 'La cédula es obligatoria.';
    if (!this.form.email.trim()) errores['email'] = 'El email es obligatorio.';
    else if (!emailRegex.test(this.form.email)) errores['email'] = 'Ingresa un email válido.';
    if (this.form.ingresos === null || this.form.ingresos === undefined || Number(this.form.ingresos) < 0) {
      errores['ingresos'] = 'Los ingresos deben ser mayores o iguales a 0.';
    }
    if (!this.form.periodo || Number(this.form.periodo) < 2000) errores['periodo'] = 'Ingresa un periodo válido desde 2000.';

    this.errores = errores;
    return Object.keys(errores).length === 0;
  }

  private mostrarMensaje(tipo: 'success' | 'error', texto: string): void {
    this.mensajeTipo = tipo;
    this.mensaje = texto;
    this.cdr.detectChanges();

    window.setTimeout(() => {
      if (this.mensaje === texto) {
        this.mensaje = '';
        this.cdr.detectChanges();
      }
    }, 4200);
  }

  private resaltarFila(id: string): void {
    this.resaltadoId = id;
    this.cdr.detectChanges();

    window.setTimeout(() => {
      if (this.resaltadoId === id) {
        this.resaltadoId = '';
        this.cdr.detectChanges();
      }
    }, 3200);
  }
}
