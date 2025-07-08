import { Component } from '@angular/core';
import { ListarContactosEmergenciaComponent } from './listar-contactos-emergencia/listar-contactos-emergencia.component';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-contacto-emergencia',
  imports: [ListarContactosEmergenciaComponent, RouterOutlet],
  templateUrl: './contacto-emergencia.component.html',
  styleUrl: './contacto-emergencia.component.css',
})
export class ContactoEmergenciaComponent {
  constructor(public route: ActivatedRoute) {}
}
