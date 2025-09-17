import api from "@/utils/axiosInstance";

export const sendMessage = async (data) => {
    try {
        const response = await api.post(`/contactUs/createContact`, {
            data,
        });
        return response.data;
    } catch (error) {
        console.error("Error during contact:", error);
        throw error;
    }
};