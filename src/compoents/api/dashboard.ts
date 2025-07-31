const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;
const token = localStorage.getItem("token");

export const getCourses = async () => {
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