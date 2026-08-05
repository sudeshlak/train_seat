"use client";

import { RouteDetails, StopOrder } from "@/types/train";
import { getMinBookableDate } from "@/utils/departureTime";

interface JourneyDetailsFormProps {
  routeDetails: RouteDetails;
  fromStationId: string;
  toStationId: string;
  travelDate: string;
  seatsStale: boolean;
  seatsCount: number;
  seatsLoading: boolean;
  fromValidationError?: string;
  toValidationError?: string;
  dateValidationError?: string;
  onFromStationChange: (stationId: string) => void;
  onToStationChange: (stationId: string) => void;
  onTravelDateChange: (date: string) => void;
  onCheckSeats: () => void;
}

function getDestinationStops(
  stopOrder: StopOrder[],
  fromStationId: string,
): StopOrder[] {
  if (!fromStationId) return [];
  const fromStop = stopOrder.find(
    (stop) => String(stop.station.id) === String(fromStationId),
  );
  if (!fromStop) return [];
  return stopOrder.filter((stop) => stop.order > fromStop.order);
}

export function JourneyDetailsForm({
  routeDetails,
  fromStationId,
  toStationId,
  travelDate,
  seatsStale,
  seatsCount,
  seatsLoading,
  fromValidationError,
  toValidationError,
  dateValidationError,
  onFromStationChange,
  onToStationChange,
  onTravelDateChange,
  onCheckSeats,
}: JourneyDetailsFormProps) {
  const destinationStops = getDestinationStops(
    routeDetails.stopOrder,
    fromStationId,
  );
  const minBookableDate = getMinBookableDate(routeDetails.departureTime);
  const checkSeatsLabel = seatsLoading ? "Loading..." : "Check for Seats";

  return (
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
            onChange={(e) => onFromStationChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select from station</option>
            {routeDetails.stopOrder.map((stop) => (
              <option key={stop.station.id} value={String(stop.station.id)}>
                {stop.order}. {stop.station.name}
              </option>
            ))}
          </select>
          {fromValidationError && (
            <p className="text-red-600 text-sm mt-1">{fromValidationError}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Station
          </label>
          <select
            value={toStationId}
            onChange={(e) => onToStationChange(e.target.value)}
            disabled={!fromStationId}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
          >
            <option value="">Select to station</option>
            {fromStationId && !destinationStops.length && (
              <option disabled>No stations available</option>
            )}
            {!!destinationStops.length &&
              destinationStops.map((stop) => (
                <option key={stop.station.id} value={String(stop.station.id)}>
                  {stop.order}. {stop.station.name}
                </option>
              ))}
          </select>
          {toValidationError && (
            <p className="text-red-600 text-sm mt-1">{toValidationError}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={travelDate}
            onChange={(e) => onTravelDateChange(e.target.value)}
            min={minBookableDate}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {dateValidationError && (
            <p className="text-red-600 text-sm mt-1">{dateValidationError}</p>
          )}
        </div>
      </div>
      <button
        onClick={onCheckSeats}
        disabled={!fromStationId || !toStationId || !travelDate}
        className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {checkSeatsLabel}
      </button>
      {seatsStale && seatsCount > 0 && (
        <p className="text-sm text-amber-700 mt-2">
          Journey details changed. Hit Check for Seats to update availability.
        </p>
      )}
    </div>
  );
}
