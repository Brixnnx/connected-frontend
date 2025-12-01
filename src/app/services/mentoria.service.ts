import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Mentor,
  SesionMentoria,
  SolicitarMentoriaRequest,
  ResenaRequest,
  AgregarHabilidadRequest
} from '../models/mentoria.model';

@Injectable({
  providedIn: 'root'
})
export class MentoriaService {
  private apiUrl = `${environment.apiUrl}/connected`;

  constructor(private http: HttpClient) {}

  // ============ SESIONES DE MENTORÍA ============

  /**
   * Crear una nueva sesión de mentoría
   */
  crearSesion(request: SolicitarMentoriaRequest): Observable<SesionMentoria> {
    return this.http.post<SesionMentoria>(`${this.apiUrl}/sesiones`, request);
  }

  /**
   * Listar sesiones por usuario y fecha (opcional)
   */
  listarSesiones(idUsuario: number, fecha?: string): Observable<SesionMentoria[]> {
    let params = new HttpParams().set('idUsuario', idUsuario.toString());

    if (fecha) {
      params = params.set('fecha', fecha);
    }

    return this.http.get<SesionMentoria[]>(`${this.apiUrl}/sesiones`, { params });
  }

  /**
   * Obtener todas las sesiones de un usuario
   */
  getSesionesPorUsuario(idUsuario: number): Observable<SesionMentoria[]> {
    return this.listarSesiones(idUsuario);
  }

  /**
   * Obtener sesiones de un mentor
   * Nota: Si el backend no tiene este endpoint, se debe implementar
   */
  getSesionesPorMentor(idMentor: number): Observable<SesionMentoria[]> {
    // Este endpoint puede requerir implementación en el backend
    return this.http.get<SesionMentoria[]>(`${this.apiUrl}/sesiones/mentor/${idMentor}`);
  }

  // ============ MENTORES ============

  /**
   * Obtener listado de todos los mentores
   * Nota: Si no existe en el backend, usar el servicio de usuarios con filtro de rol
   */
  getMentores(): Observable<Mentor[]> {
    return this.http.get<Mentor[]>(`${this.apiUrl}/mentores`);
  }

  /**
   * Obtener un mentor por ID
   */
  getMentor(id: number): Observable<Mentor> {
    return this.http.get<Mentor>(`${this.apiUrl}/mentores/${id}`);
  }

  /**
   * Agregar habilidad a un mentor
   */
  agregarHabilidad(idMentor: number, request: AgregarHabilidadRequest): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/mentores/${idMentor}/habilidades`,
      request
    );
  }

  // ============ RESEÑAS ============

  /**
   * Crear una reseña para una sesión de mentoría
   */
  crearResena(request: ResenaRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/resenas`, request);
  }

  /**
   * Obtener reseñas de un mentor
   * Nota: Puede requerir implementación en el backend
   */
  getResenasPorMentor(idMentor: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/resenas/mentor/${idMentor}`);
  }

  /**
   * Registrar un usuario como mentor
   */
  registrarMentor(mentorData: any): Observable<Mentor> {
    return this.http.post<Mentor>(`${this.apiUrl}/mentores`, mentorData);
  }

  // ============ UTILIDADES ============

  /**
   * Cancelar una sesión de mentoría
   * Nota: Puede requerir implementación en el backend
   */
  cancelarSesion(idSesion: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/sesiones/${idSesion}/cancelar`, {});
  }

  /**
   * Completar una sesión de mentoría
   * Nota: Puede requerir implementación en el backend
   */
  completarSesion(idSesion: number, notas?: string): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/sesiones/${idSesion}/completar`,
      { notas }
    );
  }

  /**
   * Buscar mentores por habilidad o área
   */
  buscarMentores(query: string): Observable<Mentor[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<Mentor[]>(`${this.apiUrl}/mentores/buscar`, { params });
  }

  /**
   * Obtener mentores recomendados para un alumno
   */
  getMentoresRecomendados(idAlumno: number): Observable<Mentor[]> {
    return this.http.get<Mentor[]>(`${this.apiUrl}/mentores/recomendados/${idAlumno}`);
  }
}
