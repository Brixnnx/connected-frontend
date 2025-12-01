import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'my-network',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/my-network/my-network.component').then(m => m.MyNetworkComponent)
  },
  {
    path: 'mentorias',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/mentorias/mentorias.component').then(m => m.MentoriasComponent)
  },
  {
    path: 'opportunities',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/opportunities/opportunities.component').then(m => m.OpportunitiesComponent)
  },
  {
    path: 'gamification',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/gamification/gamification.component').then(m => m.GamificationComponent)
  },
  {
    path: 'messages',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/messages/messages.component').then(m => m.MessagesComponent)
  },
  {
    path: 'search',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent)
  },
  {
    path: 'feed',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/feed/feed.component').then(m => m.FeedComponent)
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: 'user-profile/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/user-profile/user-profile.component').then(m => m.UserProfileComponent)
  },
  {
    path: 'mentorias-create',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/mentorias/mentorias-create/mentorias-create.component').then(m => m.MentoriasCreateComponent)
  },
  {
    path: 'opportunities-create',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/opportunities/opportunities-create/opportunities-create.component').then(m => m.OpportunitiesCreateComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
