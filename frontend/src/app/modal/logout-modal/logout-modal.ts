import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logout-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout-modal.html'
  // Remove styleUrls since we're using Tailwind
})
export class LogoutModalComponent {
  visible = false;
  @Output() onConfirm = new EventEmitter<void>();

  show() { this.visible = true; }
  cancel() { this.visible = false; }
  confirm() { this.onConfirm.emit(); this.visible = false; }
}