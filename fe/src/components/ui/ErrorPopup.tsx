"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearGlobalError as clearAuthGlobalError } from "@/store/slices/authSlice";
import { clearTrainGlobalError } from "@/store/slices/trainSlice";
import { ErrorType } from "@/api/errors";

export function ErrorPopup() {
  const authGlobalError = useAppSelector((state) => state.auth.globalError);
  const trainGlobalError = useAppSelector((state) => state.train.globalError);
  const dispatch = useAppDispatch();

  const globalError = authGlobalError || trainGlobalError;

  if (!globalError) return null;

  const isRetryable =
    globalError.type === ErrorType.NETWORK ||
    globalError.type === ErrorType.SERVER ||
    globalError.type === ErrorType.UNKNOWN;

  const handleRetry = () => {
    // In a real implementation, you'd call the original action again
    // For now, just clear the error
    if (authGlobalError) {
      dispatch(clearAuthGlobalError());
    }
    if (trainGlobalError) {
      dispatch(clearTrainGlobalError());
    }
  };

  const handleClose = () => {
    if (authGlobalError) {
      dispatch(clearAuthGlobalError());
    }
    if (trainGlobalError) {
      dispatch(clearTrainGlobalError());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="ml-3 text-lg font-medium text-gray-900">Error</h3>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600">{globalError.message}</p>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
          {isRetryable && (
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
