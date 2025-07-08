import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Temaforo } from '../models/temasforo';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class TemasforoService {
  private listaCambio = new Subject<Temaforo[]>();
  private url = `${base_url}/temaforo`;
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Temaforo[]>(this.url);
  }

  insert(r: Temaforo) {
    return this.http.post(this.url, r);
  }

  getList() {
    // para actualizar automático (looks like)
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Temaforo[]) {
    this.listaCambio.next(listaNueva);
  }

  listId(id: number) {
    return this.http.get<Temaforo>(`${this.url}/${id}`);
  }
  update(r: Temaforo) {
    return this.http.put(this.url, r);
  }

  deleteA(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
