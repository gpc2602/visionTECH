import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Respuesta } from '../models/respuestas';

const base_url = environment.base;
@Injectable({
  providedIn: 'root',
})
export class RespuestasService {
  private listaCambio = new Subject<Respuesta[]>();
  private url = `${base_url}/respuesta`;
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Respuesta[]>(this.url);
  }

  insert(r: Respuesta) {
    return this.http.post(this.url, r);
  }

  getList() {
    // para actualizar automático (looks like)
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Respuesta[]) {
    this.listaCambio.next(listaNueva);
  }

  listId(id: number) {
    return this.http.get<Respuesta>(`${this.url}/${id}`);
  }

  update(r: Respuesta) {
    return this.http.put(this.url, r);
  }

  deleteA(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
