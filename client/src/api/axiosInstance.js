import axios from "axios"

//creating a custom instance of Axios
const API = axios.create({
    //Note: This Url must match your server's running port (e.g. 3000)
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
    headers: { 'Content-Type': 'application/json', },
});

//request interceptor
//This runs before every request is sent
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    //if token exists, attaching it to the Authorization header
    if(token){
        //setting the header in the format required by the 'requireAuth' middleware
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
},
(error) => {
    return Promise.reject(error);
}
);

//we can add a response interceptor here later to handle 401/Expired tokens

export default API;