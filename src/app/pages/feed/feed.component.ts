import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { PublicacionService } from '../../services/publicacion.service';
import { AuthService } from '../../services/auth.service';
import { Publicacion, PublicacionRequest, ComentarioRequest, ReaccionRequest } from '../../models/publicacion.model';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
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
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent implements OnInit {
  currentUser: Usuario | null = null;
  feed: Publicacion[] = [];
  newPostContent = '';
  isLoading = false;
  showComments: { [key: number]: boolean } = {};
  newComments: { [key: number]: string } = {};

  constructor(
    private publicacionService: PublicacionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadFeed();
  }

  loadFeed() {
    this.isLoading = true;
    this.publicacionService.getFeed().subscribe({
      next: (feed) => {
        this.feed = feed.sort((a, b) =>
          new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()
        );
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar feed:', error);
        this.isLoading = false;
      }
    });
  }

  crearPublicacion() {
    if (!this.newPostContent.trim() || !this.currentUser?.idUsuario) {
      return;
    }

    const request: PublicacionRequest = {
      autorId: this.currentUser.idUsuario,
      contenido: this.newPostContent.trim()
    };

    this.publicacionService.crear(request).subscribe({
      next: (publicacion) => {
        this.feed.unshift(publicacion);
        this.newPostContent = '';
      },
      error: (error) => {
        console.error('Error al crear publicación:', error);
        alert('Error al crear la publicación');
      }
    });
  }

  toggleComments(publicacionId: number) {
    this.showComments[publicacionId] = !this.showComments[publicacionId];
  }

  agregarComentario(publicacionId: number) {
    const comentario = this.newComments[publicacionId];
    if (!comentario?.trim() || !this.currentUser?.idUsuario) {
      return;
    }

    const request: ComentarioRequest = {
      autorId: this.currentUser.idUsuario,
      contenido: comentario.trim()
    };

    this.publicacionService.agregarComentario(publicacionId, request).subscribe({
      next: () => {
        this.newComments[publicacionId] = '';
        this.loadFeed(); // Recargar para obtener el nuevo comentario
      },
      error: (error) => {
        console.error('Error al agregar comentario:', error);
        alert('Error al agregar comentario');
      }
    });
  }

  darReaccion(publicacionId: number) {
    if (!this.currentUser?.idUsuario) return;

    const publicacion = this.feed.find(p => p.idPublicacion === publicacionId);
    const yaReaccionado = publicacion?.reacciones?.some(
      r => r.usuario?.idUsuario === this.currentUser?.idUsuario
    );

    if (yaReaccionado) {
      // Quitar reacción
      this.publicacionService.quitarReaccion(publicacionId, this.currentUser.idUsuario).subscribe({
        next: () => this.loadFeed(),
        error: (error) => console.error('Error al quitar reacción:', error)
      });
    } else {
      // Agregar reacción
      const request: ReaccionRequest = {
        publicacionId: publicacionId,
        usuarioId: this.currentUser.idUsuario,
        tipo: 'ME_GUSTA'
      };

      this.publicacionService.agregarReaccion(request).subscribe({
        next: () => this.loadFeed(),
        error: (error) => console.error('Error al dar reacción:', error)
      });
    }
  }

  usuarioReacciono(publicacion: Publicacion): boolean {
    return publicacion.reacciones?.some(
      r => r.usuario?.idUsuario === this.currentUser?.idUsuario
    ) || false;
  }

  getAuthorName(usuario: Usuario): string {
    return `${usuario.primerNombre} ${usuario.primerApellido}`;
  }

  getAuthorAvatar(usuario: Usuario): string {
    return usuario.fotoPerfil || `https://i.pravatar.cc/150?u=${usuario.idUsuario}`;
  }

  getTimeAgo(fecha: Date): string {
    const now = new Date();
    const postDate = new Date(fecha);
    const diffMs = now.getTime() - postDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Justo ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return postDate.toLocaleDateString();
  }
}
