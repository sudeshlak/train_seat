type AppRouter = {
  back: () => void;
  push: (href: string) => void;
};

export function goBackOrHome(router: AppRouter) {
  if (typeof window === "undefined") {
    router.push("/home");
    return;
  }

  const referrer = document.referrer;
  const sameOriginReferrer =
    referrer !== "" && referrer.startsWith(window.location.origin);
  const hasHistory = window.history.length > 1;

  if (hasHistory && (sameOriginReferrer || referrer === "")) {
    router.back();
    return;
  }

  if (sameOriginReferrer) {
    router.back();
    return;
  }

  router.push("/home");
}
