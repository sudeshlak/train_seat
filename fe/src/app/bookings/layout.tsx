"use client";

import { withAuth } from "@/components/auth/withAuth";

function BookingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withAuth(BookingsLayout);
