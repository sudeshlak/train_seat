import { SeatWithDetails } from "@/types/train";

export function groupSeatsByCoach(
  seats: SeatWithDetails[],
): Record<string, SeatWithDetails[]> {
  return seats.reduce(
    (acc, seat) => {
      const coachNumber = String(seat.coach.number);
      if (!acc[coachNumber]) {
        acc[coachNumber] = [];
      }
      acc[coachNumber].push(seat);
      return acc;
    },
    {} as Record<string, SeatWithDetails[]>,
  );
}

export function isSeatSelectable(
  seat: SeatWithDetails,
  seatsStale: boolean,
  unavailableSeatIds: number[],
): boolean {
  return (
    !seatsStale &&
    seat.available &&
    !unavailableSeatIds.includes(seat.seat.id)
  );
}
