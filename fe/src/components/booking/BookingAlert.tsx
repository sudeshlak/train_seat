"use client";

interface BookingAlertProps {
  message: string;
  className?: string;
}

export function BookingAlert({ message, className = "mb-6" }: BookingAlertProps) {
  return (
    <div
      className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md ${className}`}
    >
      {message}
    </div>
  );
}
