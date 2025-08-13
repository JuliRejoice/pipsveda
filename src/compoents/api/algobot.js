import { getCookie } from "../../../cookie";

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;
export const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return getCookie('userToken') || '';
    }
    return null;
};

export const prchasedCourses = async () => {
    const token = getAuthToken()
    try {
        const response = await fetch(`${BASEURL}/api/v1/payment/getMyCourseHistory`, {
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

export const getAlgobot = async (id = '') => {
    const token = getAuthToken()
    try {
        const url = `${BASEURL}/api/v1/algoBot/getAllBot${id ? `?id=${id}` : ''}`;
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