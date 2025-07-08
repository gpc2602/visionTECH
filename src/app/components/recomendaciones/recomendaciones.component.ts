import { Component } from '@angular/core';
import { ListarRecomendacionesComponent } from './listar-recomendaciones/listar-recomendaciones.component';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-recomendaciones',
  imports: [RouterOutlet,ListarRecomendacionesComponent],
  templateUrl: './recomendaciones.component.html',
  styleUrl: './recomendaciones.component.css'
})
export class RecomendacionesComponent {
  constructor(public route:ActivatedRoute){}
}
