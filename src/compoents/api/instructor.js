import api from "@/utils/axiosInstance";

export const getInstructor = async () => {
  try {
    const response = await api.get(`/instructor/getAllInstructor`);
    return response.data;
  } catch (error) {
    console.error("Error fetching instructors", error);
    throw error;
  }
};

export const getInstructorById = async (id) => {
  try {
    const response = await api.get(`/instructor/getAllInstructor?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching instructor by id", error);
    throw error;
  }
};

export const getTotalStudents = async (id) => {
  try {
    const response = await api.get(
      `/instructor/getStudentByInstructor?id=${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching total students", error);
    throw error;
  }
};
