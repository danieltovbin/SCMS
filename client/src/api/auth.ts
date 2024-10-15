import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

export const loginUser = async (username:string, password:string) => {
    try {
        const response = await axios.post('/api/auth/login', {
            username,
            password
        });

        if (response.status === 200) {
            Cookies.set('access_token', response.data.access_token, { expires: 1 });
            Cookies.set('user_role', response.data.role, { expires: 1 });
           return response
        }

    } catch (error) {
        if (error instanceof AxiosError){
            if(error.response){
                if (error.response.status === 401) {
                    console.log('Invalid credentials')
                }
            }
        } else {
            console.error('Error loggin in:', error);
        }
        
    }
};



