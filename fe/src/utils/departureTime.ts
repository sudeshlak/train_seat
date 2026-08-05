import { addOneDay, formatYmd, getColomboDateParts } from "@/utils/colomboDate";

export function parseDepartureHm(
  departureTime: string,
): { hour: number; minute: number } | null {
  const match = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(departureTime.trim());
  if (!match) return null;
  return { hour: Number(match[1]), minute: Number(match[2]) };
}

export function formatDepartureTime(timeString: string) {
  if (timeString.includes("T") || timeString.includes("-")) {
    const parsed = new Date(timeString);
    return parsed.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  return timeString;
}

export function getMinBookableDate(departureTime: string | undefined) {
  const now = getColomboDateParts();
  const today = formatYmd(now.year, now.month, now.day);
  const departure = departureTime ? parseDepartureHm(departureTime) : null;

  if (!departure) {
    return today;
  }

  const isPastDeparture =
    now.hour > departure.hour ||
    (now.hour === departure.hour && now.minute > departure.minute);

  if (isPastDeparture) {
    const tomorrow = addOneDay(now.year, now.month, now.day);
    return formatYmd(tomorrow.year, tomorrow.month, tomorrow.day);
  }

  return today;
}
