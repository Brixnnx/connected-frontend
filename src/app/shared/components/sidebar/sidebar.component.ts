import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  currentUser: Usuario | null = null;
  pendingRequests = 0;
  unreadMessages = 0;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  menuItems = [
    {
      icon: 'home',
      label: 'Inicio',
      route: '/dashboard',
      badge: 0
    },
    {
      icon: 'users',
      label: 'Mi Red',
      route: '/my-network',
      badge: 0
    },
    {
      icon: 'graduation-cap',
      label: 'Mentorías',
      route: '/mentorias',
      badge: 0
    },
    {
      icon: 'briefcase',
      label: 'Oportunidades',
      route: '/opportunities',
      badge: 0
    },
    {
      icon: 'newspaper',
      label: 'Publicaciones',
      route: '/feed',
      badge: 0
    },
    {
      icon: 'messages',
      label: 'Mensajes',
      route: '/messages',
      badge: 0
    },
    {
      icon: 'settings',
      label: 'Configuración',
      route: '/settings',
      badge: 0
    }
  ];
}
