export interface Usuario {
  _id?: string;
  id?: string;
  nombre: string;
  cedula: string;
  email: string;
  periodo: number;
  ingresos: number;
  gastos?: { tipo: string; monto: number }[];
  totalGastos?: number;
  baseImponible?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type UsuarioPayload = Pick<Usuario, 'nombre' | 'cedula' | 'email' | 'periodo' | 'ingresos'> & {
  gastos?: { tipo: string; monto: number }[];
};
