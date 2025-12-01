import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { UsuarioService } from '../../services/usuario.service';
import { PublicacionService } from '../../services/publicacion.service';
import { ConexionService } from '../../services/conexion.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';
import { Publicacion } from '../../models/publicacion.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  usuario: Usuario | null = null;
  publicaciones: Publicacion[] = [];
  loading = true;
  userId: number | null = null;
  currentUserId: number | null = null;
  isOwnProfile = false;
  connectionStatus: 'none' | 'pending' | 'connected' = 'none';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
    private publicacionService: PublicacionService,
    private conexionService: ConexionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user?.idUsuario) {
        this.currentUserId = user.idUsuario;
      }
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.userId = +id;
        this.isOwnProfile = this.userId === this.currentUserId;
        this.loadUserProfile();
      }
    });
  }

  loadUserProfile() {
    if (!this.userId) return;

    this.loading = true;

    // Load user data
    this.usuarioService.getUsuario(this.userId).subscribe({
      next: (data) => {
        this.usuario = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
        this.loading = false;
      }
    });

    // Load user publications
    this.publicacionService.getPublicacionesByUsuario(this.userId).subscribe({
      next: (data) => {
        this.publicaciones = data;
      },
      error: (err) => console.error('Error loading publications:', err)
    });

    // Check connection status if not own profile
    if (!this.isOwnProfile && this.currentUserId) {
      this.checkConnectionStatus();
    }
  }

  checkConnectionStatus() {
    // Check if already connected or pending
    this.conexionService.getSolicitudesEnviadas(this.currentUserId!).subscribe({
      next: (enviadas) => {
        const pending = enviadas.find(c => c.receptor.idUsuario === this.userId);
        if (pending) {
          this.connectionStatus = 'pending';
          return;
        }

        this.conexionService.getContactos(this.currentUserId!).subscribe({
          next: (contactos) => {
            const connected = contactos.find(c => c.idUsuario === this.userId);
            this.connectionStatus = connected ? 'connected' : 'none';
          }
        });
      }
    });
  }

  enviarSolicitud() {
    if (!this.currentUserId || !this.userId) return;

    const request = {
      solicitanteId: this.currentUserId,
      receptorId: this.userId
    };

    this.conexionService.enviarSolicitud(request).subscribe({
      next: () => {
        this.connectionStatus = 'pending';
        alert('Solicitud de conexión enviada exitosamente');
      },
      error: (err) => console.error('Error sending connection request:', err)
    });
  }

  enviarMensaje() {
    this.router.navigate(['/messages'], { queryParams: { userId: this.userId } });
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
