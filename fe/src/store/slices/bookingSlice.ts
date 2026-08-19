import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  RouteDetails,
  SeatWithDetails,
  SeatRequest,
  SeatValidationError,
  BookSeatRequest,
  BookingResponse,
} from "../../types/train";
import { getApiError, ErrorType } from "../../api/errors";
import { trainService } from "@/services/trainService";

interface BookingState {
  routeDetails: RouteDetails | null;
  seats: SeatWithDetails[];
  loading: boolean;
  seatsLoading: boolean;
  bookingLoading: boolean;
  bookingSuccess: { message: string; amount: number } | null;
  bookingConflict: string | null;
  unavailableSeatIds: number[];
  myBookings: BookingResponse[];
  myBookingsLoading: boolean;
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
  bookingLoading: false,
  bookingSuccess: null,
  bookingConflict: null,
  unavailableSeatIds: [],
  myBookings: [],
  myBookingsLoading: false,
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
  async (routeId: string | number, { rejectWithValue }) => {
    try {
      return await trainService.getRoute(routeId);
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
      return await trainService.getSeats(seatRequest);
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

export const bookSeatThunk = createAsyncThunk(
  "booking/bookSeat",
  async (request: BookSeatRequest, { rejectWithValue }) => {
    try {
      return await trainService.bookSeat(request);
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue({
        type: apiError.type,
        message: apiError.message,
        seatId: request.seatId,
      } as const);
    }
  },
);

export const fetchMyBookingsThunk = createAsyncThunk(
  "booking/fetchMyBookings",
  async (_, { rejectWithValue }) => {
    try {
      return await trainService.getBookings();
    } catch (error) {
      const apiError = getApiError(error);
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
    clearBookingSuccess(state) {
      state.bookingSuccess = null;
    },
    clearBookingConflict(state) {
      state.bookingConflict = null;
    },
    markSeatUnavailable(state, action: PayloadAction<number>) {
      if (!state.unavailableSeatIds.includes(action.payload)) {
        state.unavailableSeatIds.push(action.payload);
      }
    },
    clearUnavailableSeats(state) {
      state.unavailableSeatIds = [];
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
        const availableIds = new Set(action.payload.map((s) => s.seat.id));
        state.unavailableSeatIds = state.unavailableSeatIds.filter((id) =>
          availableIds.has(id),
        );
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
      })
      .addCase(bookSeatThunk.pending, (state) => {
        state.bookingLoading = true;
        state.bookingConflict = null;
        state.bookingSuccess = null;
        state.globalError = null;
      })
      .addCase(bookSeatThunk.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.bookingSuccess = {
          message: action.payload.message ?? "Booking confirmed",
          amount: action.payload.amount,
        };
        if (!state.unavailableSeatIds.includes(action.payload.seat.id)) {
          state.unavailableSeatIds.push(action.payload.seat.id);
        }
      })
      .addCase(bookSeatThunk.rejected, (state, action) => {
        state.bookingLoading = false;
        const payload = action.payload as
          | { type: ErrorType; message: string; seatId?: number }
          | undefined;
        if (payload?.type === ErrorType.CONFLICT) {
          state.bookingConflict = payload.message;
          if (
            payload.seatId != null &&
            !state.unavailableSeatIds.includes(payload.seatId)
          ) {
            state.unavailableSeatIds.push(payload.seatId);
          }
        } else if (payload) {
          state.globalError = {
            type: payload.type,
            message: payload.message,
          };
        } else {
          state.globalError = {
            type: ErrorType.UNKNOWN,
            message: "Failed to book seat",
          };
        }
      })
      .addCase(fetchMyBookingsThunk.pending, (state) => {
        state.myBookingsLoading = true;
        state.globalError = null;
      })
      .addCase(fetchMyBookingsThunk.fulfilled, (state, action) => {
        state.myBookingsLoading = false;
        state.myBookings = action.payload;
      })
      .addCase(fetchMyBookingsThunk.rejected, (state, action) => {
        state.myBookingsLoading = false;
        const payload = action.payload as
          | { type: ErrorType; message: string }
          | undefined;
        state.globalError = payload ?? {
          type: ErrorType.UNKNOWN,
          message: "Failed to fetch bookings",
        };
      });
  },
});

export const {
  clearError: clearBookingError,
  clearValidationErrors,
  clearGlobalError: clearBookingGlobalError,
  clearSeats,
  clearBookingSuccess,
  clearBookingConflict,
  markSeatUnavailable,
  clearUnavailableSeats,
} = bookingSlice.actions;
export default bookingSlice.reducer;
