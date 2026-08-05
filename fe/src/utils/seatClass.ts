import { CLASS_COLORS, DEFAULT_CLASS_COLOR } from "@/constants/seatClass";

export function getClassColor(className: string): string {
  const key = className.trim().toLowerCase();
  return CLASS_COLORS[key] || DEFAULT_CLASS_COLOR;
}
