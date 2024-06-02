import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("Inventory");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getMenuItems: [],
  getMenuItemsStatus: "idle",

  getProductDetails: null,
  getProductDetailsStatus: "idle",

  getMenuDetails: [],
  getMenuDetailsStatus: "idle",

  getAdjustments: null,
  getAdjustmentStatus: "idle",

  getVendors: null,
  getVendorStatus: "idle",

  getVendorDetails: null,
  getVendorDetailsStatus: "idle",

  getPurchases: null,
  getPurchaseStatus: "idle",

  getServices: null,
  getServicesStatus: "idle",

  getServicesDetails: null,
  getServicesDetailsStatus: "idle",

  fetchBatchDetails: null,
  fetchBatchDetailsStatus: "idle",

  getAccompaniments: null,
  getAccompanimentsStatus: "idle",

  getAccoDetails: null,
  getAccoDetailsStatus: "idle",

  getContacts: null,
  getContactsStatus: "idle",

  getContactDetails: null,
  getContactDetailsStatus: "idle",

  getComboSubItems: null,
  getComboSubItemsStatus: "idle",

  getVendorPurchases: null,
  getVendorPurchasesStatus: "idle",

  getVendorAdjustments: null,
  getVendorAdjustmentsStatus: "idle",

  getAdjustmentReq: null,
  getAdjustmentReqStatus: "idle",

  getRFQCompanies: null,
  getRFQCompaniesStatus: "idle",

  getRFQDetails: null,
  getRFQDetailsStatus: "idle",

  getBillDetails: null,
  getBillDetailsStatus: "idle",

};

export const getMenuItems = createAsyncThunk(
  "inventory/getMenuItems",
  async ({ accessToken = null, filter = null, page = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/menu-items?`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getMenuItems::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getMenuItems::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getAdjustmentReq
export const getAdjustmentReq = createAsyncThunk(
  "adjustment/getAdjustmentReq",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/manual-adjustment-req`;

    const startTime = new Date();
    logger.log("getAdjustmentReq::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getAdjustmentReq::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);


export const getVendorPurchases = createAsyncThunk(
  "vendors/getVendorPurchases",
  async ({
    accessToken = null,
    filter = null,
    page = null,
    vendorId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/vendors/${vendorId}/show-purchases?`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getVendorPurchases::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getVendorPurchases::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getVendorAdjustments = createAsyncThunk(
  "vendors/getVendorAdjustments",
  async ({
    accessToken = null,
    filter = null,
    page = null,
    vendorId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      if (vendorId) {
        url = `${API_URL}/vendors/${vendorId}/show-manual-adjustment?`;
      } else {
        url = `${API_URL}/supplier-manual-adjustments?`;
      }
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getVendorAdjustments::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getVendorAdjustments::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

///bill/show/{id}

export const getBillDetails = createAsyncThunk(
  "bills/getBillDetails",
  async ({ accessToken = null, billId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/bill/show/${billId}`;

    const startTime = new Date();
    logger.log("getBillDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getBillDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getComboSubItems = createAsyncThunk(
  "inventory/getComboSubItems",
  async ({ accessToken = null, comboId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/combo/${comboId}/subitems/requirements`;

    const startTime = new Date();
    logger.log("getComboSubItems::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getComboSubItems::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getVendorDetails
export const getVendorDetails = createAsyncThunk(
  "vendors/getVendorDetails",
  async ({ accessToken = null, vendorId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/vendors/show/${vendorId}`;

    const startTime = new Date();
    logger.log("getVendorDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getVendorDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getContactDetails
export const getContactDetails = createAsyncThunk(
  "contacts/getContactDetails",
  async ({ accessToken = null, vendorId = null, contactId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/vendors/${vendorId}/contact/${contactId}/show`;

    const startTime = new Date();
    logger.log("getContactDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getContactDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getProductDetails = createAsyncThunk(
  "inventory/getProductDetails",
  async ({ accessToken = null, productId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    console.log(productId);

    let url = `${API_URL}/products/${productId}`;

    const startTime = new Date();
    logger.log("getProductDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getProductDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getMenuDetails = createAsyncThunk(
  "menu/getMenuDetails",
  async ({ accessToken = null, page = null, menuId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/menu-items/${menuId}?`;
    }

    const startTime = new Date();
    logger.log("getMenuDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getMenuDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getAdjustments = createAsyncThunk(
  "adjustments/getAdjustments",
  async ({ page = null, accessToken = null, filter = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/product-adjustment-list?`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getAdjustments::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getAdjustments::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getContacts = createAsyncThunk(
  "contacts/getContacts",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    vendorId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/vendors/show/${vendorId}`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getContacts::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getContacts::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getVendors = createAsyncThunk(
  "vendors/getVendors",
  async ({ page = null, accessToken = null, filter = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/vendors?`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getVendors::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getVendors::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getPurchases = createAsyncThunk(
  "purchases/getPurchases",
  async ({
    accessToken = null,
    filter = null,
    page = null,
    vendorId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      if (!vendorId) {
        url = `${API_URL}/inventory/purchases?`;
      } else {
        url = `${API_URL}/vendors/${vendorId}/show-purchases?`;
      }
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getPurchases::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getPurchases::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getRFQDetails
export const getRFQDetails = createAsyncThunk(
  "rfqs/getRFQDetails",
  async ({ accessToken = null, page = null, rfqId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/inventory/purchases/show/${rfqId}?`;
    }

    const startTime = new Date();
    logger.log("getRFQDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getRFQDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//getRFQCompanies
export const getRFQCompanies = createAsyncThunk(
  "rfqs/getRFQCompanies",
  async ({ accessToken = null, page = null, menuId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/inventory/purchases/rfq-item-requirements?`;
    }

    const startTime = new Date();
    logger.log("getRFQCompanies::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getRFQCompanies::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getServices = createAsyncThunk(
  "services/getServices",
  async ({ page = null, accessToken = null, filter = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/inventory/products?`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getServices::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getServices::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getServicesDetails = createAsyncThunk(
  "services/getServicesDetails",
  async ({ accessToken = null, page = null, serviceId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/inventory/products/show/${serviceId}?`;
    }

    const startTime = new Date();
    logger.log("getServicesDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getServicesDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchBatchDetails = createAsyncThunk(
  "batches/fetchBatchDetails",
  async ({ accessToken = null, page = null, batchId = null } = {}) => {
    if (!accessToken || !batchId) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/batchedable-records/show/${batchId}`;
    }

    const startTime = new Date();
    logger.log("fetchBatchDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchBatchDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getAccompaniments = createAsyncThunk(
  "inventory/getAccompaniments",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    menuItemId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/menu-item/${menuItemId}/accompaniments/list?`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getAccompaniments::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getAccompaniments::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getAccoDetails = createAsyncThunk(
  "accompaniments/getAccoDetails",
  async ({
    accessToken = null,
    page = null,
    itemId = null,
    menuItemId = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/menu-item/${menuItemId}/accompaniments/${itemId}/show`;
    }

    const startTime = new Date();
    logger.log("getAccoDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getAccoDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // getMenuDetails Data
      .addCase(getMenuDetails.pending, (state) => {
        state.getMenuDetailsStatus = "loading";
      })
      .addCase(getMenuDetails.rejected, (state) => {
        state.getMenuDetailsStatus = "rejected";
        logger.log("getMenuDetails::REJECTED");
      })
      .addCase(getMenuDetails.fulfilled, (state, action) => {
        state.getMenuDetailsStatus = "fulfilled";
        state.getMenuDetails = action.payload;
      })

      //getAjustmentReq
      .addCase(getAdjustmentReq.pending, (state) => {
        state.getAdjustmentReqStatus = "loading";
      })
      .addCase(getAdjustmentReq.rejected, (state) => {
        state.getAdjustmentReqStatus = "rejected";
        logger.log("getAjustmentReq::REJECTED");
      })
      .addCase(getAdjustmentReq.fulfilled, (state, action) => {
        state.getAdjustmentReqStatus = "fulfilled";
        state.getAdjustmentReq = action.payload;
      })

      //getRFQCompanies
      .addCase(getRFQCompanies.pending, (state) => {
        state.getRFQCompaniesStatus = "loading";
      })
      .addCase(getRFQCompanies.rejected, (state) => {
        state.getRFQCompaniesStatus = "rejected";
        logger.log("getRFQCompanies::REJECTED");
      })
      .addCase(getRFQCompanies.fulfilled, (state, action) => {
        state.getRFQCompaniesStatus = "fulfilled";
        state.getRFQCompanies = action.payload;
      })

      //getRFQDetails
      .addCase(getRFQDetails.pending, (state) => {
        state.getRFQDetailsStatus = "loading";
      })
      .addCase(getRFQDetails.rejected, (state) => {
        state.getRFQDetailsStatus = "rejected";
        logger.log("getRFQDetails::REJECTED");
      })
      .addCase(getRFQDetails.fulfilled, (state, action) => {
        state.getRFQDetailsStatus = "fulfilled";
        state.getRFQDetails = action.payload;
      })

      //getBillDetails
      .addCase(getBillDetails.pending, (state) => {
        state.getBillDetailsStatus = "loading";
      })
      .addCase(getBillDetails.rejected, (state) => {
        state.getBillDetailsStatus = "rejected";
        logger.log("getBillDetails::REJECTED");
      })
      .addCase(getBillDetails.fulfilled, (state, action) => {
        state.getBillDetailsStatus = "fulfilled";
        state.getBillDetails = action.payload;
      })

      //getVendorPurchases
      .addCase(getVendorPurchases.pending, (state) => {
        state.getVendorPurchasesStatus = "loading";
      })
      .addCase(getVendorPurchases.rejected, (state) => {
        state.getVendorPurchasesStatus = "rejected";
        logger.log("getVendorPurchases::REJECTED");
      })
      .addCase(getVendorPurchases.fulfilled, (state, action) => {
        state.getVendorPurchasesStatus = "fulfilled";
        state.getVendorPurchases = action.payload;
      })

      //getContactDetails
      .addCase(getContactDetails.pending, (state) => {
        state.getContactDetailsStatus = "loading";
      })
      .addCase(getContactDetails.rejected, (state) => {
        state.getContactDetailsStatus = "rejected";
        logger.log("getContactDetails::REJECTED");
      })
      .addCase(getContactDetails.fulfilled, (state, action) => {
        state.getContactDetailsStatus = "fulfilled";
        state.getContactDetails = action.payload;
      })

      //getVendorDetails
      .addCase(getVendorDetails.pending, (state) => {
        state.getVendorDetailsStatus = "loading";
      })
      .addCase(getVendorDetails.rejected, (state) => {
        state.getVendorDetailsStatus = "rejected";
        logger.log("getVendorDetails::REJECTED");
      })
      .addCase(getVendorDetails.fulfilled, (state, action) => {
        state.getVendorDetailsStatus = "fulfilled";
        state.getVendorDetails = action.payload;
      })

      //getVendorAdjustments
      .addCase(getVendorAdjustments.pending, (state) => {
        state.getVendorAdjustmentsStatus = "loading";
      })
      .addCase(getVendorAdjustments.rejected, (state) => {
        state.getVendorAdjustmentsStatus = "rejected";
        logger.log("getVendorAdjustments::REJECTED");
      })
      .addCase(getVendorAdjustments.fulfilled, (state, action) => {
        state.getVendorAdjustmentsStatus = "fulfilled";
        state.getVendorAdjustments = action.payload;
      })

      //getComboSubItems
      .addCase(getComboSubItems.pending, (state) => {
        state.getComboSubItemsStatus = "loading";
      })
      .addCase(getComboSubItems.rejected, (state) => {
        state.getComboSubItemsStatus = "rejected";
        logger.log("getComboSubItems::REJECTED");
      })
      .addCase(getComboSubItems.fulfilled, (state, action) => {
        state.getComboSubItemsStatus = "fulfilled";
        state.getComboSubItems = action.payload;
      })

      // getContacts Data
      .addCase(getContacts.pending, (state) => {
        state.getContactsStatus = "loading";
      })
      .addCase(getContacts.rejected, (state) => {
        state.getContactsStatus = "rejected";
        logger.log("getContacts::REJECTED");
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        state.getContactsStatus = "fulfilled";
        state.getContacts = action.payload;
      })

      // getProductDetails Data
      .addCase(getProductDetails.pending, (state) => {
        state.getProductDetailsStatus = "loading";
      })
      .addCase(getProductDetails.rejected, (state) => {
        state.getProductDetailsStatus = "rejected";
        logger.log("getProductDetailsStatus::REJECTED");
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.getProductDetailsStatus = "fulfilled";
        state.getProductDetails = action.payload;
      })

      // getAccoDetails Data
      .addCase(getAccoDetails.pending, (state) => {
        state.getAccoDetailsStatus = "loading";
      })
      .addCase(getAccoDetails.rejected, (state) => {
        state.getAccoDetailsStatus = "rejected";
        logger.log("getAccoDetails::REJECTED");
      })
      .addCase(getAccoDetails.fulfilled, (state, action) => {
        state.getAccoDetailsStatus = "fulfilled";
        state.getAccoDetails = action.payload;
      })

      // getMenuItems Data
      .addCase(getMenuItems.pending, (state) => {
        state.getMenuItemsStatus = "loading";
      })
      .addCase(getMenuItems.rejected, (state) => {
        state.getMenuItemsStatus = "rejected";
        logger.log("getRestaurant::REJECTED");
      })
      .addCase(getMenuItems.fulfilled, (state, action) => {
        state.getMenuItemsStatus = "fulfilled";
        state.getMenuItems = action.payload;
      })

      // getAdjustments Data
      .addCase(getAdjustments.pending, (state) => {
        state.getAdjustmentStatus = "loading";
      })
      .addCase(getAdjustments.rejected, (state) => {
        state.getAdjustmentStatus = "rejected";
        logger.log("getAdjustments::REJECTED");
      })
      .addCase(getAdjustments.fulfilled, (state, action) => {
        state.getAdjustmentStatus = "fulfilled";
        state.getAdjustments = action.payload;
      })

      // getVendors Data
      .addCase(getVendors.pending, (state) => {
        state.getVendorStatus = "loading";
      })
      .addCase(getVendors.rejected, (state) => {
        state.getVendorStatus = "rejected";
        logger.log("getVendors::REJECTED");
      })
      .addCase(getVendors.fulfilled, (state, action) => {
        state.getVendorStatus = "fulfilled";
        state.getVendors = action.payload;
      })

      // getPurchases Data
      .addCase(getPurchases.pending, (state) => {
        state.getPurchaseStatus = "loading";
      })
      .addCase(getPurchases.rejected, (state) => {
        state.getPurchaseStatus = "rejected";
        logger.log("getPurchases::REJECTED");
      })
      .addCase(getPurchases.fulfilled, (state, action) => {
        state.getPurchaseStatus = "fulfilled";
        state.getPurchases = action.payload;
      })

      //getServices Data
      .addCase(getServices.pending, (state) => {
        state.getServicesStatus = "loading";
      })
      .addCase(getServices.rejected, (state) => {
        state.getServicesStatus = "rejected";
        logger.log("getServices::REJECTED");
      })
      .addCase(getServices.fulfilled, (state, action) => {
        state.getServicesStatus = "fulfilled";
        state.getServices = action.payload;
      })

      //getServicesDetails Data
      .addCase(getServicesDetails.pending, (state) => {
        state.getServicesDetailsStatus = "loading";
      })
      .addCase(getServicesDetails.rejected, (state) => {
        state.getServicesDetailsStatus = "rejected";
        logger.log("getServicesDetails::REJECTED");
      })
      .addCase(getServicesDetails.fulfilled, (state, action) => {
        state.getServicesDetailsStatus = "fulfilled";
        state.getServicesDetails = action.payload;
      })

      //getAccompaniments Data
      .addCase(getAccompaniments.pending, (state) => {
        state.getAccompanimentsStatus = "loading";
      })
      .addCase(getAccompaniments.rejected, (state) => {
        state.getAccompanimentsStatus = "rejected";
        logger.log("getAccompaniments::REJECTED");
      })
      .addCase(getAccompaniments.fulfilled, (state, action) => {
        state.getAccompanimentsStatus = "fulfilled";
        state.getAccompaniments = action.payload;
      })

      //fetchBatchDetails Data
      .addCase(fetchBatchDetails.pending, (state) => {
        state.fetchBatchDetailsStatus = "loading";
      })
      .addCase(fetchBatchDetails.rejected, (state) => {
        state.fetchBatchDetailsStatus = "rejected";
        logger.log("fetchBatchDetails::REJECTED");
      })
      .addCase(fetchBatchDetails.fulfilled, (state, action) => {
        state.fetchBatchDetailsStatus = "fulfilled";
        state.fetchBatchDetails = action.payload;
      });
  },
});

export default inventorySlice.reducer;
