export interface UserModel {
  id: number;
  roles: Array<RoleModel>;
  name: string;
  surname: string;
  active: boolean;
  serialNumber: string;
  email: string;
}

export interface RoleModel {
  id: number;
  description: string;
  checked: boolean;
}
