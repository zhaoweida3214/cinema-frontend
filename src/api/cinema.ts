import request from './request'
import type { Result } from '@/types'

export interface Cinema {
  id: number
  name: string
  location: string
}

export interface Schedule {
  id: number
  movieId: number
  movieTitle: string
  hallId: number
  hallName: string
  startTime: string
  endTime: string
}

export const getCinemas = () => {
  return request.get<Result<Cinema[]>>('/cinemas')
}

export const getSchedules = (params: { cinemaId: number; date?: string }) => {
  return request.get<Result<Schedule[]>>('/schedules', { params })
}
