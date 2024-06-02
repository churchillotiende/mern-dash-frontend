import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { parseValidFloat } from "../../../lib/shared/data-formatters";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("PosTransactions");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  sellableSearchTerm: "",

  sellablesList: null,
  sellablesListStatus: "idle",

  transactionTableList: null,
  transactionTableStatus: "idle",

  sellableCategoryList: null,
  sellableCategoryStatus: "idle",

  existingTransaction: null,
  existingTransactionId: null,
  existingTransactionStatus: "idle",

  transactionItems: [],

  view: "pos",
  showCategoryMenu: false,

  payments: [],
  client_id: null,
  selectedClient: null,
  transactionDate: null,
  discount: null,
  coupon: null,
  table_id: null,

  submissionStatus: "idle",
  submittedTransaction: null,
  submittedSagaId: null,

  suspensionStatus: "idle",
  suspendedTransaction: null,

  stkPushStatus: "idle",
  mpesaCheckoutId: null,

  getReminders: null,
  getRemindersStatus: "idle",

  getServiceReminders: null,
  getServiceRemindersStatus: "idle",

  getServiceReminderDetails: null,
  getServiceReminderDetailsStatus: "idle",

  getReminderDetails: null,
  getReminderDetailsStatus: "idle",
};

let sellableSearchInput;
if (typeof window !== "undefined") {
  sellableSearchInput = document.getElementById("posSellableSearchInput");
}

function selectSellableSearch() {
  if (!sellableSearchInput) {
    return;
  }

  sellableSearchInput.select();
}

export function isTransactionItemAService(titem) {
  if (!titem || !titem.sellable) {
    return false;
  }
  return titem.sellable.sellable_type === "App\\Product";
}

export const sendTransactionNotification = createAsyncThunk(
  "posTransaction/sendTransactionNotification",
  async ({
    accessToken = null,
    transactionId = null,
    sendSms = null,
    sendEmail = null,
  } = {}) => {
    if (!accessToken || !transactionId) {
      return;
    }

    let url =
      (url = `${API_URL}/transactions/${transactionId}/send_transaction_notification?`);

    const params = {};
    if (sendSms) {
      params["send_sms"] = encodeURIComponent(sendSms);
    }
    if (sendEmail) {
      params["send_email"] = encodeURIComponent(sendEmail);
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("sendTransactionNotification::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("sendTransactionNotification::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const sendStkPush = createAsyncThunk(
  "posTransaction/sendStkPush",
  async ({ accessToken = null, phone = null, amount = null } = {}) => {
    if (!accessToken || !phone || !amount) {
      return;
    }

    const url = `${API_URL}/transactions/send_stk`;

    let body = { phone, amount };
    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("sendStkPush::BEGIN");
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
      logger.log("sendStkPush::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getReminders = createAsyncThunk(
  "transactions/getReminders",
  async ({ page = null, accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/transaction/reminder?`;
    }

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getReminders::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getReminders::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getServiceReminderDetails = createAsyncThunk(
  "transactions/getServiceReminderDetails",
  async ({ page = null, accessToken = null, itemId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/inventory/service/reminder/${itemId}`;
    }

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getServiceReminderDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getServiceReminderDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getReminderDetails = createAsyncThunk(
  "transactions/getReminderDetails",
  async ({ page = null, accessToken = null, itemId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/transaction/reminder/${itemId}`;
    }

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getReminderDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getReminderDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getServiceReminders = createAsyncThunk(
  "transactions/getServiceReminders",
  async ({ page = null, accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/inventory/service/reminder?`;
    }

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getServiceReminders::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getServiceReminders::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchSellables = createAsyncThunk(
  "posTransaction/fetchSellables",
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
      url = `${API_URL}/sellables?`;
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
    logger.log("fetchSellables::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchSellables::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchSellableCategories = createAsyncThunk(
  "posTransaction/fetchSellableCategories",
  async ({ page = null, accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/sellable-categories?`;
    }

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchSellableCategories::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchSellableCategories::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchTransactionTables = createAsyncThunk(
  "posTransaction/fetchTransactionTables",
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
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchTransactionTables::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchTransactionTables::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchExistingTransaction = createAsyncThunk(
  "posTransaction/fetchExistingTransaction",
  async ({ accessToken = null, transactionId = null } = {}) => {
    if (!accessToken || !transactionId) {
      return;
    }

    let url = `${API_URL}/transactions/${transactionId}?`;

    const startTime = new Date();
    logger.log("fetchExistingTransaction::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchExistingTransaction:::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitTransaction = createAsyncThunk(
  "posTransaction/submitTransaction",
  async ({ accessToken = null, transactionData = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/transactions`;

    let body = {};
    body["client_id"] = transactionData.client_id;
    body["table_id"] = transactionData.table_id;
    if (transactionData.existingTransactionId) {
      body["transaction_id"] = transactionData.existingTransactionId;
    }
    if (transactionData.transactionDate) {
      body["trans_date"] = transactionData.transactionDate;
    }
    if (transactionData.discount) {
      body["discount"] = transactionData.discount;
    }
    body["payment_methods"] = transactionData.payments;
    body["transaction_items"] = transactionData.transactionItems.map((item) => {
      const this_item = {
        product_id: item.sellable.id,
        type: item.sellable.sellable_type,
        quantity: item.quantity,
        discount: item.discount,
        staff_id: item.staff_id,
        cost: item.cost ?? item.sellable?.sellable?.cost ?? 0,
      };

      if (!isNaN(item.id)) {
        this_item["id"] = item.id;
      }
      return this_item;
    });

    let grand_total = transactionData.transactionItems.reduce(
      (partialSum, item) => partialSum + item.sub_total,
      0
    );
    body["cost"] = grand_total;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitTransaction::BEGIN", body);
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
      logger.log("submitTransaction::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const suspendTransaction = createAsyncThunk(
  "posTransaction/supsendTransaction",
  async ({ accessToken = null, transactionData = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/transactions/suspend`;

    let body = {};
    body["client_id"] = transactionData.client_id;
    body["table_id"] = transactionData.table_id;
    body["payment_methods"] = transactionData.payments;
    if (transactionData.existingTransactionId) {
      body["transaction_id"] = transactionData.existingTransactionId;
    }
    if (transactionData.transactionDate) {
      body["trans_date"] = transactionData.transactionDate;
    }
    if (transactionData.discount) {
      body["discount"] = transactionData.discount;
    }
    body["transaction_items"] = transactionData.transactionItems.map((item) => {
      const this_item = {
        id: isNaN(item.id) ? null : item.id,
        product_id: item.sellable.id,
        type: item.sellable.sellable_type,
        quantity: item.quantity,
        discount: item.discount,
        staff_id: item.staff_id,
        cost: item.cost ?? item.sellable?.sellable?.cost ?? 0,
      };
      return this_item;
    });

    let grand_total = transactionData.transactionItems.reduce(
      (partialSum, item) => partialSum + item.sub_total,
      0
    );
    body["cost"] = grand_total;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("supsendTransaction::BEGIN", body);
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
      logger.log("supsendTransaction::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const posTransactionSlice = createSlice({
  name: "posTransaction",
  initialState,
  reducers: {
    //
    //
    showViewPos(state) {
      state.view = "pos";
    },
    showViewPayments(state) {
      state.view = "payments";
    },
    showViewReceipts(state) {
      state.view = "receipts";
    },
    showViewTables(state) {
      state.view = "tables";
    },
    //
    //
    toggleCategoryMenu(state, action) {
      const show = action?.payload?.show ?? !state.showCategoryMenu;
      state.showCategoryMenu = show;
    },
    //
    //
    addCashPayment(state) {
      const payment = {
        id: crypto.randomUUID(),
        type: "cash",
        amount: 0,
        payment_type: "debit",
      };
      state.payments.push(payment);
    },
    addCardPayment(state) {
      const payment = {
        id: crypto.randomUUID(),
        type: "card",
        amount: 0,
        payment_type: "debit",
      };
      state.payments.push(payment);
    },
    addMpesaPayment(state) {
      const payment = {
        id: crypto.randomUUID(),
        type: "mpesa",
        amount: 0,
        phone: "",
        transaction_code: "",
        payment_type: "debit",
      };
      state.payments.push(payment);
    },
    addOtherPayment(state) {
      const payment = {
        id: crypto.randomUUID(),
        type: "other",
        name: null,
        amount: 0,
        payment_type: "debit",
      };
      state.payments.push(payment);
    },
    removePayment(state, action) {
      const { itemId } = action.payload;
      if (!itemId) {
        return;
      }

      const remaining = state.payments.filter((item) => item.id !== itemId);

      state.payments = remaining;
    },
    setPaymentAmount(state, action) {
      const { itemId, amount } = action.payload;
      const payment = state.payments.find((item) => item.id === itemId);
      if (!payment) {
        return;
      }
      payment.amount = parseValidFloat(amount);
    },
    setMpesaPaymentPhone(state, action) {
      const { itemId, phone } = action.payload;
      const payment = state.payments.find((item) => item.id === itemId);
      if (!payment) {
        return;
      }
      payment.phone = phone;
    },
    setMpesaPaymentCode(state, action) {
      const { itemId, code } = action.payload;
      const payment = state.payments.find((item) => item.id === itemId);
      if (!payment) {
        return;
      }
      payment.transaction_code = code;
    },
    setOtherPaymentName(state, action) {
      const { itemId, name } = action.payload;
      const payment = state.payments.find((item) => item.id === itemId);
      if (!payment) {
        return;
      }
      payment.name = name;
    },
    //
    //
    sellableSearchTermUpdated(state, action) {
      state.sellableSearchTerm = action.payload;
    },
    resetSellableSearchTerm(state) {
      state.sellableSearchTerm = "1";
      selectSellableSearch();
    },
    //
    //
    setClient(state, action) {
      const { client_id } = action.payload;
      state.client_id = client_id;
    },
    setSelectedClient(state, action) {
      const { client } = action.payload;
      state.selectedClient = client;
    },
    clearClient(state) {
      state.client_id = null;
      state.selectedClient = null;
    },
    setTable(state, action) {
      const { table_id } = action.payload;
      state.table_id = table_id;
    },
    //
    //
    addTransactionItem(state, action) {
      const sellableId = action.payload;

      console.log(sellableId);

      if (!state.sellablesList) {
        return;
      }

      const sellable = state.sellablesList.data.find(
        (item) => item.id === sellableId
      );
      if (!sellable) {
        return;
      }

      const cost = parseFloat(sellable.sellable.cost);
      const quantity = 1;
      const discount = 0;
      const titem = {
        id: crypto.randomUUID(),
        sellable,
        client_id: null,
        staff_id: null,
        quantity,
        discount,
        cost,
        sub_total: cost * quantity - discount,
      };

      state.transactionItems.push(titem);
    },

    // Add Redirected Transaction items
    addRedirectItem(state, action) {
      const sellableBooking = action.payload;

      if (!sellableBooking) {
        return;
      }

      const sellable = sellableBooking?.service?.sellable;

      console.log("Sellable Slice Enock", sellableBooking);

      const cost = parseFloat(sellable?.sellable?.cost);
      const quantity = 1;
      const discount = 0;
      const clientId = sellableBooking?.user_id;
      const staffId = sellableBooking?.staff_id;
      const titem = {
        id: crypto.randomUUID(),
        sellable,
        client_id: clientId,
        staff_id: staffId,
        quantity,
        discount,
        cost,
        sub_total: cost * quantity - discount,
      };

      state.transactionItems.push(titem);
    },

    setTransactionItemStaff(state, action) {
      const { itemId, staffId } = action.payload;
      const transactionItem = state.transactionItems.find(
        (item) => item.id === itemId
      );
      if (!transactionItem) {
        return;
      }

      transactionItem.staff_id = staffId;
    },
    setTransactionItemQuantity(state, action) {
      let { itemId, quantity } = action.payload;
      const transactionItem = state.transactionItems.find(
        (item) => item.id === itemId
      );

      if (!transactionItem) {
        return;
      }

      quantity = parseValidFloat(quantity);

      transactionItem.quantity = quantity <= 0 ? 1 : quantity;

      const cost = parseFloat(transactionItem.cost);
      transactionItem.sub_total =
        cost * transactionItem.quantity - transactionItem.discount;
    },
    setTransactionItemDiscount(state, action) {
      const { itemId, discount } = action.payload;
      const transactionItem = state.transactionItems.find(
        (item) => item.id === itemId
      );

      if (!transactionItem) {
        return;
      }

      transactionItem.discount = parseValidFloat(discount);

      const cost = parseFloat(transactionItem.cost);
      transactionItem.sub_total =
        cost * transactionItem.quantity - transactionItem.discount;
    },
    setTransactionItemCost(state, action) {
      const { itemId, cost } = action.payload;
      const transactionItem = state.transactionItems.find(
        (item) => item.id === itemId
      );

      if (!transactionItem) {
        return;
      }

      transactionItem.cost = parseValidFloat(cost);

      transactionItem.sub_total =
        cost * transactionItem.quantity - transactionItem.discount;
    },
    removeTransactionItem(state, action) {
      const { itemId } = action.payload;
      if (!itemId) {
        return;
      }

      const remainingItems = state.transactionItems.filter(
        (item) => item.id !== itemId
      );

      state.transactionItems = remainingItems;
    },
    //
    //
    setSubmittedTransaction(state, action) {
      state.submittedSagaId = null;
      state.submittedTransaction = action.payload;
    },
    //
    //
    clearSubmittedTransaction(state) {
      state.existingTransaction = null;
      state.existingTransactionId = null;
      state.existingTransactionStatus = "idle";

      state.submittedTransaction = null;
      state.suspendedTransaction = null;
      state.view = "pos";
      state.showCategoryMenu = false;
    },
    //
    //
    setTransactionDate(state, action) {
      const { transactionDate } = action.payload;
      state.transactionDate = transactionDate == "" ? null : transactionDate;
    },
    setDiscount(state, action) {
      const { discount } = action.payload;
      state.discount = parseValidFloat(discount);
    },
    //

    setCoupon(state, action) {
      const { coupon } = action.payload;
      state.coupon = parseValidFloat(coupon);
    },

    //
    resetTransactionState(state) {
      state.sellableSearchTerm = "";

      state.sellablesList = null;
      state.sellablesListStatus = "idle";

      state.transactionTableList = null;
      state.transactionTableStatus = "idle";

      state.sellableCategoryList = null;
      state.sellableCategoryStatus = "idle";

      state.transactionItems = [];

      state.payments = [];
      state.client_id = null;
      state.selectedClient = null;
      state.transactionDate = null;
      state.discount = null;
      state.table_id = null;

      state.submissionStatus = "idle";
      state.submittedSagaId = null;

      state.suspensionStatus = "idle";
      state.stkPushStatus = "idle";
      state.mpesaCheckoutId = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSellables.pending, (state) => {
        state.sellablesListStatus = "loading";
      })
      .addCase(fetchSellables.rejected, (state, action) => {
        state.sellablesListStatus = "rejected";
        logger.log("fetchSellables::REJECTED", action.error);
      })
      .addCase(fetchSellables.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchSellables::FULFILLED", { payload });

        state.sellablesListStatus = "fulfilled";
        state.sellablesList = action.payload;
      });
    //
    builder
      .addCase(sendStkPush.pending, (state) => {
        state.stkPushStatus = "loading";
      })
      .addCase(sendStkPush.rejected, (state, action) => {
        state.stkPushStatus = "rejected";
        logger.log("sendStkPush::REJECTED", action.error);
      })
      .addCase(sendStkPush.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("sendStkPush::FULFILLED", { payload });

        state.mpesaCheckoutId = payload.mpesa_checkout_id;

        state.stkPushStatus = "fulfilled";
      })
      //
      .addCase(fetchTransactionTables.pending, (state) => {
        state.transactionTableStatus = "loading";
      })
      .addCase(fetchTransactionTables.rejected, (state, action) => {
        state.transactionTableStatus = "rejected";
        logger.log("fetchTransactionTables::REJECTED", action.error);
      })
      .addCase(fetchTransactionTables.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchTransactionTables::FULFILLED", { payload });

        state.transactionTableStatus = "fulfilled";
        state.transactionTableList = action.payload;
      })
      //

      //getReminders
      .addCase(getReminders.pending, (state) => {
        state.getRemindersStatus = "loading";
      })
      .addCase(getReminders.rejected, (state, action) => {
        state.getRemindersStatus = "rejected";
        logger.log("getReminders::REJECTED", action.error);
      })
      .addCase(getReminders.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("getReminders::FULFILLED", { payload });

        state.getRemindersStatus = "fulfilled";
        state.getReminders = action.payload;
      })

      //getServiceReminders
      .addCase(getServiceReminders.pending, (state) => {
        state.getServiceRemindersStatus = "loading";
      })
      .addCase(getServiceReminders.rejected, (state, action) => {
        state.getServiceRemindersStatus = "rejected";
        logger.log("getServiceReminders::REJECTED", action.error);
      })
      .addCase(getServiceReminders.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("getServiceReminders::FULFILLED", { payload });

        state.getServiceRemindersStatus = "fulfilled";
        state.getServiceReminders = action.payload;
      })

      //getServiceReminderDetails
      .addCase(getServiceReminderDetails.pending, (state) => {
        state.getServiceReminderDetailsStatus = "loading";
      })
      .addCase(getServiceReminderDetails.rejected, (state, action) => {
        state.getServiceReminderDetailsStatus = "rejected";
        logger.log("getServiceReminderDetails::REJECTED", action.error);
      })
      .addCase(getServiceReminderDetails.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("getServiceReminderDetails::FULFILLED", { payload });

        state.getServiceReminderDetailsStatus = "fulfilled";
        state.getServiceReminderDetails = action.payload;
      })

      //getReminderDetails

      .addCase(getReminderDetails.pending, (state) => {
        state.getReminderDetailsStatus = "loading";
      })
      .addCase(getReminderDetails.rejected, (state, action) => {
        state.getReminderDetailsStatus = "rejected";
        logger.log("getReminderDetails::REJECTED", action.error);
      })
      .addCase(getReminderDetails.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("getReminderDetails::FULFILLED", { payload });

        state.getReminderDetailsStatus = "fulfilled";
        state.getReminderDetails = action.payload;
      })

      //
      .addCase(fetchSellableCategories.pending, (state) => {
        state.sellableCategoryStatus = "loading";
      })
      .addCase(fetchSellableCategories.rejected, (state, action) => {
        state.sellableCategoryStatus = "rejected";
        logger.log("fetchSellableCategories::REJECTED", action.error);
      })
      .addCase(fetchSellableCategories.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchSellableCategories::FULFILLED", { payload });

        state.sellableCategoryStatus = "fulfilled";
        state.sellableCategoryList = action.payload;
      })
      //
      .addCase(fetchExistingTransaction.pending, (state) => {
        state.existingTransactionStatus = "loading";
      })
      .addCase(fetchExistingTransaction.rejected, (state, action) => {
        state.existingTransactionStatus = "rejected";
        logger.log("fetchExistingTransaction::REJECTED", action.error);
      })
      .addCase(fetchExistingTransaction.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchExistingTransaction::FULFILLED", { payload });

        state.existingTransactionStatus = "fulfilled";

        const transaction = action.payload;
        state.existingTransaction = transaction;
        state.existingTransactionId = transaction.id;

        if (parseInt(transaction.client_id) !== 0) {
          state.client_id = parseInt(transaction.client_id);
        } else {
          state.client_id = null;
        }
        state.selectedClient = transaction.client ?? null;

        state.discount = parseInt(transaction.discount);
        state.table_id = transaction.restaurant_transaction?.table_id ?? null;

        state.transactionItems = transaction.titems.map((item) => {
          const cost = parseFloat(
            item.cost ?? item.sellable?.sellable?.cost ?? 0
          );
          const sellable = item.sellable;
          const quantity = parseFloat(item.quantity);
          const discount = parseFloat(item.discount);
          const client_id = item.client_id;
          const staff_id = item.staff_id;

          const titem = {
            id: item.id,
            sellable,
            client_id,
            staff_id,
            cost,
            quantity,
            discount,
            sub_total: cost * quantity - discount,
          };

          return titem;
        });
      })
      //
      .addCase(submitTransaction.pending, (state) => {
        state.submissionStatus = "loading";
      })
      .addCase(submitTransaction.rejected, (state, action) => {
        state.submissionStatus = "rejected";
        logger.warn("submitTransaction::REJECTED", action.error);
      })
      .addCase(submitTransaction.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitTransaction::FULFILLED", { payload });

        state.submissionStatus = "fulfilled";
        state.submittedSagaId = action.payload?.saga_id ?? null;
      })
      //
      .addCase(suspendTransaction.pending, (state) => {
        state.suspensionStatus = "loading";
      })
      .addCase(suspendTransaction.rejected, (state, action) => {
        state.suspensionStatus = "rejected";
        logger.warn("suspendTransaction::REJECTED", action.error);
      })
      .addCase(suspendTransaction.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("suspendTransaction::FULFILLED", { payload });

        state.suspensionStatus = "fulfilled";
        state.submittedSagaId = action.payload?.saga_id ?? null;
      });
    //
  },
});

export const {
  sellableSearchTermUpdated,
  resetSellableSearchTerm,
  //
  addCashPayment,
  addCardPayment,
  addMpesaPayment,
  addOtherPayment,
  removePayment,
  setPaymentAmount,
  setMpesaPaymentPhone,
  setMpesaPaymentCode,
  setOtherPaymentName,
  //
  addTransactionItem,
  addRedirectItem,
  setTransactionItemStaff,
  setTransactionItemQuantity,
  setTransactionItemDiscount,
  setTransactionItemCost,
  removeTransactionItem,
  //
  setClient,
  setSelectedClient,
  clearClient,
  setTransactionDate,
  setDiscount,
  setCoupon,
  setTable,
  //
  showViewPos,
  showViewPayments,
  showViewReceipts,
  showViewTables,
  //
  toggleCategoryMenu,
  //
  setSubmittedTransaction,
  //
  resetTransactionState,
  clearSubmittedTransaction,
} = posTransactionSlice.actions;

export default posTransactionSlice.reducer;

// Assume all bar codes have atleast 5 of the last character as numeric
export const isSearchTermBarCode = (state) => {
  const searchTerm = state.posTransaction.sellableSearchTerm.slice(-5);
  const isNumeric = !isNaN(searchTerm.slice(-5)) && searchTerm !== "";
  return isNumeric;
};

export const isViewPos = (state) => state.posTransaction.view === "pos";
export const isViewPayments = (state) =>
  state.posTransaction.view === "payments";
export const isViewReceipts = (state) =>
  state.posTransaction.view === "receipts";
export const isViewTables = (state) => state.posTransaction.view === "tables";
