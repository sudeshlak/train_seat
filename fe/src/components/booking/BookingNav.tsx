"use client";

import Link from "next/link";

interface BookingNavProps {
  userEmail: string;
}

export function BookingNav({ userEmail }: BookingNavProps) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/home" className="text-xl font-bold text-gray-900">
              Train Seat Booking
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{userEmail}</span>
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
  );
}
