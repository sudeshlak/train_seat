"use client";

import { SeatWithAvailability } from "@/types/train";
import { getClassColor } from "@/utils/seatClass";

interface SeatButtonProps {
  seat: SeatWithAvailability;
  isSelectable: boolean;
  isSelected: boolean;
  onSelect: (seat: SeatWithAvailability) => void;
}

export function SeatButton({
  seat,
  isSelectable,
  isSelected,
  onSelect,
}: SeatButtonProps) {
  const classColor = getClassColor(seat.classType.name);
  const unavailableClass =
    "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed";
  const seatColorClass = isSelectable ? classColor : unavailableClass;
  const selectedRingClass = isSelected
    ? "ring-2 ring-offset-1 ring-indigo-600"
    : "";
  const classLabel = isSelectable ? seat.classType.name : "—";

  const handleClick = () => {
    if (isSelectable) {
      onSelect(seat);
    }
  };

  return (
    <button
      type="button"
      disabled={!isSelectable}
      onClick={handleClick}
      className={`flex flex-col items-center justify-start w-full min-w-0 h-[3.25rem] p-1.5 rounded border transition-all text-center overflow-hidden ${seatColorClass} ${selectedRingClass}`}
    >
      <p className="text-xs font-semibold leading-tight">{seat.seat.number}</p>
      <p className="text-[10px] leading-tight opacity-80">{classLabel}</p>
    </button>
  );
}
