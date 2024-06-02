import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("Dashboard");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getDashboard = createAsyncThunk(
  "dashboard/getDashboard",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/dashboard`;

    const startTime = new Date();
    logger.log("getDashboard::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getDashboard::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const initialState = {
  getDashboard: null,
  getDashboardStatus: "idle",
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Dashboard Data
      .addCase(getDashboard.pending, (state) => {
        state.getDashboardStatus = "loading";
      })
      .addCase(getDashboard.rejected, (state) => {
        state.getDashboardStatus = "rejected";
        logger.log("getDashboard::REJECTED");
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.getDashboardStatus = "fulfilled";
        state.getDashboard = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
