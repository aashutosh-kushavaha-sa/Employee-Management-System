import { Injectable } from '@angular/core';

export interface ModalConfig {
  message: string;
  onConfirm: () => void;
  requiresVerification?: boolean;
  confirmText?: string;
  cancelText?: string;
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmModalService {
  message = "";
  onConfirm: (() => void) | null = null;
  requiresVerification = false;
  confirmText = "Delete";
  cancelText = "Cancel";
  title = "Confirmation Required";
  visible = false;

  show(config: ModalConfig | string, onConfirm?: () => void) {
    if (typeof config === 'string') {
      this.message = config;
      this.onConfirm = onConfirm || null;
      this.requiresVerification = false;
      this.confirmText = "Delete";
      this.cancelText = "Cancel";
      this.title = "Confirmation Required";
    } else {
      this.message = config.message;
      this.onConfirm = config.onConfirm;
      this.requiresVerification = config.requiresVerification || false;
      this.confirmText = config.confirmText || "Delete";
      this.cancelText = config.cancelText || "Cancel";
      this.title = config.title || "Confirmation Required";
    }
    
    this.visible = true;
  }

  confirm() {
    this.visible = false;
    this.resetVerification();
    if (this.onConfirm) {
      this.onConfirm();
    }
  }

  cancel() {
    this.visible = false;
    this.resetVerification();
  }

  private resetVerification() {
    this.requiresVerification = false;
  }
}