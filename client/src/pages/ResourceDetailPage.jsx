// import React, { useState, useEffect, useMemo } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { fetchSingleResource } from '../api/resourceApi.js';
// import { useAuth } from '../contexts/AuthContext.jsx';
// import { Zap, Calendar, MapPin, User, Phone, Edit, CheckCircle } from 'lucide-react';

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// const ResourceDetailPage = () => {
//     // Hooks and Contexts
//     const { id: resourceId } = useParams();
//     const { isAuthenticated, user } = useAuth();

//     // State Management
//     const [resource, setResource] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // --- Data Fetching Effect ---
//     useEffect(() => {
//         const loadResource = async () => {
//             setLoading(true);
//             try {
//                 const response = await fetchSingleResource(resourceId);
//                 setResource(response.data);
//             } catch (err) {
//                 console.error("Failed to load resource details:", err);
//                 setError('Could not load resource request. It may have been deleted.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (resourceId) {
//             loadResource();
//         }
//     }, [resourceId]);

//     // --- Derived State ---
//     const isFulfilled = resource ? !resource.isStillNeeded : false;
//     const isHost = isAuthenticated && resource?.hostId?._id.toString() === user?._id.toString();
    
//     const neededDate = resource?.neededDate 
//         ? new Date(resource.neededDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
//         : 'N/A';
    
//     // Format contact number (example: (123) 456-7890)
//     const formattedContact = resource?.contactNumber?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') || 'N/A';

//     // --- Render Logic ---
//     if (loading) {
//         return <div className="text-blue-400 text-center text-xl py-10">Loading resource request...</div>;
//     }

//     if (error) {
//         return <div className="text-red-400 text-center text-xl py-10">{error}</div>;
//     }

//     if (!resource) return null;

//     const linkedEvent = resource.linkedEventId;

//     return (
//         <div className="resource-detail-page text-white py-8">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
//                 {/* --- Left Column: Request Image and Description --- */}
//                 <div className="lg:col-span-2">
//                     {/* Request Title */}
//                     <h1 className="text-4xl font-extrabold text-white mb-4 flex items-center">
//                         {resource.title}
//                         {isFulfilled && <span className="ml-4 px-3 py-1 bg-green-600 text-sm rounded-full flex items-center"><CheckCircle className='w-4 h-4 mr-1'/> Fulfilled</span>}
//                     </h1>

//                     {/* Image */}
//                     <img 
//                         src={`${BACKEND_URL}/${resource.resourceImageUrl}`} 
//                         alt={resource.title} 
//                         className="w-full h-96 object-cover rounded-xl shadow-2xl mb-6"
//                     />

//                     {/* Description */}
//                     <h2 className="text-2xl font-bold mb-3 text-white border-b border-gray-700 pb-2">Details of the Request</h2>
//                     <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{resource.description || "No detailed description provided."}</p>
//                 </div>

                
//                 {/* --- Right Column: Context, Urgency, and Contact Panel --- */}
//                 <div className="lg:col-span-1 space-y-6">
                    
//                     {/* Urgency & Timeline Card */}
//                     <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
//                         <h2 className="text-xl font-bold mb-4 flex items-center text-yellow-400"><Zap className='w-5 h-5 mr-2'/> Urgency & Location</h2>
//                         <ul className="space-y-3 text-gray-300">
//                             <li className='flex items-center'><Calendar className='w-5 h-5 mr-3 text-green-400'/> Needed By: <span className='font-semibold ml-2 text-white'>{neededDate}</span></li>
//                             <li className='flex items-center'><MapPin className='w-5 h-5 mr-3 text-red-400'/> Location: <span className='font-semibold ml-2 text-white'>{resource.city}</span></li>
//                             <li className='flex items-center'><User className='w-5 h-5 mr-3 text-blue-400'/> Host: <span className='font-semibold ml-2 text-white'>{resource.hostId?.name || 'N/A'}</span></li>
//                         </ul>
//                     </div>

//                     {/* Linked Event Context */}
//                     {linkedEvent && (
//                         <Link to={`/events/${linkedEvent._id}`} className="block">
//                             <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:bg-gray-700/50 transition duration-200 cursor-pointer">
//                                 <h2 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-2 text-gray-400">Linked Event Context</h2>
//                                 <p className="text-white font-extrabold text-xl line-clamp-1">{linkedEvent.title}</p>
//                                 <p className={`text-sm mt-1 font-medium ${linkedEvent.isPaid ? 'text-yellow-500' : 'text-green-500'}`}>
//                                     {linkedEvent.isPaid ? 'Paid Event' : 'Free Event'}
//                                 </p>
//                             </div>
//                         </Link>
//                     )}

//                     {/* Contact Action Panel (The Primary Goal) */}
//                     <div className={`p-6 rounded-xl shadow-lg ${isFulfilled ? 'bg-gray-900 border-dashed border-gray-600' : 'bg-green-900/30 border-green-700'}`}>
//                         <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 text-white">Contact Host</h2>
                        
//                         <div className='flex items-center justify-center space-x-2'>
//                             <Phone className='w-6 h-6 text-green-400'/>
//                             <p className='text-3xl font-extrabold text-green-400'>{formattedContact}</p>
//                         </div>
//                         <p className="text-sm text-gray-400 text-center mt-2">Call the host to offer your resource or volunteer service.</p>
//                     </div>

//                     {/* Host Management Buttons */}
//                     {isHost && !isFulfilled && (
//                          <div className="bg-gray-800 p-4 rounded-xl flex space-x-4">
//                             <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center">
//                                 <Edit className='w-5 h-5 mr-2'/> Edit Request
//                             </button>
//                             <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center">
//                                 <CheckCircle className='w-5 h-5 mr-2'/> Mark Fulfilled
//                             </button>
//                          </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ResourceDetailPage;

//--------------------------------------------------------------------------------

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSingleResource } from '../api/resourceApi.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Zap, Calendar, MapPin, User, Phone, Edit, CheckCircle } from 'lucide-react';
import "../styles/ResourceDetailPage.css"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const ResourceDetailPage = () => {
    // Hooks and Contexts
    const { id: resourceId } = useParams();
    const { isAuthenticated, user } = useAuth();

    // State Management
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Data Fetching Effect ---
    useEffect(() => {
        const loadResource = async () => {
            setLoading(true);
            try {
                const response = await fetchSingleResource(resourceId);
                setResource(response.data);
            } catch (err) {
                console.error("Failed to load resource details:", err);
                setError('Could not load resource request. It may have been deleted.');
            } finally {
                setLoading(false);
            }
        };

        if (resourceId) {
            loadResource();
        }
    }, [resourceId]);

    // --- Derived State ---
    const isFulfilled = resource ? !resource.isStillNeeded : false;
    const isHost = isAuthenticated && resource?.hostId?._id.toString() === user?._id.toString();
    
    const neededDate = resource?.neededDate 
        ? new Date(resource.neededDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        : 'N/A';
    
    // Format contact number (example: (123) 456-7890)
    const formattedContact = resource?.contactNumber?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') || 'N/A';

    // --- Render Logic ---
    if (loading) {
        return <div className="text-blue-400 text-center text-xl py-10">Loading resource request...</div>;
    }

    if (error) {
        return <div className="text-red-400 text-center text-xl py-10">{error}</div>;
    }

    if (!resource) return null;

    const linkedEvent = resource.linkedEventId;

    return (
        <div className="resource-detail-page-rp">
            
                
                {/* --- Left Column: Request Image and Description --- */}
                <div className="left-interaction-rp">
                    

                    {/* Image */}
                    <img 
                        src={`${BACKEND_URL}/${resource.resourceImageUrl}`} 
                        alt={resource.title} 
                        className="resource-detail-page-image-rp"
                    />

                    {/* Request Title */}
                    {/* <h1 className="text-4xl font-extrabold text-white mb-4 flex items-center">
                        {resource.title}
                        {isFulfilled && <span className="ml-4 px-3 py-1 bg-green-600 text-sm rounded-full flex items-center"><CheckCircle className='w-4 h-4 mr-1'/> Fulfilled</span>}
                    </h1> */}

                    {/* Title and Host Info */}
                    <div className="resource-detail-page-title-host-container-rp">
                        <h1 className="resource-detail-page-title-rp">{resource.title}</h1>
                        <p className="resource-detail-page-host-rp">Hosted by: <span className='font-semibold'>{resource.hostId.name}</span></p>
                    </div>

                    {/* Description */}
                    {/* <h2 className="text-2xl font-bold mb-3 text-white border-b border-gray-700 pb-2">Details of the Request</h2>
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{resource.description || "No detailed description provided."}</p> */}

                     {/* Description */}
                    
                    <h2 className="resource-detail-page-description-heading-rp">Details of the Request</h2>
                    <p className="resource-detail-page-description-rp">{resource.description || "No detailed description provided."}</p>
                    
                </div>

                
                {/* --- Right Column: Context, Urgency, and Contact Panel --- */}
                <div className="right-interaction-rp">
                    
                    {/* Urgency & Timeline Card */}
                    <div className="resource-detail-page-location-time-data-rp ">
                        <h2 className="resource-detail-page-event-details-heading-rp "> Urgency & Location</h2>
                        <ul className="space-y-3 text-gray-300">
                            <li className='flex items-center'> Needed By: <span className='resource-detail-meta-data-rp font-semibold ml-2 text-white'>{neededDate}</span></li>
                            <li className='flex items-center'> Location: <span className='resource-detail-meta-data-rp font-semibold ml-2 text-white'>{resource.city}</span></li>
                            <li className='flex items-center'> Host: <span className='resource-detail-meta-data-rp font-semibold ml-2 text-white'>{resource.hostId?.name || 'N/A'}</span></li>
                        </ul>
                    </div>

                    {/* <div className="resource-detail-page-location-time-data-rp">
                        <h2 className="resource-detail-page-event-details-heading-rp">Event Details</h2>
                        <ul className="space-y-3 text-gray-300">
                            <li className='flex items-center'> Needed By: <span className='resource-detail-meta-data-rp font-semibold ml-2 text-white'>{neededDate}</span></li>
                            <li className='flex items-center'> Location: <span className='resource-detail-meta-data-rp font-semibold ml-2 text-white'>{resource.city}</span></li>
                            <li className='flex items-center'> Host: <span className='resource-detail-meta-data-rp font-semibold ml-2 text-white'>{event.time} ({resource.hostId?.name || '?'} hrs)</span></li>
                        </ul>
                    </div> */}

                    {/* Linked Event Context */}
                    {linkedEvent && (
                        <Link to={`/events/${linkedEvent._id}`} className="block">
                            <div className="resource-detail-page-location-time-data-rp">
                                <h2 className="resource-detail-page-event-details-heading-rp">Linked Event Context</h2>
                                <p className="text-white font-extrabold text-xl line-clamp-1">{linkedEvent.title}</p>
                                <p className={`text-sm mt-1 font-medium ${linkedEvent.isPaid ? 'text-yellow-500' : 'text-green-500'}`}>
                                    {linkedEvent.isPaid ? 'Paid Event' : 'Free Event'}
                                </p>
                            </div>
                        </Link>
                    )}

                    {/* Contact Action Panel (The Primary Goal) */}
                    <div className={`resource-detail-page-location-time-data-rp`}>
                        <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 text-white">Contact Host</h2>
                        
                        <div className='flex items-center justify-center space-x-2'>
                            <Phone className='phone-icon'/>
                            <p className='resource-detail-page-phone-num '>{formattedContact}</p>
                        </div>
                        <p className="text-sm text-gray-400 text-center mt-2">Call the host to offer your resource or volunteer service.</p>
                    </div>

                    {/* Host Management Buttons */}
                    {/* {isHost && !isFulfilled && (
                         <div className="bg-gray-800 p-4 rounded-xl flex space-x-4">
                            <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center">
                                <Edit className='w-5 h-5 mr-2'/> Edit Request
                            </button>
                            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center">
                                <CheckCircle className='w-5 h-5 mr-2'/> Mark Fulfilled
                            </button>
                         </div>
                    )} */}
                </div>
        
        </div>
    );
};

export default ResourceDetailPage;