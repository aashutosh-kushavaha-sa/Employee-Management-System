import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalComponent } from "./modal/alertModel/modal.component";
import { ConfirmModalComponent } from "./modal/confirm-model/confirm-modal";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ModalComponent, ConfirmModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
