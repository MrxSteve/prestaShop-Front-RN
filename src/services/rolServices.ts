import { API_BASE_URL } from '@env';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {CreateRolRequest,
  CreateRolResponse,
  DeleteRolParams,
  DeleteRolResponse,
  GetRolByIdParams,
  GetRolByIdResponse,
  GetRolByNombreParams,
  GetRolByNombreResponse,
  ListRolesResponse,
  UpdateRolParams,
  UpdateRolRequest,
  UpdateRolResponse, } from '../types/roles';
import { apiService } from './api';


class RolesService {
  private api: AxiosInstance;
  private BASE = '/api/admin/roles';

  constructor() {
    this.api = apiService.getAxiosInstance();
  }

  async list(): Promise<ListRolesResponse> {
    const { data }: AxiosResponse<ListRolesResponse> = await this.api.get(this.BASE);
    return data;
  }

  async getById({ id }: GetRolByIdParams): Promise<GetRolByIdResponse> {
    const { data }: AxiosResponse<GetRolByIdResponse> = await this.api.get(`${this.BASE}/${id}`);
    return data;
  }

  async getByNombre({ nombre }: GetRolByNombreParams): Promise<GetRolByNombreResponse> {
    const { data }: AxiosResponse<GetRolByNombreResponse> = await this.api.get(
      `${this.BASE}/nombre/${encodeURIComponent(nombre)}`
    );
    return data;
  }

  async create(payload: CreateRolRequest): Promise<CreateRolResponse> {
    const { data }: AxiosResponse<CreateRolResponse> = await this.api.post(this.BASE, payload);
    return data;
  }

  async update({ id }: UpdateRolParams, payload: UpdateRolRequest): Promise<UpdateRolResponse> {
    const { data }: AxiosResponse<UpdateRolResponse> = await this.api.put(
      `${this.BASE}/${id}`,
      payload
    );
    return data;
  }

  async remove({ id }: DeleteRolParams): Promise<DeleteRolResponse> {
    const { data }: AxiosResponse<DeleteRolResponse> = await this.api.delete(
      `${this.BASE}/${id}`
    );
    return data;
  }
}

export const rolesService = new RolesService();