import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalService } from './confirm-modal.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './confirm-modal.html'
})
export class ConfirmModalComponent {
  constructor(public modal: ConfirmModalService) {}

  warning = faTriangleExclamation;
}
