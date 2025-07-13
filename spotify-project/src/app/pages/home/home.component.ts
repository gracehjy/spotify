import { Component } from '@angular/core';
import { SpotifyAuthService } from '../../services/spotify-auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
constructor(private authService: SpotifyAuthService) {}
  login() {
    console.log('Initiating Spotify login...');
    this.authService.loginWithSpotify();
  }
}
