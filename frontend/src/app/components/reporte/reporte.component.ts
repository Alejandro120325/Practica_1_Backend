import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { catchError, forkJoin, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ExternalUser } from '../../models/external-user';
import { Gasto } from '../../models/gasto';
import { GastoJson } from '../../models/gasto-json';
import { Usuario } from '../../models/usuario';
import { GastoService } from '../../services/gasto.service';
import { JsonLocalService } from '../../services/json-local.service';
import { JsonPlaceholderService } from '../../services/json-placeholder.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-reporte',
  standalone: false,
  templateUrl: './reporte.component.html',
})
export class ReporteComponent implements OnInit {
  gastosApi: Gasto[] = [];
  usuariosApi: Usuario[] = [];
  datosLocales: GastoJson[] = [];
  usuariosExternos: ExternalUser[] = [];
  loadingApi = false;
  error = '';

  readonly environmentName = environment.apiUrl.includes('18.191.247.48') ? 'AWS EC2' : 'Local';

  constructor(
    private readonly gastoService: GastoService,
    private readonly usuarioService: UsuarioService,
    private readonly jsonLocalService: JsonLocalService,
    private readonly jsonPlaceholderService: JsonPlaceholderService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarReporte();
  }

  get montoTotal(): number {
    return this.gastosApi.reduce((total, gasto) => total + Number(gasto.monto || 0), 0);
  }

  cargarReporte(): void {
    this.loadingApi = true;
    this.error = '';
    const errores: string[] = [];

    forkJoin({
      gastosApi: this.gastoService.listarGastos().pipe(
        catchError((error) => {
          console.error('ERROR REPORTE GASTOS API:', error);
          errores.push('No se pudieron cargar gastos desde la API AWS.');
          return of([] as Gasto[]);
        }),
      ),
      usuariosApi: this.usuarioService.listarUsuarios().pipe(
        catchError((error) => {
          console.error('ERROR REPORTE USUARIOS API:', error);
          errores.push('No se pudieron cargar usuarios desde la API AWS.');
          return of([] as Usuario[]);
        }),
      ),
      locales: this.jsonLocalService.listarDatosLocales().pipe(
        catchError((error) => {
          console.error('ERROR JSON LOCAL:', error);
          errores.push('No se pudo cargar assets/datos.json.');
          return of([] as GastoJson[]);
        }),
      ),
      externos: this.jsonPlaceholderService.listarUsuariosExternos().pipe(
        catchError((error) => {
          console.error('ERROR JSONPLACEHOLDER:', error);
          errores.push('No se pudieron cargar usuarios desde JSONPlaceholder.');
          return of([] as ExternalUser[]);
        }),
      ),
    }).subscribe({
      next: ({ gastosApi, usuariosApi, locales, externos }) => {
        console.log('GASTOS EN COMPONENTE:', gastosApi);
        console.log('USUARIOS EN COMPONENTE:', usuariosApi);

        this.gastosApi = gastosApi;
        this.usuariosApi = usuariosApi;
        this.datosLocales = locales;
        this.usuariosExternos = externos;
        this.error = errores.join(' ');
        this.loadingApi = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('ERROR REPORTE:', error);
        this.error = 'Error al cargar datos del reporte. Verifica la API AWS o la conexión de red.';
        this.loadingApi = false;
        this.cdr.detectChanges();
      },
    });
  }

  getTipoLabel(tipo: string): string {
    const labels: Record<string, string> = {
      alimentacion: 'Alimentación',
      vivienda: 'Vivienda',
      salud: 'Salud',
      educacion: 'Educación',
      vestimenta: 'Vestimenta',
      ninguno: 'Ninguno',
    };
    return labels[tipo] || tipo;
  }
}
