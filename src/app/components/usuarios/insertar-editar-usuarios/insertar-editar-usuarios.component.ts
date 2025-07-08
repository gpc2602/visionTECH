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
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Usuarios } from '../../../models/usuarios';
import { UsuariosService } from '../../../services/usuarios.service';
import { LoginService } from '../../../services/login.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { JwtHelper } from '../../../utils/jwt-helper';

@Component({
  selector: 'app-insertar-editar-usuarios',
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './insertar-editar-usuarios.component.html',
  styleUrl: './insertar-editar-usuarios.component.css',
})
export class InsertarEditarUsuariosComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  ver: Usuarios = new Usuarios();
  estado: boolean = true;
  currentUsername: string = '';
  originalUsername: string = '';

  id: number = 0;
  edicion: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private uS: UsuariosService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getCurrentUsername();

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      codigo: [''],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: this.edicion
        ? ['']
        : ['', [Validators.required, Validators.minLength(6)]],
      enabled: [true, Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9,15}$/)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  getCurrentUsername(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JwtHelper.decodeToken(token);
      this.currentUsername = payload?.username || '';
    }
  }

  canEditUser(): boolean {
    const currentRoles = this.loginService.showAllRoles();
    const isAdmin = currentRoles.includes('ROLE_ADMIN');
    const isEditingSelf = this.originalUsername === this.currentUsername;

    return isAdmin || isEditingSelf;
  }

  aceptar() {
    if (this.form.valid) {
      if (this.edicion && !this.canEditUser()) {
        this.snackBar.open(
          'No tiene permisos para actualizar este usuario',
          'Cerrar',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          }
        );
        return;
      }

      this.ver.idUsuario = this.form.value.codigo;
      this.ver.username = this.form.value.username;

      if (!this.edicion) {
        this.ver.password = this.form.value.password;
      }

      this.ver.enabled = this.form.value.enabled;
      this.ver.correoElectronico = this.form.value.correo;
      this.ver.telefono = this.form.value.telefono;
      this.ver.nombre = this.form.value.nombre;

      const usernameChanged =
        this.edicion &&
        this.originalUsername === this.currentUsername &&
        this.form.value.username !== this.originalUsername;

      if (this.edicion) {
        // Actualizar
        this.uS.update(this.ver).subscribe({
          next: () => {
            this.snackBar.open('Usuario actualizado correctamente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });

            this.uS.list().subscribe((data) => {
              this.uS.setList(data);
            });

            // Si cambió el username del usuario actual, cerrar sesión
            if (usernameChanged) {
              this.snackBar.open(
                'El nombre de usuario ha cambiado. Cerrando sesión...',
                'Cerrar',
                {
                  duration: 2000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                }
              );

              setTimeout(() => {
                this.loginService.logout();
                this.router.navigate(['/login']);
              }, 2000);
            } else {
              this.router.navigate(['usuarios']);
            }
          },
          error: (error) => {
            console.error('Error al actualizar usuario:', error);
            if (error.status === 401) {
              this.snackBar.open(
                'No tiene permisos para realizar esta acción',
                'Cerrar',
                {
                  duration: 3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                }
              );
            } else {
              this.snackBar.open(
                'Error al actualizar el usuario. Verifique los datos.',
                'Cerrar',
                {
                  duration: 3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                }
              );
            }
          },
        });
      } else {
        // Insertar
        this.uS.insert(this.ver).subscribe({
          next: () => {
            this.snackBar.open('Usuario registrado correctamente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            this.uS.list().subscribe((data) => {
              this.uS.setList(data);
            });
            this.router.navigate(['usuarios']);
          },
          error: (error) => {
            console.error('Error al insertar usuario:', error);
            this.snackBar.open(
              'Error al registrar el usuario. Verifique los datos.',
              'Cerrar',
              {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
              }
            );
          },
        });
      }
    } else {
      this.snackBar.open(
        'Por favor, complete todos los campos requeridos correctamente.',
        'Cerrar',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        }
      );
    }
  }

  cancelar() {
    this.router.navigate(['usuarios']);
  }

  init() {
    if (this.edicion) {
      this.uS.listId(this.id).subscribe({
        next: (data) => {
          this.originalUsername = data.username;

          this.form = this.formBuilder.group({
            codigo: [data.idUsuario],
            username: [
              data.username,
              [Validators.required, Validators.minLength(3)],
            ],
            password: [''],
            enabled: [data.enabled, Validators.required],
            correo: [
              data.correoElectronico,
              [Validators.required, Validators.email],
            ],
            telefono: [
              data.telefono,
              [Validators.required, Validators.pattern(/^\d{9,15}$/)],
            ],
            nombre: [
              data.nombre,
              [Validators.required, Validators.minLength(2)],
            ],
          });
          this.estado = data.enabled;
        },
        error: (error) => {
          console.error('Error al cargar datos del usuario:', error);
          this.snackBar.open(
            'Error al cargar los datos del usuario.',
            'Cerrar',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            }
          );
          this.router.navigate(['usuarios']);
        },
      });
    }
  }
}
