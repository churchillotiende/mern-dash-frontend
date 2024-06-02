import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("Online Orders");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getOnlineOrders: null,
  getOnlineOrdersStatus: "idle",

  fetchOrderDetails: [],
  fetchOrderDetailsStatus: "idle",

  fetchOrdersListPDF: null,
  fetchOrdersListPDFStatus: "idle",

  fetchOrdersListExcel: null,
  fetchOrdersListExcelStatus: "idle",
};

export const getOnlineOrders = createAsyncThunk(
  "orders/getOnlineOrders",
  async ({
    page = null,
    accessToken = null,
    startDate = null,
    endDate = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/online-orders?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getOnlineOrders::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getOnlineOrders::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchOrdersListPDF = createAsyncThunk(
  "ordersList/fetchOrdersListPDF",
  async ({
    page = null,
    accessToken = null,
    startDate = null,
    endDate = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/online-orders/download`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchOrdersListPDF::BEGIN");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.blob();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchOrdersListPDF::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.innerHTML = `OnlineOrders.pdf`;
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

export const fetchOrdersListExcel = createAsyncThunk(
  "ordersList/fetchOrdersListExcel",
  async ({
    page = null,
    accessToken = null,
    startDate = null,
    endDate = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/online-orders/downloadExcel`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchOrdersListExcel::BEGIN");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.blob();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchOrdersListExcel::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.innerHTML = `OnlineOrders.xlsx`;
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async ({ page = null, orderId = null, accessToken = null } = {}) => {
    if (!accessToken || !orderId) {
      logger.log("fetchOrderDetails::INVALID DATA", {
        accessToken,
        orderId,
      });
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/online-orders/show/${orderId}?`;
    }

    const startTime = new Date();
    logger.log("fetchOrderDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchOrderDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const onlineOrdersSlice = createSlice({
  name: "onlineOrders",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Order Data
      .addCase(getOnlineOrders.pending, (state) => {
        state.getOnlineOrdersStatus = "loading";
      })
      .addCase(getOnlineOrders.rejected, (state) => {
        state.getOnlineOrdersStatus = "rejected";
        logger.log("getDashboard::REJECTED");
      })
      .addCase(getOnlineOrders.fulfilled, (state, action) => {
        state.getOnlineOrdersStatus = "fulfilled";
        state.getOnlineOrders = action.payload;
      })

      // OrdersPDF Data
      .addCase(fetchOrdersListPDF.pending, (state) => {
        state.fetchOrdersListPDFStatus = "loading";
      })
      .addCase(fetchOrdersListPDF.rejected, (state) => {
        state.fetchOrdersListPDFStatus = "rejected";
        logger.log("fetchOrdersListReceipt::REJECTED");
      })
      .addCase(fetchOrdersListPDF.fulfilled, (state, action) => {
        state.fetchOrdersListPDFStatus = "fulfilled";
        state.fetchOrdersListPDF = action.payload;
      })

      // Orders Excel Data
      .addCase(fetchOrdersListExcel.pending, (state) => {
        state.fetchOrdersListExcelStatus = "loading";
      })
      .addCase(fetchOrdersListExcel.rejected, (state) => {
        state.fetchOrdersListExcelStatus = "rejected";
        logger.log("fetchOrdersListExcelStatus::REJECTED");
      })
      .addCase(fetchOrdersListExcel.fulfilled, (state, action) => {
        state.fetchOrdersListExcelStatus = "fulfilled";
        state.fetchOrdersListExcel = action.payload;
      })

      //Order Details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.fetchOrderDetailsStatus = "loading";
      })
      .addCase(fetchOrderDetails.rejected, (state) => {
        state.fetchOrderDetailsStatus = "rejected";
        logger.log("getDashboard::REJECTED");
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.fetchOrderDetailsStatus = "fulfilled";
        state.fetchOrderDetails = action.payload;
      });
  },
});

export default onlineOrdersSlice.reducer;
