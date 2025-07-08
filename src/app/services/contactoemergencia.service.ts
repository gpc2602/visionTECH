import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { CEmergencia } from '../models/contactoemergencia';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class ContactoemergenciaService {
  private listaCambio = new Subject<CEmergencia[]>();
  private url = `${base_url}/contactoemergencia`;
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<CEmergencia[]>(this.url);
  }

  getList() {
    // para actualizar automático (looks like)
    return this.listaCambio.asObservable();
  }

  deleteA(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  setList(listaNueva: CEmergencia[]) {
    this.listaCambio.next(listaNueva);
  }
}
