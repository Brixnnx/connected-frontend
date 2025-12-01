import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conexion, ConexionRequest } from '../models/conexion.model';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConexionService {
  private apiUrl = `${environment.apiUrl}/api/conexiones`;

  constructor(private http: HttpClient) {}

  enviarSolicitud(request: ConexionRequest): Observable<Conexion> {
    return this.http.post<Conexion>(`${this.apiUrl}/enviar`, request);
  }

  aceptarSolicitud(id: number): Observable<Conexion> {
    return this.http.put<Conexion>(`${this.apiUrl}/${id}/aceptar`, {});
  }

  rechazarSolicitud(id: number): Observable<Conexion> {
    return this.http.put<Conexion>(`${this.apiUrl}/${id}/rechazar`, {});
  }

  getContactos(usuarioId: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/contactos/${usuarioId}`);
  }

  getSugerencias(usuarioId: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/sugerencias/${usuarioId}`);
  }

  getSolicitudesRecibidas(usuarioId: number): Observable<Conexion[]> {
    return this.http.get<Conexion[]>(`${this.apiUrl}/recibidas/${usuarioId}`);
  }

  getSolicitudesEnviadas(usuarioId: number): Observable<Conexion[]> {
    return this.http.get<Conexion[]>(`${this.apiUrl}/enviadas/${usuarioId}`);
  }
}
