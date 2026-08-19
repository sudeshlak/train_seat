"use client";

import { RouteDetails, SeatWithAvailability } from "@/types/train";
import { BookingResultBanner } from "@/components/booking/BookingResultBanner";

interface BookingSuccessSummary {
  message: string;
  amount: number;
}

interface BookingPanelProps {
  routeDetails: RouteDetails;
  selectedSeat: SeatWithAvailability | null;
  fromStationId: string;
  toStationId: string;
  travelDate: string;
  seatsStale: boolean;
  bookingLoading: boolean;
  unavailableSeatIds: number[];
  bookingConflict: string | null;
  bookingSuccess: BookingSuccessSummary | null;
  onConfirmBooking: () => void;
}

function getStationName(routeDetails: RouteDetails, stationId: string) {
  return routeDetails.stopOrder.find(
    (stop) => String(stop.station.id) === String(stationId),
  )?.station.name;
}

export function BookingPanel({
  routeDetails,
  selectedSeat,
  fromStationId,
  toStationId,
  travelDate,
  seatsStale,
  bookingLoading,
  unavailableSeatIds,
  bookingConflict,
  bookingSuccess,
  onConfirmBooking,
}: BookingPanelProps) {
  const fromStationName = getStationName(routeDetails, fromStationId);
  const toStationName = getStationName(routeDetails, toStationId);
  const showSelectionSummary = !!selectedSeat && !seatsStale;
  const emptyStateMessage = seatsStale
    ? "Check for seats after updating journey details, then select a seat."
    : "Select an available seat above to confirm a booking.";
  const confirmButtonLabel = bookingLoading ? "Booking..." : "Confirm Booking";
  const isSelectedSeatUnavailable =
    !!selectedSeat && unavailableSeatIds.includes(selectedSeat.seat.id);
  const confirmDisabled =
    bookingLoading ||
    seatsStale ||
    !selectedSeat ||
    isSelectedSeatUnavailable;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Booking</h3>
      {showSelectionSummary && selectedSeat ? (
        <div className="space-y-2 mb-4">
          <p className="text-gray-700">
            <span className="font-medium">Seat:</span> {selectedSeat.seat.number}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Coach:</span>{" "}
            {selectedSeat.coach.number}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Class:</span>{" "}
            {selectedSeat.classType.name}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">From:</span> {fromStationName}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">To:</span> {toStationName}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Date:</span> {travelDate}
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-4">{emptyStateMessage}</p>
      )}
      <button
        onClick={onConfirmBooking}
        disabled={confirmDisabled}
        className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {confirmButtonLabel}
      </button>
      <BookingResultBanner
        placement="bottom"
        bookingConflict={bookingConflict}
        bookingSuccess={bookingSuccess}
      />
    </div>
  );
}
