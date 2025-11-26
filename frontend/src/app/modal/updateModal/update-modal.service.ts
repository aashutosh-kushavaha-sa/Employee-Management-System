import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UpdateModalPayload {
  visible: boolean;
  employee: any | null;
}

@Injectable({ providedIn: 'root' })
export class UpdateModalService {

  private state$ = new BehaviorSubject<UpdateModalPayload>({
    visible: false,
    employee: null
  });

  state = this.state$.asObservable();

  private resolver: ((value?: any) => void) | null = null;

  show(employee: any): Promise<any> {
    this.state$.next({ visible: true, employee });

    return new Promise((resolve) => {
      this.resolver = resolve;
    });
  }

  confirm(updated: any) {
    this.state$.next({ visible: false, employee: null });

    if (this.resolver) {
      this.resolver(updated);
      this.resolver = null;
    }
  }

  cancel() {
    this.state$.next({ visible: false, employee: null });

    if (this.resolver) {
      this.resolver(null);
      this.resolver = null;
    }
  }
}
