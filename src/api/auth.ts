// src/api/auth.ts
import request from './request'
import type { Result } from '@/types'

export interface LoginDTO {
  username: string
  password: string
}

export interface UserInfo {
  id: number
  username: string
  name: string
  token: string
}

export const login = (data: LoginDTO) => {
  return request.post<Result<UserInfo>>('/login', data)
}
