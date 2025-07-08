import { Component } from '@angular/core';
import { ListarIncidentesComponent } from './listar-incidentes/listar-incidentes.component';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-incidentes',
  imports: [ListarIncidentesComponent,RouterOutlet],
  templateUrl: './incidentes.component.html',
  styleUrl: './incidentes.component.css'
})
export class IncidentesComponent {
  constructor(public route:ActivatedRoute){}
}
