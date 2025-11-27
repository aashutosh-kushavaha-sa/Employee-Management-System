import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  message = "";
  type: 'success' | 'error' | 'warning' = 'success';
  onClose: (() => void) | null = null;

  show(
    msg: string,
    type: 'success' | 'error' | 'warning' = 'success',
    onClose?: () => void
  ) {
    this.message = msg;
    this.type = type;
    this.onClose = onClose ?? null;

    (document.getElementById('appModal') as any).showModal();
  }

  close() {
    (document.getElementById('appModal') as any).close();

    if (this.onClose) {
      this.onClose();
    }
  }
}