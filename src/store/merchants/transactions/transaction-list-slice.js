import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";
import store from "../../store";

const logger = getLogger("Transactions");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  transactionList: null,
  transactionListType: null,
  transactionListStatus: "idle",

  transactionTableList: null,
  transactionTableStatus: "idle",

  creditReminderSettingData: null,
  creditReminderSettingStatus: "idle",
};

export const fetchCreditReminderSetting = createAsyncThunk(
  "transactions/fetchCreditReminderSetting",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/transaction_settings/credit_reminders`;

    const startTime = new Date();
    logger.log("fetchCreditReminderSetting::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchCreditReminderSetting::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitCreditReminderSetting = createAsyncThunk(
  "transactions/submitCreditReminderSetting",
  async ({
    accessToken = null,
    daysX = null,
    dateX = null,
    recurring = false,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/transaction_settings/credit_reminders`;

    let body = {};

    body["days_x"] = daysX;
    body["date_x"] = dateX;
    body["recurring"] = recurring;
    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitCreditReminderSetting::BEGIN", body);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("submitCreditReminderSetting::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchTransactionList = createAsyncThunk(
  "transactions/fetchTransactionList",
  async ({
    page = null,
    accessToken = null,

    startDate = null,
    endDate = null,

    suspended = null,
    is_credited = false,
    voided = false,

    tableId = null,
    clientId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/transactions?`;
    }

    const params = {};
    if (startDate) {
      params["start_date"] = startDate;
    }
    if (endDate) {
      params["end_date"] = endDate;
    }

    if (tableId) {
      params["table_id"] = tableId;
    }

    if (clientId) {
      params["client_id"] = clientId;
    }

    if (suspended) {
      params["suspended"] = true;

      if (tableId) {
        store.dispatch(
          setTransactionListType({ transaction_type: "suspended_tables" })
        );
      } else {
        store.dispatch(
          setTransactionListType({ transaction_type: "suspended" })
        );
      }
    } else if (voided) {
      params["voided"] = true;
      store.dispatch(setTransactionListType({ transaction_type: "voided" }));
    } else if (is_credited) {
      params["is_credited"] = true;
      store.dispatch(setTransactionListType({ transaction_type: "credited" }));
    } else {
      store.dispatch(setTransactionListType({ transaction_type: "normal" }));
    }
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchTransactionList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchTransactionList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchTransactionTableList = createAsyncThunk(
  "posTransaction/fetchTransactionTableList",
  async ({ page = null, accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/restaurant-tables?`;
    }

    const params = {};
    params["with_transactions"] = true;
    params["suspended"] = true;
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchTransactionTableList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchTransactionTableList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const updateOrderTable = createAsyncThunk(
  "posTransaction/updateOrderTable",
  async ({ orderId = null, toTableId = null, accessToken = null } = {}) => {
    if (!accessToken || !toTableId || !orderId) {
      return;
    }

    let url = `${API_URL}/transaction-list/change_order_table`;

    let body = {};
    body["order_id"] = orderId;
    body["to_table_id"] = toTableId;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("updateOrderTable::BEGIN");
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("updateOrderTable::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const mergeTables = createAsyncThunk(
  "posTransaction/mergeTables",
  async ({ fromTableId = null, toTableId = null, accessToken = null } = {}) => {
    if (!accessToken || !toTableId || !fromTableId) {
      return;
    }

    let url = `${API_URL}/transaction-list/merge_tables`;

    let body = {};
    body["from_table_id"] = fromTableId;
    body["to_table_id"] = toTableId;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("mergeTables::BEGIN");
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("mergeTables::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const transactions = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactionListType(state, action) {
      const { transaction_type } = action.payload;
      state.transactionListType = transaction_type;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTransactionList.pending, (state) => {
        state.transactionListStatus = "loading";
        state.transactionList = null;
      })
      .addCase(fetchTransactionList.rejected, (state, action) => {
        state.transactionListStatus = "rejected";
        logger.log("fetchTransactionList::REJECTED", action.error);
      })
      .addCase(fetchTransactionList.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchTransactionList::FULFILLED", { payload });

        state.transactionListStatus = "fulfilled";
        state.transactionList = action.payload;
      })
      //
      .addCase(fetchTransactionTableList.pending, (state) => {
        state.transactionTableStatus = "loading";
      })
      .addCase(fetchTransactionTableList.rejected, (state, action) => {
        state.transactionTableStatus = "rejected";
        logger.log("fetchTransactionTableList::REJECTED", action.error);
      })
      .addCase(fetchTransactionTableList.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchTransactionTableList::FULFILLED", { payload });

        state.transactionTableStatus = "fulfilled";
        state.transactionTableList = action.payload;
      })
      //
      .addCase(fetchCreditReminderSetting.pending, (state) => {
        state.creditReminderSettingStatus = "loading";
        state.creditReminderSettingData = null;
      })
      .addCase(fetchCreditReminderSetting.rejected, (state, action) => {
        state.creditReminderSettingStatus = "rejected";
        logger.log("fetchCreditReminderSetting::REJECTED", action.error);
      })
      .addCase(fetchCreditReminderSetting.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchCreditReminderSetting::FULFILLED", { payload });

        state.creditReminderSettingStatus = "fulfilled";
        state.creditReminderSettingData = action.payload;
      });
  },
});

export const { setTransactionListType } = transactions.actions;

export default transactions.reducer;
