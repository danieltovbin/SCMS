import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/homePage/HomePage';
import PageNotFound from '../pages/page404/PageNotFound';
import ProfilePage from '../pages/profilePage/ProfilePage';
import EnrollmentsPage from '../pages/enrollmentsPage/EnrollmentsPage';
import CoursesPage from '../pages/coursesPage/CoursesPage';
import LoginPage from '../pages/loginPage/LoginPage';
import UsersAdmin from '../pages/adminPages/UsersAdmin';

export const router = createBrowserRouter([
    { path: "/home", element: <HomePage />},
    { path: "/courses", element: <CoursesPage />},
    { path: "/enrollments", element: <EnrollmentsPage />},
    { path: "/users", element: <UsersAdmin />},
    { path: "/profile", element: <ProfilePage />},
    { path: "/login", element: <LoginPage />},
    { path: "/page404", element: <PageNotFound />},
])