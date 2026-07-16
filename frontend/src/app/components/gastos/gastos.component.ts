import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Gasto, GastoPayload } from '../../models/gasto';
import { GastoService } from '../../services/gasto.service';

@Component({
  selector: 'app-gastos',
  standalone: false,
  templateUrl: './gastos.component.html',
})
export class GastosComponent implements OnInit {
  readonly tipoOptions = ['alimentacion', 'vivienda', 'salud', 'educacion', 'vestimenta', 'ninguno'];
  readonly tipoLabels: Record<string, string> = {
    alimentacion: 'Alimentación',
    vivienda: 'Vivienda',
    salud: 'Salud',
    educacion: 'Educación',
    vestimenta: 'Vestimenta',
    ninguno: 'Ninguno',
  };

  gastos: Gasto[] = [];
  form: GastoPayload = this.nuevoGasto();
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
    private readonly gastoService: GastoService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarGastos();
  }

  cargarGastos(): void {
    this.loading = true;
    this.error = '';

    this.gastoService.listarGastos().subscribe({
      next: (gastos) => {
        console.log('GASTOS EN COMPONENTE:', gastos);
        this.gastos = gastos;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('ERROR GASTOS COMPONENTE:', error);
        this.error = 'No se pudieron cargar los gastos desde la API AWS.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  guardarGasto(): void {
    if (!this.validarFormulario()) {
      this.mostrarMensaje('error', 'Revisa los campos marcados antes de continuar.');
      return;
    }

    this.guardando = true;
    const payload: GastoPayload = {
      cedula: this.form.cedula.trim(),
      tipo: this.form.tipo,
      monto: Number(this.form.monto),
      montoMaximoDeducible: Number(this.form.montoMaximoDeducible || 0),
      informacion: this.form.informacion?.trim() || 'Sin información adicional',
      periodo: Number(this.form.periodo),
    };

    const request$ = this.editandoId
      ? this.gastoService.actualizarGasto(this.editandoId, payload)
      : this.gastoService.crearGasto(payload);

    request$.pipe(finalize(() => (this.guardando = false))).subscribe({
      next: (gastoGuardado) => {
        const idResaltado = gastoGuardado._id || this.editandoId;
        this.mostrarMensaje('success', this.editandoId ? 'Gasto actualizado correctamente.' : 'Gasto registrado correctamente.');
        this.cancelarEdicion();
        this.cargarGastos();
        this.resaltarFila(idResaltado);
      },
      error: (error) => {
        console.error('ERROR GUARDAR GASTO:', error);
        this.mostrarMensaje('error', 'No se pudo guardar el gasto. Verifica los datos ingresados.');
        this.cdr.detectChanges();
      },
    });
  }

  editarGasto(gasto: Gasto): void {
    this.editandoId = gasto._id || '';
    this.form = {
      cedula: gasto.cedula || '',
      tipo: gasto.tipo || 'salud',
      monto: Number(gasto.monto || 0),
      montoMaximoDeducible: Number(gasto.montoMaximoDeducible || 0),
      informacion: gasto.informacion || '',
      periodo: Number(gasto.periodo || new Date().getFullYear()),
    };
    this.errores = {};
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarGasto(gasto: Gasto): void {
    if (!gasto._id) return;
    if (!confirm('¿Seguro que deseas eliminar este gasto? Esta acción no se puede deshacer.')) return;

    this.eliminandoId = gasto._id;
    this.gastoService
      .eliminarGasto(gasto._id)
      .pipe(finalize(() => (this.eliminandoId = '')))
      .subscribe({
        next: () => {
          this.mostrarMensaje('success', 'Gasto eliminado correctamente.');
          this.cargarGastos();
        },
        error: (error) => {
          console.error('ERROR ELIMINAR GASTO:', error);
          this.mostrarMensaje('error', 'No se pudo eliminar el gasto.');
          this.cdr.detectChanges();
        },
      });
  }

  cancelarEdicion(): void {
    this.form = this.nuevoGasto();
    this.editandoId = '';
    this.errores = {};
  }

  getTipoLabel(tipo: string): string {
    return this.tipoLabels[tipo] || tipo;
  }

  private nuevoGasto(): GastoPayload {
    return {
      cedula: '',
      tipo: 'salud',
      monto: 0,
      montoMaximoDeducible: 0,
      informacion: '',
      periodo: new Date().getFullYear(),
    };
  }

  private validarFormulario(): boolean {
    const errores: Record<string, string> = {};
    if (!this.form.cedula.trim()) errores['cedula'] = 'La cédula es obligatoria.';
    if (!this.tipoOptions.includes(this.form.tipo)) errores['tipo'] = 'Selecciona un tipo válido.';
    if (!this.form.monto || Number(this.form.monto) <= 0) errores['monto'] = 'El monto debe ser mayor a 0.';
    if (Number(this.form.montoMaximoDeducible) < 0) errores['montoMaximoDeducible'] = 'El máximo deducible no puede ser negativo.';
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
