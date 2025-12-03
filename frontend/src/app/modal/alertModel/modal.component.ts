import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from './modal.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { faCircleCheck, faBug, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  modal = inject(ModalService);

  // compatibility constructor removed by migration

  // Icons based on modal type
  successIcon = faCircleCheck;
  errorIcon = faBug;
  warningIcon = faTriangleExclamation;

  getSubtitle(): string {
    switch (this.modal.type) {
      case 'success':
        return 'Operation Completed';
      case 'error':
        return 'Something Went Wrong';
      case 'warning':
        return 'Attention Required';
      default:
        return 'Notification';
    }
  }

  closeModal(): void {
    this.modal.close();
  }
}
