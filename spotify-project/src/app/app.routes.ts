import { Routes } from '@angular/router';
import { CallbackComponent } from './callback/callback.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
    { path: 'callback', component: CallbackComponent },
    { path: 'dashboard', component: DashboardComponent},
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Redirect to dashboard on empty path
];
