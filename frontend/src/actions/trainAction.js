import axios from "axios";
import Cookies from "js-cookie";
import {
  deleteTrainFail,
  deleteTrainRequest,
  deleteTrainSuccess,
  getFareFail,
  getFareRequest,
  getFareSuccess,
  getPnrFail,
  getPnrRequest,
  getPnrSuccess,
  getTrainFail,
  getTrainRequest,
  getTrainSuccess,
  newTrainFail,
  newTrainRequest,
  newTrainSuccess,
  reservationChartFail,
  reservationChartRequest,
  reservationChartSuccess,
  searchTrainsFail,
  searchTrainsRequest,
  searchTrainsSuccess,
  updateTrainFail,
  updateTrainRequest,
  updateTrainSuccess,
} from "../slices/trainSlice";

const API_URL = "http://3.84.31.96:8000";

// function to get token
const getToken = () => {
  return Cookies.get("token") ? Cookies.get("token") : "";
};

// config
const config = {
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
};

// search trains
export const searchTrains = (searchQuery) => async (dispatch) => {
  try {
    dispatch(searchTrainsRequest());
    const { data } = await axios.get(
      `${API_URL}/api/v1/train/search${searchQuery}`,
      config
    );
    dispatch(searchTrainsSuccess(data?.trains));
  } catch (error) {
    dispatch(searchTrainsFail(error?.response?.data?.message));
  }
};

// get particular train
export const getParticularTrain = (id) => async (dispatch) => {
  try {
    dispatch(getTrainRequest());
    const { data } = await axios.get(
      `${API_URL}/api/v1/train/single/${id}`,
      config
    );
    dispatch(getTrainSuccess(data?.train));
  } catch (error) {
    dispatch(getTrainFail(error?.response?.data?.message));
  }
};

// get pnr detail
export const getPNRDetail = (formData) => async (dispatch) => {
  try {
    dispatch(getPnrRequest());
    const { data } = await axios.post(
      `${API_URL}/api/v1/train/pnr`,
      formData,
      config
    );
    dispatch(getPnrSuccess(data?.pnr));
  } catch (error) {
    dispatch(getPnrFail(error?.response?.data?.message));
  }
};

// get reservation chart
export const getReservationChart = (formData) => async (dispatch) => {
  try {
    dispatch(reservationChartRequest());
    const { data } = await axios.get(
      `${API_URL}/api/v1/train/reservationchart?trainid=${formData.trainid}&date=${formData.date}&boardingstation=${formData.boardingstation}`,
      config
    );
    dispatch(reservationChartSuccess(data?.bookings));
  } catch (error) {
    dispatch(reservationChartFail(error?.response?.data?.message));
  }
};

// get all trains
export const getAllTrains = async (dispatch) => {
  try {
    dispatch(searchTrainsRequest());
    const { data } = await axios.get(`${API_URL}/api/v1/train/all`, config);
    dispatch(searchTrainsSuccess(data?.trains));
  } catch (error) {
    dispatch(searchTrainsFail(error?.response?.data?.message));
  }
};

// get train schedule
export const getTrainSchedule = (id) => async (dispatch) => {
  try {
    dispatch(getTrainRequest());
    const { data } = await axios.get(
      `${API_URL}/api/v1/train/schedule/${id}`,
      config
    );
    dispatch(getTrainSuccess(data?.train));
  } catch (error) {
    dispatch(getTrainFail(error?.response?.data?.message));
  }
};

// get train fare
export const getTrainFare = (formData) => async (dispatch) => {
  try {
    dispatch(getFareRequest());
    const { data } = await axios.post(
      `${API_URL}/api/v1/train/fare`,
      formData,
      config
    );
    dispatch(getFareSuccess(data?.fares));
  } catch (error) {
    dispatch(getFareFail(error?.response?.data?.message));
  }
};

// create new train
export const createNewTrain = (formData) => async (dispatch) => {
  try {
    dispatch(newTrainRequest());
    const { data } = await axios.post(
      `${API_URL}/api/v1/train/admin/new`,
      formData,
      config
    );
    dispatch(newTrainSuccess(data?.train));
  } catch (error) {
    dispatch(newTrainFail(error?.response?.data?.message));
  }
};

// delete train
export const deleteParticularTrain = (id) => async (dispatch) => {
  try {
    dispatch(deleteTrainRequest());
    await axios.delete(`${API_URL}/api/v1/train/admin/${id}`, config);
    dispatch(deleteTrainSuccess());
  } catch (error) {
    dispatch(deleteTrainFail(error?.response?.data?.message));
  }
};

// update train
export const updateParticularTrain = (id, formData) => async (dispatch) => {
  try {
    dispatch(updateTrainRequest());
    await axios.put(`${API_URL}/api/v1/train/admin/${id}`, formData, config);
    dispatch(updateTrainSuccess());
  } catch (error) {
    dispatch(updateTrainFail(error?.response?.data?.message));
  }
};
