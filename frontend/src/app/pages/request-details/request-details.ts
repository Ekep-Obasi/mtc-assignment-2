import { Component } from '@angular/core';

@Component({
  selector: 'app-request-details',
  standalone: true,
  template: `
    <div style="max-width:700px; margin:20px auto;">
      <h2>Request Details</h2>

      <div style="border:1px solid #ddd; padding:16px; border-radius:8px; margin-bottom:20px;">
        <h3>Fix leaking sink</h3>
        <p>Kitchen sink is leaking under the cabinet.</p>
        <p><strong>Category:</strong> Plumbing</p>
        <p><strong>Location:</strong> Toronto</p>
        <p><strong>Status:</strong> quoted</p>
      </div>

      <h3>Quotes</h3>

      <div style="border:1px solid #ddd; padding:12px; border-radius:8px; margin-bottom:12px;">
        <p><strong>Price:</strong> $120</p>
        <p><strong>Message:</strong> Can fix tomorrow morning.</p>
        <p><strong>Days to Complete:</strong> 2</p>
        <button>Accept Quote</button>
      </div>

      <div style="border:1px solid #ddd; padding:12px; border-radius:8px;">
        <p><strong>Price:</strong> $95</p>
        <p><strong>Message:</strong> Available this weekend.</p>
        <p><strong>Days to Complete:</strong> 3</p>
        <button>Accept Quote</button>
      </div>
    </div>
  `
})
export class RequestDetails {}