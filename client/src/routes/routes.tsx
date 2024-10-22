import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/homePage/HomePage';
import PageNotFound from '../pages/page404/PageNotFound';
import ProfilePage from '../pages/profilePage/ProfilePage';
import EnrollmentsPage from '../pages/enrollmentsPage/EnrollmentsPage';
import CoursesPage from '../pages/coursesPage/CoursesPage';
import LoginPage from '../pages/loginPage/LoginPage';
import UsersAdmin from '../pages/adminPages/UsersAdmin';
import ProtectedRoute from '../pages/adminPages/ProtectedRoute';
import CoursesAdmin from '../pages/adminPages/CoursesAdmin';

export const router = createBrowserRouter([
    { path: "/home", element: <HomePage />},
    { path: "/courses", element: <CoursesPage />},
    { path: "/courses-admin", element: <ProtectedRoute><CoursesAdmin /></ProtectedRoute>},
    { path: "/enrollments", element: <EnrollmentsPage />},
    { path: "/users", element: <ProtectedRoute><UsersAdmin /></ProtectedRoute>},
    { path: "/profile", element: <ProfilePage />},
    { path: "/login", element: <LoginPage />},
    { path: "*", element: <PageNotFound />},
])