import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Rutas } from '../models/rutas';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class RutasService {
  private url = `${base_url}/rutas`;
  private listaCambio = new Subject<Rutas[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Rutas[]>(`${this.url}/lista`);
  }

  insert(r: Rutas) {
    return this.http.post(`${this.url}/inserciones`, r, { responseType: 'text' });
  }

  getList() {
    // para actualizar automático (looks like)
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Rutas[]) {
    this.listaCambio.next(listaNueva);
  }

  listId(id: number) {
    return this.http.get<Rutas>(`${this.url}/${id}`);
  }

  update(r: Rutas) {
    return this.http.put(this.url, r, { responseType: 'text' });
  }

  deleteA(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}
