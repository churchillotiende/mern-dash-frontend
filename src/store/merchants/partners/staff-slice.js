import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("StaffSlice");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  staffList: [],
  staffListStatus: "idle",

  //getStaffList
  getStaffList: null,
  getStaffListStatus: "idle",

  getStaffRoles: null,
  getStaffRolesStatus: "idle",

  getStaffDetails: [],
  getStaffDetailsStatus: "idle",

  getStaffTransactions: null,
  getStaffTransactionsStatus: "idle",

  getStaffToShareCommission: null,
  getStaffToShareCommissionStatus: "idle",
};

export const fetchStaff = createAsyncThunk(
  "staff/fetchStaff",
  async ({
    page = null,
    accessToken = null,
    fetch_all = false,
    lean = false,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/partners/staff?`;
    }

    const params = {};
    if (fetch_all) {
      params["get_all"] = true;
    }
    if (lean) {
      params["lean"] = true;
    }
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchStaff::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchStaff::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getStaffTransactions = createAsyncThunk(
  "staff/getStaffTransactions",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    staffId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/staff/${staffId}/transactions?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getStaffTransactions::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getStaffTransactions::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getStaffList = createAsyncThunk(
  "staff/getStaffList",
  async ({ page = null, accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/partners/staff?`;
    }

    const startTime = new Date();
    logger.log("getStaffList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getStaffList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getStaffDetails = createAsyncThunk(
  "staff/getStaffDetails",
  async ({ accessToken = null, staffId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/staff/show/${staffId}`;

    const startTime = new Date();
    logger.log("getStaffDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getStaffDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getStaffToShareCommission = createAsyncThunk(
  "staff/getStaffToShareCommission",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/staff/to-share-commission`;

    const startTime = new Date();
    logger.log("getStaffToShareCommission::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getStaffToShareCommission::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getStaffRoles = createAsyncThunk(
  "staff/getStaffRoles",
  async ({ accessToken = null, staffId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/staff-roles`;

    const startTime = new Date();
    logger.log("getStaffRoles::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getStaffRoles::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const staff = createSlice({
  name: "staff",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // getStaffDetails Data
      .addCase(getStaffDetails.pending, (state) => {
        state.getStaffDetailsStatus = "loading";
      })
      .addCase(getStaffDetails.rejected, (state) => {
        state.getStaffDetailsStatus = "rejected";
        logger.log("getStaffDetails::REJECTED");
      })
      .addCase(getStaffDetails.fulfilled, (state, action) => {
        state.getStaffDetailsStatus = "fulfilled";
        state.getStaffDetails = action.payload;
      })

      //getStaffTransactions
      .addCase(getStaffTransactions.pending, (state) => {
        state.getStaffTransactionsStatus = "loading";
      })
      .addCase(getStaffTransactions.rejected, (state) => {
        state.getStaffTransactionsStatus = "rejected";
        logger.log("getStaffTransactions::REJECTED");
      })
      .addCase(getStaffTransactions.fulfilled, (state, action) => {
        state.getStaffTransactionsStatus = "fulfilled";
        state.getStaffTransactions = action.payload;
      })

      //getStaffToShareCommission
      .addCase(getStaffToShareCommission.pending, (state) => {
        state.getStaffToShareCommissionStatus = "loading";
      })
      .addCase(getStaffToShareCommission.rejected, (state) => {
        state.getStaffToShareCommissionStatus = "rejected";
        logger.log("getStaffToShareCommission::REJECTED");
      })
      .addCase(getStaffToShareCommission.fulfilled, (state, action) => {
        state.getStaffToShareCommissionStatus = "fulfilled";
        state.getStaffToShareCommission = action.payload;
      })

      // getStaffRoles Data
      .addCase(getStaffRoles.pending, (state) => {
        state.getStaffRolesStatus = "loading";
      })
      .addCase(getStaffRoles.rejected, (state) => {
        state.getStaffRolesStatus = "rejected";
        logger.log("getStaffRoles::REJECTED");
      })
      .addCase(getStaffRoles.fulfilled, (state, action) => {
        state.getStaffRolesStatus = "fulfilled";
        state.getStaffRoles = action.payload;
      })

      // getStaffList Data
      .addCase(getStaffList.pending, (state) => {
        state.getStaffListStatus = "loading";
      })
      .addCase(getStaffList.rejected, (state) => {
        state.getStaffListStatus = "rejected";
        logger.log("getStaffList::REJECTED");
      })
      .addCase(getStaffList.fulfilled, (state, action) => {
        state.getStaffListStatus = "fulfilled";
        state.getStaffList = action.payload;
      })

      .addCase(fetchStaff.pending, (state) => {
        state.staffListStatus = "loading";
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.staffListStatus = "rejected";
        logger.log("fetchStaff::REJECTED", action.error);
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchStaff::FULFILLED", { payload });

        state.staffListStatus = "fulfilled";
        state.staffList = action.payload;

        if (typeof window !== "undefined") {
          try {
            window.sessionStorage.setItem(
              "staff",
              JSON.stringify(action.payload)
            );
          } catch (e) {
            logger.log("fetchStaff::ERROR", {
              message: "Could not set storage",
            });
          }
        }
      });
  },
});

export default staff.reducer;
