import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  template: `
    <div>
      <h1>Callback Component</h1>
      <p>Processing your login...</p>
    </div>
  `,
})
export class CallbackComponent {
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}
    
  ngOnInit(): void{
    const code = this.route.snapshot.queryParamMap.get('code');
    if (code) {
      this.exchangeCodeForToken(code);
    }
  }

  exchangeCodeForToken(code: string): void {
    console.log('Exchanging code for token...');
    // send the code to your backend to exchange it for an access token
    this.http.post<any>('https://localhost:3000/auth/token', { code }).subscribe({
      next: (res) => {
        localStorage.setItem('access_token', res.access_token);
        console.log('Access token received:', res.access_token);
        // Redirect to the dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error exchanging code for token:', err);
      }
    });
  }
}
