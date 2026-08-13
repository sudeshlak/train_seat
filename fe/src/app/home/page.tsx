import NavBar from "@/components/ui/NavBar";
import { trainService } from "@/services/trainService";
import { formatDepartureTime } from "@/utils/departureTime";
import Link from "next/link";

export const dynamic = "force-static";

export default async function HomePage() {

  const trains = await trainService.getTrains();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Train Seat Booking
              </h1>
            </div>
            <NavBar/>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Available Trains
        </h2>
        {trains.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No trains available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {trains.map((train) => (
              <div
                key={train.routeId}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {train.trainName}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {train.from} → {train.to}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Departure: {formatDepartureTime(train.departureTime)}
                    </p>
                    {train.stopStations && train.stopStations.length > 0 && (
                      <div className="mt-2">
                        <p className="text-gray-500 text-sm">
                          Stops: {train.stopStations.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                      <Link
                        href={`/bookings/${train.routeId}`}
                        className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                      >
                        Book Now
                      </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
