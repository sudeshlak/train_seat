"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  // Mock bookings data - replace with API call later
  const bookings = [
    {
      id: 1,
      trainName: "Express 101",
      from: "New York",
      to: "Boston",
      departure: "08:00",
      arrival: "12:00",
      seat: "A12",
      date: "2026-08-05",
      status: "Confirmed",
    },
  ];

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
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">My Bookings</h2>
        
        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No bookings found.</p>
            <Link
              href="/home"
              className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Browse Trains
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {booking.trainName}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {booking.from} → {booking.to}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Departure: {booking.departure} | Arrival: {booking.arrival}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Date: {booking.date} | Seat: {booking.seat}
                    </p>
                    <span className="inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                      {booking.status}
                    </span>
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
