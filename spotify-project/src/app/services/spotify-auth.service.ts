import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpotifyAuthService {
  private clientId = '0285ad106d274f4499bd18ce25443809'; 
  private redirectUri = 'http://localhost:4200/callback';
  private scopes = [
    'user-top-read',
    'playlist-modify-private',
    'playlist-modify-public',
  ];
  
  loginWithSpotify() {
    const authURL = `https://accounts.spotify.com/authorize?` +
      `client_id=${this.clientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(this.redirectUri)}` +
      `&scope=${encodeURIComponent(this.scopes.join(' '))}`;

    // Redirect the user to the Spotify authorization page
    window.location.href = authURL;
   }
}
