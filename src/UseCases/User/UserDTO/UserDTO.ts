export interface UserDTO {
  name: string
  email: string
  password: string
  bio?: string
  picture?: string
  site?: string
  site_admin?: boolean
}

export interface UpdateUser {
  id: string;
  name: string;
  bio?: string;
  picture?: string;
  site?: string;
  site_admin?: boolean;
}