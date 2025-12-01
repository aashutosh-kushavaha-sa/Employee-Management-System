import { Injectable } from '@angular/core';

export type ModalType = 'success' | 'error' | 'warning';

export interface ModalConfig {
  message: string;
  type: ModalType;
  onClose?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  message: string = '';
  type: ModalType = 'success';
  onClose: (() => void) | null = null;
  visible: boolean = false;

  // Method 1: Simple usage
  show(
    msg: string,
    type: ModalType = 'success',
    onClose?: () => void
  ): void {
    this.message = msg;
    this.type = type;
    this.onClose = onClose ?? null;
    this.visible = true;
  }

  // Method 2: Full config
  showWithConfig(config: ModalConfig): void {
    this.message = config.message;
    this.type = config.type;
    this.onClose = config.onClose ?? null;
    this.visible = true;
  }

  close(): void {
    this.visible = false;
    if (this.onClose) {
      this.onClose();
    }
  }
}
