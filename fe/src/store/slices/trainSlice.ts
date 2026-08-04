import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Train } from "../../types/train";
import { trainApi } from "../../api/trainApi";
import { getApiError, ErrorType } from "../../api/errors";

interface TrainState {
  trains: Train[];
  loading: boolean;
  error: string | null;
  globalError: {
    type: ErrorType | null;
    message: string | null;
  } | null;
}

const initialState: TrainState = {
  trains: [],
  loading: false,
  error: null,
  globalError: null,
};

export const fetchTrainsThunk = createAsyncThunk(
  "train/fetchTrains",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await trainApi.getTrains();
      return data.trains;
    } catch (error) {
      const apiError = getApiError(error);
      if (apiError.type === ErrorType.VALIDATION) {
        return rejectWithValue({
          type: ErrorType.VALIDATION,
          message: apiError.message,
        } as const);
      }
      return rejectWithValue({
        type: apiError.type,
        message: apiError.message,
      } as const);
    }
  }
);

const trainSlice = createSlice({
  name: "train",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearGlobalError(state) {
      state.globalError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.globalError = null;
      })
      .addCase(fetchTrainsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.trains = action.payload;
        state.error = null;
        state.globalError = null;
      })
      .addCase(fetchTrainsThunk.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as any;
        if (payload) {
          if (payload.type === ErrorType.VALIDATION) {
            state.error = payload.message;
          } else {
            state.globalError = payload;
          }
        } else {
          state.globalError = {
            type: ErrorType.UNKNOWN,
            message: "Failed to fetch trains",
          };
        }
      });
  },
});

export const { clearError: clearTrainError, clearGlobalError: clearTrainGlobalError } =
  trainSlice.actions;
export default trainSlice.reducer;
