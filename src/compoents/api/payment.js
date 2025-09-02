import { getCookie } from "../../../cookie";

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;
export const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return getCookie('userToken') || '';
    }
    return null;
};

export const getpaymentHistory = async (type) => {
    const token = getAuthToken();
    const response = await fetch(`${BASEURL}/payment/getPaymentHistory?${type ? `isType=${type}` : ''}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ['x-auth-token']: token,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch payment history');
    }
    return await response.json();
};


export const addmetaAccountNo = async (paymentId, metaAccountNo) => {
    const token = getAuthToken();
    const response = await fetch(`${BASEURL}/payment/updateMetaAccountNo/${paymentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ['x-auth-token']: token,
        },
        body: JSON.stringify({"metaAccountNo" : metaAccountNo}),
    });
    if (!response.ok) {
        throw new Error('Failed to add meta account number');
    }
    return await response.json();
};