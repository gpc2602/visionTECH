import { Usuarios } from './usuarios';

export class NumeroEmergencia {
  idNumeroEmergencia: number = 0;
  tipoEmergencia: string = '';
  distrito: string = '';
  usuario: Usuarios = new Usuarios();
}
