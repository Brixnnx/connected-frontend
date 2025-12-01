import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Publicacion, PublicacionRequest, ComentarioRequest, ReaccionRequest, Comentario } from '../models/publicacion.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  private apiUrl = `${environment.apiUrl}/api/publicaciones`;

  constructor(private http: HttpClient) {}

  getFeed(): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.apiUrl}/feed`);
  }

  getPublicacionesByUsuario(usuarioId: number): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  getPorAutor(usuarioId: number): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.apiUrl}/autor/${usuarioId}`);
  }

  crear(request: PublicacionRequest): Observable<Publicacion> {
    return this.http.post<Publicacion>(this.apiUrl, request);
  }

  crearPublicacion(request: PublicacionRequest): Observable<Publicacion> {
    return this.http.post<Publicacion>(this.apiUrl, request);
  }

  agregarComentario(publicacionId: number, request: ComentarioRequest): Observable<Comentario> {
    return this.http.post<Comentario>(`${this.apiUrl}/${publicacionId}/comentarios`, request);
  }

  agregarReaccion(request: ReaccionRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${request.publicacionId}/reacciones`, request);
  }

  quitarReaccion(publicacionId: number, usuarioId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${publicacionId}/reacciones/${usuarioId}`);
  }
}
