"use client";

import { useAppSelector } from "@/store/hooks";
import Link from "next/link";

export default function NavBar () {
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    return (
    <div className="flex items-center space-x-4">
    {isAuthenticated ? (
      <>
        <span className="text-gray-700">{user?.email}</span>
        <Link
          href="/bookings"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          My Bookings
        </Link>
      </>
    ) : (
      <>
        <Link
          href="/login"
          className="text-gray-700 hover:text-gray-900"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Sign Up
        </Link>
      </>
    )}
  </div>
  )
}