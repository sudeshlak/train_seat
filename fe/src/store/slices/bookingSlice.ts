import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  RouteDetails,
  SeatWithDetails,
  SeatRequest,
  SeatValidationError,
} from "../../types/train";
import { trainApi } from "../../api/trainApi";
import { getApiError, ErrorType } from "../../api/errors";

interface BookingState {
  routeDetails: RouteDetails | null;
  seats: SeatWithDetails[];
  loading: boolean;
  seatsLoading: boolean;
  error: string | null;
  validationErrors: SeatValidationError;
  globalError: {
    type: ErrorType | null;
    message: string | null;
  } | null;
}

const initialState: BookingState = {
  routeDetails: null,
  seats: [],
  loading: false,
  seatsLoading: false,
  error: null,
  validationErrors: {},
  globalError: null,
};

function pickSeatValidationErrors(
  details?: Record<string, string>,
): SeatValidationError {
  if (!details) return {};
  const errors: SeatValidationError = {};
  if (details.routeId) errors.routeId = details.routeId;
  if (details.from) errors.from = details.from;
  if (details.to) errors.to = details.to;
  if (details.date) errors.date = details.date;
  return errors;
}

export const fetchRouteThunk = createAsyncThunk(
  "booking/fetchRoute",
  async (routeId: string, { rejectWithValue }) => {
    try {
      const { data } = await trainApi.getRoute(routeId);
      return data;
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue({
        type: apiError.type,
        message: apiError.message,
      } as const);
    }
  },
);

export const fetchSeatsThunk = createAsyncThunk(
  "booking/fetchSeats",
  async (seatRequest: SeatRequest, { rejectWithValue }) => {
    try {
      const { data } = await trainApi.getSeats(seatRequest);
      return data;
    } catch (error) {
      const apiError = getApiError(error);
      if (apiError.type === ErrorType.VALIDATION) {
        return rejectWithValue({
          type: ErrorType.VALIDATION,
          message: apiError.message,
          validationErrors: pickSeatValidationErrors(apiError.details),
        } as const);
      }
      return rejectWithValue({
        type: apiError.type,
        message: apiError.message,
      } as const);
    }
  },
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearValidationErrors(state) {
      state.validationErrors = {};
    },
    clearGlobalError(state) {
      state.globalError = null;
    },
    clearSeats(state) {
      state.seats = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRouteThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.globalError = null;
      })
      .addCase(fetchRouteThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.routeDetails = action.payload;
        state.error = null;
        state.globalError = null;
      })
      .addCase(fetchRouteThunk.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as
          | { type: ErrorType; message: string }
          | undefined;
        if (payload) {
          if (payload.type === ErrorType.VALIDATION) {
            state.error = payload.message;
          } else {
            state.globalError = payload;
          }
        } else {
          state.globalError = {
            type: ErrorType.UNKNOWN,
            message: "Failed to fetch route details",
          };
        }
      })
      .addCase(fetchSeatsThunk.pending, (state) => {
        state.seatsLoading = true;
        state.error = null;
        state.validationErrors = {};
        state.globalError = null;
      })
      .addCase(fetchSeatsThunk.fulfilled, (state, action) => {
        state.seatsLoading = false;
        state.seats = action.payload;
        state.error = null;
        state.validationErrors = {};
        state.globalError = null;
      })
      .addCase(fetchSeatsThunk.rejected, (state, action) => {
        state.seatsLoading = false;
        const payload = action.payload as
          | {
              type: ErrorType;
              message: string;
              validationErrors?: SeatValidationError;
            }
          | undefined;
        if (payload) {
          if (
            payload.type === ErrorType.VALIDATION &&
            payload.validationErrors
          ) {
            state.validationErrors = payload.validationErrors;
            state.error = payload.message;
          } else if (payload.type === ErrorType.VALIDATION) {
            state.error = payload.message;
          } else {
            state.globalError = {
              type: payload.type,
              message: payload.message,
            };
          }
        } else {
          state.globalError = {
            type: ErrorType.UNKNOWN,
            message: "Failed to fetch seats",
          };
        }
      });
  },
});

export const {
  clearError: clearBookingError,
  clearValidationErrors,
  clearGlobalError: clearBookingGlobalError,
  clearSeats,
} = bookingSlice.actions;
export default bookingSlice.reducer;
