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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Roles } from '../../../models/roles';
import { Usuarios } from '../../../models/usuarios';
import { UsuariosService } from '../../../services/usuarios.service';
import { RolesService } from '../../../services/roles.service';
import {
  UserRoleService,
  AsignarRolesDTO,
  UsuarioConRolesDTO,
} from '../../../services/user-role.service';

@Component({
  selector: 'app-insertar-editar-roles',
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './insertar-editar-roles.component.html',
  styleUrl: './insertar-editar-roles.component.css',
})
export class InsertarEditarRolesComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  id: number = 0;
  edicion: boolean = false;

  listaUsuarios: Usuarios[] = [];
  listaRoles: Roles[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private uS: UsuariosService,
    private rS: RolesService,
    private userRoleService: UserRoleService,
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
      user: [{ value: '', disabled: false }, Validators.required],
      roles: [[], Validators.required],
    });

    // Cargar usuarios
    this.uS.list().subscribe((data) => {
      this.listaUsuarios = data;
    });

    // Cargar roles
    this.rS.list().subscribe((data) => {
      this.listaRoles = data;
    });
  }

  aceptar() {
    if (this.form.valid || (this.edicion && this.form.get('roles')?.valid)) {
      const dto: AsignarRolesDTO = {
        idUsuario: this.edicion ? this.id : this.form.value.user,
        roleIds: this.form.value.roles,
      };

      this.userRoleService.asignarRoles(dto).subscribe({
        next: (response) => {
          this.snackBar.open(response, 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });

          this.userRoleService
            .listarTodosUsuariosConRoles()
            .subscribe((data) => {
              this.userRoleService.setList(data);
            });

          this.router.navigate(['roles']);
        },
        error: (error) => {
          this.snackBar.open('Error al asignar roles', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          console.error('Error:', error);
        },
      });
    }
  }

  init() {
    if (this.edicion) {
      this.userRoleService
        .obtenerUsuarioConRoles(this.id)
        .subscribe((data: UsuarioConRolesDTO) => {
          this.form = new FormGroup({
            user: new FormControl({ value: data.idUsuario, disabled: true }),
            roles: new FormControl(data.roleIds),
          });
        });
    }
  }

  cargarRolesDelUsuario(userId: number) {
    this.userRoleService.obtenerUsuarioConRoles(userId).subscribe({
      next: (data: UsuarioConRolesDTO) => {
        this.form.get('roles')?.setValue(data.roleIds);
      },
      error: (error) => {
        console.error('Error al cargar roles del usuario:', error);
        this.snackBar.open('Error al cargar los roles del usuario', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        this.form.get('roles')?.setValue([]);
      },
    });
  }

  onUserChange(event: any) {
    const userId = event.value;
    if (userId && !this.edicion) {
      this.cargarRolesDelUsuario(userId);
    } else if (!userId) {
      this.form.get('roles')?.setValue([]);
    }
  }

  cancelar() {
    this.router.navigate(['roles']);
  }

  formatRole(rol: string): string {
    switch (rol) {
      case 'ROLE_ADMIN':
        return 'Administrador';
      case 'ROLE_TESTER':
        return 'Tester';
      case 'ROLE_USER':
        return 'Usuario';
      default:
        return rol;
    }
  }

  get isFormValid(): boolean {
    if (this.edicion) {
      return this.form.get('roles')?.valid || false;
    }
    return this.form.valid;
  }
}
