import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from './modal.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircleCheck,faBug,faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  constructor(public modal: ModalService) {}

  sucess = faCircleCheck;
  error = faBug;
  warning = faTriangleExclamation;

}
