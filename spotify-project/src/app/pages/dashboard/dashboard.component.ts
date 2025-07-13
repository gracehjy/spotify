import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  userName: string = ''; 
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('access_token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.get<any>('https://api.spotify.com/v1/me', { headers }).subscribe({
        next: (response) => {
          this.userName = response.display_name
          document.getElementById('welcome-message')!.innerHTML = `Welcome, ${this.userName}!`;
          
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        }
      });
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    window.location.href = 'http://localhost:4200';
  }
}
