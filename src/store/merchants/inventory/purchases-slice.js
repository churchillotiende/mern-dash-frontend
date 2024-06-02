import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("Purchases");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getLPOSDetails: null,
  getLPOSDetailsStatus: "idle",

  getLRFQDetails: null,
  getLRFQDetailsStatus: "idle",

  getRFQSubItems: null,
  getRFQSubItemsStatus: "idle",

  getRFQItems: null,
  getRFQItemsStatus: "idle",
};

export const getLPOSDetails = createAsyncThunk(
  "purchases/getLPOSDetails",
  async ({ accessToken = null, rfqId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/inventory/purchases/rfq/${rfqId}`;

    const startTime = new Date();
    logger.log("getLPOSDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getLPOSDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getLRFQDetails = createAsyncThunk(
  "purchases/getLRFQDetails",
  async ({ accessToken = null, rfqId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/inventory/purchases/show/${rfqId}`;

    const startTime = new Date();
    logger.log("getLRFQDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getLRFQDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getRFQSubItems = createAsyncThunk(
  "purchases/getRFQSubItems",
  async ({ accessToken = null, rfqId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/inventory/purchases/rfq/${rfqId}/products`;

    const startTime = new Date();
    logger.log("getRFQSubItems::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getRFQSubItems::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

///inventory/purchases/rfq/{rfq_id}

export const getRFQItems = createAsyncThunk(
  "purchases/getRFQItems",
  async ({ accessToken = null, rfqId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/inventory/purchases/rfq/${rfqId}`;

    const startTime = new Date();
    logger.log("getRFQItems::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getRFQItems::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const purchasesSlice = createSlice({
  name: "purchases",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // getLRFQDetails Data
      .addCase(getLRFQDetails.pending, (state) => {
        state.getLRFQDetailsStatus = "loading";
      })
      .addCase(getLRFQDetails.rejected, (state) => {
        state.getLRFQDetailsStatus = "rejected";
        logger.log("getLRFQDetails::REJECTED");
      })
      .addCase(getLRFQDetails.fulfilled, (state, action) => {
        state.getLRFQDetailsStatus = "fulfilled";
        state.getLRFQDetails = action.payload;
      })

      //getRFQItems
      .addCase(getRFQItems.pending, (state) => {
        state.getRFQItemsStatus = "loading";
      })
      .addCase(getRFQItems.rejected, (state) => {
        state.getRFQItemsStatus = "rejected";
        logger.log("getLRFQDetails::REJECTED");
      })
      .addCase(getRFQItems.fulfilled, (state, action) => {
        state.getRFQItemsStatus = "fulfilled";
        state.getRFQItems = action.payload;
      })

      //getRFQSubItems
      .addCase(getRFQSubItems.pending, (state) => {
        state.getRFQSubItemsStatus = "loading";
      })
      .addCase(getRFQSubItems.rejected, (state) => {
        state.getRFQSubItemsStatus = "rejected";
        logger.log("getRFQSubItems::REJECTED");
      })
      .addCase(getRFQSubItems.fulfilled, (state, action) => {
        state.getRFQSubItemsStatus = "fulfilled";
        state.getRFQSubItems = action.payload;
      })

      // getLPOS Data
      .addCase(getLPOSDetails.pending, (state) => {
        state.getLPOSDetailsStatus = "loading";
      })
      .addCase(getLPOSDetails.rejected, (state) => {
        state.getLPOSStatus = "rejected";
        logger.log("getLPOSDetails::REJECTED");
      })
      .addCase(getLPOSDetails.fulfilled, (state, action) => {
        state.getLPOSDetailsStatus = "fulfilled";
        state.getLPOSDetails = action.payload;
      });
  },
});

export default purchasesSlice.reducer;
