import { Usuarios } from './usuarios';

export class Rutas {
  idRuta: number = 0;
  nombreRuta: string = '';
  destino: string = '';
  inicio: string = '';
  distanciaMetros: number = 0;
  favorito: boolean = false;
  tiempoRuta: number = 0;
  longitud: number = 0;
  latitud: number = 0;
  usuario: Usuarios = new Usuarios();
}
