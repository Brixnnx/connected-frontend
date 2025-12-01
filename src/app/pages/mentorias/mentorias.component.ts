import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { MentoriaService } from '../../services/mentoria.service';
import { AuthService } from '../../services/auth.service';
import { Mentor, SesionMentoria, SolicitarMentoriaRequest } from '../../models/mentoria.model';

@Component({
  selector: 'app-mentorias',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink, 
    HeaderComponent, 
    SidebarComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatSelectModule
  ],
  templateUrl: './mentorias.component.html',
  styleUrl: './mentorias.component.css'
})
export class MentoriasComponent implements OnInit {
  mentores: Mentor[] = [];
  misSesiones: SesionMentoria[] = [];
  activeTab: 'mentores' | 'sesiones' = 'mentores';
  showSolicitarModal = false;
  selectedMentor: Mentor | null = null;
  currentUserId: number | undefined;

  // Formulario de solicitud
  solicitudForm = {
    fechaInicio: '',
    canal: 'ZOOM',
    notas: ''
  };

  constructor(
    private mentoriaService: MentoriaService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.currentUserId = user?.idUsuario;

    this.loadMentores();

    if (this.currentUserId) {
      this.loadMisSesiones();
    }
  }

  loadMentores() {
    this.mentoriaService.getMentores().subscribe({
      next: (mentores) => {
        this.mentores = mentores;
      },
      error: (error) => {
        console.error('Error al cargar mentores:', error);
        // Si el endpoint no existe, usar datos mock temporalmente
        this.useMockMentores();
      }
    });
  }

  loadMisSesiones() {
    if (!this.currentUserId) return;

    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    this.mentoriaService.listarSesiones(this.currentUserId, today).subscribe({
      next: (sesiones) => {
        this.misSesiones = sesiones;
      },
      error: (error) => {
        console.error('Error al cargar sesiones:', error);
      }
    });
  }

  abrirModalSolicitud(mentor: Mentor) {
    this.selectedMentor = mentor;
    this.showSolicitarModal = true;
    this.resetSolicitudForm();
  }

  cerrarModalSolicitud() {
    this.showSolicitarModal = false;
    this.selectedMentor = null;
    this.resetSolicitudForm();
  }

  solicitarMentoria() {
    if (!this.currentUserId || !this.selectedMentor?.idMentor) {
      alert('Error: Usuario o mentor no válido');
      return;
    }

    if (!this.solicitudForm.fechaInicio || !this.solicitudForm.notas) {
      alert('Por favor completa todos los campos');
      return;
    }

    const request: SolicitarMentoriaRequest = {
      idUsuario: this.currentUserId,
      idMentor: this.selectedMentor.idMentor,
      fechaInicio: this.solicitudForm.fechaInicio,
      canal: this.solicitudForm.canal,
      estado: 'PENDIENTE',
      notas: this.solicitudForm.notas
    };

    console.log('Enviando request:', request);

    this.mentoriaService.crearSesion(request).subscribe({
      next: (sesion) => {
        alert('¡Sesión de mentoría solicitada exitosamente!');
        this.cerrarModalSolicitud();
        this.loadMisSesiones();
      },
      error: (error) => {
        console.error('Error al solicitar mentoría:', error);
        alert('Error al solicitar mentoría. Por favor intenta nuevamente.');
      }
    });
  }

  cancelarSesion(sesion: SesionMentoria) {
    if (!sesion.idSesionMentoria) return;

    if (confirm('¿Estás seguro de cancelar esta sesión?')) {
      this.mentoriaService.cancelarSesion(sesion.idSesionMentoria).subscribe({
        next: () => {
          alert('Sesión cancelada exitosamente');
          this.loadMisSesiones();
        },
        error: (error) => {
          console.error('Error al cancelar sesión:', error);
          alert('Error al cancelar sesión');
        }
      });
    }
  }

  private resetSolicitudForm() {
    this.solicitudForm = {
      fechaInicio: '',
      canal: 'ZOOM',
      notas: ''
    };
  }

  private useMockMentores() {
    // Datos mock temporales mientras se implementa el endpoint
    console.warn('Usando datos mock para mentores');
    // Los datos mock se pueden mantener vacíos para forzar la implementación del backend
  }

  getRatingStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('⭐');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }

    return stars;
  }

  getEstadoClass(estado: string): string {
    const classes: { [key: string]: string } = {
      'AGENDADA': 'badge-info',
      'COMPLETADA': 'badge-success',
      'CANCELADA': 'badge-danger'
    };
    return classes[estado] || 'badge-secondary';
  }
}
