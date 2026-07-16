export interface Gasto {
  _id?: string;
  id?: string;
  cedula: string;
  tipo: string;
  monto: number;
  montoMaximoDeducible: number;
  informacion: string;
  periodo: number;
  createdAt?: string;
  updatedAt?: string;
}

export type GastoPayload = Pick<Gasto, 'cedula' | 'tipo' | 'monto' | 'montoMaximoDeducible' | 'informacion' | 'periodo'>;
