import { Usuarios } from './usuarios';

export class Temaforo {
  idTema: number = 0;
  tituloTema: string = '';
  comentario: string = '';
  fechaCreacion: Date = new Date();
  estadoCerrado: boolean = false;
  usuario: Usuarios = new Usuarios();
}
