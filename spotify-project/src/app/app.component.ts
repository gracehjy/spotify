import { Component } from '@angular/core';
import { SpotifyAuthService } from './services/spotify-auth.service';
import { RouterOutlet } from "@angular/router";

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet]
})
export class AppComponent {
  constructor(private authService: SpotifyAuthService) {}
  login() {
    console.log('Initiating Spotify login...');
    this.authService.loginWithSpotify();
  }
}
