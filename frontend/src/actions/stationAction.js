import axios from "axios";
import Cookies from "js-cookie";
import {
  deleteStationFail,
  deleteStationRequest,
  deleteStationSuccess,
  getAllStationsFail,
  getAllStationsRequest,
  getAllStationsSuccess,
  getStationFail,
  getStationRequest,
  getStationSuccess,
  newStationFail,
  newStationRequest,
  newStationSuccess,
  updateStationFail,
  updateStationRequest,
  updateStationSuccess,
} from "../slices/stationSlice";

const API_URL = "http://3.84.31.96:8000";

// function to get token
const getToken = () => {
  // const token = Cookies.get("token");
  // return token ? token : "";
  const token = localStorage.getItem("token");
  return token ? token : "";
};

// config
const config = {
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
};

// get all station
export const getAllStations = async (dispatch) => {
  try {
    dispatch(getAllStationsRequest());
    const { data } = await axios.get(`${API_URL}/api/v1/station/all`, config);
    dispatch(getAllStationsSuccess(data?.stations));
  } catch (error) {
    dispatch(getAllStationsFail(error?.response?.data?.message));
  }
};

// create new station
export const newStation = (formData) => async (dispatch) => {
  try {
    dispatch(newStationRequest());
    const { data } = await axios.post(
      `${API_URL}/api/v1/station/admin/new`,
      formData,
      config
    );
    dispatch(newStationSuccess());
  } catch (error) {
    dispatch(newStationFail(error?.response?.data?.message));
  }
};

// get station by id
export const getStationById = (id) => async (dispatch) => {
  try {
    dispatch(getStationRequest());
    const { data } = await axios.get(
      `${API_URL}/api/v1/station/admin/${id}`,
      config
    );
    dispatch(getStationSuccess(data?.station));
  } catch (error) {
    dispatch(getStationFail(error?.response?.data?.message));
  }
};

// update station by id
export const updateStationById = (id, formData) => async (dispatch) => {
  try {
    dispatch(updateStationRequest());
    await axios.put(`${API_URL}/api/v1/station/admin/${id}`, formData, config);
    dispatch(updateStationSuccess());
  } catch (error) {
    dispatch(updateStationFail(error?.response?.data?.message));
  }
};

// delete station by id
export const deleteStationById = (id) => async (dispatch) => {
  try {
    dispatch(deleteStationRequest());
    await axios.delete(`${API_URL}/api/v1/station/admin/${id}`, config);
    dispatch(deleteStationSuccess());
  } catch (error) {
    dispatch(deleteStationFail(error?.response?.data?.message));
  }
};