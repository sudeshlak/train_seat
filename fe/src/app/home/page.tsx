"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTrainsThunk } from "@/store/slices/trainSlice";
import Link from "next/link";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { trains, loading } = useAppSelector((state) => state.train);

  useEffect(() => {
    dispatch(fetchTrainsThunk());
  }, [dispatch]);

  const formatDepartureTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

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
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700">{user?.email}</span>
                  <Link
                    href="/bookings"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    My Bookings
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Available Trains
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Loading trains...</p>
          </div>
        ) : trains.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No trains available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {trains.map((train, index) => (
              <div
                key={index}
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
                    {isAuthenticated ? (
                      <Link
                        href={`/bookings?trainName=${encodeURIComponent(train.trainName)}&from=${encodeURIComponent(train.from)}&to=${encodeURIComponent(train.to)}&departure=${encodeURIComponent(train.departureTime)}`}
                        className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                      >
                        Book Now
                      </Link>
                    ) : (
                      <Link
                        href="/login"
                        className="inline-block bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                      >
                        Login to Book
                      </Link>
                    )}
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
