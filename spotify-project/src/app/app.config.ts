import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { CallbackComponent } from './callback/callback.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: 'callback', component: CallbackComponent },
      { path: 'dashboard', component: DashboardComponent},
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ])
  ]
};
