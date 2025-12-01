import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mensaje, MensajeRequest } from '../models/mensaje.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
  private apiUrl = `${environment.apiUrl}/api/mensajes`;

  constructor(private http: HttpClient) {}

  enviarMensaje(request: MensajeRequest): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${this.apiUrl}/enviar`, request);
  }

  getConversacion(usuario1Id: number, usuario2Id: number): Observable<Mensaje[]> {
    const params = new HttpParams()
      .set('usuario1Id', usuario1Id.toString())
      .set('usuario2Id', usuario2Id.toString());
    return this.http.get<Mensaje[]>(`${this.apiUrl}/conversacion`, { params });
  }

  marcarComoLeido(mensajeId: number): Observable<Mensaje> {
    return this.http.put<Mensaje>(`${this.apiUrl}/${mensajeId}/leer`, {});
  }

  getMensajesNoLeidos(usuarioId: number): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.apiUrl}/no-leidos/${usuarioId}`);
  }
}
