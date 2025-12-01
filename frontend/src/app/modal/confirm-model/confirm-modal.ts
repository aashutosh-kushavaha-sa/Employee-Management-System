import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmModalService } from './confirm-modal.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { 
  faTriangleExclamation, 
  faTrash, 
  faTimes, 
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './confirm-modal.html'
})
export class ConfirmModalComponent {
  constructor(public modal: ConfirmModalService) {}

  // Icons
  warning = faTriangleExclamation;
  deleteIcon = faTrash;
  cancelIcon = faTimes;
  errorIcon = faExclamationTriangle;

  // Verification properties
  confirmationText: string = '';
  showError: boolean = false;
  isConfirmed: boolean = false;

  onConfirmationInput(): void {
    if (this.modal.requiresVerification) {
      this.isConfirmed = this.confirmationText.trim() === 'DELETE';
      this.showError = !this.isConfirmed && this.confirmationText.length > 0;
    }
  }

  confirm(): void {
    if (this.modal.requiresVerification && !this.isConfirmed) {
      this.showError = true;
      return;
    }

    this.modal.confirm();
    this.resetVerification();
  }

  cancel(): void {
    this.modal.cancel();
    this.resetVerification();
  }

  private resetVerification(): void {
    this.confirmationText = '';
    this.showError = false;
    this.isConfirmed = false;
  }

  get isConfirmDisabled(): boolean {
    return this.modal.requiresVerification && !this.isConfirmed;
  }
}
