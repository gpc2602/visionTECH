import { Subject } from 'rxjs';
import { Incidente } from './../models/incidentes';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class IncidentesService {
  private url = `${base_url}/incidentes`;
  private listaCambio = new Subject<Incidente[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Incidente[]>(`${this.url}/lista`);
  }

  insert(i: Incidente) {
    return this.http.post(`${this.url}/inserciones`, i);
  }

  getList() {
    // para actualizar automático (looks like)
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Incidente[]) {
    this.listaCambio.next(listaNueva);
  }

  listId(id: number) {
    return this.http.get<Incidente>(`${this.url}/${id}`);
  }

  update(i: Incidente) {
    return this.http.put(this.url, i);
  }

  deleteA(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
