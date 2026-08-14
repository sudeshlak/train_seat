import { trainApi } from "@/api/trainApi"

export const trainService = {
    getTrains:async ()=>{
        const {data} =  await trainApi.getTrains();
        return data.trains
    },
    getRoute:async (routeId: string | number)=>{
        const {data} =  await trainApi.getRoute(routeId);
        return data
    },
    getSeats:async (seatRequest: any)=>{
        const {data} =  await trainApi.getSeats(seatRequest);
        return data
    },
    bookSeat:async (request: any)=>{
        const {data} =  await trainApi.bookSeat(request);
        return data
    },
    getBookings:async ()=>{
        const {data} =  await trainApi.getBookings();
        return data.bookings
    },
    avaialableRoutes:async ()=>{
        const {data} =  await trainApi.getAvailableRoutes();
        return data.routes
    }
}