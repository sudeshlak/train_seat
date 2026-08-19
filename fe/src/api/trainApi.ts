import { axiosClient } from "./axiosClient";
import {
  TrainsResponse,
  RouteDetails,
  SeatRequest,
  SeatWithDetails,
  BookSeatRequest,
  BookingResponse,
  BookingsResponse,
  AvailableRoutesResponse,
} from "../types/train";

export const trainApi = {
  getTrains: () => axiosClient.get<TrainsResponse>("/trains"),
  getAvailableRoutes: () => axiosClient.get<AvailableRoutesResponse>("/route/available"),
  getRoute: (routeId: string | number) =>
    axiosClient.get<RouteDetails>(`/route/${routeId}`),
  getSeats: (seatRequest: SeatRequest) =>
    axiosClient.post<SeatWithDetails[]>("/seats", seatRequest),
  bookSeat: (request: BookSeatRequest) =>
    axiosClient.post<BookingResponse>("/book/seat", request),
  getBookings: () => axiosClient.get<BookingsResponse>("/bookings"),
};
