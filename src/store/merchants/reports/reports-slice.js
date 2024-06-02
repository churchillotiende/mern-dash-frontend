import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("Reports");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getChanges: null,
  getChangesStatus: "idle",

  getTaxes: null,
  getTaxesStatus: "idle",

  getInventory: null,
  getInventoryStatus: "idle",

  getBalanceSheet: null,
  getBalanceSheetStatus: "idle",

  getExpenses: null,
  getExpensesStatus: "idle",

  getInvoices: null,
  getInvoicesStatus: "idle",

  getStaffs: null,
  getStaffsStatus: "idle",

  getCustomerTrends: null,
  getCustomerTrendsStatus: "idle",

  getCustomerTrendsTabular: null,
  getCustomerTrendsTabularStatus: "idle",
};

// getChanges Async Thunk
export const getChanges = createAsyncThunk(
  "reports/getChanges",
  async ({ accessToken = null, page = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/change-tracking?`;
    }

    const startTime = new Date();
    logger.log("getChanges::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getChanges::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

// getInventory Async Thunk
export const getInventory = createAsyncThunk(
  "reports/getInventory",
  async ({ accessToken = null, page = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/inventory-reports?`;
    }

    const startTime = new Date();
    logger.log("getInventory::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getInventory::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

// getBalanceSheet Async Thunk
export const getBalanceSheet = createAsyncThunk(
  "reports/getBalanceSheet",
  async ({ accessToken = null, page = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/balance-sheet?`;
    }

    const startTime = new Date();
    logger.log("getBalanceSheet::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getBalanceSheet::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

// getInvoices Async Thunk
export const getInvoices = createAsyncThunk(
  "reports/getInvoices",
  async ({ accessToken = null, page = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/invoice-reports?`;
    }

    const startTime = new Date();
    logger.log("getInvoices::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getInvoices::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

// getExpenses Async Thunk
export const getExpenses = createAsyncThunk(
  "reports/getExpenses",
  async ({ accessToken = null, page = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/expenses-reports?`;
    }

    const startTime = new Date();
    logger.log("getExpenses::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getExpenses::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

// getStaffs Async Thunk
export const getStaffs = createAsyncThunk(
  "reports/getStaffs",
  async ({ accessToken = null, page = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/staff-reports?`;
    }

    const startTime = new Date();
    logger.log("getStaffs::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getStaffs::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

// getCustomerTrendsTabular Async Thunk
export const getCustomerTrendsTabular = createAsyncThunk(
  "reports/getCustomerTrendsTabular",
  async ({ accessToken = null, page = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/customer-trends/tabular?`;
    }

    const startTime = new Date();
    logger.log("getCustomerTrendsTabular::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getCustomerTrendsTabular::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

// getCustomerTrends Async Thunk
export const getCustomerTrends = createAsyncThunk(
  "reports/getCustomerTrends",
  async ({ accessToken = null, page = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/customer-trends?`;
    }

    const startTime = new Date();
    logger.log("getCustomerTrends::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getCustomerTrends::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder

      // getChanges Data
      .addCase(getChanges.pending, (state) => {
        state.getChangesStatus = "loading";
      })
      .addCase(getChanges.rejected, (state) => {
        state.getChangesStatus = "rejected";
        logger.log("getChanges::REJECTED");
      })
      .addCase(getChanges.fulfilled, (state, action) => {
        state.getChangesStatus = "fulfilled";
        state.getChanges = action.payload;
      })

      // getInventory Data
      .addCase(getInventory.pending, (state) => {
        state.getInventoryStatus = "loading";
      })
      .addCase(getInventory.rejected, (state) => {
        state.getInventoryStatus = "rejected";
        logger.log("getInventory::REJECTED");
      })
      .addCase(getInventory.fulfilled, (state, action) => {
        state.getInventoryStatus = "fulfilled";
        state.getInventory = action.payload;
      })

      // getExpenses Data
      .addCase(getExpenses.pending, (state) => {
        state.getExpensesStatus = "loading";
      })
      .addCase(getExpenses.rejected, (state) => {
        state.getExpensesStatus = "rejected";
        logger.log("getExpenses::REJECTED");
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.getExpensesStatus = "fulfilled";
        state.getExpenses = action.payload;
      })

      // getInvoices Data
      .addCase(getInvoices.pending, (state) => {
        state.getInvoicesStatus = "loading";
      })
      .addCase(getInvoices.rejected, (state) => {
        state.getInvoicesStatus = "rejected";
        logger.log("getInvoices::REJECTED");
      })
      .addCase(getInvoices.fulfilled, (state, action) => {
        state.getInvoicesStatus = "fulfilled";
        state.getInvoices = action.payload;
      })

      // getStaffs Data
      .addCase(getStaffs.pending, (state) => {
        state.getStaffsStatus = "loading";
      })
      .addCase(getStaffs.rejected, (state) => {
        state.getStaffsStatus = "rejected";
        logger.log("getStaffs::REJECTED");
      })
      .addCase(getStaffs.fulfilled, (state, action) => {
        state.getStaffsStatus = "fulfilled";
        state.getStaffs = action.payload;
      })

      // getCustomerTrends Data
      .addCase(getCustomerTrends.pending, (state) => {
        state.getCustomerTrendsStatus = "loading";
      })
      .addCase(getCustomerTrends.rejected, (state) => {
        state.getCustomerTrendsStatus = "rejected";
        logger.log("getCustomerTrends::REJECTED");
      })
      .addCase(getCustomerTrends.fulfilled, (state, action) => {
        state.getCustomerTrendsStatus = "fulfilled";
        state.getCustomerTrends = action.payload;
      })

      // getCustomerTrendsTabular Data
      .addCase(getCustomerTrendsTabular.pending, (state) => {
        state.getCustomerTrendsTabularStatus = "loading";
      })
      .addCase(getCustomerTrendsTabular.rejected, (state) => {
        state.getCustomerTrendsTabularStatus = "rejected";
        logger.log("getCustomerTrendsTabular::REJECTED");
      })
      .addCase(getCustomerTrendsTabular.fulfilled, (state, action) => {
        state.getCustomerTrendsTabularStatus = "fulfilled";
        state.getCustomerTrendsTabular = action.payload;
      })

      // getBalanceSheet Data
      .addCase(getBalanceSheet.pending, (state) => {
        state.getBalanceSheetStatus = "loading";
      })
      .addCase(getBalanceSheet.rejected, (state) => {
        state.getBalanceSheetStatus = "rejected";
        logger.log("getBalanceSheet::REJECTED");
      })
      .addCase(getBalanceSheet.fulfilled, (state, action) => {
        state.getBalanceSheetStatus = "fulfilled";
        state.getBalanceSheet = action.payload;
      });
  },
});

export default reportsSlice.reducer;
