"use client";

import Link from "next/link";

export function RouteNotFound() {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <p className="text-gray-600">Route not found.</p>
      <Link
        href="/home"
        className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        Browse Trains
      </Link>
    </div>
  );
}
