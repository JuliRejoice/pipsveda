
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../../firebase";
import api from "@/utils/axiosInstance";



export const signIn = async (email, password) => {
  try {
    const response = await api.post(`/user/signin`, {
      email,
      password,
    });

    return response.data; // axios auto-parses JSON
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
};

export const signUp = async (data) => {
  try {
    const response = await api.post(`/user/signup`, {
      data,
    });

    return response.data; // axios auto-parses JSON
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

export const forgetPassword = async (data) => {
  try {
    const response = await api.post(`/user/forgot`, {
      data,
    });
    return response.data;
  } catch (error) {
    console.error('Error during password reset request:', error);
    throw error;
  }
};

export const verifyOtp = async (data) => {
  try {
    const response = await api.post(`/user/verifyOtp`, {
      data,
    });

    return response.data;
  } catch (error) {
    console.error('Error during verify OTP:', error);
    throw error;
  }
};

export const updatePassword = async (data) => {
  try {
    const response = await api.post(`/user/afterOtpVerify`, {
      data,
    });

    return response.data;
  } catch (error) {
    console.error('Error during update password:', error);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = {
      email: result.user.email,
      name: result.user.displayName,
      accessToken: result.user.stsTokenManager.accessToken,
    }
    // const response = await fetch(`/user/signinWithGoogle`, {
    const response = await api.post(`/user/signinWithGoogle`, 
      user,
    );
    return response.data;
  } catch (err) {
    console.error("Login error", err);
    throw err;
  }
};

export const editProfile = async (id, data) => {
   
  try {
    const response = await api.put(`/user/update?id=${id}`, {
      data,
    });

    return response.data;
  } catch (error) {
    console.error('Error during profile update:', error);
    throw error;
  }
};

export const getProfile = async (id) => {

    try {
        const response = await api.get(`/user/get?id=${id}`)
        return response.data;
    } catch (error) {
        console.log("error", error)
        throw error;
    }
}

