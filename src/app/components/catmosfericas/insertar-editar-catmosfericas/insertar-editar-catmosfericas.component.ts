import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
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
import { CAtmosfericas } from '../../../models/catmosfericas';
import { Rutas } from '../../../models/rutas';
import { CatmosfericasService } from '../../../services/catmosfericas.service';
import { RutasService } from '../../../services/rutas.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-insertar-editar-catmosfericas',
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
  templateUrl: './insertar-editar-catmosfericas.component.html',
  styleUrl: './insertar-editar-catmosfericas.component.css',
})
export class InsertarEditarCatmosfericasComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  ver: CAtmosfericas = new CAtmosfericas();
  estado: boolean = true;

  id: number = 0;
  edicion: boolean = false;

  listaRutas: Rutas[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private caS: CatmosfericasService,
    private router: Router,
    private rS: RutasService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      //actualizar
      this.init();
    });

    this.form = this.formBuilder.group({
      codigo: [''],
      humedad: ['', Validators.required],
      temperatura: ['', Validators.required],
      velocidadViento: ['', Validators.required],
      fecha: ['', Validators.required],
      ruta: ['', Validators.required],
    });
    this.rS.list().subscribe((data) => {
      this.listaRutas = data;
    });
  }

  aceptar() {
    if (this.form.valid) {
      this.ver.idCondicionAtmosferica = this.form.value.codigo;
      this.ver.humedad = this.form.value.humedad;
      this.ver.temperatura = this.form.value.temperatura;
      this.ver.velocidadViento = this.form.value.velocidadViento;
      this.ver.fechaHora = this.form.value.fecha;
      this.ver.ruta.idRuta = this.form.value.ruta;
      if (this.edicion) {
        //actualziar
        this.caS.update(this.ver).subscribe(() => {
          this.caS.list().subscribe((data) => {
            this.caS.setList(data);
          });
        });
      } else {
        //insertar
        this.caS.insert(this.ver).subscribe(() => {
          this.caS.list().subscribe((data) => {
            this.caS.setList(data);
          });
        });
      }
      this.router.navigate(['catmosferica']);
    }
  }

  init() {
    if (this.edicion) {
      this.caS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idCondicionAtmosferica),
          humedad: new FormControl(data.humedad),
          temperatura: new FormControl(data.temperatura),
          velocidadViento: new FormControl(data.velocidadViento),
          fecha: new FormControl(data.fechaHora),
          ruta: new FormControl(data.ruta.idRuta),
        });
      });
    }
  }
}
