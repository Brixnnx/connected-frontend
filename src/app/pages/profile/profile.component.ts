import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { PublicacionService } from '../../services/publicacion.service';
import { PuntuacionService } from '../../services/puntuacion.service';
import { Usuario } from '../../models/usuario.model';
import { Publicacion } from '../../models/publicacion.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    HeaderComponent, 
    SidebarComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatDialogModule,
    MatSelectModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  currentUser: Usuario | null = null;
  publicaciones: Publicacion[] = [];
  puntos = 0;
  nivel = 1;
  activeTab: 'actividad' | 'sobre' = 'actividad';
  showEditModal = false;

  editForm: FormGroup;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private publicacionService: PublicacionService,
    private puntuacionService: PuntuacionService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      primerNombre: ['', Validators.required],
      primerApellido: ['', Validators.required],
      ciudad: ['', Validators.required],
      pais: ['', Validators.required],
      descripcion: ['']
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user?.idUsuario) {
        this.loadPublicaciones(user.idUsuario);
        this.loadPuntos(user.idUsuario);
        this.editForm.patchValue({
          primerNombre: user.primerNombre,
          primerApellido: user.primerApellido,
          ciudad: user.ciudad,
          pais: user.pais,
          descripcion: user.descripcion || ''
        });
      }
    });
  }

  loadPublicaciones(usuarioId: number) {
    this.publicacionService.getPorAutor(usuarioId).subscribe({
      next: (data) => {
        this.publicaciones = data;
      },
      error: (err) => console.error('Error loading publications:', err)
    });
  }

  loadPuntos(usuarioId: number) {
    this.puntuacionService.getPuntosPorUsuario(usuarioId).subscribe({
      next: (puntuaciones) => {
        this.puntos = puntuaciones.reduce((sum, p) => sum + p.puntos, 0);
        this.nivel = Math.floor(this.puntos / 100) + 1;
      },
      error: (err) => console.error('Error loading points:', err)
    });
  }

  openEditModal() {
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  saveProfile() {
    if (this.editForm.invalid || !this.currentUser?.idUsuario) return;

    const updatedData = {
      ...this.currentUser,
      ...this.editForm.value
    };

    this.usuarioService.actualizar(this.currentUser.idUsuario, updatedData).subscribe({
      next: () => {
        this.authService.loadCurrentUser();
        this.closeEditModal();
      },
      error: (err) => console.error('Error updating profile:', err)
    });
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
