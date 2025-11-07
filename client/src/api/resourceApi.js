// client/src/api/resourceApi.js

import API from './axiosInstance';

const RESOURCE_URL = '/resources';

/**
 * Fetches the main resource requests feed with dynamic filtering and sorting.
 * @param {object} filters - Object containing city, search query, and chip states.
 * @returns {Promise<AxiosResponse>}
 */
export const fetchResources = (filters) => {
    // 1. Prepare Query Parameters
    const params = {};

    // Iterate over the filters object. The backend expects parameters like city, urgency, etc.
    for (const key in filters) {
        let value = filters[key];
        
        // Exclude null, undefined, or empty string values (the 'unselected' state)
        if (value === null || value === undefined || value === '') {
            continue;
        }

        // Convert booleans to strings for the backend
        if (typeof value === 'boolean') {
            params[key] = String(value); 
        } else {
            params[key] = value;
        }
    }
    
    // 2. Execute GET Request with Query Parameters
    return API.get(RESOURCE_URL, { params }); 
};

/**
 * Fetches the detailed information for a single resource request.
 * @param {string} resourceId - The MongoDB _id of the request.
 * @returns {Promise<AxiosResponse>}
 */
export const fetchSingleResource = (resourceId) => {
    return API.get(`${RESOURCE_URL}/${resourceId}`);
};

export const postResource = (formData) => {
    // Interceptor attaches the user's JWT (requireAuth on backend)
    return API.post(RESOURCE_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data', 
        }
    });
};