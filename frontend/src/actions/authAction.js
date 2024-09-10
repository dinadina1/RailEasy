import axios from "axios";
import Cookies from "js-cookie";
import {
  forgotPasswordFail,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  getUsersFail,
  getUsersRequest,
  getUsersSuccess,
  googleLoginFail,
  googleLoginRequest,
  googleLoginSuccess,
  loginFail,
  loginRequest,
  loginSuccess,
  logoutFail,
  logoutRequest,
  logoutSuccess,
  registerFail,
  registerRequest,
  registerSuccess,
  resetPasswordFail,
  resetPasswordRequest,
  resetPasswordSuccess,
} from "../slices/authSlice";

const API_URL = "http://3.84.31.96:8000";

// Function to get the token from localStorage
const getToken = () => {
  const token = Cookies.get("token");
  return token ? token : "";
};

const config = {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  }

// Google login user action
export const loginwithGoogle = (formData) => async (dispatch) => {
  try {
    dispatch(googleLoginRequest());
    const { data } = await axios.post(
      `${API_URL}/api/v1/auth/login/google`,
      formData
    );
    dispatch(googleLoginSuccess(data?.user));

    // store user and token in cookie
    Cookies.set("user", JSON.stringify(data?.user), {
      expires: 2,
      secure: true,
      sameSite: "None",
    });
    Cookies.set("token", data?.token, {
      expires: 2,
      secure: true,
      sameSite: "None",
    });
  } catch (err) {
    dispatch(googleLoginFail(err.response?.data?.message));
  }
};

// Logout user action
export const logoutUser = async (dispatch) => {
  try {
    dispatch(logoutRequest());

    const token = getToken();

    await axios.get(`${API_URL}/api/v1/auth/logout`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(logoutSuccess());
    Cookies.remove("user");
    Cookies.remove("token");
  } catch (err) {
    dispatch(logoutFail(err?.response?.data?.message));
  }
};

// Login user action
export const loginUser = (formData) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await axios.post(
      `${API_URL}/api/v1/auth/login`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch(loginSuccess(data?.user));

    // store user and token in cookie
    Cookies.set("user", JSON.stringify(data?.user), {
      expires: 2,
      secure: true,
      sameSite: "Lax",
    });
    Cookies.set("token", data?.token, {
      expires: 2,
      secure: true,
      sameSite: "Lax",
    });
  } catch (err) {
    dispatch(loginFail(err.response?.data?.message));
  }
};

// register user
export const registerUser = (formData) => async (dispatch) => {
  try {
    dispatch(registerRequest());
    const { data } = await axios.post(
      `${API_URL}/api/v1/auth/register`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    dispatch(registerSuccess(data?.user));

    // store user and token in cookie
    Cookies.set("user", JSON.stringify(data?.user), {
      expires: 2,
      secure: true,
      sameSite: "None",
    });
    Cookies.set("token", data?.token, {
      expires: 2,
      secure: true,
      sameSite: "None",
    });
  } catch (err) {
    dispatch(registerFail(err.response?.data?.message));
  }
};

// get all users
export const getAllUsers = async (dispatch) => {
  try {
    dispatch(getUsersRequest());
    const token = getToken();
    const { data } = await axios.get(`${API_URL}/api/v1/auth/admin/users`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(getUsersSuccess(data?.users));
  } catch (err) {
    dispatch(getUsersFail(err.response?.data?.message));
  }
};

// forgot password
export const forgotPassword = (formData) => async (dispatch) => {
  try{
    dispatch(forgotPasswordRequest());
    await axios.post(`${API_URL}/api/v1/auth/password/forgot`, formData, config);
    dispatch(forgotPasswordSuccess());
  } catch (error) {
    dispatch(forgotPasswordFail(error?.response?.data?.message));
  }
}

// reset password
export const resetPassword = (formData, token) => async (dispatch) => {
  try{
    dispatch(resetPasswordRequest());
    await axios.post(`${API_URL}/api/v1/auth/password/reset/${token}`, formData, config);
    dispatch(resetPasswordSuccess());
  } catch (error) {
    dispatch(resetPasswordFail(error?.response?.data?.message));
  }
}