
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
  const fromdata = new FormData();
  fromdata.append("name", data.name);
  fromdata.append("email", data.email);
  fromdata.append("password", data.password);
  fromdata.append("country", data.country);
  fromdata.append("state", data.state);
  fromdata.append("city", data.city);
  try {
    const response = await api.post(`/user/signup`, fromdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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
      email: data.email,
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
      otp: data.otp,
      email: data.email,
    });

    return response.data;
  } catch (error) {
    console.error('Error during verify OTP:', error);
    throw error;
  }
};

export const updatePassword = async (data) => {
  try {
    const response = await api.post(`/user/afterOtpVerify`,
      { email: data.email, password: data.password });

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
      profileImage: result.user.photoURL,
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

export const editProfile = async (userId, formData) => {
  try {
    const response = await api.put(
      `/user/update?id=${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    return response.data;
  } catch (error) {
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

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file, file.name || 'profile-image.jpg');

    const response = await api.post(`/user/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: [(data, headers) => {
        delete headers['Content-Type'];
        return data;
      }]
    });

    return response.data;
  } catch (error) {
    console.error('Error during image upload:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

