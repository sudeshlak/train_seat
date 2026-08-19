import { trainService } from "@/services/trainService";
import { ITodayBooked } from "@/types/train";
import { cacheLife } from "next/cache";
import { groupSeatsByCoach } from "@/utils/seats";
import { TodayBooked } from "./TodayBooked";

interface SeatPlanProps{
    params:Promise<{routeId:string}>
}

const getSeatPlan = async (routeId:string)=>{
    'use cache'
     cacheLife('days')
     return await trainService.getSeatPlan(routeId);
}

const getTodayBooked = async (routeId:string)=>{
     return await trainService.getTodayBooked(routeId);
}

export default async function SeatPlan({ params }:SeatPlanProps) {
    const { routeId } = await params;
    const seatPlan = await getSeatPlan(routeId);
    const todayBooked = await getTodayBooked(routeId);

    const bookingsBySeatId = new Map<number, ITodayBooked[]>();
    for (const booking of todayBooked) {
        const list = bookingsBySeatId.get(booking.seatId) ?? [];
        list.push(booking);
        bookingsBySeatId.set(booking.seatId, list);
    }

    const seatsByCoach = groupSeatsByCoach(seatPlan);
    const coachEntries = Object.entries(seatsByCoach);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Seats</h3>
            <p className="text-sm text-gray-500 mb-4">
                Click a booked seat to see today&apos;s trips.
            </p>
            {coachEntries.map(([coachNumber, coachSeats]) => {
                const firstSeat = coachSeats[0];

                return (
                    <div key={coachNumber} className="mb-6">
                        <h4 className="text-sm font-medium text-gray-800 mb-2">
                            Coach {coachNumber}
                            {!!firstSeat && (
                                <span className="text-gray-500 font-normal">
                                    {" "}
                                    · {firstSeat.classType.name}
                                </span>
                            )}
                        </h4>
                        <div className="grid grid-cols-8 md:grid-cols-10 gap-1.5 items-stretch">
                            {coachSeats.map((seat) => (
                                <TodayBooked
                                    key={seat.seat.id}
                                    seat={seat}
                                    bookings={bookingsBySeatId.get(seat.seat.id) ?? []}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}