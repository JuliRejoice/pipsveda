const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;
console.log('BASEURL:', BASEURL);
export const signIn = async (email, password) => {
  try {
    const response = await fetch(`${BASEURL}/user/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Failed to sign in');
    }

    return await response.json();
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
}

export const signUp = async (data) => {
  try {
    const response = await fetch(`${BASEURL}/user/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to sign up');
    }

    return await response.json();
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

export const forgetPassword = async (data) => {
  try {
    const response = await fetch(`${BASEURL}/user/forgot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to send password reset email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error during password reset request:', error);
    throw error;
  }
};

export const verifyOtp = async (data) => {
  try {
    const response = await fetch(`${BASEURL}/user/verifyOtp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to verify OTP');
    }

    return await response.json();
  } catch (error) {
    console.error('Error during verify OTP:', error);
    throw error;
  }
};

export const updatePassword = async (data) => {
  try {
    const response = await fetch(`${BASEURL}/user/afterOtpVerify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update password');
    }

    return await response.json();
  } catch (error) {
    console.error('Error during update password:', error);
    throw error;
  }
};
