import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Respuesta } from '../../../models/respuestas';
import { Temaforo } from '../../../models/temasforo';
import { RespuestasService } from '../../../services/respuestas.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TemasforoService } from '../../../services/temasforo.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-insertar-editar-respuestas',
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
  templateUrl: './insertar-editar-respuestas.component.html',
  styleUrl: './insertar-editar-respuestas.component.css',
})
export class InsertarEditarRespuestasComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  respuesta: Respuesta = new Respuesta();

  id: number = 0;
  edicion: boolean = false;

  listaTemasForo: Temaforo[] = [];

  validacionFecha(control: AbstractControl) {
    let fechaSeleccionada = control.value;
    if (!fechaSeleccionada) return null;
    let fechaActual = new Date();
    return fechaSeleccionada > fechaActual ? { fechaInvalida: true } : null;
  }

  constructor(
    private formBuilder: FormBuilder,
    private respuestasService: RespuestasService,
    private router: Router,
    private temasforoService: TemasforoService,
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
      respuesta: ['', Validators.required],
      fechaRespuesta: ['', [Validators.required, this.validacionFecha]],
      idTema: ['', Validators.required],
    });

    this.temasforoService.list().subscribe((data) => {
      this.listaTemasForo = data;
    });
  }

  aceptar() {
    if (this.form.valid) {
      this.respuesta.idRespuesta = this.form.value.codigo;
      this.respuesta.respuesta = this.form.value.respuesta;
      this.respuesta.fechaRespuesta = this.form.value.fechaRespuesta;
      this.respuesta.temaForo.idTema = this.form.value.idTema;

      if (this.edicion) {
        this.respuestasService.update(this.respuesta).subscribe(() => {
          this.respuestasService.list().subscribe((data) => {
            this.respuestasService.setList(data);
          });
          this.router.navigate(['respuesta']);
          this.snackBar.open('Se actualizó correctamente la respuesta', 'OK', {
            duration: 5000,
          });
        });
      } else {
        this.respuestasService.insert(this.respuesta).subscribe(() => {
          this.respuestasService.list().subscribe((data) => {
            this.respuestasService.setList(data);
          });
          this.router.navigate(['respuesta']);
          this.snackBar.open('Se registró correctamente la respuesta', 'OK', {
            duration: 5000,
          });
        });
      }
    }
  }

  init() {
    if (this.edicion) {
      this.respuestasService.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idRespuesta),
          respuesta: new FormControl(data.respuesta),
          fechaRespuesta: new FormControl(data.fechaRespuesta),
          idTema: new FormControl(data.temaForo.idTema),
        });
      });
    }
  }

  cancelar() {
    this.router.navigate(['respuesta']);
  }
}
