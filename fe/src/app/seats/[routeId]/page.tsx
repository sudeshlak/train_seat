import { Suspense } from "react";
import { BookingNav } from "@/components/booking/BookingNav";
import { RouteSummary } from "@/components/booking/RouteSummary";
import SeatPlan from "@/components/seat/SeatPlan";
import { trainService } from "@/services/trainService";

export async function generateStaticParams() {
  const routes = await trainService.avaialableRoutes();
  return routes.map((routeId) => ({ routeId: String(routeId) }));
}

export default function Page({
  params,
}: {
  params: Promise<{ routeId: string }>;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <BookingNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RouteSummary params={params} />
        <Suspense
          fallback={
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              <p className="mt-2 text-gray-600">Loading seats...</p>
            </div>
          }
        >
          <SeatPlan params={params} />
        </Suspense>
      </main>
    </div>
  );
}
