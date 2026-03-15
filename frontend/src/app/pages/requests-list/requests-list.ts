import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-requests-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>Requests List</h2>

    <div style="border:1px solid #ddd; padding:12px; margin:12px 0;">
      <h3>Fix leaking sink</h3>
      <p>Kitchen sink is leaking under the cabinet.</p>
      <p><strong>Location:</strong> Toronto</p>
      <p><strong>Status:</strong> quoted</p>
      <a [routerLink]="['/requests', 'r1']">View Details</a>
    </div>

    <div style="border:1px solid #ddd; padding:12px;">
      <h3>House cleaning needed</h3>
      <p>Need deep cleaning for a 2-bedroom apartment.</p>
      <p><strong>Location:</strong> North York</p>
      <p><strong>Status:</strong> open</p>
      <a [routerLink]="['/requests', 'r2']">View Details</a>
    </div>
  `
})
export class RequestsList {}