import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../../lib/shared/logger";

const logger = getLogger("SalesReportsSlice");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  salesList: null,
  salesListStatus: "idle",

  comboSalesList: null,
  comboSalesListStatus: "idle",

  comboSalesDetails: null,
  comboSalesDetailsStatus: "idle",

  sellablesList: null,
  sellablesListStatus: "idle",

  salesSummaryReceiptStatus: "idle",

  salesListReceiptStatus: "idle",

  inventoryReportList: null,
  inventoryReportListStatus: "idle",
};

export const fetchInventoryReportList = createAsyncThunk(
  "sellableSalesReports/fetchInventoryReportList",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    category_id,
    sub_category_id,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/sellables/inventory_report?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = encodeURIComponent(filter);
    }
    if (category_id) {
      params["category_id"] = encodeURIComponent(category_id);
    }
    if (sub_category_id) {
      params["sub_category_id"] = encodeURIComponent(sub_category_id);
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchInventoryReportList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchInventoryReportList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchSalesSummaryReceipt = createAsyncThunk(
  "sellableSalesReports/fetchSalesSummaryReceipt",
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
      url = `${API_URL}/reports/transactions/sold_sellables/receipt?`;
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
    logger.log("fetchSalesSummaryReceipt::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.blob();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchSalesSummaryReceipt::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.innerHTML = `SalesSummary.pdf`;
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

export const fetchSoldSellables = createAsyncThunk(
  "sellableSalesReports/fetchSoldSellables",
  async ({
    page = null,
    accessToken = null,
    startDate = null,
    endDate = null,

    categoryId = null,
    subCategoryId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/transactions/sold_sellables?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    if (categoryId !== null) {
      params["category_id"] = categoryId;
    }

    if (subCategoryId !== null) {
      params["sub_category_id"] = subCategoryId;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchSoldSellables::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchSoldSellables::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchSalesListReceipt = createAsyncThunk(
  "sellableSalesReports/fetchSalesListReceipt",
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
      url = `${API_URL}/reports/transactions/sales_list_pdf?`;
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
    logger.log("fetchSalesListReceipt::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.blob();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchSalesListReceipt::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.innerHTML = `SalesSummary.pdf`;
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

export const fetchSalesList = createAsyncThunk(
  "salesReport/fetchSalesList",
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
      url = `${API_URL}/reports/transactions/sales_list?`;
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
    logger.log("fetchSalesList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchSalesList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchComboSalesList = createAsyncThunk(
  "salesReport/fetchComboSalesList",
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
      url = `${API_URL}/reports/transactions/combo_sales_list?`;
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
    logger.log("fetchComboSalesList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchComboSalesList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchComboSalesDetails = createAsyncThunk(
  "salesReport/fetchComboSalesDetails",
  async ({
    comboSellableId = null,
    page = null,
    accessToken = null,
    startDate = null,
    endDate = null,
  } = {}) => {
    if (!accessToken || !comboSellableId) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/reports/transactions/combo_item_sales_list/${comboSellableId}?`;
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
    logger.log("fetchComboSalesDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchComboSalesDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const salesReports = createSlice({
  name: "salesReports",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSalesList.pending, (state) => {
        state.salesListStatus = "loading";
      })
      .addCase(fetchSalesList.rejected, (state, action) => {
        state.salesListStatus = "rejected";
        logger.log("fetchSalesList::REJECTED", action.error);
      })
      .addCase(fetchSalesList.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchSalesList::FULFILLED", { payload });

        state.salesListStatus = "fulfilled";
        state.salesList = action.payload;
      })

      // fetchSoldSellables
      .addCase(fetchSoldSellables.pending, (state) => {
        state.sellablesListStatus = "loading";
      })
      .addCase(fetchSoldSellables.rejected, (state, action) => {
        state.sellablesListStatus = "rejected";
        logger.log("fetchSoldSellables::REJECTED", action.error);
      })
      .addCase(fetchSoldSellables.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchSoldSellables::FULFILLED", { payload });

        state.sellablesListStatus = "fulfilled";
        state.sellablesList = action.payload;
      })

      // fetchSalesSummaryReceipt
      .addCase(fetchSalesSummaryReceipt.pending, (state) => {
        state.salesSummaryReceiptStatus = "loading";
      })
      .addCase(fetchSalesSummaryReceipt.rejected, (state) => {
        state.salesSummaryReceiptStatus = "rejected";
        logger.log("salesSummaryReceiptStatus::REJECTED");
      })
      .addCase(fetchSalesSummaryReceipt.fulfilled, (state) => {
        state.salesSummaryReceiptStatus = "fulfilled";
      })

      // fetchSalesListReceipt
      .addCase(fetchSalesListReceipt.pending, (state) => {
        state.salesListReceiptStatus = "loading";
      })
      .addCase(fetchSalesListReceipt.rejected, (state) => {
        state.salesListReceiptStatus = "rejected";
        logger.log("fetchSalesListReceipt::REJECTED");
      })
      .addCase(fetchSalesListReceipt.fulfilled, (state) => {
        state.salesListReceiptStatus = "fulfilled";
      })

      // fetchComboSalesList
      .addCase(fetchComboSalesList.pending, (state) => {
        state.comboSalesListStatus = "loading";
      })
      .addCase(fetchComboSalesList.rejected, (state) => {
        state.comboSalesListStatus = "rejected";
        logger.log("fetchComboSalesList::REJECTED");
      })
      .addCase(fetchComboSalesList.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchComboSalesList::FULFILLED", { payload });

        state.comboSalesListStatus = "fulfilled";
        state.comboSalesList = action.payload;
      })

      // fetchComboSalesDetails
      .addCase(fetchComboSalesDetails.pending, (state) => {
        state.comboSalesDetailsStatus = "loading";
      })
      .addCase(fetchComboSalesDetails.rejected, (state) => {
        state.comboSalesDetailsStatus = "rejected";
        logger.log("fetchComboSalesDetails::REJECTED");
      })
      .addCase(fetchComboSalesDetails.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchComboSalesDetails::FULFILLED", { payload });

        state.comboSalesDetailsStatus = "fulfilled";
        state.comboSalesDetails = action.payload;
      })
      //
      .addCase(fetchInventoryReportList.pending, (state) => {
        state.inventoryReportListStatus = "loading";
      })
      .addCase(fetchInventoryReportList.rejected, (state, action) => {
        state.inventoryReportListStatus = "rejected";
        logger.log("fetchInventoryReportList::REJECTED", action.error);
      })
      .addCase(fetchInventoryReportList.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchInventoryReportList::FULFILLED", { payload });

        state.inventoryReportListStatus = "fulfilled";
        state.inventoryReportList = action.payload;
      });
    //
  },
});

export default salesReports.reducer;
