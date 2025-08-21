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
  id = ""
}) => {
console.log(id)
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
    if (id) {
      params.append("id", id);
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

export const getCourseByType = async () => {
    try {
        const token = getAuthToken();
        const headers = {};

        if (token) {
            headers['x-auth-token'] = token;
        }

        const res = await fetch(`${BASEURL}/course/getCoueseByType`, { headers });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching courses by type", error);
        throw error;
    }
};

export const getChapters = async (id) => {
    try {
        const token = getAuthToken();
        const headers = {};

        if (token) {
            headers['x-auth-token'] = token;
        }


        const res = await fetch(`${BASEURL}/chapter/getChapterByCourse?courseId=${id}&sortBy=chapterNo&sortOrder=1`, { headers });
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

        const res = await fetch(`${BASEURL}/course/getDefineCourse?type=${type}`, { headers });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching trending courses", error);
        throw error;
    }
};

export const getPaymentUrl = async (data) => {
    try {
        const token = getAuthToken();
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['x-auth-token'] = token;
        }

        const response = await fetch(
            `${BASEURL}/payment/createPayment`,
            {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Error creating payment URL:", error);
        throw error;
    }
};

export const getUtilityData = async () => {
    try {
        const res = await fetch(`${BASEURL}/utilitySetting/`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching utility data", error);
        throw error;
    }
};
