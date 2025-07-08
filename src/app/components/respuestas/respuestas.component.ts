import { Component } from '@angular/core';
import { ListarRespuestasComponent } from "./listar-respuestas/listar-respuestas.component";
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-respuestas',
  imports: [ListarRespuestasComponent, RouterOutlet],
  templateUrl: './respuestas.component.html',
  styleUrl: './respuestas.component.css'
})
export class RespuestasComponent {
  constructor(public route:ActivatedRoute){}

}
