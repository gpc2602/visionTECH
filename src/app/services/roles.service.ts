import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Roles } from '../models/roles';
import { Subject } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private url = `${base_url}/roles`;
  private listaCambio = new Subject<Roles[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Roles[]>(`${this.url}/lista`);
  }

  insert(r: Roles) {
    return this.http.post(`${this.url}/inserciones`, r);
  }

  getList() {
    // para actualizar automático (looks like)
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Roles[]) {
    this.listaCambio.next(listaNueva);
  }

  listId(id: number) {
    return this.http.get<Roles>(`${this.url}/${id}`);
  }

  update(r: Roles) {
    return this.http.put(this.url, r);
  }

  deleteA(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
