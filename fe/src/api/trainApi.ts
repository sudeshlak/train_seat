import { axiosClient } from "./axiosClient";
import { TrainsResponse, RouteDetails, SeatRequest, SeatWithDetails } from "../types/train";

export const trainApi = {
  getTrains: () => axiosClient.get<TrainsResponse>("/trains"),
  getRoute: (routeId: string | number) =>
    axiosClient.get<RouteDetails>(`/route/${routeId}`),
  getSeats: (seatRequest: SeatRequest) =>
    axiosClient.post<SeatWithDetails[]>("/seats", seatRequest),
};
