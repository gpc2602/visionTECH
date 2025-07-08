import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

const base_url = environment.base;

export interface AsignarRolesDTO {
  idUsuario: number;
  roleIds: number[];
}

export interface UsuarioConRolesDTO {
  idUsuario: number;
  username: string;
  nombre: string;
  correoElectronico: string;
  telefono: number;
  roleIds: number[];
  roleNames: string[];
}

@Injectable({
  providedIn: 'root',
})
export class UserRoleService {
  private url = `${base_url}/usuario-roles`;
  private listaCambio = new Subject<UsuarioConRolesDTO[]>();

  constructor(private http: HttpClient) {}

  obtenerUsuarioConRoles(id: number): Observable<UsuarioConRolesDTO> {
    return this.http.get<UsuarioConRolesDTO>(`${this.url}/usuario/${id}`);
  }

  asignarRoles(dto: AsignarRolesDTO): Observable<string> {
    return this.http.post(`${this.url}/asignar`, dto, { responseType: 'text' });
  }

  listarTodosUsuariosConRoles(): Observable<UsuarioConRolesDTO[]> {
    return this.http.get<UsuarioConRolesDTO[]>(`${this.url}/todos-usuarios-roles`);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: UsuarioConRolesDTO[]) {
    this.listaCambio.next(listaNueva);
  }
}
