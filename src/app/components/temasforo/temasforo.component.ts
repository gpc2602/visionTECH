import { Component } from '@angular/core';
import { ListarTemasforoComponent } from "./listar-temasforo/listar-temasforo.component";
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-temasforo',
  imports: [ListarTemasforoComponent, RouterOutlet],
  templateUrl: './temasforo.component.html',
  styleUrl: './temasforo.component.css'
})
export class TemasforoComponent {
  constructor(public route:ActivatedRoute){}

}
