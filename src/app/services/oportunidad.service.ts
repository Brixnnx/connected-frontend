import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Oportunidad, OportunidadRequest } from '../models/oportunidad.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OportunidadService {
  private apiUrl = `${environment.apiUrl}/api/oportunidades`;

  constructor(private http: HttpClient) {}

  getAllOportunidades(): Observable<Oportunidad[]> {
    return this.http.get<Oportunidad[]>(this.apiUrl);
  }

  listar(): Observable<Oportunidad[]> {
    return this.http.get<Oportunidad[]>(this.apiUrl);
  }

  getEmpleos(): Observable<Oportunidad[]> {
    return this.http.get<Oportunidad[]>(`${this.apiUrl}/empleos`);
  }

  getPasantias(): Observable<Oportunidad[]> {
    return this.http.get<Oportunidad[]>(`${this.apiUrl}/pasantias`);
  }

  getTalleres(): Observable<Oportunidad[]> {
    return this.http.get<Oportunidad[]>(`${this.apiUrl}/talleres`);
  }

  getEventos(): Observable<Oportunidad[]> {
    return this.http.get<Oportunidad[]>(`${this.apiUrl}/eventos`);
  }

  crearOportunidad(request: OportunidadRequest): Observable<Oportunidad> {
    return this.http.post<Oportunidad>(this.apiUrl, request);
  }

  actualizarOportunidad(id: number, request: OportunidadRequest): Observable<Oportunidad> {
    return this.http.put<Oportunidad>(`${this.apiUrl}/${id}`, request);
  }

  desactivarOportunidad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
