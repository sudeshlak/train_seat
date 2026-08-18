import { BookingNav } from "@/components/booking/BookingNav";
import { BookingPage } from "@/components/booking/BookingPage";
import { RouteSummary } from "@/components/booking/RouteSummary";
import { trainService } from "@/services/trainService";

export async function generateStaticParams() {
  const routes = await trainService.avaialableRoutes();
  return routes.map((routeId) => ({ routeId: String(routeId) }));
}

export default function Page({params}: {params: Promise<{routeId:number}>}) {
  return (
      <div className="min-h-screen bg-gray-50">
        <BookingNav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <RouteSummary params={params} />  
          <BookingPage />                         
        </main>
      </div>
    );
}
