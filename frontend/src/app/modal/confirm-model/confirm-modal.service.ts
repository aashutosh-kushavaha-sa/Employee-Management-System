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
  message: string = "";
  onConfirm: (() => void) | null = null;
  requiresVerification: boolean = false;
  confirmText: string = "Delete";
  cancelText: string = "Cancel";
  title: string = "Confirmation Required";
  visible: boolean = false;

  show(config: ModalConfig | string, onConfirm?: () => void): void {
    if (typeof config === 'string') {
      this.message = config;
      this.onConfirm = onConfirm ?? null;

      this.requiresVerification = false;
      this.confirmText = "Delete";
      this.cancelText = "Cancel";
      this.title = "Confirmation Required";

    } else {
      this.message = config.message;
      this.onConfirm = config.onConfirm;
      this.requiresVerification = config.requiresVerification ?? false;
      this.confirmText = config.confirmText ?? "Delete";
      this.cancelText = config.cancelText ?? "Cancel";
      this.title = config.title ?? "Confirmation Required";
    }

    this.visible = true;
  }

  confirm(): void {
    this.visible = false;
    this.resetVerification();
    this.onConfirm?.();
  }

  cancel(): void {
    this.visible = false;
    this.resetVerification();
  }

  private resetVerification(): void {
    this.requiresVerification = false;
  }
}
