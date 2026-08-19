"use client";

import { useReducer } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signupThunk, clearError } from "@/store/slices/authSlice";
import { ErrorType } from "@/api/errors";
import { goBackOrHome } from "@/utils/navigation";

interface SignupState {
  email: string;
  password: string;
  confirmPassword: string;
}

type SignupAction =
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_CONFIRM_PASSWORD"; payload: string }
  | { type: "SUBMIT" };

const initialState: SignupState = {
  email: "",
  password: "",
  confirmPassword: "",
};

function signupReducer(state: SignupState, action: SignupAction): SignupState {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_CONFIRM_PASSWORD":
      return { ...state, confirmPassword: action.payload };
    case "SUBMIT":
      return state;
    default:
      return state;
  }
}

export function SignupForm() {
  const [state, dispatch] = useReducer(signupReducer, initialState);
  const reduxDispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await reduxDispatch(
      signupThunk({
        email: state.email,
        password: state.password,
        confirmPassword: state.confirmPassword,
      }),
    );

    if (signupThunk.fulfilled.match(result)) {
      goBackOrHome(router);
    } else if (signupThunk.rejected.match(result)) {
      const payload = result.payload as any;
      if (payload?.type === ErrorType.UNAUTHENTICATED) {
        router.push("/login");
      }
    }
  };

  const handleChange =
    (field: "email" | "password" | "confirmPassword") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const actionType =
        field === "email"
          ? "SET_EMAIL"
          : field === "password"
            ? "SET_PASSWORD"
            : "SET_CONFIRM_PASSWORD";
      dispatch({ type: actionType, payload: e.target.value });
      if (error) {
        reduxDispatch(clearError());
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={state.email}
                onChange={handleChange("email")}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={state.password}
                onChange={handleChange("password")}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={state.confirmPassword}
                onChange={handleChange("confirmPassword")}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              replace
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
