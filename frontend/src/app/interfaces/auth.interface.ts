export interface LoginResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}


export interface SignUpResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}
