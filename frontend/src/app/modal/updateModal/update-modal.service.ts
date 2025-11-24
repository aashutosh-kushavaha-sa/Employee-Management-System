import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UpdateModalPayload {
  visible: boolean;
  employee: any | null;
}

@Injectable({ providedIn: 'root' })
export class UpdateModalService {
  private state$ = new BehaviorSubject<UpdateModalPayload>({ visible: false, employee: null });
  state = this.state$.asObservable();

  // internal resolver for promise returned to caller
  private resolver: ((value?: any) => void) | null = null;

  show(employee: any): Promise<any> {
    // Open modal with provided employee data
    this.state$.next({ visible: true, employee });

    // return a promise that resolves when modal confirms (or rejects on cancel)
    return new Promise((resolve) => {
      this.resolver = resolve;
    });
  }

  // Called from modal component when user clicks Update (with updated employee)
  confirm(updatedEmployee: any) {
    // close modal
    this.state$.next({ visible: false, employee: null });

    if (this.resolver) {
      this.resolver(updatedEmployee);
      this.resolver = null;
    }
  }

  // Called from modal component when user clicks Cancel
  cancel() {
    this.state$.next({ visible: false, employee: null });
    if (this.resolver) {
      this.resolver(null);
      this.resolver = null;
    }
  }
}
