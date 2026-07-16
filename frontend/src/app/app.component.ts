import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../environments/environment';
import { GastoService } from './services/gasto.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  pageTitle = 'Panel de Gestión de Gastos';
  pageDescription = 'Aplicación Angular conectada a la API REST de GastosDB.';
  backendOnline: boolean | null = null;
  backendMessage = 'Verificando conexión...';
  readonly environmentLabel = environment.apiUrl.includes('18.191.247.48') ? 'AWS EC2' : 'Local';
  readonly connectionLabel =
    this.environmentLabel === 'AWS EC2'
      ? 'Conectado a AWS EC2 con MongoDB Atlas'
      : 'Conectado a backend local con MongoDB';

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly gastoService: GastoService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(() => {
      const child = this.activatedRoute.firstChild;
      this.pageTitle = child?.snapshot.data['title'] ?? this.pageTitle;
      this.pageDescription = child?.snapshot.data['description'] ?? this.pageDescription;
    });

    this.verificarBackend();
  }

  verificarBackend(): void {
    this.gastoService.verificarHealth().subscribe({
      next: (respuesta) => {
        this.backendOnline = true;
        this.backendMessage = respuesta.message || 'Servidor activo';
        this.cdr.detectChanges();
      },
      error: () => {
        this.backendOnline = false;
        this.backendMessage = 'Backend no disponible';
        this.cdr.detectChanges();
      },
    });
  }
}
