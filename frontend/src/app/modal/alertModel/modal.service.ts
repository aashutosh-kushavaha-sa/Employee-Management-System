import { Injectable } from '@angular/core';

export interface ModalConfig {
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  message = "";
  type: 'success' | 'error' | 'warning' = 'success';
  onClose: (() => void) | null = null;
  visible = false;

  // Method 1: Simple string with type
  show(
    msg: string,
    type: 'success' | 'error' | 'warning' = 'success',
    onClose?: () => void
  ) {
    this.message = msg;
    this.type = type;
    this.onClose = onClose ?? null;
    this.visible = true;
  }

  // Method 2: Configuration object (more flexible)
  showWithConfig(config: ModalConfig) {
    this.message = config.message;
    this.type = config.type;
    this.onClose = config.onClose ?? null;
    this.visible = true;
  }

  close() {
    this.visible = false;
    if (this.onClose) {
      this.onClose();
    }
  }
}