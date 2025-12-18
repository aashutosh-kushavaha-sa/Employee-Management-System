export interface EmployeeCreateRequest {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  position: string;
  department: string;
  salary: number;
}
