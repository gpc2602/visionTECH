import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Rutas } from '../../../models/rutas';
import { Incidente } from '../../../models/incidentes';
import { IncidentesService } from '../../../services/incidentes.service';
import { RutasService } from '../../../services/rutas.service';

@Component({
  selector: 'app-insertar-editar-incidentes',
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './insertar-editar-incidentes.component.html',
  styleUrl: './insertar-editar-incidentes.component.css',
})
export class InsertarEditarIncidentesComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  incidente: Incidente = new Incidente();

  id: number = 0;
  edicion: boolean = false;
  enviando: boolean = false;

  listaRutas: Rutas[] = [];

  pcTipos: { value: string; viewValue: string }[] = [
    { value: 'alta', viewValue: 'Alta' },
    { value: 'media', viewValue: 'Media' },
    { value: 'baja', viewValue: 'Baja' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private incidentesService: IncidentesService,
    private router: Router,
    private rutasService: RutasService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      codigo: [''],
      descripcion: ['', Validators.required],
      gravedad: ['', Validators.required],
      tipo: ['', Validators.required],
      ruta: ['', Validators.required],
    });

    this.rutasService.list().subscribe((data) => {
      this.listaRutas = data;
    });
  }

  aceptar() {
    if (this.form.valid && !this.enviando) {
      this.enviando = true;
      
      const incidenteData = new Incidente();
      
      incidenteData.idIncidente = this.form.value.codigo;
      incidenteData.descripcion = this.form.value.descripcion;
      incidenteData.gravedad = this.form.value.gravedad;
      incidenteData.tipo = this.form.value.tipo;
      incidenteData.ruta.idRuta = this.form.value.ruta;

      if (this.edicion) {
        incidenteData.idIncidente = this.id;
        this.incidentesService.update(incidenteData).subscribe({
          next: () => {
            this.incidentesService.list().subscribe((data: Incidente[]) => {
              this.incidentesService.setList(data);
            });
            this.router.navigate(['incidentes']);
            this.snackBar.open('Se actualizó correctamente el incidente', 'OK', {
              duration: 5000,
            });
          },
          error: (err) => {
            console.error('Error al actualizar:', err);
            this.snackBar.open('Error al actualizar el incidente', 'OK', {
              duration: 5000,
            });
            this.enviando = false;
          }
        });
      } else {
        incidenteData.idIncidente = 0;
        this.incidentesService.insert(incidenteData).subscribe({
          next: () => {
            this.incidentesService.list().subscribe((data: Incidente[]) => {
              this.incidentesService.setList(data);
            });
            this.router.navigate(['incidentes']);
            this.snackBar.open('Se registró correctamente el incidente', 'OK', {
              duration: 5000,
            });
          },
          error: (err) => {
            console.error('Error al insertar:', err);
            this.snackBar.open('Error al registrar el incidente', 'OK', {
              duration: 5000,
            });
            this.enviando = false;
          }
        });
      }
    }
  }

  init() {
    if (this.edicion) {
      this.incidentesService.listId(this.id).subscribe((data: Incidente) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idIncidente),
          descripcion: new FormControl(data.descripcion),
          gravedad: new FormControl(data.gravedad),
          tipo: new FormControl(data.tipo),
          ruta: new FormControl(data.ruta.idRuta),
        });
      });
    }
  }

  cancelar() {
    // Redirigir sin guardar
    this.router.navigate(['incidentes']);
  }
}
