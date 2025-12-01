import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { UsuarioService } from '../../services/usuario.service';
import { ConexionService } from '../../services/conexion.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, SidebarComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  searchQuery = '';
  usuarios: Usuario[] = [];
  isLoading = false;
  currentUserId: number | undefined;
  hasSearched = false;

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private conexionService: ConexionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.currentUserId = user?.idUsuario;

    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      if (this.searchQuery) {
        this.search();
      }
    });
  }

  search() {
    if (!this.searchQuery.trim()) return;

    this.isLoading = true;
    this.hasSearched = true;

    this.usuarioService.buscarUsuarios(this.searchQuery).subscribe({
      next: (usuarios) => {
        // Filtrar al usuario actual de los resultados
        this.usuarios = usuarios.filter(u => u.idUsuario !== this.currentUserId);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error en búsqueda:', error);
        this.isLoading = false;
      }
    });
  }

  enviarSolicitud(receptorId: number) {
    if (!this.currentUserId) {
      alert('Debes iniciar sesión para conectar');
      return;
    }

    this.conexionService.enviarSolicitud({
      solicitanteId: this.currentUserId,
      receptorId
    }).subscribe({
      next: () => {
        alert('Solicitud de conexión enviada exitosamente');
      },
      error: (error) => {
        console.error('Error al enviar solicitud:', error);
        alert('Error al enviar solicitud. Puede que ya exista una conexión.');
      }
    });
  }

  getAvatar(usuario: Usuario): string {
    return usuario.fotoPerfil || `https://i.pravatar.cc/150?u=${usuario.idUsuario}`;
  }

  getFullName(usuario: Usuario): string {
    return `${usuario.primerNombre} ${usuario.primerApellido}`;
  }

  getLocation(usuario: Usuario): string {
    const parts = [];
    if (usuario.ciudad) parts.push(usuario.ciudad);
    if (usuario.pais) parts.push(usuario.pais);
    return parts.join(', ') || 'Ubicación no especificada';
  }
}
