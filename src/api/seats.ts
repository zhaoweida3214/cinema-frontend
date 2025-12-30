import request from "./request";
import type { Result } from "@/types";

export interface Seat {
  id: number;
  row: number;
  col: number;
  status: "AVAILABLE" | "LOCKED" | "SOLD";
  type: "NORMAL" | "VIP";
}

export interface SeatMap {
  hallName: string;
  rows: number;
  cols: number;
  seats: Seat[];
}

export interface CreateOrderDTO {
  scheduleId: number;
  seatIds: number[];
}

export interface OrderItem {
  id: number;
  movieTitle: string;
  hallName: string;
  startTime: string;
  seatNumbers: string[];
  status: "PENDING" | "PAID" | "CANCELLED";
  createdAt: string;
}

export const getSeatMap = (scheduleId: number) => {
  return request.get<Result<SeatMap>>(`/schedules/${scheduleId}/seats`);
};

export const lockSeats = (data: CreateOrderDTO) => {
  return request.post<Result<{ orderId: number; expiresAt: string }>>(
    "/orders",
    data
  );
};

export const payOrder = (orderId: number) => {
  return request.put<Result<void>>(`/orders/${orderId}/pay`);
};

export const getMyOrders = () => {
  return request.get<Result<OrderItem[]>>("/orders");
};
