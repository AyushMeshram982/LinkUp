// client/src/api/groupApi.js

import API from './axiosInstance';

const GROUP_URL = '/groups';

/**
 * Fetches the main groups feed with dynamic filtering and sorting.
 * @param {object} filters - Object containing city, search query, and chip states.
 * @returns {Promise<AxiosResponse>}
 */
export const fetchGroups = (filters) => {
    // 1. Prepare Query Parameters
    const params = {};

    // Iterate over the filters object. The backend expects parameters like city, search, etc.
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
    return API.get(GROUP_URL, { params }); 
};

/**
 * Fetches the detailed information for a single group.
 * @param {string} groupId - The MongoDB _id of the group.
 * @returns {Promise<AxiosResponse>}
 */
export const fetchSingleGroup = (groupId) => {
    return API.get(`${GROUP_URL}/${groupId}`);
};

export const createGroup = (formData) => {
    // Interceptor attaches the user's JWT (requireAuth on backend)
    return API.post(GROUP_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data', 
        }
    });
};