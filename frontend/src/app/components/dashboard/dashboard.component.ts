import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { catchError, forkJoin, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Gasto } from '../../models/gasto';
import { Usuario } from '../../models/usuario';
import { GastoService } from '../../services/gasto.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  gastos: Gasto[] = [];
  usuarios: Usuario[] = [];
  totalGastos = 0;
  totalUsuarios = 0;
  montoTotal = 0;
  loading = true;
  error = '';
  estadoBackend = 'Verificando';
  backendOnline: boolean | null = null;
  backendMessage = 'Verificando conexión...';

  readonly environmentName = environment.apiUrl.includes('18.191.247.48') ? 'AWS EC2' : 'Local';
  readonly connectionLabel =
    this.environmentName === 'AWS EC2'
      ? 'Conectado a AWS EC2 con MongoDB Atlas'
      : 'Conectado a backend local con MongoDB';

  constructor(
    private readonly gastoService: GastoService,
    private readonly usuarioService: UsuarioService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    this.error = '';
    this.estadoBackend = 'Verificando';
    this.backendOnline = null;
    this.backendMessage = 'Verificando conexión...';

    forkJoin({
      health: this.gastoService.verificarHealth().pipe(catchError(() => of(null))),
      gastos: this.gastoService.listarGastos(),
      usuarios: this.usuarioService.listarUsuarios(),
    }).subscribe({
      next: ({ health, gastos, usuarios }) => {
        console.log('GASTOS EN DASHBOARD:', gastos);
        console.log('USUARIOS EN DASHBOARD:', usuarios);

        this.gastos = gastos;
        this.usuarios = usuarios;
        this.totalGastos = gastos.length;
        this.totalUsuarios = usuarios.length;
        this.montoTotal = gastos.reduce((total, gasto) => total + Number(gasto.monto || 0), 0);

        this.backendOnline = Boolean(health);
        this.estadoBackend = health ? 'Servidor activo' : 'Backend no disponible';
        this.backendMessage = health?.message || this.estadoBackend;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('ERROR DASHBOARD:', error);
        this.error = 'No se pudieron cargar los datos del dashboard.';
        this.estadoBackend = 'Error de conexión';
        this.backendOnline = false;
        this.backendMessage = 'Backend no disponible';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
