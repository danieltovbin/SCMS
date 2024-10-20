import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

export const Enrollments = async (
  user_name: string,
  course_name: string,
  grade: number
) => {
  try {
    const token = Cookies.get("access_token");
    const userRole = Cookies.get("user_role");

    if (!token) {
      throw new Error("No token found");
    }
    if (userRole !== "admin") {
      throw new Error("role is not admin");
    }
    const response = await axios.post(
      "/api/enrollments/enrollment/admin",
      {
        user_name,
        course_name,
        grade,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
 
    if (response.status === 400) {
      console.log("Missing required fileds: userName or courseName");
    }

    if (response.status === 404) {
      console.log("Course does not exist.");
    }

    if (response.status === 201) {
      console.log("User is logged in:", response.data);
      return response;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        if (error.response.status === 500) {
          console.log("Invalid credentials");
        }
      }
    } else {
      console.error("Error loggin in:", error);
    }
  }
};



export const getEnrollments = async () => {
  const token = Cookies.get("access_token");
  if (!token) {
    throw new Error("No token found");
  }
  try {
    const response = await axios.get("/api/enrollments/enrollments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    throw error;
  }
};



export const updateUserGrade = async (
  enrollmentId: number,
  newGrade: number
) => {
  const token = Cookies.get("access_token");
  const userRole = Cookies.get("user_role");

  if (!token) {
    throw new Error("No token found");
  }
  if (userRole !== "admin") {
    throw new Error("role is not admin");
  }

  try {
    const response = await axios.patch(
      `/api/enrollments/enrollment/${enrollmentId}`,
      { grade: newGrade },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.message;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        if (error.response.status === 500) {
          console.log("Invalid credentials");
        }
      }
    } else {
      console.error("Error loggin in:", error);
    }
  }
};



export const removeEnrollment = async (enrollmentId: number) => {
  const token = Cookies.get("access_token");
  const userRole = Cookies.get("user_role");

  if (!token) {
    throw new Error("No token found");
  }
  if (userRole !== "admin") {
    throw new Error("role is not admin");
  }

  try {
    const response = await axios.delete(
      `/api/enrollments/enrollment/${enrollmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error removing enrollment");
  }
};
