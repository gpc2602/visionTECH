import { Component, OnInit } from '@angular/core';
import { Temaforo } from '../../../models/temasforo';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TemasforoService } from '../../../services/temasforo.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-insertar-editar-temasforo',
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './insertar-editar-temasforo.component.html',
  styleUrl: './insertar-editar-temasforo.component.css',
})
export class InsertarEditarTemasforoComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  tema: Temaforo = new Temaforo();
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private mS: TemasforoService,
    private router: Router,
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
      tituloTema: ['', [Validators.required, Validators.minLength(5)]],
      comentario: ['', [Validators.required, Validators.minLength(10)]],
      estadoCerrado: [false],
    });
  }

  aceptar() {
    if (this.form.valid) {
      this.tema.tituloTema = this.form.value.tituloTema;
      this.tema.comentario = this.form.value.comentario;
      this.tema.estadoCerrado = this.form.value.estadoCerrado || false;
      this.tema.fechaCreacion = new Date();
      this.tema.usuario.idUsuario = 1;

      if (this.edicion) {
        this.tema.idTema = this.id;
        this.mS.update(this.tema).subscribe({
          next: () => {
            this.router.navigate(['temaforo']);
            this.snackBar.open('Tema actualizado correctamente', 'OK', {
              duration: 3000,
            });
            setTimeout(() => {
              this.mS.list().subscribe((data) => {
                this.mS.setList(data);
              });
            }, 100);
          },
          error: (error) => {
            this.snackBar.open('Error al actualizar tema', 'OK', {
              duration: 3000,
            });
            console.error('Error:', error);
          },
        });
      } else {
        this.mS.insert(this.tema).subscribe({
          next: () => {
            this.router.navigate(['temaforo']);
            this.snackBar.open('Tema creado correctamente', 'OK', {
              duration: 3000,
            });
            setTimeout(() => {
              this.mS.list().subscribe((data) => {
                this.mS.setList(data);
              });
            }, 100);
          },
          error: (error) => {
            this.snackBar.open('Error al crear tema', 'OK', { duration: 3000 });
            console.error('Error:', error);
          },
        });
      }
    } else {
      this.snackBar.open(
        'Por favor complete todos los campos requeridos',
        'OK',
        { duration: 3000 }
      );
    }
  }

  init() {
    if (this.edicion) {
      this.mS.listId(this.id).subscribe({
        next: (data) => {
          this.tema = data;
          this.form = new FormGroup({
            tituloTema: new FormControl(data.tituloTema),
            comentario: new FormControl(data.comentario),
            estadoCerrado: new FormControl(data.estadoCerrado),
          });
        },
        error: (error) => {
          console.error('Error al cargar tema:', error);
          this.router.navigate(['temaforo']);
        },
      });
    }
  }

  cancelar() {
    this.router.navigate(['temaforo']);
  }
}
