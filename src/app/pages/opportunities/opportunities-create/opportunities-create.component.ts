import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { OportunidadService } from '../../../services/oportunidad.service';
import { TipoOportunidad } from '../../../models/oportunidad.model';

@Component({
  selector: 'app-opportunities-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, SidebarComponent],
  templateUrl: './opportunities-create.component.html',
  styleUrl: './opportunities-create.component.css'
})
export class OpportunitiesCreateComponent implements OnInit {
  activeTab: TipoOportunidad = TipoOportunidad.EMPLEO;
  TipoOportunidad = TipoOportunidad;
  oportunidadForm: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;
  errorMessage = '';

  tabs = [
    { 
      tipo: TipoOportunidad.EMPLEO, 
      label: 'Empleos',
      icon: 'M10 2L3 7v6c0 4.4 3 8.5 7 10 4-1.5 7-5.6 7-10V7l-7-5z',
      description: 'Publica ofertas de trabajo a tiempo completo o parcial'
    },
    { 
      tipo: TipoOportunidad.PASANTIA, 
      label: 'Pasantías',
      icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
      description: 'Ofrece oportunidades de prácticas profesionales'
    },
    { 
      tipo: TipoOportunidad.TALLER, 
      label: 'Talleres',
      icon: 'M4 4h12v12H4V4zM6 8h8M6 12h8',
      description: 'Organiza talleres y capacitaciones'
    },
    { 
      tipo: TipoOportunidad.EVENTO, 
      label: 'Eventos',
      icon: 'M4 2h12v16H4V2zM8 6h4M8 10h4',
      description: 'Crea eventos de networking y conferencias'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private oportunidadService: OportunidadService,
    private router: Router
  ) {
    this.oportunidadForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      empresa: ['', [Validators.required]],
      ubicacion: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]]
    });
  }

  ngOnInit() {}

  setActiveTab(tipo: TipoOportunidad) {
    this.activeTab = tipo;
    // Reset form when switching tabs
    this.oportunidadForm.reset();
    this.errorMessage = '';
  }

  getActiveTabInfo() {
    return this.tabs.find(tab => tab.tipo === this.activeTab);
  }

  onSubmit() {
    if (this.oportunidadForm.invalid) {
      this.oportunidadForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const oportunidadData = {
      tipo: this.activeTab,
      ...this.oportunidadForm.value,
      activo: true
    };

    this.oportunidadService.crearOportunidad(oportunidadData).subscribe({
      next: () => {
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.router.navigate(['/opportunities']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error al crear oportunidad:', error);
        this.errorMessage = 'Error al crear la oportunidad. Por favor, intenta nuevamente.';
        this.isSubmitting = false;
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.oportunidadForm.get(fieldName);
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['minlength']) {
      return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }

  cancelar() {
    this.router.navigate(['/opportunities']);
  }

  getPlaceholdersByType() {
    switch (this.activeTab) {
      case TipoOportunidad.EMPLEO:
        return {
          titulo: 'Ej: Desarrollador Full Stack Senior',
          empresa: 'Nombre de la empresa',
          ubicacion: 'Ciudad, País (o Remoto)'
        };
      case TipoOportunidad.PASANTIA:
        return {
          titulo: 'Ej: Pasantía en Marketing Digital',
          empresa: 'Nombre de la empresa u organización',
          ubicacion: 'Ciudad, País'
        };
      case TipoOportunidad.TALLER:
        return {
          titulo: 'Ej: Taller de Inteligencia Artificial',
          empresa: 'Organizador o institución',
          ubicacion: 'Lugar del taller (presencial o virtual)'
        };
      case TipoOportunidad.EVENTO:
        return {
          titulo: 'Ej: Conferencia de Tecnología 2025',
          empresa: 'Organizador del evento',
          ubicacion: 'Sede del evento'
        };
    }
  }
}
