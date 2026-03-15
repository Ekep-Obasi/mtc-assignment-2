import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-quotes',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="max-width:700px; margin:20px auto;">
      <h2>My Quotes</h2>

      <div style="border:1px solid #ddd; padding:12px; border-radius:8px; margin-bottom:12px;">
        <p><strong>Request:</strong> Fix leaking sink</p>
        <p><strong>Price:</strong> $120</p>
        <p><strong>Message:</strong> Can fix tomorrow morning.</p>
        <p><strong>Days to Complete:</strong> 2</p>
        <p><strong>Status:</strong> pending</p>
        <a [routerLink]="['/requests', 'r1']">Go to request</a>
      </div>

      <div style="border:1px solid #ddd; padding:12px; border-radius:8px;">
        <p><strong>Request:</strong> House cleaning needed</p>
        <p><strong>Price:</strong> $95</p>
        <p><strong>Message:</strong> Available this weekend.</p>
        <p><strong>Days to Complete:</strong> 3</p>
        <p><strong>Status:</strong> pending</p>
        <a [routerLink]="['/requests', 'r2']">Go to request</a>
      </div>
    </div>
  `
})
export class MyQuotes {}