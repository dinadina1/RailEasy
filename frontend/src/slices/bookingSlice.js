import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings:[],
    loading: false,
    error: null,
    booking: {},
    payment: {},
    tickets: [],
    transactions:[],
    isUpdated: false,
    isCreated: false,
    isTicketDownloaded: false
  },
  reducers: {
    getBookingsRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    getBookingsSuccess(state, action) {
      return {
        ...state,
        loading: false,
        bookings: action.payload,
      };
    },
    getBookingsFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearBookingError(state, action) {
      return {
        ...state,
        error: null,
      };
    },
    newBookingRequest(state, action){
      return {
        ...state,
        loading: true,
        isCreated: false
      }
    },
    newBookingSuccess(state, action){
      return {
        ...state,
        booking: action.payload,
        loading: false,
        isCreated: true
      }
    },
    newBookingFail(state, action){
      return {
        ...state,
        loading: false,
        error: action.payload,
        isCreated: false
      }
    },
    getPaymentRequest(state, action){
      return {
        ...state,
        loading: true
      }
    },
    getPaymentSuccess(state, action){
      return {
        ...state,
        payment: action.payload,
        loading: false
      }
    },
    getPaymentFail(state, action){
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    },
    getTicketsRequest(state, action){
      return {
        ...state,
        loading: true
      }
    },
    getTicketsSuccess(state, action){
      return {
        ...state,
        tickets: action.payload,
        loading: false
      }
    },
    getTicketsFail(state, action){
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    },
    getAllBookingRequest(state, action){
      return {
        ...state,
        loading: true
      }
    },
    getAllBookingSuccess(state, action){
      return {
        ...state,
        loading: false,
        bookings: action.payload
      }
    },
    getAllBookingFail(state, action){
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    },
    getBookingRequest(state, action){
      return {
        ...state,
        loading: true
      }
    },
    getBookingSuccess(state, action){
      return {
        ...state,
        loading: false,
        booking: action.payload
      }
    },
    getBookingFail(state, action){
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    },
    updateBookingRequest(state, action){
      return {
        ...state,
        loading: true,
        isUpdated: false
      }
    },
    updateBookingSuccess(state, action){
      return {
        ...state,
        loading: false,
        isUpdated: true
      }
    },
    updateBookingFail(state, action){
      return {
        ...state,
        loading: false,
        error: action.payload,
        isUpdated: false
      }
    },
    clearIsBookingUpdated(state, action){
      return {
        ...state,
        isUpdated: false
      }
    },
    clearIsBookingCreated(state, action){
      return {
        ...state,
        isCreated: false
      }
    },
    manualBookingRequest(state, action){
      return {
        ...state,
        loading: true,
        isCreated: false
      }
    },
    manualBookingSuccess(state, action){
      return {
        ...state,
        loading: false,
        booking: action.payload,
        isCreated: true
      }
    },
    manualBookingFail(state, action){
      return {
        ...state,
        loading: false,
        error: action.payload,
        isCreated: false
      }
    },
    getTransactionsRequest(state, action){
      return {
        ...state,
        loading: true
      }
    },
    getTransactionsSuccess(state, action){
      return {
        ...state,
        loading: false,
        transactions: action.payload
      }
    },
    getTransactionsFail(state, action){
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    },
    dailyReportRequest(state, action){
      return {
        ...state,
        loading: true
      }
    },
    dailyReportSuccess(state, action){
      return {
        ...state,
        loading: false,
        isDownloaded: true,
      }
    },
    dailyReportFail(state, action){
      return {
        ...state,
        loading: false,
        error: action.payload,
        isDownloaded: false
      }
    },
    clearIsReportDownloaded(state, action){
      return {
        ...state,
        isDownloaded: false
      }
    },
    ticketDownloadRequest(state, action){
      return {
        ...state,
        loading: true
      }
    },
    ticketDownloadSuccess(state, action){
      return {
        ...state,
        loading: false,
        isTicketDownloaded: true
      }
    },
    ticketDownloadFail(state, action){
      return {
        ...state,
        loading: false,
        error: action.payload,
        isTicketDownloaded: false
      }
    },
    clearIsTicketDownloaded(state, action){
      return {
        ...state,
        isTicketDownloaded: false
      }
    }
  }
});

// export reducer
const { reducer, actions } = bookingSlice;

export const {
  getBookingsFail,
  getBookingsRequest,
  getBookingsSuccess,
  clearBookingError,
  newBookingFail,
  newBookingRequest,
  newBookingSuccess,
  getPaymentFail,
  getPaymentRequest,
  getPaymentSuccess,
  getTicketsFail,
  getTicketsRequest,
  getTicketsSuccess,
  getAllBookingRequest,
  getAllBookingFail,
  getAllBookingSuccess,
  getBookingFail,
  getBookingRequest,
  getBookingSuccess,
  updateBookingFail,
  updateBookingRequest,
  updateBookingSuccess,
  clearIsBookingUpdated,
  clearIsBookingCreated,
  manualBookingFail,
  manualBookingRequest,
  manualBookingSuccess,
  getTransactionsFail,
  getTransactionsRequest,
  getTransactionsSuccess,
  dailyReportFail,
  dailyReportRequest,
  dailyReportSuccess,
  clearIsReportDownloaded,
  ticketDownloadFail,
  ticketDownloadRequest,
  ticketDownloadSuccess,
  clearIsTicketDownloaded

} = actions;

export default reducer;
