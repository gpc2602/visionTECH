import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RecomendacionesService } from '../../../services/recomendaciones.service';
import { RutasService } from '../../../services/rutas.service';
import { Recomendaciones } from '../../../models/recomendaciones';
import { Rutas } from '../../../models/rutas';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-insertar-editar-recomendaciones',
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
  templateUrl: './insertar-editar-recomendaciones.component.html',
  styleUrl: './insertar-editar-recomendaciones.component.css',
})
export class InsertarEditarRecomendacionesComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  recomendacion: Recomendaciones = new Recomendaciones();
  id: number = 0;
  edicion: boolean = false;
  listaRutas: Rutas[] = [];

  pcTiposPuntuacion: { value: number; viewValue: string }[] = [
    { value: 1, viewValue: '1 Estrella' },
    { value: 2, viewValue: '2 Estrellas' },
    { value: 3, viewValue: '3 Estrellas' },
    { value: 4, viewValue: '4 Estrellas' },
    { value: 5, viewValue: '5 Estrellas' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private recomendacionesService: RecomendacionesService,
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
      comentario: ['', Validators.required],
      puntuacion: ['', Validators.required],
      ruta: ['', Validators.required],
    });

    this.rutasService.list().subscribe((data: Rutas[]) => {
      this.listaRutas = data;
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.recomendacion.idRecomendacion = this.form.value.codigo || 0;
      this.recomendacion.comentario = this.form.value.comentario;
      this.recomendacion.puntuacion = this.form.value.puntuacion;
      this.recomendacion.ruta.idRuta = this.form.value.ruta;

      if (this.edicion) {
        this.recomendacionesService.update(this.recomendacion).subscribe({
          next: () => {
            this.recomendacionesService
              .list()
              .subscribe((data: Recomendaciones[]) => {
                this.recomendacionesService.setList(data);
              });
            this.snackBar.open(
              'Se actualizó correctamente la recomendación',
              'OK',
              { duration: 5000 }
            );
            this.router.navigate(['recomendaciones']);
          },
          error: (error) => {
            console.error('Error al actualizar:', error);
            this.snackBar.open('Error al actualizar la recomendación', 'OK', {
              duration: 5000,
            });
          },
        });
      } else {
        this.recomendacionesService.insert(this.recomendacion).subscribe({
          next: () => {
            this.recomendacionesService
              .list()
              .subscribe((data: Recomendaciones[]) => {
                this.recomendacionesService.setList(data);
              });
            this.snackBar.open(
              'Se registró correctamente la recomendación',
              'OK',
              { duration: 5000 }
            );
            this.router.navigate(['recomendaciones']);
          },
          error: (error) => {
            console.error('Error al insertar:', error);
            this.snackBar.open('Error al registrar la recomendación', 'OK', {
              duration: 5000,
            });
          },
        });
      }
    }
  }

  init(): void {
    if (this.edicion) {
      this.recomendacionesService
        .listId(this.id)
        .subscribe((data: Recomendaciones) => {
          this.form = new FormGroup({
            codigo: new FormControl(data.idRecomendacion),
            comentario: new FormControl(data.comentario),
            puntuacion: new FormControl(data.puntuacion),
            ruta: new FormControl(data.ruta.idRuta),
          });
        });
    }
  }

  cancelar(): void {
    this.router.navigate(['recomendaciones']);
  }
}
