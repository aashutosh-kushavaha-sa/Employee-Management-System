export interface AdminUser {
  _id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}
