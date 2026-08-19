"use client";

import { useEffect, useState } from "react";
import { ITodayBooked, SeatDetails } from "@/types/train";
import { getClassColor } from "@/utils/seatClass";

function TicketIcon({ className = "h-2 w-2 shrink-0" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a1.5 1.5 0 0 0 0 3v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a1.5 1.5 0 0 0 0-3V8z"
      />
    </svg>
  );
}

export function TodayBooked({
  seat,
  bookings,
}: {
  seat: SeatDetails;
  bookings: ITodayBooked[];
}) {
  const [open, setOpen] = useState(false);
  const classColor = getClassColor(seat.classType.name);
  const isBooked = bookings.length > 0;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        disabled={!isBooked}
        onClick={() => setOpen(true)}
        className={`flex flex-col items-center justify-start w-full min-w-0 h-[3.25rem] p-1.5 rounded border text-center overflow-hidden ${classColor} ${
          isBooked ? "hover:brightness-95" : "cursor-default"
        }`}
      >
        <p className="text-xs font-semibold leading-tight">{seat.seat.number}</p>
        <p className="text-[10px] leading-tight opacity-80">
          {seat.classType.name}
        </p>
        {isBooked && (
          <span className="mt-0.5 flex max-w-full items-center justify-center gap-0.5 text-[8px] leading-none opacity-80">
            <TicketIcon />
            {bookings.length}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`seat-${seat.seat.id}-bookings`}
            className="w-full max-w-xs rounded-lg bg-white p-4 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3
              id={`seat-${seat.seat.id}-bookings`}
              className="text-sm font-semibold text-gray-900"
            >
              Seat {seat.seat.number}
              <span className="font-normal text-gray-500">
                {" "}
                · Coach {seat.coach.number} · {seat.classType.name}
              </span>
            </h3>
            <ul className="mt-3 max-h-48 space-y-1.5 overflow-y-auto">
              {bookings.map((booking) => (
                <li
                  key={`${booking.startStation}-${booking.endStation}`}
                  className="flex items-start gap-1.5 text-xs text-gray-700"
                >
                  <TicketIcon className="mt-0.5 h-3 w-3 shrink-0 text-gray-500" />
                  <span>
                    {booking.startStation} → {booking.endStation}
                  </span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-md bg-gray-200 px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
