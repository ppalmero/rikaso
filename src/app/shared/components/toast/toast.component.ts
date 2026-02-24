import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="toast"
      *ngIf="toast"
      [ngClass]="toast.type">

      {{ toast.message }}

    </div>
  `,
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {

  toast: any = null;

  constructor(private toastService: ToastService) {
    this.toastService.toast$.subscribe(t => {
      this.toast = t;
    });
  }
}