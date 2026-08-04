"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { fetchMyBookingsThunk } from "@/store/slices/bookingSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { myBookings, myBookingsLoading } = useAppSelector(
    (state) => state.booking,
  );

  useEffect(() => {
    dispatch(fetchMyBookingsThunk());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

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
                Browse Trains
              </Link>
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

        {myBookingsLoading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Loading bookings...</p>
          </div>
        ) : myBookings.length === 0 ? (
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
            {myBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {booking.trainName}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {booking.fromStation.name} → {booking.toStation.name}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Date: {booking.date}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Coach {booking.coach.number} · Seat {booking.seat.number}{" "}
                      · {booking.classType.name}
                    </p>
                    <p className="text-gray-700 text-sm mt-2 font-medium">
                      Amount: LKR {Number(booking.amount).toFixed(2)}
                    </p>
                    <span className="inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                      {booking.status}
                    </span>
                  </div>
                  <Link
                    href={`/bookings/${booking.routeId}`}
                    className="text-sm text-indigo-600 hover:text-indigo-800 whitespace-nowrap"
                  >
                    Book again
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
