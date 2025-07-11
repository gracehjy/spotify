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
    console.log('Access token:', token);
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.get<any>('https://api.spotify.com/v1/me', { headers }).subscribe({
        next: (response) => {
          this.userName = response.display_name
          console.log('User name:', this.userName);
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
          // Handle error appropriately, e.g., show a message to the user
        }
      });
    }
  }
}
