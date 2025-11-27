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

  show(config: ModalConfig | string, onConfirm?: () => void) {
    if (typeof config === 'string') {
      // Backward compatibility with string message
      this.message = config;
      this.onConfirm = onConfirm || null;
      this.requiresVerification = false;
      this.confirmText = "Delete";
      this.cancelText = "Cancel";
      this.title = "Confirmation Required";
    } else {
      // New configuration object
      this.message = config.message;
      this.onConfirm = config.onConfirm;
      this.requiresVerification = config.requiresVerification || false;
      this.confirmText = config.confirmText || "Delete";
      this.cancelText = config.cancelText || "Cancel";
      this.title = config.title || "Confirmation Required";
    }
    
    (document.getElementById('confirmModal') as any).showModal();
  }

  confirm() {
    (document.getElementById('confirmModal') as any).close();
    this.resetVerification();
    if (this.onConfirm) {
      this.onConfirm();
    }
  }

  cancel() {
    (document.getElementById('confirmModal') as any).close();
    this.resetVerification();
  }

  private resetVerification() {
    this.requiresVerification = false;
  }
}