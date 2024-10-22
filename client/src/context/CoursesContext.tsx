import axios from "axios";
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from "react";
import { Course } from "../components/courses/utils/coursesUtils";

interface CoursesContextType {
    courses: Course[];
    setCourses: Dispatch<SetStateAction<Course[]>>;
    fetchCourses: () => void;
    error: string | null;
    successMessage: string | null;
    setError: Dispatch<SetStateAction<string | null>>;
    setSuccessMessage: Dispatch<SetStateAction<string | null>>;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

interface CoursesProvider {
    children: ReactNode;
}
export const CourseProvider:FC<CoursesProvider> = ({ children }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fetchCourses = async () => {
        try {
            const response = await axios.get("/api/courses/courses");
            setCourses(response.data.courses);
        } catch (err) {
            setError("Failed to fetch courses");
        } 
    };

    


   

    return (
        <CoursesContext.Provider value={{courses,setCourses, fetchCourses, error, setError, successMessage, setSuccessMessage}}>
            {children}
        </CoursesContext.Provider>
    )
}

export const useCoursesContext = () => {
    const context = useContext(CoursesContext);
    if (!context) {
        throw new Error("useCoursesContext must be within a CourseProvider")
    }
    return context;
};