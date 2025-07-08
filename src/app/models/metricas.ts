import { Rutas } from './rutas';

export class Metricas {
  idMetrica: number = 0;
  numeroPasos: number = 0;
  caloriasQuemadas: number = 0;
  tiempoEfectivoMinutos: number = 0;
  fecha: Date = new Date();
  ruta: Rutas = new Rutas();
}
