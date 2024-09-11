import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : {},
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : {},
    loading: false,
    // isAuthenticatedUser: Cookies.get("token") ? true : false,
    isAuthenticatedUser: localStorage.getItem("token") ? true : false,
    error: null,
    users: [],
    isMailSent: false,
    isPasswordReseted: false,
  },
  reducers: {
    googleLoginRequest(state, action) {
      return {
        ...state,
        loading: true,
        isAuthenticatedUser: false,
      };
    },
    googleLoginSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isAuthenticatedUser: true,
        user: action.payload,
      };
    },
    googleLoginFail(state, action) {
      return {
        ...state,
        loading: false,
        isAuthenticatedUser: false,
        error: action.payload,
      };
    },
    logoutRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    logoutSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isAuthenticatedUser: false,
        user: {},
      };
    },
    logoutFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    loginRequest(state, action) {
      return {
        ...state,
        loading: true,
        isAuthenticatedUser: false,
      };
    },
    loginSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isAuthenticatedUser: true,
        user: action.payload,
      };
    },
    loginFail(state, action) {
      return {
        ...state,
        loading: false,
        isAuthenticatedUser: false,
        error: action.payload,
      };
    },
    clearAuthError(state, action) {
      return {
        ...state,
        error: null,
      };
    },
    registerRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    registerSuccess(state, action) {
      return {
        ...state,
        loading: false,
        user: action.payload,
        isAuthenticatedUser: true,
      };
    },
    registerFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticatedUser: false,
      };
    },
    getUsersRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    getUsersSuccess(state, action) {
      return {
        ...state,
        loading: false,
        users: action.payload,
      };
    },
    getUsersFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    forgotPasswordRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    forgotPasswordSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isMailSent: true,
      };
    },
    forgotPasswordFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    resetPasswordRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    resetPasswordSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isPasswordReseted: true,
      };
    },
    resetPasswordFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearPasswordReset(state, action) {
      return {
        ...state,
        isPasswordReseted: false,
      };
    },
    clearMailSent(state, action) {
      return {
        ...state,
        isMailSent: false,
      };
    },
  },
});

// export reducer
const { reducer, actions } = authSlice;

export const {
  googleLoginFail,
  googleLoginRequest,
  googleLoginSuccess,
  logoutFail,
  logoutRequest,
  logoutSuccess,
  loginFail,
  loginRequest,
  loginSuccess,
  clearAuthError,
  registerRequest,
  registerSuccess,
  registerFail,
  getUsersFail,
  getUsersRequest,
  getUsersSuccess,
  forgotPasswordFail,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  resetPasswordFail,
  resetPasswordRequest,
  resetPasswordSuccess,
  clearPasswordReset,
  clearMailSent,
} = actions;

export default reducer;
