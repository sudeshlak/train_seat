"use client";

import { useEffect, useState } from "react";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchRouteThunk,
  fetchSeatsThunk,
  bookSeatThunk,
  clearBookingSuccess,
  clearBookingConflict,
  clearUnavailableSeats,
} from "@/store/slices/bookingSlice";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { SeatWithDetails } from "@/types/train";
import { ErrorType } from "@/api/errors";

const COLOMBO_TZ = "Asia/Colombo";

function getColomboDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: COLOMBO_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const lookup = Object.fromEntries(
    parts.filter((p) => p.type !== "literal").map((p) => [p.type, p.value]),
  );

  return {
    year: Number(lookup.year),
    month: Number(lookup.month),
    day: Number(lookup.day),
    hour: Number(lookup.hour),
    minute: Number(lookup.minute),
  };
}

function formatYmd(year: number, month: number, day: number) {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function addOneDay(year: number, month: number, day: number) {
  const utc = new Date(Date.UTC(year, month - 1, day));
  utc.setUTCDate(utc.getUTCDate() + 1);
  return {
    year: utc.getUTCFullYear(),
    month: utc.getUTCMonth() + 1,
    day: utc.getUTCDate(),
  };
}

function parseDepartureHm(departureTime: string): { hour: number; minute: number } | null {
  const match = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(departureTime.trim());
  if (!match) return null;
  return { hour: Number(match[1]), minute: Number(match[2]) };
}

const getClassColor = (className: string): string => {
  const key = className.trim().toLowerCase();
  const colors: Record<string, string> = {
    "1st class": "bg-purple-100 border-purple-300 text-purple-800",
    "first class": "bg-purple-100 border-purple-300 text-purple-800",
    "2nd class": "bg-blue-100 border-blue-300 text-blue-800",
    "second class": "bg-blue-100 border-blue-300 text-blue-800",
    "3rd class": "bg-green-100 border-green-300 text-green-800",
    "third class": "bg-green-100 border-green-300 text-green-800",
    sleeper: "bg-yellow-100 border-yellow-300 text-yellow-800",
    ac: "bg-red-100 border-red-300 text-red-800",
  };
  return colors[key] || "bg-gray-100 border-gray-300 text-gray-800";
};

export default function BookingPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const routeId = params.routeId as string;

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const {
    routeDetails,
    seats,
    loading,
    seatsLoading,
    bookingLoading,
    bookingSuccess,
    bookingConflict,
    unavailableSeatIds,
    error,
    validationErrors,
  } = useAppSelector((state) => state.booking);

  const [fromStationId, setFromStationId] = useState("");
  const [toStationId, setToStationId] = useState("");
  const [date, setDate] = useState("");
  const [selectedSeat, setSelectedSeat] = useState<SeatWithDetails | null>(
    null,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (routeId) {
      dispatch(fetchRouteThunk(routeId));
    }
  }, [dispatch, routeId, isAuthenticated, router]);

  const journeySeatsRequest = () =>
    fromStationId && toStationId && date && routeId
      ? {
          routeId: Number(routeId),
          from: Number(fromStationId),
          to: Number(toStationId),
          date,
        }
      : null;

  const resetJourneyFeedback = () => {
    dispatch(clearBookingSuccess());
    dispatch(clearBookingConflict());
    dispatch(clearUnavailableSeats());
    setSelectedSeat(null);
  };

  const handleFetchSeats = () => {
    const request = journeySeatsRequest();
    if (request) {
      resetJourneyFeedback();
      dispatch(fetchSeatsThunk(request));
    }
  };

  const handleBookSeat = async () => {
    if (!selectedSeat || !fromStationId || !toStationId || !date || !routeId) {
      return;
    }

    const seatId = selectedSeat.seat.id;
    const result = await dispatch(
      bookSeatThunk({
        routeId: Number(routeId),
        seatId,
        from: Number(fromStationId),
        to: Number(toStationId),
        date,
      }),
    );

    setSelectedSeat(null);

    const seatsRequest = journeySeatsRequest();
    if (seatsRequest) {
      dispatch(fetchSeatsThunk(seatsRequest));
    }

    if (bookSeatThunk.rejected.match(result)) {
      const payload = result.payload as
        | { type: ErrorType; message: string; seatId?: number }
        | undefined;
      if (payload?.type === ErrorType.CONFLICT) {
        // Conflict message + unavailable seat already set in slice
        return;
      }
    }
  };

  const formatDepartureTime = (timeString: string) => {
    if (timeString.includes("T") || timeString.includes("-")) {
      const parsed = new Date(timeString);
      return parsed.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
    return timeString;
  };

  const getMinDate = () => {
    const now = getColomboDateParts();
    const today = formatYmd(now.year, now.month, now.day);
    const departure = routeDetails
      ? parseDepartureHm(routeDetails.departureTime)
      : null;

    if (!departure) {
      return today;
    }

    const pastDeparture =
      now.hour > departure.hour ||
      (now.hour === departure.hour && now.minute > departure.minute);

    if (pastDeparture) {
      const tomorrow = addOneDay(now.year, now.month, now.day);
      return formatYmd(tomorrow.year, tomorrow.month, tomorrow.day);
    }

    return today;
  };

  const getAvailableToStations = (fromOrder: number) => {
    if (!routeDetails) return [];
    return routeDetails.stopOrder.filter((stop) => stop.order > fromOrder);
  };

  const findStopByStationId = (stationId: string) =>
    routeDetails?.stopOrder.find(
      (s) => String(s.station.id) === String(stationId),
    );

  // Group seats by coach
  const seatsByCoach = seats.reduce(
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading route details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/home" className="text-xl font-bold text-gray-900">
                Train Seat Booking
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.email}</span>
              <Link
                href="/home"
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {bookingConflict && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {bookingConflict}
          </div>
        )}

        {bookingSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-6">
            <p className="font-medium">{bookingSuccess.message}</p>
            <p className="text-sm mt-1">
              Amount: LKR {bookingSuccess.amount.toFixed(2)}
            </p>
            <Link
              href="/bookings"
              className="inline-block mt-2 text-sm font-medium text-green-900 underline"
            >
              View my bookings
            </Link>
          </div>
        )}

        {validationErrors.routeId && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {validationErrors.routeId}
          </div>
        )}

        {routeDetails ? (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {routeDetails.trainName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Departure Time
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDepartureTime(routeDetails.departureTime)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  Route Stops
                </p>
                <div className="flex flex-wrap gap-2">
                  {routeDetails.stopOrder.map((stop, index) => (
                    <React.Fragment key={stop.station.id}>
                      <span className="text-sm text-gray-700">
                        {stop.order}. {stop.station.name}
                      </span>
                      {index < routeDetails.stopOrder.length - 1 && (
                        <span className="text-gray-400">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Select Journey Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Station
                  </label>
                  <select
                    value={fromStationId}
                    onChange={(e) => {
                      setFromStationId(e.target.value);
                      setToStationId("");
                      resetJourneyFeedback();
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select from station</option>
                    {routeDetails.stopOrder.map((stop) => (
                      <option
                        key={stop.station.id}
                        value={String(stop.station.id)}
                      >
                        {stop.order}. {stop.station.name}
                      </option>
                    ))}
                  </select>
                  {fromStationId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Selected: {findStopByStationId(fromStationId)?.station.name}
                    </p>
                  )}
                  {validationErrors.from && (
                    <p className="text-red-600 text-sm mt-1">
                      {validationErrors.from}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Station
                  </label>
                  <select
                    value={toStationId}
                    onChange={(e) => {
                      setToStationId(e.target.value);
                      resetJourneyFeedback();
                    }}
                    disabled={!fromStationId}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select to station</option>
                    {fromStationId &&
                      (() => {
                        const fromStop = findStopByStationId(fromStationId);
                        if (!fromStop) return null;
                        const availableStations = getAvailableToStations(
                          fromStop.order,
                        );
                        if (availableStations.length === 0) {
                          return (
                            <option disabled>No stations available</option>
                          );
                        }
                        return availableStations.map((stop) => (
                          <option
                            key={stop.station.id}
                            value={String(stop.station.id)}
                          >
                            {stop.order}. {stop.station.name}
                          </option>
                        ));
                      })()}
                  </select>
                  {toStationId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Selected: {findStopByStationId(toStationId)?.station.name}
                    </p>
                  )}
                  {validationErrors.to && (
                    <p className="text-red-600 text-sm mt-1">
                      {validationErrors.to}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      resetJourneyFeedback();
                    }}
                    min={getMinDate()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {date && (
                    <p className="text-xs text-gray-500 mt-1">
                      Selected:{" "}
                      {new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}
                  {validationErrors.date && (
                    <p className="text-red-600 text-sm mt-1">
                      {validationErrors.date}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleFetchSeats}
                disabled={!fromStationId || !toStationId || !date}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {seatsLoading ? "Loading..." : "Check for Seats"}
              </button>
            </div>

            {seats.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  Available Seats
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Only online-bookable coaches are shown.
                </p>
                {Object.entries(seatsByCoach).map(
                  ([coachNumber, coachSeats]) => (
                    <div key={coachNumber} className="mb-6">
                      <h4 className="text-lg font-medium text-gray-800 mb-3">
                        Coach {coachNumber}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {coachSeats.map((seat) => {
                          const unavailable = unavailableSeatIds.includes(
                            seat.seat.id,
                          );
                          return (
                            <button
                              key={seat.seat.id}
                              type="button"
                              disabled={unavailable}
                              onClick={() => {
                                if (!unavailable) {
                                  setSelectedSeat(seat);
                                }
                              }}
                              className={`p-4 rounded-lg border-2 transition-all ${getClassColor(seat.classType.name)} ${
                                selectedSeat?.seat.id === seat.seat.id
                                  ? "ring-2 ring-offset-2 ring-indigo-600"
                                  : ""
                              } ${
                                unavailable
                                  ? "opacity-40 cursor-not-allowed grayscale"
                                  : ""
                              }`}
                            >
                              <div className="text-center">
                                <p className="font-semibold">
                                  {seat.seat.number}
                                </p>
                                <p className="text-xs opacity-75">
                                  {unavailable
                                    ? "Unavailable"
                                    : seat.classType.name}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}

            {selectedSeat && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Booking Summary
                </h3>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-700">
                    <span className="font-medium">Seat:</span>{" "}
                    {selectedSeat.seat.number}
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
                    <span className="font-medium">From:</span>{" "}
                    {findStopByStationId(fromStationId)?.station.name}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">To:</span>{" "}
                    {findStopByStationId(toStationId)?.station.name}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Date:</span> {date}
                  </p>
                </div>
                <button
                  onClick={handleBookSeat}
                  disabled={
                    bookingLoading ||
                    unavailableSeatIds.includes(selectedSeat.seat.id)
                  }
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Route not found.</p>
            <Link
              href="/home"
              className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Browse Trains
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
