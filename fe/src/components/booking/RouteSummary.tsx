import { Fragment } from "react";
import { formatDepartureTime } from "@/utils/departureTime";
import { trainService } from "@/services/trainService";

interface RouteSummaryProps {
  params:Promise<{routeId: number}>
}

export async function RouteSummary({ params }: RouteSummaryProps) {
  const { routeId } = await params;
  const routeDetails = await trainService.getRoute(routeId);

  const formattedDeparture = formatDepartureTime(routeDetails.departureTime);
  const lastStopIndex = routeDetails.stopOrder.length - 1;

  return (
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
            {formattedDeparture}
          </p>
        </div>
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
          Route Stops
        </p>
        <div className="flex flex-wrap gap-2">
          {routeDetails.stopOrder.map((stop, index) => {
            const hasNextStop = index < lastStopIndex;
            return (
              <Fragment key={stop.station.id}>
                <span className="text-sm text-gray-700">
                  {stop.order}. {stop.station.name}
                </span>
                {hasNextStop && <span className="text-gray-400">→</span>}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
