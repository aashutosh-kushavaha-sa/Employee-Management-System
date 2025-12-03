import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logout-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout-modal.html',
})
export class LogoutModalComponent {
  visible = false;

  @Output() confirm: EventEmitter<void> = new EventEmitter<void>();

  show(): void {
    this.visible = true;
  }

  cancel(): void {
    this.visible = false;
  }

  confirm(): void {
    this.confirm.emit();
    this.visible = false;
  }
}
