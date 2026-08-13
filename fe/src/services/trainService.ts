import { trainApi } from "@/api/trainApi"

export const trainService = {
    getTrains:async ()=>{
        const {data} =  await trainApi.getTrains();
        return data.trains
    }
}