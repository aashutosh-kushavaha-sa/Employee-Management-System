export interface EmployeeResponse {
  message: string;
  employee?: {
    _id: string;
    name: string;
    age: number;
    gender: string;
    email: string;
    position: string;
    department: string;
    salary: number;
  };
}
