"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchRouteThunk,
  fetchSeatsThunk,
  bookSeatThunk,
  clearBookingSuccess,
  clearBookingConflict,
  clearUnavailableSeats,
} from "@/store/slices/bookingSlice";
import { SeatRequest, SeatWithAvailability } from "@/types/train";
import { BookingNav } from "@/components/booking/BookingNav";
import { BookingAlert } from "@/components/booking/BookingAlert";
import { BookingResultBanner } from "@/components/booking/BookingResultBanner";
import { RouteLoading } from "@/components/booking/RouteLoading";
import { RouteNotFound } from "@/components/booking/RouteNotFound";
import { JourneyDetailsForm } from "@/components/booking/JourneyDetailsForm";
import { SeatMap } from "@/components/booking/SeatMap";
import { BookingPanel } from "@/components/booking/BookingPanel";
import { bumpRouteClick } from "@/utils/cookie";

export function BookingPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const routeId = params.routeId as string;
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
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [fromStationId, setFromStationId] = useState("");
  const [toStationId, setToStationId] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [selectedSeat, setSelectedSeat] = useState<SeatWithAvailability | null>(
    null,
  );
  const [seatsStale, setSeatsStale] = useState(true);

  useEffect(() => {
    if (routeId) {
      dispatch(fetchRouteThunk(routeId));
      bumpRouteClick(Number(routeId));
    }
  }, [dispatch, routeId]);

  const buildJourneySeatsRequest = (): SeatRequest | null => {
    if (!fromStationId || !toStationId || !travelDate || !routeId) return null;
    return {
      routeId: routeId,
      from: Number(fromStationId),
      to: Number(toStationId),
      date: travelDate,
    };
  };

  const clearJourneyFeedback = () => {
    dispatch(clearBookingSuccess());
    dispatch(clearBookingConflict());
    dispatch(clearUnavailableSeats());
    setSelectedSeat(null);
  };

  const markJourneyDetailsChanged = () => {
    setSeatsStale(true);
    clearJourneyFeedback();
  };

  const updateFromStation = (stationId: string) => {
    setFromStationId(stationId);
    setToStationId("");
    markJourneyDetailsChanged();
  };

  const updateToStation = (stationId: string) => {
    setToStationId(stationId);
    markJourneyDetailsChanged();
  };

  const updateTravelDate = (date: string) => {
    setTravelDate(date);
    markJourneyDetailsChanged();
  };

  const selectSeat = (seat: SeatWithAvailability) => {
    setSelectedSeat(seat);
  };

  const checkSeatAvailability = async () => {
    const request = buildJourneySeatsRequest();
    if (!request) return;

    clearJourneyFeedback();
    const result = await dispatch(fetchSeatsThunk(request));
    if (fetchSeatsThunk.fulfilled.match(result)) {
      setSeatsStale(false);
    }
  };

  const confirmSeatBooking = async () => {
    const canConfirmBooking =
      !!selectedSeat &&
      !seatsStale &&
      !bookingLoading &&
      !!fromStationId &&
      !!toStationId &&
      !!travelDate &&
      !!routeId &&
      !unavailableSeatIds.includes(selectedSeat.seat.id);

    if (!canConfirmBooking) {
      return;
    }

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    await dispatch(
      bookSeatThunk({
        routeId: Number(routeId),
        seatId: selectedSeat.seat.id,
        from: Number(fromStationId),
        to: Number(toStationId),
        date: travelDate,
      }),
    );

    setSelectedSeat(null);

    const seatsRequest = buildJourneySeatsRequest();
    if (seatsRequest) {
      const refresh = await dispatch(fetchSeatsThunk(seatsRequest));
      if (fetchSeatsThunk.fulfilled.match(refresh)) {
        setSeatsStale(false);
      }
    }
  };

  if (loading) {
    return <RouteLoading />;
  }

  if (!routeDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BookingNav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && <BookingAlert message={error} />}
          {validationErrors.routeId && (
            <BookingAlert message={validationErrors.routeId} />
          )}
          <RouteNotFound />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        {error && <BookingAlert message={error} />}

        <BookingResultBanner
          placement="top"
          bookingConflict={bookingConflict}
          bookingSuccess={bookingSuccess}
        />

        {validationErrors.routeId && (
          <BookingAlert message={validationErrors.routeId} />
        )}

        <JourneyDetailsForm
          routeDetails={routeDetails}
          fromStationId={fromStationId}
          toStationId={toStationId}
          travelDate={travelDate}
          seatsStale={seatsStale}
          seatsCount={seats.length}
          seatsLoading={seatsLoading}
          fromValidationError={validationErrors.from}
          toValidationError={validationErrors.to}
          dateValidationError={validationErrors.date}
          onFromStationChange={updateFromStation}
          onToStationChange={updateToStation}
          onTravelDateChange={updateTravelDate}
          onCheckSeats={checkSeatAvailability}
        />

        {seats.length > 0 && (
          <SeatMap
            seats ={seats}
            selectedSeat={selectedSeat}
            seatsStale={seatsStale}
            unavailableSeatIds={unavailableSeatIds}
            onSelectSeat={selectSeat}
          />
        )}

        {seats.length > 0 && (
          <BookingPanel
            routeDetails={routeDetails}
            selectedSeat={selectedSeat}
            fromStationId={fromStationId}
            toStationId={toStationId}
            travelDate={travelDate}
            seatsStale={seatsStale}
            bookingLoading={bookingLoading}
            unavailableSeatIds={unavailableSeatIds}
            bookingConflict={bookingConflict}
            bookingSuccess={bookingSuccess}
            onConfirmBooking={confirmSeatBooking}
          />
        )}
    </div>
  );
}
