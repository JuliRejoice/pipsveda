import { getCookie } from "../../../cookie";

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;
export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return getCookie('token');
    }
    return null;
};

export const getCourses = async () => {
  const token = getAuthToken();
  const response = await fetch(`${BASEURL}/course/getAllCourse`,
    {method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ['x-auth-token']: token,
        },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  return response.json();
}


export const getChapters = async (id: string) => {
    try {
        const token = getAuthToken();
        const headers: Record<string, string> = {};

        if (token) {
            headers['x-auth-token'] = token;
        }

        const res = await fetch(`${BASEURL}/chapter/getAllChapter?courseId=${id}`, { headers });
        const data = await res.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error fetching chapters", error);
        throw error;
    }
};