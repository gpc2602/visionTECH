import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Usuarios } from '../models/usuarios';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private listaCambio = new Subject<Usuarios[]>();
  private url = `${base_url}/usuarios`;
  
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Usuarios[]>(`${this.url}/lista`);
  }

  insert(u: Usuarios) {
    const userDTO = {
      idUsuario: u.idUsuario,
      username: u.username,
      password: u.password,
      enabled: u.enabled,
      correoElectronico: u.correoElectronico,
      telefono: u.telefono,
      nombre: u.nombre,
      rol: [],
    };

    return this.http.post(`${this.url}/inserciones`, userDTO, {
      responseType: 'text',
    });
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Usuarios[]) {
    this.listaCambio.next(listaNueva);
  }

  listId(id: number) {
    return this.http.get<Usuarios>(`${this.url}/${id}`);
  }

  update(u: Usuarios) {
    const userDTO = {
      idUsuario: u.idUsuario,
      username: u.username,
      enabled: u.enabled,
      correoElectronico: u.correoElectronico,
      telefono: u.telefono,
      nombre: u.nombre,
      rol: [],
    };

    return this.http.put(this.url, userDTO, { responseType: 'text' });
  }

  deleteA(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}
