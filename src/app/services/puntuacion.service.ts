import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Puntuacion } from '../models/puntuacion.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PuntuacionService {
  private apiUrl = `${environment.apiUrl}/api/puntuaciones`;

  constructor(private http: HttpClient) {}

  getPuntuacion(usuarioId: number): Observable<Puntuacion> {
    return this.http.get<Puntuacion>(`${this.apiUrl}/${usuarioId}`);
  }

  getPuntosPorUsuario(usuarioId: number): Observable<Puntuacion[]> {
    return this.http.get<Puntuacion[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  getLeaderboard(): Observable<Puntuacion[]> {
    return this.http.get<Puntuacion[]>(`${this.apiUrl}/leaderboard`);
  }
}
