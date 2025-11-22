import api from "@/utils/axiosInstance";
import { getCookie } from "../../../cookie";

export const getCourses = async ({
  page = 1,
  limit = 10,
  searchQuery = "",
  courseType = "",
  id = "",
  categoryId = "",
  instructorId = "",
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
    if (categoryId) {
      params.append("categoryId", categoryId);
    }
    if (instructorId) {
      params.append("instructorId", instructorId);
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
    const res = await api.get(
      `/chapter/getChapterByCourse?courseId=${id}&sortBy=chapterNo&sortOrder=1`
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.error("Error fetching chapters", error);
    throw error;
  }
};

export const getTrendingOrPopularCourses = async ({
  type,
  searchQuery = "",
}) => {
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
};

export const getAlgobots = async (id = "", page = 1, limit = 10) => {
  try {
    const params = new URLSearchParams({
      page,
      limit,
    });

    if (id) {
      params.append("categoryId", id);
    }

    const response = await api.get(
      `/strategyPlan/getStrategiesDashboard?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const getBotPlanForDashboard = async (id) => {
  try {
    const res = await api.get(`/strategyPlan/allDashboard/${id}`);
    const data = await res.data;
    return data;
  } catch (error) {
    console.error("Error fetching dashboard data", error);
    throw error;
  }
};

export const getTelegramFordashboard = async (id) => {
  try {
    const res = await api.get(
      `/telegram/getAllTelegramDashboard${id ? `?id=${id}` : ""}`
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.error("Error fetching dashboard data", error);
    throw error;
  }
};

export const getPaymentUrl = async (data) => {
  try {
    const response = await api.post(`/payment/createPayment`, data);

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
    const response = await api.post(`/newsletter/createNewsLetter`, formData);
    const responseData = await response.data;
    return responseData;
  } catch (error) {
    console.error("Error creating newsletter:", error);
    throw error;
  }
};

export const getDashboardData = async () => {
  try {
    const res = await api.get(`/payment/getUserDashHistory`);
    const data = await res.data;
    return data;
  } catch (error) {
    console.error("Error fetching dashboard data", error);
    throw error;
  }
};

export const getSessionData = async (id) => {
  try {
    const res = await api.get(`/sesstion/getSessionByCourse?courseId=${id}`);
    const data = await res.data;
    return data;
  } catch (error) {
    console.error("Error fetching dashboard data", error);
    throw error;
  }
};

export const updateVideoProgress = async (
  id,
  chapterId,
  courseId,
  percentage
) => {
  try {
    const res = await api.put(
      `/chapter/updateChapterTracking?id=${id}&chapterId=${chapterId}&courseId=${courseId}`,
      { percentage }
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.error("Error fetching dashboard data", error);
    throw error;
  }
};

export const getTelegramChannels = async (id, searchQuery) => {
  try {
    const res = await api.get(
      `/telegram/getAllTelegram${
        id ? `?id=${id}` : searchQuery ? `?search=${searchQuery}` : ""
      }`
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.error("Error fetching dashboard data", error);
    throw error;
  }
};

export const getCourseById = async (data) => {
  const params = new URLSearchParams();
  if (data.id) {
    params.append("id", data.id);
  }
  if (data.courseType) {
    params.append("courseType", data.courseType);
  }
  try {
    const response = await api.get(
      `/course/getAllCourseDashboard?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching course by id:", error);
    throw error;
  }
};

export const getAllCourseCategory = async ({ id, searchQuery }) => {
  const params = new URLSearchParams();
  if (id) {
    params.append("id", id);
  }
  if (searchQuery) {
    params.append("search", searchQuery);
  }
  try {
    const response = await api.get(
      `/courseCategory/getAllCourseCategory?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching algo bots:", error);
    throw error;
  }
};

export const getCourseCategoryById = async ({ id, courseType }) => {
  const params = new URLSearchParams();
  if (id) {
    params.append("id", id);
  }
  if (courseType) {
    params.append("courseType", courseType);
  }
  try {
    const response = await api.get(
      `/courseCategory/getAllCourseCategory?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching course category by id:", error);
    throw error;
  }
};

export const submitReview = async (data) => {
  console.log("data", data);
  try {
    const response = await api.post("/courseRating/addCourseRating", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};



export const getBatches = async (data) => {
  try {
    const response = await api.get(
      `/batch/getBatchByCourse?courseId=${data.courseId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching batches:", error);
    throw error;
  }
};

export const getOneBatch = async (id) => {
  try {
    const response = await api.get(`/batch/getAllBatch?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching batches:", error);
    throw error;
  }
};

export const getCourseSyllabus = async (id) => {
  try {
    const response = await api.get(`/syllabus/getAllSyllabus?courseId=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching course syllabus:", error);
    throw error;
  }
};

export const downloadCourseCertificate = async (courseId) => {
  try {
    const response = await api.post(`/payment/courseCertificate?courseId=${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error downloading certificate:', error);
    throw error;
  }
};

export const downloadStudentID = async (id,batchId) => {
  try {
    const response = await api.post(`/payment/createStudentId?courseId=${id}&batchId=${batchId}`);
    return response.data;
  } catch (error) {
    console.error('Error downloading certificate:', error);
    throw error;
  }
};

export const purchasedAllCourses = async ({type,page,limit}) => {
  try {
    const response = await api.get(
      `/payment/getMyCourseHistory?page=${page}&limit=${limit}&type=${type}`
    );
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}; 
export const getCourseRating = async (id) => {
  try {
    const response = await api.get(`/courseRating/getCourseRating?courseId=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course rating:', error);
    throw error;
  }
};

export const getCourseRatingByUser = async () => {
  try {
    const response = await api.get(`/courseRating/getUserByCourseRating`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course rating:', error);
    throw error;
  }
};

export const getYoutubeVideo = async () => {
  try {
    const res = await api.get(`/youtube/getAllYoutube`);
    const data = await res.data;
    return data;
  } catch (error) {
    console.error("Error fetching utility data", error);
    throw error;
  }
};
    