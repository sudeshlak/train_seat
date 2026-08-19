import { trainService } from "@/services/trainService";
import { cookies } from "next/headers";
import Link from "next/link";

async function getRouteDetails(id: string) {
  "use cache";
  return trainService.getRoute(id);
}

export async function FrequentRoutes() {
  const raw = (await cookies()).get("frequentRoutes")?.value;
  let counts: Record<string, number> = {};
  try {
    if (raw) counts = JSON.parse(raw);
  } catch {
    counts = {};
  }
  const routeIds = Object.entries(counts)
    .filter(([, n]) => n > 3)
    .map(([id]) => id);

  if (routeIds.length === 0) return null;

  const details = await Promise.all(
    routeIds.map(async (id) => ({
      routeId: id,
      trainName: (await getRouteDetails(id)).trainName,
    })),
  );

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequent routes</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {details.map((route) => (
          <div
            key={route.routeId}
            className="flex-none w-48 aspect-square bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex h-full flex-col justify-between">
              <h3 className="text-xl font-semibold text-gray-900 line-clamp-3">
                {route.trainName}
              </h3>
              <Link
                href={`/bookings/${route.routeId}`}
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-center"
              >
                Book Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
