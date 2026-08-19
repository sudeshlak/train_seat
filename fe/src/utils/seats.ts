import { SeatDetails, SeatWithAvailability } from "@/types/train";

export function groupSeatsByCoach<T extends SeatDetails>(
  seats: T[],
): Record<string, T[]> {
  return seats.reduce(
    (acc, seat) => {
      const coachNumber = String(seat.coach.number);
      if (!acc[coachNumber]) {
        acc[coachNumber] = [];
      }
      acc[coachNumber].push(seat);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

export function isSeatSelectable(
  seat: SeatWithAvailability,
  seatsStale: boolean,
  unavailableSeatIds: number[],
): boolean {
  return (
    !seatsStale &&
    seat.available &&
    !unavailableSeatIds.includes(seat.seat.id)
  );
}
