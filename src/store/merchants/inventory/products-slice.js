import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("Products");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  getProducts: null,
  getProductsStatus: "idle",

  getCombos: null,
  getCombosStatus: "idle",

  getCombosSubItems: null,
  getCombosSubItemsStatus: "idle",

  getProductsPDF: null,
  getProductsPDFStatus: "idle",

  getProductsExcel: null,
  getProductsExcelStatus: "idle",

  fetchManualAdjustment: null,
  fetchManualAdjustmentStatus: "idle",

  getComboDetails: null,
  getComboDetailsStatus: "idle",

  getInventoryCategories: null,
  getInventoryCategoriesStatus: "idle",

  getStorageCategories: null,
  getStorageCategoriesStatus: "idle",

  getProductTax: null,
  getProductTaxStatus: "idle",
};

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async ({ page = null, accessToken = null, filter = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/products?`;
    }

    const params = {};
    if (filter) {
      params["search_string"] = filter;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("getProducts::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getProducts::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getInventoryCategories = createAsyncThunk(
  "products/getInventoryCategories",
  async ({ accessToken = null, page = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/inventory/categories`;
    }

    const startTime = new Date();
    logger.log("getInventoryCategories::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getInventoryCategories::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

//Combo Sub Items
export const getCombosSubItems = createAsyncThunk(
  "combos/getCombosSubItems",
  async ({ accessToken = null, page = null, comboId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/combo/${comboId}/sub-item`;
    }

    const startTime = new Date();
    logger.log("getCombosSubItems::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getCombosSubItems::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getStorageCategories = createAsyncThunk(
  "products/getStorageCategories",
  async ({ accessToken = null, page = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/storage/categories`;
    }

    const startTime = new Date();
    logger.log("getStorageCategories::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getStorageCategories::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getProductTax = createAsyncThunk(
  "products/getProductTax",
  async ({ accessToken = null, page = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/product/tax`;
    }

    const startTime = new Date();
    logger.log("getProductTax::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getProductTax::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getCombos = createAsyncThunk(
  "products/getCombos",
  async ({ accessToken = null, page = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/combos?`;
    }

    const startTime = new Date();
    logger.log("getCombos::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getCombos::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getComboDetails = createAsyncThunk(
  "products/getComboDetails",
  async ({ accessToken = null, page = null, comboId = null } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;

    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/combos/${comboId}`;
    }

    const startTime = new Date();
    logger.log("getComboDetails::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("getComboDetails::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const getProductsPDF = createAsyncThunk(
  "products/getProductsPDF",
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
      url = `${API_URL}/products/downloadPDF/exportPDF`;
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
    logger.log("getProductsPDF::BEGIN");
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
      logger.log("getProductsPDF::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.innerHTML = `Products.pdf`;
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

export const getProductsExcel = createAsyncThunk(
  "products/getProductsExcel",
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
      url = `${API_URL}/products/downloadExcel/exportExcel`;
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
    logger.log("getProductsExcel::BEGIN");
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
      logger.log("getProductsExcel::END", { took: seconds });

      if (!response.ok) {
        throw { message: "failure" };
      }

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.innerHTML = `Products.xlsx`;
      a.target = "_blank";
      a.click();

      return { message: "success" };
    });

    return response;
  }
);

export const fetchManualAdjustment = createAsyncThunk(
  "adjustment/fetchManualAdjustment",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/manual-adjustment-req`;

    const startTime = new Date();
    logger.log("fetchManualAdjustment::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchManualAdjustment::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // getProducts Data
      .addCase(getProducts.pending, (state) => {
        state.getProductsStatus = "loading";
      })
      .addCase(getProducts.rejected, (state) => {
        state.getProductsStatus = "rejected";
        logger.log("getRestaurant::REJECTED");
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.getProductsStatus = "fulfilled";
        state.getProducts = action.payload;
      })

      //getCombosSubItems
      .addCase(getCombosSubItems.pending, (state) => {
        state.getCombosSubItemsStatus = "loading";
      })
      .addCase(getCombosSubItems.rejected, (state) => {
        state.getCombosSubItemsStatus = "rejected";
        logger.log("getCombosSubItems::REJECTED");
      })
      .addCase(getCombosSubItems.fulfilled, (state, action) => {
        state.getCombosSubItemsStatus = "fulfilled";
        state.getCombosSubItems = action.payload;
      })

      // getInventoryCategories Data
      .addCase(getInventoryCategories.pending, (state) => {
        state.getInventoryCategoriesStatus = "loading";
      })
      .addCase(getInventoryCategories.rejected, (state) => {
        state.getInventoryCategoriesStatus = "rejected";
        logger.log("getInventoryCategories::REJECTED");
      })
      .addCase(getInventoryCategories.fulfilled, (state, action) => {
        state.getInventoryCategoriesStatus = "fulfilled";
        state.getInventoryCategories = action.payload;
      })

      // getStorageCategories Data
      .addCase(getStorageCategories.pending, (state) => {
        state.getStorageCategoriesStatus = "loading";
      })
      .addCase(getStorageCategories.rejected, (state) => {
        state.getStorageCategoriesStatus = "rejected";
        logger.log("getStorageCategories::REJECTED");
      })
      .addCase(getStorageCategories.fulfilled, (state, action) => {
        state.getStorageCategoriesStatus = "fulfilled";
        state.getStorageCategories = action.payload;
      })

      // getProductTax Data
      .addCase(getProductTax.pending, (state) => {
        state.getProductTaxStatus = "loading";
      })
      .addCase(getProductTax.rejected, (state) => {
        state.getProductTaxStatus = "rejected";
        logger.log("getProductTax::REJECTED");
      })
      .addCase(getProductTax.fulfilled, (state, action) => {
        state.getProductTaxStatus = "fulfilled";
        state.getProductTax = action.payload;
      })

      // PDF Data
      .addCase(getProductsPDF.pending, (state) => {
        state.getProductsPDFStatus = "loading";
      })
      .addCase(getProductsPDF.rejected, (state) => {
        state.getProductsPDFStatus = "rejected";
        logger.log("getProductsPDFStatus::REJECTED");
      })
      .addCase(getProductsPDF.fulfilled, (state, action) => {
        state.getProductsPDFStatus = "fulfilled";
        state.getProductsPDF = action.payload;
      })

      // Excel Data
      .addCase(getProductsExcel.pending, (state) => {
        state.getProductsExcelStatus = "loading";
      })
      .addCase(getProductsExcel.rejected, (state) => {
        state.getProductsExcelStatus = "rejected";
        logger.log("getProductsExcel::REJECTED");
      })
      .addCase(getProductsExcel.fulfilled, (state, action) => {
        state.getProductsExcelStatus = "fulfilled";
        state.getProductsExcel = action.payload;
      })

      // fetchManualAdjustment Data
      .addCase(fetchManualAdjustment.pending, (state) => {
        state.fetchManualAdjustmentStatus = "loading";
      })
      .addCase(fetchManualAdjustment.rejected, (state) => {
        state.fetchManualAdjustmentStatus = "rejected";
        logger.log("fetchManualAdjustment::REJECTED");
      })
      .addCase(fetchManualAdjustment.fulfilled, (state, action) => {
        state.fetchManualAdjustmentStatus = "fulfilled";
        state.fetchManualAdjustment = action.payload;
      })

      //getComboDetails Data
      .addCase(getComboDetails.pending, (state) => {
        state.getComboDetailsStatus = "loading";
      })
      .addCase(getComboDetails.rejected, (state) => {
        state.getComboDetailsStatus = "rejected";
        logger.log("getComboDetails::REJECTED");
      })
      .addCase(getComboDetails.fulfilled, (state, action) => {
        state.getComboDetailsStatus = "fulfilled";
        state.getComboDetails = action.payload;
      })

      // getCombos Data
      .addCase(getCombos.pending, (state) => {
        state.getCombosStatus = "loading";
      })
      .addCase(getCombos.rejected, (state) => {
        state.getCombosStatus = "rejected";
        logger.log("getCombos::REJECTED");
      })
      .addCase(getCombos.fulfilled, (state, action) => {
        state.getCombosStatus = "fulfilled";
        state.getCombos = action.payload;
      });
  },
});

export default productsSlice.reducer;
