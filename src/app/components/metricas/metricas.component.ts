import { Component } from '@angular/core';
import { ListarMetricasComponent } from "./listar-metricas/listar-metricas.component";
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-metricas',
  imports: [RouterOutlet,ListarMetricasComponent],
  templateUrl: './metricas.component.html',
  styleUrl: './metricas.component.css'
})
export class MetricasComponent {
  constructor(public route:ActivatedRoute){}
}
