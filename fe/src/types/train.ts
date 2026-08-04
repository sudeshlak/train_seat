export interface Train {
  trainName: string;
  departureTime: string;
  from: string;
  to: string;
  stopStations: string[];
}

export interface TrainsResponse {
  trains: Train[];
}
