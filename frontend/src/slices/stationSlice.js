import { createSlice } from "@reduxjs/toolkit";

// station slice
const stationSlice = createSlice({
  name: "station",
  initialState: {
    stations: [],
    station:{},
    loading: false,
    error: null,
    isCreated: false,
    isUpdated: false,
    isDeleted: false,
  },
  reducers: {
    getAllStationsRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    getAllStationsSuccess(state, action) {
      return {
        ...state,
        loading: false,
        stations: action.payload,
      };
    },
    getAllStationsFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearStationError(state, action) {
      return {
        ...state,
        error: null,
      };
    },
    newStationRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    newStationSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isCreated: true,
      };
    },
    newStationFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
        isCreated: false,
      };
    },
    clearIsStationCreated(state, action) {
      return {
        ...state,
        isCreated: false,
      };
    },
    updateStationRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    updateStationSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isUpdated: true,
      };
    },
    updateStationFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
        isUpdated: false,
      };
    },
    clearIsStationUpdated(state, action) {
      return {
        ...state,
        isUpdated: false,
      };
    },
    deleteStationRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    deleteStationSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isDeleted: true,
      };
    },
    deleteStationFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
        isDeleted: false,
      };
    },
    clearIsStationDeleted(state, action) {
      return {
        ...state,
        isDeleted: false,
      };
    },
    getStationRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    getStationSuccess(state, action) {
      return {
        ...state,
        loading: false,
        station: action.payload,
      };
    },
    getStationFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
  },
});

// export reducer and action
const { actions, reducer } = stationSlice;

export const {
  getAllStationsRequest,
  getAllStationsSuccess,
  getAllStationsFail,
  clearStationError,
  newStationFail,
  newStationRequest,
  newStationSuccess,
  updateStationFail,
  updateStationRequest,
  updateStationSuccess,
  deleteStationFail,
  deleteStationRequest,
  deleteStationSuccess,
  clearIsStationCreated,
  clearIsStationDeleted,
  clearIsStationUpdated,
  getStationFail,
  getStationRequest,
  getStationSuccess
} = actions;

export default reducer;
