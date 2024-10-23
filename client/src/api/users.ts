import axios from "axios";
import Cookies from "js-cookie";

export const getUsers = async () => {
    const token = Cookies.get("access_token");
    const userRole = Cookies.get("user_role");

    if (!token) {
        throw new Error("No token found")
    }

    if (userRole !== "admin") {
        throw new Error("role is not admin")
    }

    try {
        const response = await axios.get("/api/users/users", {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })    
        console.log("response" ,response.data.users)
        return response.data.users;
    } catch (error) {
        console.error("Error fetching users:", error)
        throw error
    }
}



export const removeUser = async (id: number) => {
    const token = Cookies.get("access_token");
    const userRole = Cookies.get("user_role");

    if (!token) {
        throw new Error("token not found")
    }

    if (userRole !== "admin") {
        throw new Error("user is not admin")
    }

    try {
        const response = await axios.delete(`/api/users/user/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response
    } catch (error) {
        console.error("Error removing user")
    }
}

