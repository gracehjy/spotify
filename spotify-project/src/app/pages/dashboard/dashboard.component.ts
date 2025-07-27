import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {
  currentTerm: string = '4 weeks'; // default term
  userName: string = ''; 
  playlistId: string = '';
  topArtists: string[] = [];
  topTracks: string[] = [];
  topGenres: string[] = [];

  constructor(private http: HttpClient) {}

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   */
  ngOnInit(): void {
    const token = localStorage.getItem('access_token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      // Fetch user data
      this.http.get<any>('https://api.spotify.com/v1/me', { headers }).subscribe({
        next: (response) => {
          this.userName = response.display_name
          document.getElementById('welcome-message')!.innerHTML = `Hello, ${this.userName}!`;
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        }
      });

      // Fetch top artists, tracks, and genres to display on the dashboard
      this.getTopArtists(headers, 'short_term');
      this.getTopTracks(headers, 'short_term');
      this.getTopGenres(headers, 'short_term');
      window.addEventListener('resize', () => this.movePillIndicator(this.currentTerm));
    }
  }

  /**
   * Change the time range for top artists, tracks, and genres.
   * @param term - The time range to set (e.g., '4 weeks', '6 months', '1 year').
   */
  changeTerm(term: string): void {
    const token = localStorage.getItem('access_token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const selectedTerm = this.getTerm(term);
      this.currentTerm = term;
      this.getTopArtists(headers, selectedTerm);
      this.getTopTracks(headers, selectedTerm);
      this.getTopGenres(headers, selectedTerm);
      // Update the pill indicator position
      this.movePillIndicator(term);
    }
  }

  /**
   * Get the time range for the specified term.
   * @param term - The time range to set (e.g., '4 weeks', '6 months', '1 year').
   * @returns The corresponding Spotify time range.
   */
  getTerm(term: String): string {
    switch (term) {
      case '4 weeks':
        document.getElementById('short-term')!.classList.add('active');
        document.getElementById('med-term')!.classList.remove('active');
        document.getElementById('long-term')!.classList.remove('active');
        return 'short_term';
      case '6 months':
        document.getElementById('short-term')!.classList.remove('active');
        document.getElementById('med-term')!.classList.add('active');
        document.getElementById('long-term')!.classList.remove('active');
        return 'medium_term';
      case '1 year':
        document.getElementById('short-term')!.classList.remove('active');
        document.getElementById('med-term')!.classList.remove('active');
        document.getElementById('long-term')!.classList.add('active');
        return 'long_term';
      default:
        return 'short_term';
    }
  }

  /**
   * Fetch the top artists for the specified time range.
   * @param headers - The HTTP headers to include in the request.
   * @param term - The time range to set (e.g., '4 weeks', '6 months', '1 year').
   */
  getTopArtists(headers: HttpHeaders, term: String): void {
      this.http.get<any>(`https://api.spotify.com/v1/me/top/artists/?limit=10&time_range=${term}`, { headers }).subscribe({
        next: (response) => {
          console.log('Top Artists:', response.items);
          document.getElementById('top-artists-list')!.innerHTML = response.items.map((artist: any) => `<li><img src="${artist.images[0].url}" alt="${artist.name}" width="40" height="40"> ${artist.name}</li>`).join('');
          this.animateAllLists(['top-artists-list', 'top-tracks-list', 'top-genres-list']);
          this.topArtists = response.items.map((artist: any) => artist.name.toLowerCase());
        },
        error: (error) => {
          console.error('Error fetching top artists:', error);
        }
      });
    }

  /**
   * Fetch the top tracks for the specified time range.
   * @param headers - The HTTP headers to include in the request.
   * @param term - The time range to set (e.g., '4 weeks', '6 months', '1 year').
   */
  getTopTracks(headers: HttpHeaders, term: String): void {
      this.http.get<any>(`https://api.spotify.com/v1/me/top/tracks/?limit=25&time_range=${term}`, { headers }).subscribe({
        next: (response) => {
          console.log('Top Tracks:', response.items);
          document.getElementById('top-tracks-list')!.innerHTML = response.items.map((track: any) => `<li> <img src="${track.album.images[0].url}" alt="${track.name}" width="40" height="40"> ${track.name} - ${track.artists.map((artist: any) => artist.name).join(', ')}</li>`).join('');
          this.animateAllLists(['top-artists-list', 'top-tracks-list', 'top-genres-list']);
          this.topTracks = response.items.map((track: any ) => track.name.toLowerCase());
        },
        error: (error) => {
          console.error('Error fetching top tracks:', error);
        }
      });
    }

  /**
   * Fetch the top genres for the specified time range.
   * @param headers - The HTTP headers to include in the request.
   * @param term - The time range to set (e.g., '4 weeks', '6 months', '1 year').
   */
  getTopGenres(headers: HttpHeaders, term: String): void {
      this.http.get<any>(`https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${term}`, { headers }).subscribe({
        next: (response) => {
          console.log('Top Genres:', response.items);
          const setGenres = new Set<string>();
          response.items.forEach((artist: any) => {
            if (artist.genres && artist.genres.length > 0) {
              setGenres.add(artist.genres[0]);
            }
          });
          document.getElementById('top-genres-list')!.innerHTML =  Array.from(setGenres).map(genre => `<li>${genre}</li>`).join('');
          this.animateAllLists(['top-artists-list', 'top-tracks-list', 'top-genres-list']);
          this.topGenres = Array.from(setGenres);
      },
        error: (error) => {
          console.error('Error fetching top genres:', error);
        }
      });
    }

  /**
   * Animate the entrance of list items for the specified list IDs.
   * @param ids - The IDs of the lists to animate.
   */
  animateAllLists(ids: string[]) {
    ids.forEach(id => {
      const list = document.getElementById(id);
      if (list) {
        const items = list.querySelectorAll('li');
        items.forEach(li => li.classList.add('fade-enter'));
      }
    });
    setTimeout(() => {
      ids.forEach(id => {
        const list = document.getElementById(id);
        if (list) {
          const items = list.querySelectorAll('li');
          items.forEach(li => li.classList.add('fade-enter-active'));
        }
      });
    }, 10);
    setTimeout(() => {
      ids.forEach(id => {
        const list = document.getElementById(id);
        if (list) {
          const items = list.querySelectorAll('li');
          items.forEach(li => li.classList.remove('fade-enter', 'fade-enter-active'));
        }
      });
    }, 1100);
  }

  /**
   * Move the pill indicator to the specified time range.
   * @param term - The time range to set (e.g., '4 weeks', '6 months', '1 year').
   */
  movePillIndicator(term: string) {
    document.querySelectorAll('.pill-nav button').forEach(button => button.classList.remove('active'));
    const nav = document.querySelector('.pill-nav');
    const indicator = nav?.querySelector('.pill-indicator') as HTMLElement;
    const btnId = term === '4 weeks' ? 'short-term' : term === '6 months' ? 'med-term' : 'long-term';
    const newBtn = document.getElementById(btnId) as HTMLElement;
    if (indicator && newBtn && nav) {
      const navRect = nav.getBoundingClientRect();
      const btnRect = newBtn.getBoundingClientRect();
      const left = btnRect.left - navRect.left;
      indicator.style.left = newBtn.offsetLeft + 'px';
      indicator.style.width = newBtn.offsetWidth + 'px';
      indicator.style.height = newBtn.offsetHeight + 'px';

      setTimeout(() => {
        newBtn.classList.add('active');
      }, 300); 
    }
  }

  /**
   * Generate a playlist based on the user's top tracks, artists, and genres.
   */
  generatePlaylist(): void {
    const token = localStorage.getItem('access_token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const generateButton = document.getElementById('generate-playlist-btn') as HTMLButtonElement;
      // Disable the button and show loading state
      if (generateButton) {
        generateButton.disabled = true;
        generateButton.querySelector('.btn-text')!.textContent = 'Generating Playlist...';
        (generateButton.querySelector('.spinner') as HTMLElement)!.style.display = 'inline-block';
      }
      console.log('Generating playlist...');
      // Fetch the songs
      this.createPlaylist(headers, () => {
        if (generateButton) {
          generateButton.disabled = false;
          generateButton.querySelector('.btn-text')!.textContent = 'Generate Playlist';
          (generateButton.querySelector('.spinner') as HTMLElement)!.style.display = 'none';
        }
      });
    } else {
      console.error('No access token found. Please log in first.');
    }
  }

  /**
   * Get a random sample from an array.
   * @param array - The array to sample from.
   * @param count - The number of items to sample.
   * @returns A random sample of items from the array.
   */
  getRandomSample<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Fetch songs based on the user's top tracks, artists, and genres.
   * @param headers - The HTTP headers to include in the request.
   * @param done - Callback function to call when done.
   */
  getSongs(headers: HttpHeaders, done: () => void): void {
    const sanitize = (s: string) => `"${s.replace(/["]/g, '')}"`;

    // Get 3 random genres, artists, and tracks from the user's top genres, artists, and tracks
    const genres = this.getRandomSample(this.topGenres, 3).map(g => `genre:${sanitize(g)}`);
    const artists = this.getRandomSample(this.topArtists, 3).map(a => `artist:${sanitize(a)}`);
    const tracks = this.getRandomSample(this.topTracks, 3).map(t => `track:${sanitize(t)}`);

    // Combine 9 queries into 1: 3 genres, 3 artists, and 3 tracks
    const queries = [...artists, ...tracks, ...genres];

    const allSongsMap = new Map<string, any>(); 
    let completedRequests = 0;

    // For each query, fetch 10 songs (don't fetch songs that have already been fetched)
    queries.forEach(query => {
      const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`;
      console.log('Searching with query:', query);

      this.http.get<any>(url, { headers }).subscribe({
        next: (response) => {
          response.tracks.items.forEach((track: any) => {
            if (!allSongsMap.has(track.uri)) {
              allSongsMap.set(track.uri, track);
            }
          });
        },
        error: (error) => {
          console.error('Error fetching songs for query:', query, error);
        },
        complete: () => {
          completedRequests++;
          if (completedRequests === queries.length) {
            const allSongs = Array.from(allSongsMap.values());
            // Pick 25 random songs from allSongs
            const selectedSongs = this.getRandomSample(allSongs, 25);
            console.log('Selected Songs:', selectedSongs);
            this.addTracksToPlaylist(headers, selectedSongs.map(t => t.uri), done);
          }
        }
      });
    });
  }

  /**
   * Add tracks to the user's playlist.
   * @param headers - The HTTP headers to include in the request.
   * @param trackUris - The URIs of the tracks to add.
   * @param done - Callback function to call when done.
   */
  addTracksToPlaylist(headers: HttpHeaders, trackUris: string[], done: () => void): void {
    const playlistId = this.playlistId
    this.http.post<any>(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      uris: trackUris
    }, { headers }).subscribe({
      next: (response) => {
        console.log('Tracks added to playlist:', response);
        done();
      },
      error: (error) => {
        console.error('Error adding tracks to playlist:', error);
        done();
      }
    });
  }

  /**
   * Create a new playlist.
   * @param headers - The HTTP headers to include in the request.
   */
  createPlaylist(headers: HttpHeaders, done: () => void): void {
    this.http.post<any>('https://api.spotify.com/v1/me/playlists', {
      name: 'Melofy Playlist',
      description: 'bello, this is a playlist generated by melofy',
      public: false
    },
    {headers}).subscribe({
      next: (response) => {
        this.playlistId = response.id;
        this.getSongs(headers, done);
        console.log('Playlist created:', response);
      },
      error: (error) => {
        console.error('Error creating playlist:', error);
        done();
      }
    });
  }

  /**
   * Log out the user.
   */
  logout(): void {
    localStorage.removeItem('access_token');
    window.location.href = 'http://localhost:4200';
  }
}
