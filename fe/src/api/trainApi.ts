import { axiosClient } from "./axiosClient";
import {
  TrainsResponse,
  RouteDetails,
  SeatRequest,
  SeatWithAvailability,
  BookSeatRequest,
  BookingResponse,
  BookingsResponse,
  AvailableRoutesResponse,
  ITodayBooked,
} from "../types/train";

export const trainApi = {
  getTrains: () => axiosClient.get<TrainsResponse>("/trains"),
  getAvailableRoutes: () => axiosClient.get<AvailableRoutesResponse>("/route/available"),
  getRoute: (routeId: string | number) =>
    axiosClient.get<RouteDetails>(`/route/${routeId}`),
  getSeats: (seatRequest: SeatRequest) =>
    axiosClient.post<SeatWithAvailability[]>("/seats", seatRequest),
  getSeatPlan: (routeId: string) =>
    axiosClient.get<SeatWithAvailability[]>(`/seatPlan/${routeId}`),
  todayBooked: (routeId: string) =>
    axiosClient.get<ITodayBooked[]>(`/todayBooked/${routeId}`),
  bookSeat: (request: BookSeatRequest) =>
    axiosClient.post<BookingResponse>("/book/seat", request),
  getBookings: () => axiosClient.get<BookingsResponse>("/bookings"),
};
