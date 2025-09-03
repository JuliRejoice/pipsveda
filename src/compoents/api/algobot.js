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


export const getAlgobotCategories = async () =>{
    const token = getAuthToken()
    try {
        const response = await fetch(`${BASEURL}/categories/dropdown`, {
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

export const getAlgobot = async (id = '',searchQuery = '', page = 1, limit = 10) => {
    console.log(id,'id');
    const token = getAuthToken()
    try {
        const url = `${BASEURL}/strategyPlan/getStrategiesByCategory?page=${page}&limit=${limit}${id ? `&categoryId=${id}` : searchQuery ? `&search=${searchQuery}` : ''}`;
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