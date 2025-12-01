import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { PuntuacionService } from '../../services/puntuacion.service';
import { AuthService } from '../../services/auth.service';
import { Puntuacion } from '../../models/puntuacion.model';

@Component({
  selector: 'app-gamification',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './gamification.component.html',
  styleUrl: './gamification.component.css'
})
export class GamificationComponent implements OnInit {
  puntuaciones: Puntuacion[] = [];
  puntosTotal = 0;
  nivel = 1;
  progreso = 0;
  currentUserId: number | null = null;

  constructor(
    private puntuacionService: PuntuacionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user?.idUsuario) {
        this.currentUserId = user.idUsuario;
        this.loadPuntuaciones(user.idUsuario);
      }
    });
  }

  loadPuntuaciones(usuarioId: number) {
    this.puntuacionService.getPuntosPorUsuario(usuarioId).subscribe({
      next: (data) => {
        this.puntuaciones = data;
        this.puntosTotal = data.reduce((sum, p) => sum + p.puntos, 0);
        this.nivel = Math.floor(this.puntosTotal / 100) + 1;
        this.progreso = (this.puntosTotal % 100);
      },
      error: (err) => console.error('Error loading points:', err)
    });
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
