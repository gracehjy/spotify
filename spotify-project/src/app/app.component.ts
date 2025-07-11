import { Component } from '@angular/core';
import { SpotifyAuthService } from './services/spotify-auth.service';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private authService: SpotifyAuthService) {}
  login() {
    console.log('Initiating Spotify login...');
    this.authService.loginWithSpotify();
  }
}
