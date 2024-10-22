import Courses from "../../components/courses/Courses";
import Header from "../../components/header/Header";
import { CourseProvider } from "../../context/CoursesContext";

function CoursesPage() {
  return (
    <CourseProvider>
      <div>
        <Header />
        <Courses />
      </div>
    </CourseProvider>
  );
}

export default CoursesPage;
