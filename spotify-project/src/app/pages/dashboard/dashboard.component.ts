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

      this.getTopArtists(headers);
      this.getTopTracks(headers);
      this.getTopGenres(headers);
    }
  }

  getTopArtists(headers: HttpHeaders): void {
      this.http.get<any>('https://api.spotify.com/v1/me/top/artists/?limit=5', { headers }).subscribe({
        next: (response) => {
          console.log('Top Artists:', response.items);
          document.getElementById('top-artists')!.innerHTML = response.items.map((artist: any) => `<li>${artist.name}</li>`).join('');
        },
        error: (error) => {
          console.error('Error fetching top artists:', error);
        }
      });
    }

  getTopTracks(headers: HttpHeaders): void {
      this.http.get<any>('https://api.spotify.com/v1/me/top/tracks/?limit=5', { headers }).subscribe({
        next: (response) => {
          console.log('Top Tracks:', response.items);
          document.getElementById('top-tracks')!.innerHTML = response.items.map((track: any) => `<li>${track.name}</li>`).join('');
        },
        error: (error) => {
          console.error('Error fetching top tracks:', error);
        }
      });
    }

  getTopGenres(headers: HttpHeaders): void {
      this.http.get<any>('https://api.spotify.com/v1/me/top/artists?limit=5', { headers }).subscribe({
        next: (response) => {
          console.log('Top Genres:', response.items);
          const setGenres = new Set<string>();
          response.items.forEach((artist: any) => {
            if (artist.genres && artist.genres.length > 0) {
              setGenres.add(artist.genres[0]);
            }
          });
          document.getElementById('top-genres')!.innerHTML =  Array.from(setGenres).map(genre => `<li>${genre}</li>`).join('');
      },
        error: (error) => {
          console.error('Error fetching top genres:', error);
        }
      });
    }

  logout(): void {
    localStorage.removeItem('access_token');
    window.location.href = 'http://localhost:4200';
  }
}
