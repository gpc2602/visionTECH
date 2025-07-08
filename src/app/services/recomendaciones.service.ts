import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Subject } from 'rxjs';
import { Recomendaciones } from '../models/recomendaciones';
import { RecomendacionDTO } from '../models/recomendacionDTO';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class RecomendacionesService {
  private listaCambio = new Subject<Recomendaciones[]>();
  private url = `${base_url}/recomendaciones`;
  
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<RecomendacionDTO[]>(`${this.url}/lista`).pipe(
      map((dtos: RecomendacionDTO[]) => 
        dtos.map(dto => this.convertDTOToRecomendacion(dto))
      )
    );
  }

  insert(r: Recomendaciones) {
    const dto: RecomendacionDTO = this.convertRecomendacionToDTO(r);
    return this.http.post(`${this.url}/inserciones`, dto);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Recomendaciones[]) {
    this.listaCambio.next(listaNueva);
  }

  listId(id: number) {
    return this.http.get<RecomendacionDTO>(`${this.url}/${id}`).pipe(
      map(dto => this.convertDTOToRecomendacion(dto))
    );
  }

  update(r: Recomendaciones) {
    const dto: RecomendacionDTO = this.convertRecomendacionToDTO(r);
    return this.http.put(`${this.url}`, dto);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  private convertDTOToRecomendacion(dto: RecomendacionDTO): Recomendaciones {
    const recomendacion = new Recomendaciones();
    recomendacion.idRecomendacion = dto.idRecomendacion;
    recomendacion.comentario = dto.comentario;
    recomendacion.puntuacion = dto.puntuacion;
    recomendacion.ruta.idRuta = dto.idRuta;
    // El nombre de la ruta se cargará desde el componente
    return recomendacion;
  }

  private convertRecomendacionToDTO(recomendacion: Recomendaciones): RecomendacionDTO {
    const dto = new RecomendacionDTO();
    dto.idRecomendacion = recomendacion.idRecomendacion;
    dto.comentario = recomendacion.comentario;
    dto.puntuacion = recomendacion.puntuacion;
    dto.idRuta = recomendacion.ruta.idRuta;
    return dto;
  }
}
