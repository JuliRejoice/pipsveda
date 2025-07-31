import { getCookie } from "../../../cookie";

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;
export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return getCookie('token');
    }
    return null;
};

export const sendMessage = async (data: any) => {
    const token = getAuthToken();
    const response = await fetch(`${BASEURL}/contact-us`, {
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