import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  features = [
    {
      icon: 'network',
      title: 'Construye tu Red',
      description: 'Conecta con estudiantes y profesionales de tu área'
    },
    {
      icon: 'mentor',
      title: 'Encuentra Mentores',
      description: 'Accede a mentorías personalizadas con expertos'
    },
    {
      icon: 'opportunity',
      title: 'Oportunidades',
      description: 'Descubre empleos, pasantías y talleres exclusivos'
    },
    {
      icon: 'growth',
      title: 'Crece Profesionalmente',
      description: 'Desarrolla habilidades y gana reconocimientos'
    }
  ];

  testimonials = [
    {
      name: 'María González',
      role: 'Estudiante de Ingeniería',
      image: 'assets/images/user1.jpg',
      content: 'Gracias a ConnectEd conseguí mi primera pasantía y ahora tengo una red de contactos increíble.'
    },
    {
      name: 'Carlos Mendoza',
      role: 'Egresado de Administración',
      image: 'assets/images/user2.jpg',
      content: 'Las mentorías me ayudaron a prepararme para el mercado laboral. Ahora trabajo en una empresa líder.'
    },
    {
      name: 'Ana Torres',
      role: 'Estudiante de Diseño',
      image: 'assets/images/user3.jpg',
      content: 'Encontré colaboradores para mis proyectos y aprendí de profesionales con años de experiencia.'
    }
  ];

  stats = [
    { value: '10,000+', label: 'Estudiantes Activos' },
    { value: '500+', label: 'Mentores Expertos' },
    { value: '2,000+', label: 'Oportunidades Publicadas' },
    { value: '95%', label: 'Satisfacción de Usuarios' }
  ];

  scrollToFeatures() {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  }
}
