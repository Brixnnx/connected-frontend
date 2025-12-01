import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AuthService } from '../../services/auth.service';
import { PublicacionService } from '../../services/publicacion.service';
import { ConexionService } from '../../services/conexion.service';
import { PuntuacionService } from '../../services/puntuacion.service';
import { Usuario } from '../../models/usuario.model';
import { Publicacion } from '../../models/publicacion.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    ReactiveFormsModule, 
    HeaderComponent, 
    SidebarComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: Usuario | null = null;
  publicaciones: Publicacion[] = [];
  sugerencias: Usuario[] = [];
  puntos = 0;
  nivel = 1;
  loading = true;

  publicacionForm: FormGroup;
  showPublicacionInput = false;

  constructor(
    private authService: AuthService,
    private publicacionService: PublicacionService,
    private conexionService: ConexionService,
    private puntuacionService: PuntuacionService,
    private fb: FormBuilder
  ) {
    this.publicacionForm = this.fb.group({
      contenido: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit() {
    this.loadUserData();
    this.loadPublicaciones();
    this.loadSugerencias();
  }

  loadUserData() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user?.idUsuario) {
        this.loadPuntos(user.idUsuario);
      }
    });
  }

  loadPublicaciones() {
    this.publicacionService.getFeed().subscribe({
      next: (data) => {
        this.publicaciones = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading feed:', err);
        this.loading = false;
      }
    });
  }

  loadSugerencias() {
    if (this.currentUser?.idUsuario) {
      this.conexionService.getSugerencias(this.currentUser.idUsuario).subscribe({
        next: (data) => {
          this.sugerencias = data.slice(0, 5);
        },
        error: (err) => console.error('Error loading suggestions:', err)
      });
    }
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

  crearPublicacion() {
    console.log('crearPublicacion called');
    console.log('Form valid:', this.publicacionForm.valid);
    console.log('Form value:', this.publicacionForm.value);
    console.log('Current user:', this.currentUser);

    if (this.publicacionForm.invalid || !this.currentUser?.idUsuario) {
      console.log('Form invalid or no user ID - exiting');
      return;
    }

    const request = {
      autorId: this.currentUser.idUsuario,
      contenido: this.publicacionForm.get('contenido')?.value,
      imagen: null
    };

    console.log('Sending request:', request);

    this.publicacionService.crear(request).subscribe({
      next: (publicacion) => {
        console.log('Publication created:', publicacion);
        this.publicaciones.unshift(publicacion);
        this.publicacionForm.reset();
        this.showPublicacionInput = false;
      },
      error: (err) => console.error('Error creating publication:', err)
    });
  }

  agregarReaccion(publicacionId: number, tipo: string) {
    if (!this.currentUser?.idUsuario) return;

    const request = {
      publicacionId,
      usuarioId: this.currentUser.idUsuario,
      tipo
    };

    this.publicacionService.agregarReaccion(request).subscribe({
      next: () => {
        const pub = this.publicaciones.find(p => p.idPublicacion === publicacionId);
        if (pub && pub.reacciones) {
          const existing = pub.reacciones.find(r => r.usuario.idUsuario === this.currentUser?.idUsuario);
          if (existing) {
            existing.tipo = tipo;
          } else {
            pub.reacciones.push({
              idReaccion: Date.now(),
              idPublicacion: publicacionId,
              usuario: this.currentUser!,
              tipo,
              fechaReaccion: new Date()
            });
          }
        }
      },
      error: (err) => console.error('Error adding reaction:', err)
    });
  }

  enviarSolicitud(receptorId: number) {
    if (!this.currentUser?.idUsuario) return;

    const request = {
      solicitanteId: this.currentUser.idUsuario,
      receptorId
    };

    this.conexionService.enviarSolicitud(request).subscribe({
      next: () => {
        this.sugerencias = this.sugerencias.filter(u => u.idUsuario !== receptorId);
      },
      error: (err) => console.error('Error sending connection request:', err)
    });
  }

  getReactionCount(publicacion: Publicacion, tipo: string): number {
    return publicacion.reacciones?.filter(r => r.tipo === tipo).length || 0;
  }

  hasUserReacted(publicacion: Publicacion, tipo: string): boolean {
    return publicacion.reacciones?.some(r =>
      r.usuario.idUsuario === this.currentUser?.idUsuario && r.tipo === tipo
    ) || false;
  }

  formatDate(date: Date): string {
    const now = new Date();
    const pubDate = new Date(date);
    const diff = now.getTime() - pubDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Hace menos de 1 hora';
    if (hours < 24) return `Hace ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `Hace ${days}d`;
    return pubDate.toLocaleDateString();
  }
}
