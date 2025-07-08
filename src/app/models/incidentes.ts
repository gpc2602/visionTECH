import { Rutas } from './rutas';

export class Incidente {
  idIncidente: number = 0;
  tipo: string = '';
  gravedad: string = '';
  descripcion: string = '';
  ruta: Rutas = new Rutas();
}
