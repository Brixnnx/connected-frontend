import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HeaderComponent, 
    SidebarComponent,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  currentUser: Usuario | null = null;
  formData: Partial<Usuario> = {};
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.formData = {
        primerNombre: this.currentUser.primerNombre,
        primerApellido: this.currentUser.primerApellido,
        email: this.currentUser.email,
        descripcion: this.currentUser.descripcion,
        ciudad: this.currentUser.ciudad,
        pais: this.currentUser.pais,
        fotoPerfil: this.currentUser.fotoPerfil
      };
    }
  }

  guardarCambios() {
    console.log('guardarCambios called');
    console.log('Current user:', this.currentUser);
    console.log('Form data:', this.formData);

    if (!this.currentUser?.idUsuario) {
      console.log('No user ID - exiting');
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    console.log('Sending update request...');

    this.usuarioService.actualizar(this.currentUser.idUsuario, this.formData).subscribe({
      next: (usuario) => {
        console.log('User updated successfully:', usuario);
        this.successMessage = '¡Configuración actualizada exitosamente!';
        this.authService.updateCurrentUser(usuario);
        this.isLoading = false;
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error al actualizar configuración:', error);
        this.errorMessage = 'Error al actualizar la configuración';
        this.isLoading = false;
      }
    });
  }

  cerrarSesion() {
    this.authService.logout();
  }
}
