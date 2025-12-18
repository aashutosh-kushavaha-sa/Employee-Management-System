import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Employee } from '../../interfaces/employee.interface';

export interface UpdateModalPayload {
  visible: boolean;
  employee: Employee | null;
}

@Injectable({ providedIn: 'root' })
export class UpdateModalService {
  private state$ = new BehaviorSubject<UpdateModalPayload>({
    visible: false,
    employee: null,
  });

  state = this.state$.asObservable();

  private resolver: ((value: Employee | PromiseLike<Employee | null> | null) => void) | null = null;

  show(employee: Employee): Promise<Employee | null> {
    this.state$.next({ visible: true, employee });

    return new Promise<EmployeeUpdate | null>((resolve) => {
      this.resolver = resolve;
    });
  }

  confirm(updated: Employee) {
    this.state$.next({ visible: false, employee: null });
    this.resolver?.(updated);
    this.resolver = null;
  }

  cancel(): void {
    this.state$.next({ visible: false, employee: null });
    this.resolver?.(null);
    this.resolver = null;
  }
}
