export interface Train {
  routeId: number;
  trainName: string;
  departureTime: string;
  from: string;
  to: string;
  stopStations: string[];
}

export interface TrainsResponse {
  trains: Train[];
}

export interface Station {
  id: number;
  name: string;
}

export interface StopOrder {
  order: number;
  station: Station;
}

export interface RouteDetails {
  trainName: string;
  departureTime: string;
  stopOrder: StopOrder[];
}

export interface Seat {
  id: number;
  number: number;
}

export interface Coach {
  id: number;
  number: number;
}

export interface ClassType {
  id: number;
  name: string;
}

export interface SeatDetails{
  seat: Seat;
  coach: Coach;
  classType: ClassType;
}

export interface SeatWithAvailability extends SeatDetails{
  available: boolean;
}

export interface SeatRequest {
  routeId: string;
  from: number;
  to: number;
  date: string;
}

export interface SeatValidationError {
  routeId?: string;
  from?: string;
  to?: string;
  date?: string;
}

export interface BookSeatRequest {
  routeId: number;
  seatId: number;
  from: number;
  to: number;
  date: string;
}

export interface BookingResponse {
  id: number;
  status: string;
  amount: number;
  date: string;
  trainName: string;
  routeId: number;
  seat: Seat;
  coach: Coach;
  classType: ClassType;
  fromStation: Station;
  toStation: Station;
  message?: string | null;
}

export interface AvailableRoutesResponse {
  routes: number[];
}

export interface BookingsResponse {
  bookings: BookingResponse[];
}

export interface ITodayBooked {
  seatId: number;
  startStation: string;
  endStation: string;
}
