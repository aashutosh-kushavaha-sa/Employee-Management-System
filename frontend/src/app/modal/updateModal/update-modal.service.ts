import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Employee } from '../../interfaces/employee.interface';
import { EmployeeUpdate } from '../../interfaces/employee-update.interface';

export interface UpdateModalPayload {
  visible: boolean;
  employee: Employee | null;
}

@Injectable({ providedIn: 'root' })
export class UpdateModalService {

  private state$ = new BehaviorSubject<UpdateModalPayload>({
    visible: false,
    employee: null
  });

  state = this.state$.asObservable();

  private resolver: ((value: EmployeeUpdate | null) => void) | null = null;

  show(employee: Employee): Promise<EmployeeUpdate | null> {
    this.state$.next({ visible: true, employee });

    return new Promise<EmployeeUpdate | null>((resolve) => {
      this.resolver = resolve;
    });
  }

  confirm(updated: EmployeeUpdate): void {
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
