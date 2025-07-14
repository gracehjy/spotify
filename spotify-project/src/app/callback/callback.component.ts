import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent {
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}
    
  ngOnInit(): void {
    console.log('CallbackComponent loaded');
    const code = this.route.snapshot.queryParamMap.get('code');
    if (code) {
      console.log('Exchanging code for token...');
      // send the code to backend to exchange it for an access token
      this.http.post<any>('http://localhost:3000/auth/token', { code }).subscribe({
        next: (res) => {
          localStorage.setItem('access_token', res.access_token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error exchanging code for token:', err);
        }
      });
    }
    else {
      console.error('No authorization code found in the URL');
    }
  }
}
