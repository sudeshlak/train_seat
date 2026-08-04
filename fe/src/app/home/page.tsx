"use client";

import { useAppSelector } from "@/store/hooks";
import Link from "next/link";

export default function HomePage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Mock train data - replace with API call later
  const trains = [
    { id: 1, name: "Express 101", from: "New York", to: "Boston", departure: "08:00", arrival: "12:00", price: 50 },
    { id: 2, name: "Regional 205", from: "New York", to: "Philadelphia", departure: "09:30", arrival: "11:30", price: 35 },
    { id: 3, name: "Express 303", from: "Boston", to: "Washington DC", departure: "10:00", arrival: "15:00", price: 75 },
    { id: 4, name: "Local 404", from: "Philadelphia", to: "Baltimore", departure: "11:00", arrival: "12:30", price: 25 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Train Seat Booking</h1>
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
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Available Trains</h2>
        <div className="grid gap-4">
          {trains.map((train) => (
            <div
              key={train.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{train.name}</h3>
                  <p className="text-gray-600 mt-1">
                    {train.from} → {train.to}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Departure: {train.departure} | Arrival: {train.arrival}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-600">${train.price}</p>
                  {isAuthenticated ? (
                    <Link
                      href={`/bookings?trainId=${train.id}`}
                      className="mt-2 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Book Now
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="mt-2 inline-block bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Login to Book
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
