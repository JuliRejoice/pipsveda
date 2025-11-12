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

export const updateNotification = async (notificationId = null) => {
    try {
        let url = '/notification/updateNotification';
        if (notificationId) {
            url += `?notificationId=${notificationId}`;
        } else {
            url += '?isReadAll=true';
        }
        const response = await api.put(url);
        return response.data;
    } catch (error) {
        console.error("Error updating notification", error);
        // Don't throw the error to prevent automatic logout
        return { error: true, message: error.message };
    }
}