import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { OportunidadService } from '../../services/oportunidad.service';
import { Oportunidad } from '../../models/oportunidad.model';

@Component({
  selector: 'app-opportunities',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    HeaderComponent, 
    SidebarComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './opportunities.component.html',
  styleUrl: './opportunities.component.css'
})
export class OpportunitiesComponent implements OnInit {
  activeTab: 'EMPLEO' | 'PASANTIA' | 'TALLER' | 'EVENTO' = 'EMPLEO';
  oportunidades: Oportunidad[] = [];
  filteredOportunidades: Oportunidad[] = [];
  loading = true;

  constructor(private oportunidadService: OportunidadService) {}

  ngOnInit() {
    this.loadOportunidades();
  }

  loadOportunidades() {
    this.oportunidadService.listar().subscribe({
      next: (data) => {
        this.oportunidades = data;
        this.filterByType();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading opportunities:', err);
        this.loading = false;
      }
    });
  }

  setActiveTab(tipo: 'EMPLEO' | 'PASANTIA' | 'TALLER' | 'EVENTO') {
    this.activeTab = tipo;
    this.filterByType();
  }

  onTabChange(index: number) {
    const tabs: ('EMPLEO' | 'PASANTIA' | 'TALLER' | 'EVENTO')[] = ['EMPLEO', 'PASANTIA', 'TALLER', 'EVENTO'];
    this.setActiveTab(tabs[index]);
  }

  filterByType() {
    this.filteredOportunidades = this.oportunidades.filter(o => o.tipo === this.activeTab);
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  getIcon(tipo: string): string {
    const icons: Record<string, string> = {
      'EMPLEO': 'M3 3h14v14H3V3z',
      'PASANTIA': 'M8 2v4M12 2v4',
      'TALLER': 'M3 8l5-5 5 5',
      'EVENTO': 'M3 8h14'
    };
    return icons[tipo] || '';
  }
}
