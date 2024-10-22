import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

export const removeCourse = async (id: number) => {
  const token = Cookies.get("access_token");
  const userRole = Cookies.get("user_role");

  if (!token) {
    throw new Error("No roken found");
  }

  if (userRole !== "admin") {
    throw new Error("role is not admin");
  }

  try {
    const response = await axios.delete(`/api/courses/course/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error removing course");
  }
};

export const updateCourse = async (
  id: number,
  updatedData: { title: string; description: string }
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
    const response = await axios.put(`/api/courses/course/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("response updatecourse data message", response.data.message);
    return response.data.message;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        if (error.response.status === 409) {
          throw new Error("A course with the same title already exists.");
        }
        if (error.response.status === 500) {
          console.log("Invalid credentials");
        }
      }
    } else {
      console.error("Error updating course:", error);
    }
  }
};

export const createCourse = async (title: string, description: string) => {
  const token = Cookies.get("access_token");
  const userRole = Cookies.get("user_role");

  if (!token) {
    throw new Error("No token found");
  }

  if (userRole !== "admin") {
    throw new Error("user is not admin");
  }

  try {
    const response = await axios.post(
      "/api/courses/course",
      {
        title,
        description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 400) {
      console.log("Missing required fileds: title or description");
    }

    if (response.status === 201) {
      console.log("Course created:", response.data);
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
      console.error("Error creating course", error);
    }
  }
};

// setCourses((prevCourses) => [
//   ...prevCourses,
//   { id: response.data.courseId, title, description},
// ]);
// setSuccessMessage("Course created successfullt.")

// setError("Failed to create course.")
