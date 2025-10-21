import API from "./axiosInstance.js";

const AUTH_URL = '/user';

//1. User Registration
const signup = (formData) => {
    //Since 'register' handles image, content type must be formdata
    //when sending formdata with Axios, we don't set the Content-Type header; Axios does it automatically
    return API.post(`${AUTH_URL}/register`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
};

//2. User login
const login = (formData) => {
    //sending email and password as json
    return API.post(`${AUTH_URL}/login`, formData);
}

//3. Fetch user profile (private - Token required by interceptor)
const fetchProfile = () => {
    //GET request - token automatically attached by interceptor
    return API.get(`${AUTH_URL}/profile`);
};

//4. update user profile (Private - Token required by interceptor)
const updateProfile = (formData) => {
    return API.put(`${AUTH_URL}/profile`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
};

export { signup, login, updateProfile, fetchProfile }