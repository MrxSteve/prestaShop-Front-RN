export interface RolResponse {
  id: number;
  nombre: string;
}

export interface ListRolesQuery {
  page: number;
  size: number;
  sort: string[];
}

export type ListRolesResponse = RolResponse[];

export interface GetRolByIdParams {
  id: number | string;
}
export type GetRolByIdResponse = RolResponse;

export interface GetRolByNombreParams {
  nombre: string;
}
export type GetRolByNombreResponse = RolResponse;

export interface CreateRolRequest {
  id?: number;
  nombre: string;
}
export type CreateRolResponse = RolResponse;

export interface UpdateRolParams {
  id: number | string;
}
export interface UpdateRolRequest {
  id?: number;
  nombre: string;
}
export type UpdateRolResponse = RolResponse;

export interface DeleteRolParams {
  id: number | string;
}
export interface DeleteRolResponse {
  message?: string;
}
