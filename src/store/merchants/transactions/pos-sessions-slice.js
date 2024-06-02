import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("PosSessions");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  posSessionsList: null,
  posSessionsListStatus: "idle",

  posSessionDetails: null,
  posSessionDetailsStatus: "idle",

  currentPosSession: null,
  currentPosSessionStatus: "idle",

  posSessionDetailsReceiptStatus: "idle",

  createNewPosSessionStatus: "idle",
  closeCurrentPosSessionStatus: "idle",
};

export const fetchPosSessionList = createAsyncThunk(
  "posSessions/fetchPosSessionList",
  async ({
    page = null,
    accessToken = null,
    startDate = null,
    endDate = null,
    byMe = null,
    isCurrent = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/posSessions?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    if (isCurrent) {
      params["is_current"] = isCurrent;
    }
    if (byMe) {
      params["by_me"] = byMe;
    }
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchPosSessionList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchPosSessionList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchPosSessionDetails = createAsyncThunk(
  "posSessions/fetchPosSessionDetails",
  async ({ page = null, sessionId = null, accessToken = null } = {}) => {
    if (!accessToken || !sessionId) {
      logger.log("fetchPosSessionDetails::INVALID DATA", {
        accessToken,
        sessionId,
      });
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/posSessions/${sessionId}?`;
    }

    const startTime = new Date();
    logger.log("fetchPosSessionDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchPosSessionDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchPosSessionDetailsReceipt = createAsyncThunk(
  "posSessions/fetchPosSessionDetailsReceipt",
  async ({ sessionId = null, accessToken = null } = {}) => {
    if (!accessToken || !sessionId) {
      return;
    }

    const url = `${API_URL}/posSessions/${sessionId}/receipt?`;

    const startTime = new Date();
    logger.log("fetchPosSessionDetailsReceipt::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.blob();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchPosSessionDetailsReceipt::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.innerHTML = `Session - ${sessionId}.pdf`;
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

export const createNewPosSession = createAsyncThunk(
  "posSessions/createNewPosSession",
  async ({ accessToken = null, amount = 0 } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/posSessions`;
    let body = { amount: amount };
    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("createNewPosSession::BEGIN");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("createNewPosSession::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const closeCurrentPosSession = createAsyncThunk(
  "posSessions/closeCurrentPosSession",
  async ({ accessToken = null, amount = 0, narration = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/posSessions/current/close`;
    let body = { amount, narration };
    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("closeCurrentPosSession::BEGIN");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("closeCurrentPosSession::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchCurrentPosSession = createAsyncThunk(
  "posSessions/fetchCurrentPosSession",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }
    const url = `${API_URL}/posSessions/current/get`;

    const startTime = new Date();
    logger.log("fetchCurrentPosSession::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchCurrentPosSession::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const posSessions = createSlice({
  name: "posSessions",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPosSessionList.pending, (state) => {
        state.posSessionsListStatus = "loading";
      })
      .addCase(fetchPosSessionList.rejected, (state, action) => {
        state.posSessionsListStatus = "rejected";
        logger.log("fetchPosSessionList::REJECTED", action.error);
      })
      .addCase(fetchPosSessionList.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchPosSessionList::FULFILLED", { payload });

        state.posSessionsListStatus = "fulfilled";
        state.posSessionsList = action.payload;
      })

      // fetchPosSessionDetails
      .addCase(fetchPosSessionDetails.pending, (state) => {
        state.posSessionDetailsStatus = "loading";
      })
      .addCase(fetchPosSessionDetails.rejected, (state, action) => {
        state.posSessionDetailsStatus = "rejected";
        logger.log("fetchPosSessionList::REJECTED", action.error);
      })
      .addCase(fetchPosSessionDetails.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchPosSessionList::FULFILLED", { payload });

        state.posSessionDetailsStatus = "fulfilled";
        state.posSessionDetails = action.payload;
      })

      // fetchPosSessionDetailsReceipt
      .addCase(fetchPosSessionDetailsReceipt.pending, (state) => {
        state.posSessionDetailsReceiptStatus = "loading";
      })
      .addCase(fetchPosSessionDetailsReceipt.rejected, (state) => {
        state.posSessionDetailsReceiptStatus = "rejected";
        logger.log("posSessionDetailsReceiptStatus::REJECTED");
      })
      .addCase(fetchPosSessionDetailsReceipt.fulfilled, (state) => {
        state.posSessionDetailsReceiptStatus = "fulfilled";
      })

      // createNewPosSession
      .addCase(createNewPosSession.pending, (state) => {
        state.createNewPosSessionStatus = "loading";
      })
      .addCase(createNewPosSession.rejected, (state) => {
        state.createNewPosSessionStatus = "rejected";
        logger.log("createNewPosSession::REJECTED");
      })
      .addCase(createNewPosSession.fulfilled, (state, action) => {
        const { payload } = action;
        state.createNewPosSessionStatus = "fulfilled";

        logger.log("createNewPosSession::FULFILLED", { payload });

        // Trigger session list reload
        state.posSessionsListStatus = "idle";
        state.currentPosSessionStatus = "idle";
      })

      // closeCurrentPosSession
      .addCase(closeCurrentPosSession.pending, (state) => {
        state.closeCurrentPosSessionStatus = "loading";
      })
      .addCase(closeCurrentPosSession.rejected, (state) => {
        state.closeCurrentPosSessionStatus = "rejected";
        logger.log("closeCurrentPosSession::REJECTED");
      })
      .addCase(closeCurrentPosSession.fulfilled, (state, action) => {
        const { payload } = action;
        state.closeCurrentPosSessionStatus = "fulfilled";

        state.createNewPosSessionStatus = "idle";

        logger.log("closeCurrentPosSession::FULFILLED", { payload });

        // Trigger session list reload
        state.currentPosSessionStatus = "idle";
        state.posSessionsListStatus = "idle";
      })

      // fetchCurrentPosSession
      .addCase(fetchCurrentPosSession.pending, (state) => {
        state.currentPosSessionStatus = "loading";
      })
      .addCase(fetchCurrentPosSession.rejected, (state) => {
        state.currentPosSessionStatus = "rejected";
        logger.log("fetchCurrentPosSession::REJECTED");
        state.currentPosSession = null;
      })
      .addCase(fetchCurrentPosSession.fulfilled, (state, action) => {
        state.currentPosSessionStatus = "fulfilled";
        state.currentPosSession = action.payload;
        logger.log("fetchCurrentPosSession::FULFILLED");
      });
  },
});

export default posSessions.reducer;
