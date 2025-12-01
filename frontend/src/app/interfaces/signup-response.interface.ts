export interface AdminUser {
  _id: string;
  name: string;
  email: string;
}

export interface SignupResponse {
  token: string;
  user: AdminUser;
}
