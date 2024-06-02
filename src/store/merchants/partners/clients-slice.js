import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getLogger from "../../../lib/shared/logger";

const logger = getLogger("ClientSlice");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState = {
  clientList: null,
  clientListStatus: "idle",

  clientFormData: null,
  clientFormDataStatus: "idle",

  submissionStatus: "idle",
};

export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async ({
    page = null,
    accessToken = null,
    filter = null,
    detailed = false,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = undefined;
    if (page) {
      url = page + "&";
    } else {
      url = `${API_URL}/partners/clients?`;
    }

    const params = {};
    if (filter) {
      params["filter"] = filter;
    }
    if (detailed) {
      params["detailed"] = true;
    }

    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchClients::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchClients::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const fetchClientFormData = createAsyncThunk(
  "clients/fetchClientFormData",
  async ({ accessToken = null } = {}) => {
    if (!accessToken) {
      return;
    }

    const url = `${API_URL}/partners/client-form-data`;

    const params = {};
    url += new URLSearchParams(params);

    const startTime = new Date();
    logger.log("fetchClientFormData::BEGIN");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
    }).then(async (response) => {
      const data = await response.json();
      const endTime = new Date();
      const seconds = endTime.getTime() - startTime.getTime();
      logger.log("fetchClientFormData::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

export const submitClient = createAsyncThunk(
  "posTransaction/submitClient",
  async ({
    accessToken = null,

    name = null,
    email = null,
    phone = null,
    dob = null,
    gender = null,
    car_model = null,
    car_plate = null,
    car_series = null,
    car_year = null,
    car_type = null,

    house_no = null,
    street_name = null,
    city = null,
    estate = null,
  } = {}) => {
    if (!accessToken) {
      return;
    }

    let url = `${API_URL}/partners/clients`;

    let body = {};

    body["name"] = name;
    body["email"] = email;
    body["phone"] = phone;
    body["dob"] = dob;
    body["gender"] = gender;
    body["car_model"] = car_model;
    body["car_plate"] = car_plate;
    body["car_series"] = car_series;
    body["car_year"] = car_year;
    body["car_type"] = car_type;

    body["house_no"] = house_no;
    body["street_name"] = street_name;
    body["city"] = city;
    body["estate"] = estate;

    body = JSON.stringify(body);

    const startTime = new Date();
    logger.log("submitClient::BEGIN", body);
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
      logger.log("submitClient::END", { took: seconds, data });

      if (!response.ok) {
        throw data;
      }

      return data;
    });

    return response;
  }
);

const clients = createSlice({
  name: "clients",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.clientListStatus = "loading";
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.clientListStatus = "rejected";
        logger.log("fetchClients::REJECTED", action.error);
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchClients::FULFILLED", { payload });

        state.clientListStatus = "fulfilled";
        state.clientList = action.payload;
      })
      //
      .addCase(fetchClientFormData.pending, (state) => {
        state.clientFormDataStatus = "loading";
      })
      .addCase(fetchClientFormData.rejected, (state, action) => {
        state.clientFormDataStatus = "rejected";
        logger.log("fetchClientFormData::REJECTED", action.error);
      })
      .addCase(fetchClientFormData.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("fetchClientFormData::FULFILLED", { payload });

        state.clientFormDataStatus = "fulfilled";
        state.clientFormData = action.payload;
      })
      //
      .addCase(submitClient.pending, (state) => {
        state.submissionStatus = "loading";
      })
      .addCase(submitClient.rejected, (state, action) => {
        state.submissionStatus = "rejected";
        logger.warn("submitClient::REJECTED", action.error);
      })
      .addCase(submitClient.fulfilled, (state, action) => {
        const { payload } = action;
        logger.log("submitClient::FULFILLED", { payload });

        state.submissionStatus = "fulfilled";
      });
    //
  },
});

export default clients.reducer;
