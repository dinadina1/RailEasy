import axios from "axios";
import Cookies from "js-cookie";
import {
  getAllBookingSuccess,
  getAllBookingRequest,
  getBookingsFail,
  getBookingsRequest,
  getBookingsSuccess,
  getPaymentFail,
  getPaymentRequest,
  getPaymentSuccess,
  getTicketsFail,
  getTicketsRequest,
  getTicketsSuccess,
  newBookingFail,
  newBookingRequest,
  newBookingSuccess,
  getAllBookingFail,
  getBookingRequest,
  getBookingSuccess,
  getBookingFail,
  updateBookingRequest,
  updateBookingSuccess,
  updateBookingFail,
  manualBookingRequest,
  manualBookingSuccess,
  manualBookingFail,
  getTransactionsRequest,
  getTransactionsSuccess,
  getTransactionsFail,
  dailyReportRequest,
  dailyReportSuccess,
  dailyReportFail,
  ticketDownloadRequest,
  ticketDownloadSuccess,
  ticketDownloadFail,
} from "../slices/bookingSlice";

const API_URL = "http://localhost:8000";

// Function to get the token from cookies
const getToken = () => {
  const token = Cookies.get("token");
  return token ? token : "";
};

const config = {
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
};

// get all bookings
export const getBookings = async (dispatch) => {
  try {
    dispatch(getBookingsRequest());
    const { data } = await axios.get(`${API_URL}/api/v1/booking/all`, config);
    dispatch(getBookingsSuccess(data?.bookings));
  } catch (error) {
    dispatch(getBookingsFail(error?.response?.data?.message));
  }
};

// create new booking
export const newBooking = (formData) => async (dispatch) => {
  try {
    dispatch(newBookingRequest());
    const { data } = await axios.post(
      `${API_URL}/api/v1/booking/new`,
      formData,
      config
    );
    dispatch(newBookingSuccess(data?.book));
  } catch (error) {
    dispatch(newBookingFail(error?.response?.data?.message));
  }
};

// get payment details
export const getPaymentDetail = (bookingId) => async (dispatch) => {
  try {
    dispatch(getPaymentRequest());
    const { data } = await axios.get(
      `${API_URL}/api/v1/booking/payment/${bookingId}`,
      config
    );
    dispatch(getPaymentSuccess(data.payment));
  } catch (error) {
    dispatch(getPaymentFail(error?.response?.data?.message));
  }
};

// get all tickets
export const getTickets = async (dispatch) => {
  try {
    dispatch(getTicketsRequest());
    const { data } = await axios.get(`${API_URL}/api/v1/booking/user`, config);
    dispatch(getTicketsSuccess(data?.bookings));
  } catch (error) {
    dispatch(getTicketsFail(error?.response?.data?.message));
  }
};

// get all bookings
export const getAllBookings = async (dispatch) => {
  try {
    dispatch(getAllBookingRequest());
    const { data } = await axios.get(`${API_URL}/api/v1/booking/all`, config);
    dispatch(getAllBookingSuccess(data?.bookings));
  } catch (error) {
    dispatch(getAllBookingFail(error?.response?.data?.message));
  }
};

// get booking by booking id
export const getBookingById = (formData) => async (dispatch) => {
  try {
    dispatch(getBookingRequest());
    const { data } = await axios.post(
      `${API_URL}/api/v1/booking/admin/single`,
      formData,
      config
    );
    dispatch(getBookingSuccess(data?.booking));
  } catch (error) {
    dispatch(getBookingFail(error?.response?.data?.message));
  }
};

// update booking
export const updateBookingById = (id, formData) => async (dispatch) => {
  try {
    dispatch(updateBookingRequest());
    await axios.put(`${API_URL}/api/v1/booking/single/${id}`, formData, config);
    dispatch(updateBookingSuccess());
  } catch (error) {
    dispatch(updateBookingFail(error?.response?.data?.message));
  }
};

// get booking
export const getBooking = (id) => async (dispatch) => {
  try {
    dispatch(getBookingRequest());
    const { data } = await axios.get(
      `${API_URL}/api/v1/booking/single/${id}`,
      config
    );
    dispatch(getBookingSuccess(data?.booking));
  } catch (error) {
    dispatch(getBookingFail(error?.response?.data?.message));
  }
};

// manual booking
export const manualBooking = (formData) => async (dispatch) => {
  try {
    dispatch(manualBookingRequest());
    const { data } = await axios.post(
      `${API_URL}/api/v1/booking/manual`,
      formData,
      config
    );
    dispatch(manualBookingSuccess(data?.booking));
  } catch (error) {
    dispatch(manualBookingFail(error?.response?.data?.message));
  }
};

// get all transactions
export const getTransactions = async (dispatch) => {
  try {
    dispatch(getTransactionsRequest());
    const { data } = await axios.get(
      `${API_URL}/api/v1/booking/admin/payment/all`,
      config
    );
    dispatch(getTransactionsSuccess(data?.transactions));
  } catch (error) {
    dispatch(getTransactionsFail(error?.response?.data?.message));
  }
};

// download daily transaction report
export const downloadTransactionReport = (date) => async (dispatch) => {
  try {
    dispatch(dailyReportRequest());

    // Sending the request to get the PDF file from the server
    const response = await axios.get(
      `${API_URL}/api/v1/booking/report/dailyreport`,
      {
        params: {
          date: date, // Example date or dynamically provided
        },
        responseType: "blob", // Important to get the response as a blob (binary data)
      }
    );

    // Create a URL for the blob and trigger a download
    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "daily-booking-report.pdf"); // File name for download
    document.body.appendChild(link);
    link.click();
    link.remove(); // Clean up the link element after download

    // Dispatch success action without passing a message
    dispatch(dailyReportSuccess());
  } catch (error) {
    let errorMessage = "An error occurred while downloading the report.";

    // If the error is a blob (binary data), we need to convert it to text
    if (error.response && error.response.data instanceof Blob) {
      const blob = error.response.data;
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        // Assuming the server sends error as JSON with a message
        const errorData = JSON.parse(text);
        errorMessage = errorData.message || errorMessage;
        dispatch(dailyReportFail(errorMessage));
      };
      reader.readAsText(blob);
    } else {
      // Handle non-blob errors
      errorMessage = error?.response?.data?.message || errorMessage;
      dispatch(dailyReportFail(errorMessage));
    }
  }
};

// download ticket
export const downloadTicket = (bookingId) => async (dispatch) => {
  try {
    dispatch(ticketDownloadRequest());

    // Sending the request to get the PDF file from the server
    const response = await axios.get(
      `${API_URL}/api/v1/booking/ticket/download/${bookingId}`, 
      {
        responseType: "blob", 
      }
    );

    // Create a URL for the blob and trigger a download
    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "RailEasy_Ticket.pdf"); // Use an appropriate file name
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Dispatch success action without passing a message
    dispatch(ticketDownloadSuccess());
  } catch (error) {
    let errorMessage = "An error occurred while downloading the ticket.";

    // Check if the error response is a Blob
    if (error.response && error.response.data instanceof Blob) {
      const blob = error.response.data;
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        // Assuming the server sends error as JSON with a message
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          // Handle JSON parsing error
          errorMessage = "Failed to parse error message.";
        }
        dispatch(ticketDownloadFail(errorMessage));
      };
      reader.readAsText(blob);
    } else {
      // Handle non-blob errors
      errorMessage = error?.response?.data?.message || errorMessage;
      dispatch(ticketDownloadFail(errorMessage));
    }
  }
};

