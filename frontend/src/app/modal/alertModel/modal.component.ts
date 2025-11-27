import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from './modal.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircleCheck,
  faBug,
  faTriangleExclamation,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  constructor(public modal: ModalService) {}

  // Icons for different modal types
  successIcon = faCircleCheck;
  errorIcon = faBug;
  warningIcon = faTriangleExclamation;
  closeIcon = faTimes;

  getSubtitle(): string {
    switch (this.modal.type) {
      case 'success': return 'Operation Completed';
      case 'error': return 'Something Went Wrong';
      case 'warning': return 'Attention Required';
      default: return 'Notification';
    }
  }

  closeModal() {
    this.modal.close();
  }
}