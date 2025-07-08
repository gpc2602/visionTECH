import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReporteGeneral } from '../models/reportes';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  private url = `${base_url}/reportes`;

  constructor(private http: HttpClient) {}

  getReporteGeneral(): Observable<ReporteGeneral> {
    return this.http.get<ReporteGeneral>(`${this.url}/general`);
  }
}
