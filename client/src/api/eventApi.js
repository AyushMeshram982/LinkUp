import API from "./axiosInstance.js";

const EVENT_URL = '/events';

export const fetchEvents = (filters) => {
    //preparing query parameters
    const params = {};

    //mandatory / primary filters
    if(filters.city){
        params.city = filters.city;
    }
    if(filters.search){
        params.search = filters.search;
    }

    if(filters.isPaid){
        params.isPaid = filters.isPaid;
    }
    if(filters.seatsAvailable){
        params.seatsAvailable = filters.seatsAvailable;
    }
    //Date and Time filters (assuming filters object has date. Time From and Time To)
    if(filters.date){
        params.date = filters.date;
    }
    if(filters.timeFrom){
        params.timeFrom = filters.timeFrom;
    }
    if(filters.timeTo){
        params.timeTo = filters.timeTo;
    }

    // executing GET request with query parameters
    return API.get(EVENT_URL, { params }); 
};

//Fetching info of single event
export const fetchSingleEvent = (eventId) => {
    return API.get(`${EVENT_URL}/${eventId}`);
};

//registering the user for an event
export const registerUserForEvent = (eventId, seats) => {
    return API.post(`${EVENT_URL}/${eventId}/register`, { seats });
};

export const commentEvent = (eventId, text) => {
    //Interceptor attaches the user's JWT
    return API.post(`${EVENT_URL}/${eventId}/comment`, { text });
};

export const likeEvent = (eventId) => {
    //Interceptor attaches the user's JWT
    return API.post(`${EVENT_URL}/${eventId}/like`); 
}

export const checkInUser = (qrToken) => {
    // Interceptor attaches the user's JWT
    return API.post(`${EVENT_URL}/checkin`, { qrToken });
};

export const createEvent = (formData) => {
    // Interceptor attaches the user's JWT (requireAuth on backend)
    // CRITICAL: We explicitly set the Content-Type to 'multipart/form-data' 
    // to ensure the file upload is handled correctly, even though Axios often guesses it.
    return API.post(EVENT_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data', 
        }
    });
};

//Will add more functions
