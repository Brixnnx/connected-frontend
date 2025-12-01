import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { ConexionService } from '../../services/conexion.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';
import { Conexion } from '../../models/conexion.model';

@Component({
  selector: 'app-my-network',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderComponent, 
    SidebarComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './my-network.component.html',
  styleUrl: './my-network.component.css'
})
export class MyNetworkComponent implements OnInit {
  activeTab: 'contactos' | 'recibidas' | 'enviadas' | 'sugerencias' = 'contactos';

  contactos: Usuario[] = [];
  solicitudesRecibidas: Conexion[] = [];
  solicitudesEnviadas: Conexion[] = [];
  sugerencias: Usuario[] = [];

  currentUserId: number | null = null;
  loading = true;
  showNotification = false;
  notificationMessage = '';

  constructor(
    private conexionService: ConexionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user?.idUsuario) {
        this.currentUserId = user.idUsuario;
        this.loadData();
      }
    });
  }

  loadData() {
    if (!this.currentUserId) return;

    this.loading = true;

    // Load all data
    this.conexionService.getContactos(this.currentUserId).subscribe({
      next: (data) => {
        this.contactos = data;
      },
      error: (err) => console.error('Error loading contacts:', err)
    });

    this.conexionService.getSolicitudesRecibidas(this.currentUserId).subscribe({
      next: (data) => {
        this.solicitudesRecibidas = data;
      },
      error: (err) => console.error('Error loading received requests:', err)
    });

    this.conexionService.getSolicitudesEnviadas(this.currentUserId).subscribe({
      next: (data) => {
        this.solicitudesEnviadas = data;
      },
      error: (err) => console.error('Error loading sent requests:', err)
    });

    this.conexionService.getSugerencias(this.currentUserId).subscribe({
      next: (data) => {
        this.sugerencias = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading suggestions:', err);
        this.loading = false;
      }
    });
  }

  setActiveTab(tab: 'contactos' | 'recibidas' | 'enviadas' | 'sugerencias') {
    this.activeTab = tab;
  }

  aceptarSolicitud(conexionId: number) {
    const solicitud = this.solicitudesRecibidas.find(s => s.idConexion === conexionId);
    const nombreSolicitante = solicitud ? `${solicitud.solicitante.primerNombre} ${solicitud.solicitante.primerApellido}` : 'Usuario';
    
    this.conexionService.aceptarSolicitud(conexionId).subscribe({
      next: () => {
        this.showNotificationMessage(`¡Solicitud de ${nombreSolicitante} aceptada! Ahora están conectados.`);
        this.loadData();
      },
      error: (err) => console.error('Error accepting request:', err)
    });
  }

  showNotificationMessage(message: string) {
    this.notificationMessage = message;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 5000);
  }

  verPerfil(usuarioId: number) {
    this.router.navigate(['/user-profile', usuarioId]);
  }

  rechazarSolicitud(conexionId: number) {
    this.conexionService.rechazarSolicitud(conexionId).subscribe({
      next: () => {
        this.solicitudesRecibidas = this.solicitudesRecibidas.filter(s => s.idConexion !== conexionId);
      },
      error: (err) => console.error('Error rejecting request:', err)
    });
  }

  enviarSolicitud(receptorId: number) {
    if (!this.currentUserId) return;

    const request = {
      solicitanteId: this.currentUserId,
      receptorId
    };

    this.conexionService.enviarSolicitud(request).subscribe({
      next: () => {
        this.sugerencias = this.sugerencias.filter(u => u.idUsuario !== receptorId);
        this.loadData();
      },
      error: (err) => console.error('Error sending request:', err)
    });
  }

  cancelarSolicitud(conexionId: number) {
    // Assuming we can delete a sent request
    this.conexionService.rechazarSolicitud(conexionId).subscribe({
      next: () => {
        this.solicitudesEnviadas = this.solicitudesEnviadas.filter(s => s.idConexion !== conexionId);
      },
      error: (err) => console.error('Error canceling request:', err)
    });
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
