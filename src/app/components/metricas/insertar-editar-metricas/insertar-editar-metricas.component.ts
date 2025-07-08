import { Component, OnInit } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { Metricas } from '../../../models/metricas';
import { Rutas } from '../../../models/rutas';
import { MetricasService } from '../../../services/metricas.service';
import { RutasService } from '../../../services/rutas.service';

@Component({
  selector: 'app-insertar-editar-metricas',
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
  templateUrl: './insertar-editar-metricas.component.html',
  styleUrl: './insertar-editar-metricas.component.css',
})
export class InsertarEditarMetricasComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  metrica: Metricas = new Metricas();

  id: number = 0;
  edicion: boolean = false;

  listaRutas: Rutas[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private metricasService: MetricasService,
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
      numeroPasos: ['', Validators.required],
      caloriasQuemadas: ['', Validators.required],
      tiempoEfectivoMinutos: ['', Validators.required],
      fecha: ['', Validators.required],
      idRuta: ['', Validators.required],
    });

    this.rutasService.list().subscribe((data) => {
      this.listaRutas = data;
    });
  }

  aceptar() {
    if (this.form.valid) {
      this.metrica.idMetrica = this.form.value.codigo;
      this.metrica.numeroPasos = this.form.value.numeroPasos;
      this.metrica.caloriasQuemadas = this.form.value.caloriasQuemadas;
      this.metrica.tiempoEfectivoMinutos =
        this.form.value.tiempoEfectivoMinutos;
      this.metrica.fecha = this.form.value.fecha;
      this.metrica.ruta.idRuta = this.form.value.idRuta;

      if (this.edicion) {
        this.metricasService.update(this.metrica).subscribe(() => {
          this.metricasService.list().subscribe((data) => {
            this.metricasService.setList(data);
          });
          this.router.navigate(['metricas']);
          this.snackBar.open('Se actualizó correctamente la métrica', 'OK', {
            duration: 5000,
          });
        });
      } else {
        this.metricasService.insert(this.metrica).subscribe(() => {
          this.metricasService.list().subscribe((data) => {
            this.metricasService.setList(data);
          });
          this.router.navigate(['metricas']);
          this.snackBar.open('Se registró correctamente la métrica', 'OK', {
            duration: 5000,
          });
        });
      }
    }
  }

  init() {
    if (this.edicion) {
      this.metricasService.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idMetrica),
          numeroPasos: new FormControl(data.numeroPasos),
          caloriasQuemadas: new FormControl(data.caloriasQuemadas),
          tiempoEfectivoMinutos: new FormControl(data.tiempoEfectivoMinutos),
          fecha: new FormControl(data.fecha),
          idRuta: new FormControl(data.ruta.idRuta),
        });
      });
    }
  }

  cancelar() {
    this.router.navigate(['metricas']);
  }
}
