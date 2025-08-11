import { getCookie } from "../../../cookie";

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;
export const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return getCookie('userToken');
    }
    return null;
};

export const getCourses = async ({
  page = 1,
  limit = 10,
  searchQuery = "",
  courseType = "",
}) => {
  try {
    const token = getAuthToken();

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["x-auth-token"] = token;
    }

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

    const response = await fetch(
      `${BASEURL}/course/getAllCourse?${params.toString()}`,
      { method: "GET", headers }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching courses", error);
    throw error;
  }
};


export const getChapters = async (id) => {
    try {
        const token = getAuthToken();
        console.log("token", token);
        const headers = {};

        if (token) {
            headers['x-auth-token'] = token;
        }

        const res = await fetch(`https://259s7s89-6002.inc1.devtunnels.ms/api/v1/chapter/getChapterByCourse?courseId=${id}&sortBy=chapterNo&sortOrder=1`, { headers });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching chapters", error);
        throw error;
    }
};

export const getTrendingOrPopularCourses = async (type) => {
    try {
        const token = getAuthToken();
        const headers = {};

        if (token) {
            headers['x-auth-token'] = token;
        }

        const res = await fetch(`https://259s7s89-6002.inc1.devtunnels.ms/api/v1/course/getDefineCourse?type=${type}`, { headers });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching trending courses", error);
        throw error;
    }
};



