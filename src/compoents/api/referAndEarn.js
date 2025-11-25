import api from "@/utils/axiosInstance";

export const getUserWithdrawalDash = async () => {
    try {
        const response = await api.get(`/withdrawal/getUserWithdrawalDash`);
        return response.data;
    } catch (error) {
        console.error('Error fetching withdrawal dashboard data:', error);
        throw error;
    }
};

export const addWithdrawalRequest = async (withdrawalData) => {
    try {
        const response = await api.post(`/withdrawal/addWithdrawalRequest`, withdrawalData);
        return response.data;
    } catch (error) {
        console.error('Error adding withdrawal request:', error);
        throw error;
    }
};

export const getWithdrawalHistory = async (type) => {
    try {
        const response = await api.get(`/withdrawal/getWithdrawalHistory?type=${type}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching withdrawal history:', error);
        throw error;
    }
};