import { Component, Input } from '@angular/core';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
  exact?: boolean;
}

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  @Input() backendMessage = 'Verificando conexión...';
  @Input() backendOnline: boolean | null = null;
  @Input() connectionLabel = '';

  readonly menuItems: MenuItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: '▦', exact: true },
    { path: '/gastos', label: 'Gastos', icon: '▤' },
    { path: '/usuarios', label: 'Usuarios', icon: '👥' },
    { path: '/reporte', label: 'Reporte', icon: '▥' },
    { path: '/informacion', label: 'Información', icon: 'ⓘ' },
    { path: '/contacto', label: 'Contacto', icon: '✉' },
  ];
}
