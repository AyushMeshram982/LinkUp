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

    //chip filters (sent as 'true' or 'false' strings, or undefined if null)
    // if(filters.isPaid !== null){
    //     params.isPaid = filters.isPaid ? 'true' : 'false';
    // }

    // if(filters.seatsAvailable !== null){
    //     //Note: the backend logic for this is complex, so we pass it as a boolean string
    //     params.seatsAvailable = filters.seatsAvailable ? 'true' : 'false';
    // }

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

//Will add more functions
