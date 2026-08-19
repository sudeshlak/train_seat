"use client";

import { SeatWithAvailability } from "@/types/train";
import { SeatButton } from "@/components/booking/SeatButton";
import { groupSeatsByCoach, isSeatSelectable } from "@/utils/seats";

interface SeatMapProps {
  seats: SeatWithAvailability[];
  selectedSeat: SeatWithAvailability | null;
  seatsStale: boolean;
  unavailableSeatIds: number[];
  onSelectSeat: (seat: SeatWithAvailability) => void;
}

export function SeatMap({
  seats,
  selectedSeat,
  seatsStale,
  unavailableSeatIds,
  onSelectSeat,
}: SeatMapProps) {
  const seatsByCoach = groupSeatsByCoach(seats);
  const coachEntries = Object.entries(seatsByCoach);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-1">Seats</h3>
      <p className="text-sm text-gray-500 mb-4">
        Only online-bookable coaches are shown. Gray seats are taken or locked
        until you check again.
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
              {coachSeats.map((seat) => {
                const isSelectable = isSeatSelectable(
                  seat,
                  seatsStale,
                  unavailableSeatIds,
                );
                const isSelected = selectedSeat?.seat.id === seat.seat.id;
                return (
                  <SeatButton
                    key={seat.seat.id}
                    seat={seat}
                    isSelectable={isSelectable}
                    isSelected={!!isSelected}
                    onSelect={onSelectSeat}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
