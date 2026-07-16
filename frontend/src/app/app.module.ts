import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GastosComponent } from './components/gastos/gastos.component';
import { InformacionComponent } from './components/informacion/informacion.component';
import { MenuComponent } from './components/menu/menu.component';
import { ReporteComponent } from './components/reporte/reporte.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    DashboardComponent,
    GastosComponent,
    UsuariosComponent,
    ReporteComponent,
    InformacionComponent,
    ContactoComponent,
  ],
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
