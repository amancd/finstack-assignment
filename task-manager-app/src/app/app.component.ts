import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NewTaskModalComponent } from './components/task-modal/new-task-modal.component';
import { SalesLogComponent } from './components/sales-log/sales-log.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, NewTaskModalComponent, SalesLogComponent],
  template: `
  <app-navbar></app-navbar>
    <div class="min-h-screen bg-gray-100 p-4">
      <app-sales-log></app-sales-log>
    </div>
  `
})
export class AppComponent {
  onTaskAdded() {
    // Optional: handle task added event
  }
}
