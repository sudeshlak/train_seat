import { axiosClient } from "./axiosClient";
import { TrainsResponse } from "../types/train";

export const trainApi = {
  getTrains: () => axiosClient.get<TrainsResponse>("/trains"),
};
