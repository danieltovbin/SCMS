import axios, { AxiosError } from "axios";
import Cookies from 'js-cookie';

export const Enrollments = async (userId:number, courseId:number, grade:number) => {
    try {
        const response = await axios.post('/api/enrollments/enrollment/admin', {
            userId,
            courseId,
            grade
        });

        if (response.status === 400) {
            console.log('Missing required fileds: userId or courseId')
        }

        if (response.status === 404){
            console.log('Course does not exist.')
        }

        if (response.status === 201) {
            console.log('User is logged in:', response.data);
            return response
        }

    } catch (error) {
        if (error instanceof AxiosError){
            if(error.response){
                if (error.response.status === 500) {
                    console.log('Invalid credentials')
                }
            }
        } else {
            console.error('Error loggin in:', error);
        }
        
    }
};


export const getEnrollments = async () =>{
    const token = Cookies.get('access_token'); 
    if (!token) {
        throw new Error('No token found');
    }
    try {
        const response = await axios.get("/api/enrollments/enrollments", {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        })
        return response.data;
    } catch (error) {
        console.error('Error fetching enrollments:', error);
        throw error;
    }
}