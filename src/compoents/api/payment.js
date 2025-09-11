import api from "@/utils/axiosInstance";

export const getpaymentHistory = async (type,queryData) => {
    try {
        const response = await api.get(`/payment/getPaymentHistory?page=${queryData.page}&limit=${queryData.limit}${type ? `&isType=${type}` : ''}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching payment history:', error);
        throw error;
    }
};



export const addmetaAccountNo = async (paymentId, metaAccountNo) => {
    try {
        const response = await api.put(`/payment/updateMetaAccountNo/${paymentId}`, {
            "metaAccountNo" : metaAccountNo
        });
        return response.data;
    } catch (error) {
        console.error('Error adding meta account number:', error);
        throw error;
    }
};

export const downloadInvoice = async (paymentData) => {
    try {
        const response = await api.post(`/payment/createInvoice`,paymentData);
        return response.data;
    } catch (error) {
        console.error('Error downloading invoice:', error);
        throw error;
    }
};