"use client";

import { ComponentType, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export function withAuth<P extends object>(Component: ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.replace("/login");
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}
