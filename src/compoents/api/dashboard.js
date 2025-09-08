import api from "@/utils/axiosInstance";

export const getCourses = async ({
    page = 1,
    limit = 10,
    searchQuery = "",
    courseType = "",
    id = "",
  }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
  
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (courseType) {
        params.append("courseType", courseType);
      }
      if (id) {
        params.append("id", id);
      }
  
      const response = await api.get(`/course/getAllCourse?${params.toString()}`);
  
      return response.data;
    } catch (error) {
      console.error("Error fetching courses", error);
      throw error;
    }
  };

export const getCourseByType = async () => {
    try {
        const res = await api.get(`/course/getCoueseByType`);
        const data = await res.data;
        return data;
    } catch (error) {
        console.error("Error fetching courses by type", error);
        throw error;
    }
};

export const getChapters = async (id) => {
    try {
        const res = await api.get(`/chapter/getChapterByCourse?courseId=${id}&sortBy=chapterNo&sortOrder=1`);
        const data = await res.data;
        return data;
    } catch (error) {
        console.error("Error fetching chapters", error);
        throw error;
    }
};

export const getTrendingOrPopularCourses = async ({ type, searchQuery = "" }) => {
    try {
      let url = `/course/getDefineCourse?type=${type}`;
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
  
      const res = await api.get(url);
      const data = await res.data;
      return data;
    } catch (error) {
      console.error("Error fetching trending/popular courses", error);
      throw error;
    }
  };

  export const getBots = async () => {
    try {
        const res = await api.get(`/strategies?page=1&limit=3`);
        const data = await res.data;
        return data;
    } catch (error) {
        console.error("Error fetching bots", error);
        throw error;
    }
}
  

export const getPaymentUrl = async (data) => {
    try {
        const response = await api.post(
            `/payment/createPayment`,
            data
        );
        
        const responseData = await response.data;
        return responseData;
    } catch (error) {
        console.error("Error creating payment URL:", error);
        throw error;
    }
};

export const getUtilityData = async () => {
    try {
        const res = await api.get(`/utilitySetting/`);
        const data = await res.data;
        return data;
    } catch (error) {
        console.error("Error fetching utility data", error);
        throw error;
    }
};

export const createNewsLetter = async (formData) => {
    try {
        const response = await api.post(
            `/newsletter/createNewsLetter`,
            formData
        );
        const responseData = await response.data;
        return responseData;
    } catch (error) {
        console.error("Error creating newsletter:", error);
        throw error;
    }
}

export const getDashboardData = async () => {
    try {
        const res = await api.get(`/payment/getUserDashHistory`);
        const data = await res.data;
        return data;
    } catch (error) {
        console.error("Error fetching dashboard data", error);
        throw error;
    }
}

export const getSessionData = async (id) => {
    try {
        const res = await api.get(`/sesstion/getSessionByCourse?courseId=${id}`);
        const data = await res.data;
        return data;
    } catch (error) {
        console.error("Error fetching dashboard data", error);
        throw error;
    }
}


export const getTelegramChannels = async (id,searchQuery) => {
    try {
        const res = await api.get(`/telegram/getAllTelegram${id ? `?id=${id}` : searchQuery ? `?search=${searchQuery}` : ''}`);
        const data = await res.data;
        return data;
    } catch (error) {
        console.error("Error fetching dashboard data", error);
        throw error;
    }
}
