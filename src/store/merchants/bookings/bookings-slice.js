import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("Bookings");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getBookings: null,
  getBookingsStatus: "idle",

  getBookingsList: null,
  getBookingsListStatus: "idle",

  getSingleBooking: null,
  getSingleBookingStatus: "idle",

  getBookingsAnalytics: null,
  getBookingsAnalyticsStatus: "idle",

  getBookingsTabular: null,
  getBookingsTabularStatus: "idle",

  getBookingsSettings: null,
  getBookingsSettingsStatus: "idle",

  getBookingsSettingsPost: null,
  getBookingsSettingsPostStatus: "idle",

  getBookingsSelect: null,
  getBookingsSelectStatus: "idle",
};

// getBookings Async Thunk
export const getBookings = createAsyncThunk(
  "bookings/getBookings",
  async ({ accessToken = null, page = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/bookings?`;
    }

    const startTime = new Date();
    logger.log("getBookings::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getBookings::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getSingleBooking
export const getSingleBooking = createAsyncThunk(
  "bookings/getSingleBooking",
  async ({ accessToken = null, bookingId = null } = {}) => {
    if (!accessToken || !bookingId) {
      return;
    }

    const url = `${API_URL}/bookings/${bookingId}`;

    const startTime = new Date();
    logger.log("getSingleBooking::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getSingleBooking::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getBookingsList
export const getBookingsList = createAsyncThunk(
  "bookings/getBookingsList",
  async ({
    page = null,
    accessToken = null,
    filter = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/booking/list-all?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getBookingsList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getBookingsList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

// getBookingsSelect Async Thunk
export const getBookingsSelect = createAsyncThunk(
  "bookings/getBookingsSelect",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/booking/select-options`;

    const startTime = new Date();
    logger.log("getBookingsSelect::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getBookingsSelect::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

// getBookingsAnalytics Async Thunk
export const getBookingsAnalytics = createAsyncThunk(
  "bookings/getBookingsAnalytics",
  async ({ accessToken = null, page = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/bookings/reports/analytics?`;
    }

    const startTime = new Date();
    logger.log("getBookingsAnalytics::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getBookingsAnalytics::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

// getBookingsTabular Async Thunk
export const getBookingsTabular = createAsyncThunk(
  "bookings/getBookingsTabular",
  async ({ accessToken = null, page = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/bookings/reports/tabular?`;
    }

    const startTime = new Date();
    logger.log("getBookingsTabular::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getBookingsTabular::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

// getBookingsSettings Async Thunk
export const getBookingsSettings = createAsyncThunk(
  "bookings/getBookingsSettings",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/bookings/settings/show`;

    const startTime = new Date();
    logger.log("getBookingsSettings::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getBookingsSettings::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

// getBookingsSettingsPost Async Thunk
export const getBookingsSettingsPost = createAsyncThunk(
  "bookings/getBookingsSettingsPost",
  async ({ accessToken = null, page = null, settings_id = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/bookings/store/settings/${settings_id}?`;
    }

    const startTime = new Date();
    logger.log("getBookingsSettingsPost::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getBookingsSettingsPost::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder

      // getBookings Data
      .addCase(getBookings.pending, (state) => {
        state.getBookingsStatus = "loading";
      })
      .addCase(getBookings.rejected, (state) => {
        state.getBookingsStatus = "rejected";
        logger.log("getBookings::REJECTED");
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.getBookingsStatus = "fulfilled";
        state.getBookings = action.payload;
      })

      //getSingleBooking
      .addCase(getSingleBooking.pending, (state) => {
        state.getSingleBookingStatus = "loading";
      })
      .addCase(getSingleBooking.rejected, (state) => {
        state.getSingleBookingStatus = "rejected";
        logger.log("getSingleBooking::REJECTED");
      })
      .addCase(getSingleBooking.fulfilled, (state, action) => {
        state.getSingleBookingStatus = "fulfilled";
        state.getSingleBooking = action.payload;
      })

      //getBookingsList
      .addCase(getBookingsList.pending, (state) => {
        state.getBookingsListStatus = "loading";
      })
      .addCase(getBookingsList.rejected, (state) => {
        state.getBookingsListStatus = "rejected";
        logger.log("getBookingsList::REJECTED");
      })
      .addCase(getBookingsList.fulfilled, (state, action) => {
        state.getBookingsListStatus = "fulfilled";
        state.getBookingsList = action.payload;
      })

      // getBookingsSelect Data
      .addCase(getBookingsSelect.pending, (state) => {
        state.getBookingsSelectStatus = "loading";
      })
      .addCase(getBookingsSelect.rejected, (state) => {
        state.getBookingsSelectStatus = "rejected";
        logger.log("getBookingsSelect::REJECTED");
      })
      .addCase(getBookingsSelect.fulfilled, (state, action) => {
        state.getBookingsSelectStatus = "fulfilled";
        state.getBookingsSelect = action.payload;
      })

      // getBookingsAnalytics Data
      .addCase(getBookingsAnalytics.pending, (state) => {
        state.getBookingsAnalyticsStatus = "loading";
      })
      .addCase(getBookingsAnalytics.rejected, (state) => {
        state.getBookingsAnalyticsStatus = "rejected";
        logger.log("getBookingsAnalytics::REJECTED");
      })
      .addCase(getBookingsAnalytics.fulfilled, (state, action) => {
        state.getBookingsAnalyticsStatus = "fulfilled";
        state.getBookingsAnalytics = action.payload;
      })

      // getBookingsTabular Data
      .addCase(getBookingsTabular.pending, (state) => {
        state.getBookingsTabularStatus = "loading";
      })
      .addCase(getBookingsTabular.rejected, (state) => {
        state.getBookingsTabularStatus = "rejected";
        logger.log("getBookingsTabular::REJECTED");
      })
      .addCase(getBookingsTabular.fulfilled, (state, action) => {
        state.getBookingsTabularStatus = "fulfilled";
        state.getBookingsTabular = action.payload;
      })

      // getBookingsSettings Data
      .addCase(getBookingsSettings.pending, (state) => {
        state.getBookingsSettingsStatus = "loading";
      })
      .addCase(getBookingsSettings.rejected, (state) => {
        state.getBookingsSettingsStatus = "rejected";
        logger.log("getBookingsSettings::REJECTED");
      })
      .addCase(getBookingsSettings.fulfilled, (state, action) => {
        state.getBookingsSettingsStatus = "fulfilled";
        state.getBookingsSettings = action.payload;
      })

      // getBookingsSettingsPost Data
      .addCase(getBookingsSettingsPost.pending, (state) => {
        state.getBookingsSettingsPostStatus = "loading";
      })
      .addCase(getBookingsSettingsPost.rejected, (state) => {
        state.getBookingsSettingsPostStatus = "rejected";
        logger.log("getBookingsSettingsPost::REJECTED");
      })
      .addCase(getBookingsSettingsPost.fulfilled, (state, action) => {
        state.getBookingsSettingsPostStatus = "fulfilled";
        state.getBookingsSettingsPost = action.payload;
      });
  },
});

export default bookingsSlice.reducer;
