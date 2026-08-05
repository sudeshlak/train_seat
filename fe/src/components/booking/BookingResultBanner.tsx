"use client";

import Link from "next/link";
import { BookingAlert } from "@/components/booking/BookingAlert";

interface BookingSuccessSummary {
  message: string;
  amount: number;
}

interface BookingResultBannerProps {
  placement: "top" | "bottom";
  bookingConflict: string | null;
  bookingSuccess: BookingSuccessSummary | null;
}

export function BookingResultBanner({
  placement,
  bookingConflict,
  bookingSuccess,
}: BookingResultBannerProps) {
  const spacingClass = placement === "top" ? "mb-6" : "mt-4";

  return (
    <>
      {bookingConflict && (
        <BookingAlert message={bookingConflict} className={spacingClass} />
      )}
      {bookingSuccess && (
        <div
          className={`bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md ${spacingClass}`}
        >
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
    </>
  );
}
