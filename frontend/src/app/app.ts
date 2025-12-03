import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalComponent } from './modal/alertModel/modal.component';
import { ConfirmModalComponent } from './modal/confirm-model/confirm-modal';
import { LoaderComponent } from './loader/loader.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ModalComponent, ConfirmModalComponent, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
