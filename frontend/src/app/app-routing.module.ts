import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactoComponent } from './components/contacto/contacto.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GastosComponent } from './components/gastos/gastos.component';
import { InformacionComponent } from './components/informacion/informacion.component';
import { ReporteComponent } from './components/reporte/reporte.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      title: 'Panel de Gestión de Gastos',
      description: 'Resumen operativo del sistema consumiendo la API REST con Angular HttpClient.',
    },
  },
  {
    path: 'gastos',
    component: GastosComponent,
    data: {
      title: 'Gestión de Gastos',
      description: 'Formulario Angular con ngModel y CRUD completo de gastos.',
    },
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    data: {
      title: 'Gestión de Usuarios',
      description: 'Formulario Angular con ngModel y CRUD completo de usuarios.',
    },
  },
  {
    path: 'reporte',
    component: ReporteComponent,
    data: {
      title: 'Reporte de Gestión de Gastos',
      description: 'Datos desde API REST AWS, JSON local y JSONPlaceholder usando HttpClient.',
    },
  },
  {
    path: 'informacion',
    component: InformacionComponent,
    data: {
      title: 'Información Técnica',
      description: 'Evidencia de cumplimiento de Formulario, Routing y HttpClient.',
    },
  },
  {
    path: 'contacto',
    component: ContactoComponent,
    data: {
      title: 'Contacto / Desarrollador',
      description: 'Datos académicos y tecnologías usadas en GastosDB.',
    },
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
