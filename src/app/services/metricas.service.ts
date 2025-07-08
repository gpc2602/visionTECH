import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Metricas } from '../models/metricas';

const base_url = environment.base;
@Injectable({
  providedIn: 'root',
})
export class MetricasService {
  private url = `${base_url}/metricas`;
  private listaCambio = new Subject<Metricas[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Metricas[]>(`${this.url}/lista`);
  }

  insert(m: Metricas) {
    return this.http.post(`${this.url}/inserciones`, m);
  }

  getList() {
    // para actualizar automático (looks like)
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Metricas[]) {
    this.listaCambio.next(listaNueva);
  }

  listId(id: number) {
    return this.http.get<Metricas>(`${this.url}/${id}`);
  }

  update(m: Metricas) {
    return this.http.put(this.url, m);
  }

  deleteA(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
