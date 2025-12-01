import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { MensajeService } from '../../services/mensaje.service';
import { ConexionService } from '../../services/conexion.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';
import { Mensaje } from '../../models/mensaje.model';

@Component({
  selector: 'app-messages',
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
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit, OnDestroy {
  currentUser: Usuario | null = null;
  contactos: Usuario[] = [];
  selectedContact: Usuario | null = null;
  messages: Mensaje[] = [];
  newMessage = '';
  isLoading = false;
  private pollingInterval: any;

  constructor(
    private mensajeService: MensajeService,
    private conexionService: ConexionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();

    if (this.currentUser?.idUsuario) {
      this.loadContactos();
    }
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  loadContactos() {
    if (!this.currentUser?.idUsuario) return;

    this.conexionService.getContactos(this.currentUser.idUsuario).subscribe({
      next: (contactos) => {
        this.contactos = contactos;
        // Auto-seleccionar el primer contacto si existe
        if (this.contactos.length > 0 && !this.selectedContact) {
          this.selectContact(this.contactos[0]);
        }
      },
      error: (error) => {
        console.error('Error al cargar contactos:', error);
      }
    });
  }

  selectContact(contact: Usuario) {
    this.selectedContact = contact;
    this.messages = [];

    if (this.currentUser?.idUsuario && contact.idUsuario) {
      this.loadConversacion(this.currentUser.idUsuario, contact.idUsuario);
      this.startPolling();
    }
  }

  loadConversacion(usuario1Id: number, usuario2Id: number) {
    this.isLoading = true;

    this.mensajeService.getConversacion(usuario1Id, usuario2Id).subscribe({
      next: (messages) => {
        this.messages = messages.sort((a, b) =>
          new Date(a.fechaEnvio).getTime() - new Date(b.fechaEnvio).getTime()
        );
        this.isLoading = false;
        this.scrollToBottom();
        this.marcarMensajesComoLeidos();
      },
      error: (error) => {
        console.error('Error al cargar conversación:', error);
        this.isLoading = false;
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.currentUser?.idUsuario || !this.selectedContact?.idUsuario) {
      return;
    }

    const contenido = this.newMessage.trim();
    this.newMessage = '';

    this.mensajeService.enviarMensaje({
      emisorId: this.currentUser.idUsuario,
      receptorId: this.selectedContact.idUsuario,
      contenido: contenido
    }).subscribe({
      next: (mensaje) => {
        this.messages.push(mensaje);
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Error al enviar mensaje:', error);
        alert('Error al enviar el mensaje. Por favor intenta nuevamente.');
        // Restaurar el mensaje en caso de error
        this.newMessage = contenido;
      }
    });
  }

  marcarMensajesComoLeidos() {
    if (!this.currentUser?.idUsuario) return;

    const mensajesNoLeidos = this.messages.filter(
      m => !m.leido && m.receptor?.idUsuario === this.currentUser?.idUsuario
    );

    mensajesNoLeidos.forEach(mensaje => {
      if (mensaje.idMensaje) {
        this.mensajeService.marcarComoLeido(mensaje.idMensaje).subscribe({
          error: (error) => console.error('Error al marcar mensaje como leído:', error)
        });
      }
    });
  }

  startPolling() {
    this.stopPolling();

    // Poll every 5 seconds for new messages
    this.pollingInterval = setInterval(() => {
      if (this.currentUser?.idUsuario && this.selectedContact?.idUsuario) {
        this.loadConversacion(this.currentUser.idUsuario, this.selectedContact.idUsuario);
      }
    }, 5000);
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      const chatContainer = document.querySelector('.messages-container');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

  isMessageFromCurrentUser(mensaje: Mensaje): boolean {
    return mensaje.emisor?.idUsuario === this.currentUser?.idUsuario;
  }

  getContactAvatar(usuario: Usuario): string {
    return usuario.fotoPerfil || `https://i.pravatar.cc/150?u=${usuario.idUsuario}`;
  }

  getContactName(usuario: Usuario): string {
    return `${usuario.primerNombre} ${usuario.primerApellido}`;
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
