import api from "@/utils/axiosInstance";

export const purchasedCourses = async () => {

    try {
        const response = await api.get(`/payment/getMyCourseHistory`)
        return response.data;
    } catch (error) {
        console.log("error", error)
        throw error;
    }
}   


export const getAlgobotCategories = async () =>{
    try {
        const response = await api.get(`/categories/dropdown`)
        return response.data;
    } catch (error) {
        console.log("error", error)
        throw error;
    }
}
         


export const getAlgobot = async (id = '', searchQuery = '', page = 1, limit = 10) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
      });
  
      if (id) {
        params.append("categoryId", id);
      }
  
      if (searchQuery) {
        params.append("search", searchQuery);
      }
  
      const response = await api.get(`/strategyPlan/getStrategiesByCategory?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
  

export const getOneBot = async (id) => {
    try {
        const response = await api.get(`/strategies/${id}`)
        return response.data;
    } catch (error) {
        console.log("error", error)
        throw error;
    }
}

export const getPlan = async (id) => {
    try {
        const response = await api.get(`/strategyPlan/all/${id}`)
        return response.data;
    } catch (error) {
        console.log("error", error)
        throw error;
    }
}
      

export const getCoupon = async (couponCode) => {
    try {
        const response = await api.get(`/coupon/get-coupon-name?couponCode=${couponCode}`)
        return response.data;
    } catch (error) {
        console.log("error", error)
        throw error;
    }
}
          