import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfirmModalService {

  message = "";
  onConfirm: (() => void) | null = null;

  show(msg: string, onConfirm: () => void) {
    this.message = msg;
    this.onConfirm = onConfirm;
    (document.getElementById('confirmModal') as any).showModal();
  }

  confirm() {
    (document.getElementById('confirmModal') as any).close();
    if (this.onConfirm) {
      this.onConfirm();
    }
  }

  cancel() {
    (document.getElementById('confirmModal') as any).close();
  }
}