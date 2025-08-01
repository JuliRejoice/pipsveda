import { getCookie } from "../../../cookie";

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;
export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return getCookie('userToken') || '';
    }
    return null;
};

export const sendMessage = async (data: any) => {
    const token = getAuthToken();
    console.log(token)
    const response = await fetch(`${BASEURL}/contactUs/createContact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ['x-auth-token']: token,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to send message');
    }
    return await response.json();
};