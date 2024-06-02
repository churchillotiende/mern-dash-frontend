import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("AccessControlSlice");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  accessGroupList: null,
  accessGroupListStatus: "idle",

  permissionsList: null,
  permissionsListStatus: "idle",

  submitAccessGroupStatus: "idle",
  deleteAccessGroupStatus: "idle",

  submitAccessGroupUsersStatus: "idle",
  submitAccessGroupPagesStatus: "idle",

  myAccountDataStatus: "idle",
  myAccountData: null,

  packagesList: null,
  packagesListStatus: "idle",

  subscriptionInvoiceList: null,
  subscriptionInvoiceStatus: "idle",
};

export const submitAccessGroup = createAsyncThunk(
  "accessControlSlice/submitAccessGroup",
  async ({ accessToken = null, name = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/settings/accessGroups`;

    let body = {};

    body["name"] = name;
    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitAccessGroup::BEGIN", body);
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
      logger.log("submitAccessGroup::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitAccessGroupUsers = createAsyncThunk(
  "accessControlSlice/submitAccessGroupUsers",
  async ({
    accessToken = null,
    accessGroupId = null,
    accessGroupUsers = null,
  } = {}) => {
    if (!accessToken || !accessGroupId || !accessGroupUsers) {
      return;
    }

    let url = `${API_URL}/settings/accessGroupUsers/${accessGroupId}`;

    let body = {};
    body["users"] = [...accessGroupUsers];
    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitAccessGroupUsers::BEGIN", body);
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
      logger.log("submitAccessGroupUsers::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitAccessGroupPages = createAsyncThunk(
  "accessControlSlice/submitAccessGroupPages",
  async ({
    accessToken = null,
    accessGroupId = null,
    accessGroupPages = null,
    accessGroupPermissions = null,
  } = {}) => {
    if (
      !accessToken ||
      !accessGroupId ||
      !accessGroupPages ||
      !accessGroupPermissions
    ) {
      return;
    }

    let url = `${API_URL}/settings/accessGroupPermissions/${accessGroupId}`;

    let body = {};
    body["pages"] = [...accessGroupPages];
    body["permissions"] = [...accessGroupPermissions];
    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitAccessGroupPages::BEGIN", body);
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
      logger.log("submitAccessGroupPages::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const deleteAccessGroup = createAsyncThunk(
  "accessControlSlice/deleteAccessGroup",
  async ({ accessToken = null, itemId = null } = {}) => {
    if (!accessToken || !itemId) {
      return;
    }

    let url = `${API_URL}/settings/accessGroups/${itemId}`;

    const startTime = new Date();
    logger.log("deleteAccessGroup::BEGIN");
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("deleteAccessGroup::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchAccessGroups = createAsyncThunk(
  "accessControlSlice/fetchAccessGroups",
  async ({ page = null, accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/settings/accessGroups?`;
    }

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchAccessGroups::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchAccessGroups::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchPermissions = createAsyncThunk(
  "accessControlSlice/fetchPermissions",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/settings/accessGroupPermissions`;

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchPermissions::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchPermissions::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchMyAccountData = createAsyncThunk(
  "accessControlSlice/fetchMyAccountData",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/auth/me?`;

    const params = {};
    params["detailed"] = true;
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchMyAccountData::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchMyAccountData::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchPackagesList = createAsyncThunk(
  "accessControlSlice/fetchPackagesList",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/settings/packages`;

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchPackagesList::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchPackagesList::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const sendSubscriptionStk = createAsyncThunk(
  "accessControlSlice/sendSubscriptionStk",
  async ({
    accessToken = null,
    phone = null,
    amount = null,
    package_id = null,
    billing_period = null,
  } = {}) => {
    if (!accessToken || !phone || !amount || !package_id || !billing_period) {
      return;
    }

    const url = `${API_URL}/settings/packages/purchase`;

    let body = { phone, amount, package_id, billing_period };
    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("sendSubscriptionStk::BEGIN");
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
      logger.log("sendSubscriptionStk::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchSubscriptionInvoices = createAsyncThunk(
  "accessControlSlice/fetchSubscriptionInvoices",
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
      url = `${API_URL}/settings/packages/invoices?`;
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
    logger.log("fetchSubscriptionInvoices::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchSubscriptionInvoices::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const accessControl = createSlice({
  name: "accessControl",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // fetchAccessGroups
      .addCase(fetchAccessGroups.pending, (state) => {
        state.accessGroupListStatus = "loading";
      })
      .addCase(fetchAccessGroups.rejected, (state) => {
        state.accessGroupListStatus = "rejected";
        logger.log("fetchAccessGroups::REJECTED");
      })
      .addCase(fetchAccessGroups.fulfilled, (state, action) => {
        state.accessGroupListStatus = "fulfilled";
        state.accessGroupList = action.payload;
      })

      // submitAccessGroup
      .addCase(submitAccessGroup.pending, (state) => {
        state.submitAccessGroupStatus = "loading";
      })
      .addCase(submitAccessGroup.rejected, (state, action) => {
        state.submitAccessGroupStatus = "rejected";
        logger.warn("submitAccessGroup::REJECTED", action.error);
      })
      .addCase(submitAccessGroup.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitAccessGroup::FULFILLED", { payload });

        state.submitAccessGroupStatus = "fulfilled";
      })

      // deleteAccessGroup
      .addCase(deleteAccessGroup.pending, (state) => {
        state.deleteAccessGroupStatus = "loading";
      })
      .addCase(deleteAccessGroup.rejected, (state, action) => {
        state.deleteAccessGroupStatus = "rejected";
        logger.warn("deleteAccessGroup::REJECTED", action.error);
      })
      .addCase(deleteAccessGroup.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("deleteAccessGroup::FULFILLED", { payload });

        state.deleteAccessGroupStatus = "fulfilled";
      })

      // submitAccessGroupUsers
      .addCase(submitAccessGroupUsers.pending, (state) => {
        state.submitAccessGroupUsersStatus = "loading";
      })
      .addCase(submitAccessGroupUsers.rejected, (state, action) => {
        state.submitAccessGroupUsersStatus = "rejected";
        logger.warn("submitAccessGroupUsers::REJECTED", action.error);
      })
      .addCase(submitAccessGroupUsers.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitAccessGroupUsers::FULFILLED", { payload });

        state.submitAccessGroupUsersStatus = "fulfilled";
      })

      // fetchPermissions
      .addCase(fetchPermissions.pending, (state) => {
        state.permissionsListStatus = "loading";
      })
      .addCase(fetchPermissions.rejected, (state) => {
        state.permissionsListStatus = "rejected";
        logger.log("fetchPermissions::REJECTED");
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.permissionsListStatus = "fulfilled";
        state.permissionsList = action.payload;
      })

      // fetchMyAccountData
      .addCase(fetchMyAccountData.pending, (state) => {
        state.myAccountDataStatus = "loading";
      })
      .addCase(fetchMyAccountData.rejected, (state) => {
        state.myAccountDataStatus = "rejected";
        logger.log("fetchMyAccountData::REJECTED");
      })
      .addCase(fetchMyAccountData.fulfilled, (state, action) => {
        state.myAccountDataStatus = "fulfilled";
        state.myAccountData = action.payload;
      })

      // submitAccessGroupPages
      .addCase(submitAccessGroupPages.pending, (state) => {
        state.submitAccessGroupPagesStatus = "loading";
      })
      .addCase(submitAccessGroupPages.rejected, (state, action) => {
        state.submitAccessGroupPagesStatus = "rejected";
        logger.warn("submitAccessGroupPages::REJECTED", action.error);
      })
      .addCase(submitAccessGroupPages.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitAccessGroupPages::FULFILLED", { payload });

        state.submitAccessGroupPagesStatus = "fulfilled";
      })

      // fetchPackagesList
      .addCase(fetchPackagesList.pending, (state) => {
        state.packagesListStatus = "loading";
      })
      .addCase(fetchPackagesList.rejected, (state) => {
        state.packagesListStatus = "rejected";
        logger.log("fetchPackagesList::REJECTED");
      })
      .addCase(fetchPackagesList.fulfilled, (state, action) => {
        state.packagesListStatus = "fulfilled";
        state.packagesList = action.payload;
      })

      // fetchSubscriptionInvoices
      .addCase(fetchSubscriptionInvoices.pending, (state) => {
        state.subscriptionInvoiceStatus = "loading";
      })
      .addCase(fetchSubscriptionInvoices.rejected, (state) => {
        state.subscriptionInvoiceStatus = "rejected";
        logger.log("fetchSubscriptionInvoices::REJECTED");
      })
      .addCase(fetchSubscriptionInvoices.fulfilled, (state, action) => {
        state.subscriptionInvoiceStatus = "fulfilled";
        state.subscriptionInvoiceList = action.payload;
      });

    // END
  },
});

export default accessControl.reducer;

export const canViewPages = (page) => (state) => {
  const loadingStatus = state.accessControl.myAccountDataStatus;
  if (loadingStatus === "idle" || loadingStatus === "loading") {
    return true;
  }

  const myAccount = state.accessControl.myAccountData;

  // The merchant has accesss to everything
  if (myAccount?.role_id === "2") {
    return true;
  }

  const canViewThisPage = myAccount?.access_group_pages?.find(
    (item) => item?.accessible_page?.name === page
  );

  return canViewThisPage ? true : false;
};

export const hasBeenGranted = (permission) => (state) => {
  const loadingStatus = state.accessControl.myAccountDataStatus;
  if (loadingStatus === "idle" || loadingStatus === "loading") {
    return true;
  }

  const myAccount = state.accessControl.myAccountData;

  // The merchant has accesss to everything
  if (myAccount?.role_id === "2") {
    return true;
  }

  const canDoThing = myAccount?.access_group_permissions?.find(
    (item) => item?.grantable_permission?.name === permission
  );

  return canDoThing ? true : false;
};

export const subscriptionDays = (state) => {
  const loadingStatus = state.accessControl.myAccountDataStatus;
  if (loadingStatus === "idle" || loadingStatus === "loading") {
    return 0;
  }

  const myAccount = state.accessControl.myAccountData;

  return myAccount?.subscription.remaining_days ?? 0;
};

export const hasActiveSubscription = (state) => {
  const loadingStatus = state.accessControl.myAccountDataStatus;
  if (
    loadingStatus === "idle" ||
    loadingStatus === "loading" ||
    loadingStatus === "rejected"
  ) {
    return true;
  }

  const myAccount = state.accessControl.myAccountData;

  return myAccount?.subscription?.is_active ?? false;
};

export const isCarWash = (state) => {
  const loadingStatus = state.accessControl.myAccountDataStatus;
  if (loadingStatus === "idle" || loadingStatus === "loading") {
    return false;
  }

  const myAccount = state.accessControl.myAccountData;

  return myAccount?.carwash ?? false;
};

export const clearLocalStorage = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("next_url");
    window.localStorage.removeItem("with_data");
  }
};
