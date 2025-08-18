import { getCookie } from "../../../cookie";

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;
export const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return getCookie('userToken') || '';
    }
    return null;
};

export const purchasedCourses = async () => {
    const token = getAuthToken()
    try {
        const response = await fetch(`${BASEURL}/payment/getMyCourseHistory`, {
            headers: {
                'Content-Type': 'application/json',
                ['x-auth-token']: token,
            }
        })
        return await response.json();
    } catch (error) {
        console.log("error", error)
        throw error;
    }
}

export const getAlgobot = async (id = '',searchQuery = '') => {
    console.log("searchQuery",searchQuery,'------------',id)
    const token = getAuthToken()
    try {
        const url = `${BASEURL}/strategies${id ? `?id=${id}` : searchQuery ? `?search=${searchQuery}` : ''}`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ['x-auth-token']: token,
            }
        })
        return await response.json();
    } catch (error) {
        console.log("error", error)
        throw error;
    }
}

export const getOneBot = async (id) => {
    const token = getAuthToken()
    try {
        const response = await fetch(`${BASEURL}/strategies/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                ['x-auth-token']: token,
            }
        })
        return await response.json();
    } catch (error) {
        console.log("error", error)
        throw error;
    }
}

export const getPlan = async (id) => {
    const token = getAuthToken()
    try {
        const response = await fetch(`${BASEURL}/strategyPlan/all/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                ['x-auth-token']: token,
            }
        })
        return await response.json();
    } catch (error) {
        console.log("error", error)
        throw error;
    }
}

export const getCoupon = async (couponCode) => {
    const token = getAuthToken()
    try {
        const response = await fetch(`${BASEURL}/coupon/get-coupon-name?couponCode=${couponCode}`, {
            headers: {
                'Content-Type': 'application/json',
                ['x-auth-token']: token,
            }
        })
        return await response.json();
    } catch (error) {
        console.log("error", error)
        throw error;
    }
}