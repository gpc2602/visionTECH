import { Usuarios } from './usuarios';

export class CEmergencia {
  idContacto: number = 0;
  nombre: string = '';
  telefono: number = 0;
  correoElectronico: string = '';
  usuario: Usuarios = new Usuarios();
}
