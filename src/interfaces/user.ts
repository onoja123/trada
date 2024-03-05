export interface IUser {
  firstname: string;
  lastname: string;
  dateOfBirth: Date;
  gender: string;
  phone: string;
  username: string;
  email: string;
  tagNumber: string;
  qrcode: string;
  image?: string;
  bvn?: string;
  password: string;
  isAdmin: boolean;
  isActive: boolean;
  verificationStatus?: string;
  isIdentityVerified?: boolean;
  isProfileCompleted?: boolean;
  token?: string;
  profile: IProfile;
}

export interface IProfile {
  country?: string;
  state?: string;
  apartment?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  image?: string;
  tagNumber?: string;
}

export interface IKyc {
  user: IUser;
  firstname: string;
  lastname: string;
  govId: string;
  proof_of_id: string;
  bvn?: string;
}

export interface UserResponse {
  user: IUser;
  profile: IProfile;
}

export interface UsersResponse {
  users: IUser[];
  totalUsers: number;
}