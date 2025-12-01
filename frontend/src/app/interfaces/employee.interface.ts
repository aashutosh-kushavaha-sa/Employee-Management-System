export interface Employee {
  _id: string;
  name: string;
  email: string;
  department: string;
  gender: 'Male' | 'Female' | 'Other';
  salary: number;
  age?: number;
  createdAt?: string | Date;
}
