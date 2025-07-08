import { Rutas } from './rutas';

export class CAtmosfericas {
  idCondicionAtmosferica: number = 0;
  humedad: number = 0;
  temperatura: number = 0;
  velocidadViento: number = 0;
  fechaHora: Date = new Date();
  ruta: Rutas = new Rutas();
}
