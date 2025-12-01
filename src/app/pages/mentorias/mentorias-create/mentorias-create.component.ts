import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { MentoriaService } from '../../../services/mentoria.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-mentorias-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, SidebarComponent],
  templateUrl: './mentorias-create.component.html',
  styleUrl: './mentorias-create.component.css'
})
export class MentoriasCreateComponent implements OnInit {
  mentorForm: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private mentoriaService: MentoriaService,
    private authService: AuthService,
    private router: Router
  ) {
    this.mentorForm = this.fb.group({
      areasExperiencia: ['', [Validators.required, Validators.minLength(10)]],
      anosExperiencia: [0, [Validators.required, Validators.min(1), Validators.max(50)]],
      tarifaHora: [0, [Validators.required, Validators.min(0)]],
      disponible: [true]
    });
  }

  ngOnInit() {
    // Check if user is logged in
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    if (this.mentorForm.invalid) {
      this.mentorForm.markAllAsTouched();
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.idUsuario) {
      this.errorMessage = 'Debes iniciar sesión para registrarte como mentor';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const mentorData = {
      usuario: { idUsuario: currentUser.idUsuario },
      ...this.mentorForm.value
    };

    this.mentoriaService.registrarMentor(mentorData).subscribe({
      next: () => {
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.router.navigate(['/mentorias']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error al registrar mentor:', error);
        this.errorMessage = 'Error al registrar como mentor. Por favor, intenta nuevamente.';
        this.isSubmitting = false;
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.mentorForm.get(fieldName);
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['minlength']) {
      return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    }
    if (control.errors['min']) {
      return `El valor mínimo es ${control.errors['min'].min}`;
    }
    if (control.errors['max']) {
      return `El valor máximo es ${control.errors['max'].max}`;
    }
    return '';
  }

  cancelar() {
    this.router.navigate(['/mentorias']);
  }
}
