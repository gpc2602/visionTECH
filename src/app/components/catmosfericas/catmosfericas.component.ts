import { ListarCatmosfericasComponent } from './listar-catmosfericas/listar-catmosfericas.component';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-catmosfericas',
  imports: [ListarCatmosfericasComponent,RouterOutlet],
  templateUrl: './catmosfericas.component.html',
  styleUrl: './catmosfericas.component.css'
})

export class CatmosfericasComponent {
 constructor(public route:ActivatedRoute){}
}
