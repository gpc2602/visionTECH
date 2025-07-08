import { CAtmosfericas } from './../models/catmosfericas';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class CatmosfericasService {
  private url = `${base_url}/catmosferica`;
  private listaCambio = new Subject<CAtmosfericas[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<CAtmosfericas[]>(`${this.url}/lista`);
  }

  insert(ca: CAtmosfericas) {
    return this.http.post(`${this.url}/inserciones`, ca);
  }

  getList() {
    // para actualizar automático (looks like)
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: CAtmosfericas[]) {
    this.listaCambio.next(listaNueva);
  }

  listId(id: number) {
    return this.http.get<CAtmosfericas>(`${this.url}/${id}`);
  }

  update(ca: CAtmosfericas) {
    return this.http.put(this.url, ca);
  }

  deleteA(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
