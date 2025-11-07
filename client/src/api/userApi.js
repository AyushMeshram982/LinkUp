// client/src/api/userApi.js

import API from './axiosInstance';

const USER_URL = '/user';

/**
 * Fetches all events hosted by the currently authenticated user for their dashboard.
 * @returns {Promise<AxiosResponse>}
 */
export const fetchHostedEvents = () => {
    // Token is attached automatically by the interceptor
    return API.get(`${USER_URL}/hosted-events`);
};

/**
 * Sends a request to update the fulfillment status of a resource request.
 * (Placeholder for future resource management actions)
 * @param {string} resourceId 
 * @param {object} updates 
 * @returns {Promise<AxiosResponse>}
 */
export const updateResourceStatus = (resourceId, updates) => {
    return API.put(`/resources/${resourceId}`, updates);
};
