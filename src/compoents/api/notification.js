import api from "@/utils/axiosInstance";

export const getNotification = async () => {
    try {
        const response = await api.get(`/notification/getAllNotification`);
        return response.data;
    } catch (error) {
        console.error("Error fetching notification", error);
        throw error;
    }
}

export const updateNotification = async () => {
    try {
        const response = await api.put(`/notification/updateNotification?isReadAll=true`);
        return response.data;
    } catch (error) {
        console.error("Error updating notification", error);
        throw error;
    }
}