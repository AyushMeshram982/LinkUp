// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { useAuth } from '../contexts/AuthContext.jsx';
// import { postResource } from '../api/resourceApi.js'; 
// import { fetchHostedEvents } from '../api/userApi.js'; // To get host's event list
// import { Zap, Calendar, Phone, Link, MapPin } from 'lucide-react'; 

// const PostResourcePage = () => {
//     // Hooks and Context
//     const { isAuthenticated, user, loading: authLoading } = useAuth();
//     const navigate = useNavigate();
    
//     // State
//     const [hostedEvents, setHostedEvents] = useState([]);
//     const [eventsLoading, setEventsLoading] = useState(true);
//     const [submitError, setSubmitError] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     // React Hook Form Setup
//     const { 
//         register, 
//         handleSubmit, 
//         formState: { errors } 
//     } = useForm({
//         defaultValues: {
//             title: '',
//             description: '',
//             contactNumber: '',
//             neededDate: '',
//             linkedEventId: '',
//             resourceImage: null,
//         }
//     });

//     // --- Data Fetching: Load Host's Events for Dropdown ---
//     useEffect(() => {
//         if (!authLoading && !isAuthenticated) {
//             alert("You must be logged in to post a resource request.");
//             navigate('/login');
//             return;
//         }

//         const loadHostedEvents = async () => {
//             if (!user) return;
//             setEventsLoading(true);
//             try {
//                 // Use the dedicated endpoint to get all events hosted by the user
//                 const response = await fetchHostedEvents(); 
                
//                 // Filter to only show UPCOMING active events
//                 const upcomingEvents = response.data.filter(e => new Date(e.date) >= new Date() && e.isCancelled === false);
//                 setHostedEvents(upcomingEvents);
//             } catch (err) {
//                 console.error("Failed to load hosted events for resource linking:", err);
//             } finally {
//                 setEventsLoading(false);
//             }
//         };

//         if (isAuthenticated) {
//             loadHostedEvents();
//         }
//     }, [authLoading, isAuthenticated, navigate, user]);

//     // --- Handlers ---

//     const onSubmit = async (data) => {
//         setSubmitError('');
//         setIsSubmitting(true);

//         try {
//             // 1. Prepare data for 'multipart/form-data' upload
//             const formData = new FormData();
            
//             // Append all fields
//             formData.append('title', data.title);
//             formData.append('description', data.description);
//             formData.append('contactNumber', data.contactNumber);
//             formData.append('neededDate', data.neededDate);
//             formData.append('linkedEventId', data.linkedEventId);
            
//             // Append file (Multer expects 'resourceImage' key)
//             if (data.resourceImage && data.resourceImage.length > 0) {
//                 formData.append('resourceImage', data.resourceImage[0]);
//             } else {
//                 return setSubmitError('Resource image is required.');
//             }

//             // 2. Call the API
//             const response = await postResource(formData);
            
//             // 3. Success: Redirect to the Resources feed or the new resource's detail page
//             navigate(`/resources/${response.data._id}`);

//         } catch (err) {
//             console.error('Post Resource Error:', err);
//             const apiError = err.response?.data?.error || 'Failed to post resource request.';
//             setSubmitError(apiError);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (eventsLoading || authLoading || !isAuthenticated) {
//         return <div className="text-blue-400 text-center text-xl py-10">Loading Host Data...</div>;
//     }
    
//     if (hostedEvents.length === 0) {
//         return (
//             <div className="text-white text-center py-20">
//                 <h2 className="text-2xl font-bold mb-4">No Upcoming Events</h2>
//                 <p className="text-gray-400 mb-6">You must have an upcoming active event to post a resource request.</p>
//                 <Link to="/create-event" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition">
//                     Post a New Event First
//                 </Link>
//             </div>
//         );
//     }


//     return (
//         <div className="flex flex-col items-center py-10 bg-gray-900">
//             <h1 className="text-4xl font-extrabold mb-8 text-yellow-400 flex items-center">
//                 <Zap className="w-8 h-8 mr-3"/> Post a Resource Request
//             </h1>
            
//             <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full border border-gray-700 space-y-6">
                
//                 {submitError && <p className="text-red-400 mb-4 p-3 bg-red-900/30 rounded-lg font-medium">{submitError}</p>}

//                 {/* Resource Image Upload */}
//                 <div className="border border-gray-700 p-4 rounded-lg">
//                     <label className="block text-gray-300 text-lg font-semibold mb-2" htmlFor="resourceImage">Resource Image (Required)</label>
//                     <input 
//                         type="file" 
//                         id="resourceImage" 
//                         accept="image/*" 
//                         {...register("resourceImage", { required: "Resource image is required" })}
//                         className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition duration-200"
//                     />
//                     {errors.resourceImage && <p className="mt-1 text-xs text-red-500">{errors.resourceImage.message}</p>}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
//                     {/* Resource Title */}
//                     <div>
//                         <label className="form-label" htmlFor="title">Item/Volunteer Needed <span className="text-red-400">*</span></label>
//                         <input type="text" id="title" {...register("title", { required: "Title is required" })} className="form-input" placeholder="e.g., Acoustic Guitar, 5 Volunteers" />
//                         {errors.title && <p className="input-error">{errors.title.message}</p>}
//                     </div>
                    
//                     {/* Linked Event ID (Dropdown) */}
//                     <div>
//                         <label className="form-label" htmlFor="linkedEventId">Link to Event <span className="text-red-400">*</span></label>
//                         <div className='relative'>
//                             <select 
//                                 id="linkedEventId" 
//                                 {...register("linkedEventId", { required: "Event linkage is required" })} 
//                                 className="form-input appearance-none pl-10"
//                             >
//                                 <option value="">--- Select Your Upcoming Event ---</option>
//                                 {hostedEvents.map(event => (
//                                     <option key={event._id} value={event._id}>
//                                         {event.title} ({new Date(event.date).toLocaleDateString()})
//                                     </option>
//                                 ))}
//                             </select>
//                             <Link className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500' />
//                         </div>
//                         {errors.linkedEventId && <p className="input-error">{errors.linkedEventId.message}</p>}
//                     </div>
                    
//                     {/* Needed Date */}
//                     <div>
//                         <label className="form-label" htmlFor="neededDate">Needed By Date <span className="text-red-400">*</span></label>
//                         <input type="date" id="neededDate" {...register("neededDate", { required: "Needed Date is required" })} className="form-input" />
//                         {errors.neededDate && <p className="input-error">{errors.neededDate.message}</p>}
//                     </div>

//                     {/* Contact Number */}
//                     <div>
//                         <label className="form-label" htmlFor="contactNumber">Contact Number <span className="text-red-400">*</span></label>
//                         <div className='relative'>
//                             <input 
//                                 type="tel" 
//                                 id="contactNumber" 
//                                 {...register("contactNumber", { 
//                                     required: "Contact number is required",
//                                     pattern: {
//                                         value: /^\d{10}$/,
//                                         message: "Must be a 10-digit number"
//                                     }
//                                 })} 
//                                 className="form-input pl-10" 
//                                 placeholder="e.g., 9876543210"
//                             />
//                             <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500' />
//                         </div>
//                         {errors.contactNumber && <p className="input-error">{errors.contactNumber.message}</p>}
//                     </div>
//                 </div>

//                 {/* Description */}
//                 <div className="space-y-6">
//                     <div>
//                         <label className="form-label" htmlFor="description">Detailed Description of Need</label>
//                         <textarea id="description" rows="4" {...register("description")} className="form-input resize-none" placeholder="Specify requirements, dimensions, or time commitment..."></textarea>
//                     </div>
//                 </div>

//                 {/* Submit Button */}
//                 <button 
//                     type="submit" 
//                     disabled={isSubmitting}
//                     className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 flex items-center justify-center"
//                 >
//                     {isSubmitting ? 'Posting Request...' : 'Post Resource Request'}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default PostResourcePage;

//----------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext.jsx';
import { postResource } from '../api/resourceApi.js'; 
import { fetchHostedEvents } from '../api/userApi.js'; // To get host's event list
import { Zap, Calendar, Phone, Link, MapPin } from 'lucide-react'; 
import "../styles/PostResourcePage.css"

const PostResourcePage = () => {
    // Hooks and Context
    const { isAuthenticated, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    
    // State
    const [hostedEvents, setHostedEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // React Hook Form Setup
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm({
        defaultValues: {
            title: '',
            description: '',
            contactNumber: '',
            neededDate: '',
            linkedEventId: '',
            resourceImage: null,
        }
    });

    // --- Data Fetching: Load Host's Events for Dropdown ---
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            alert("You must be logged in to post a resource request.");
            navigate('/login');
            return;
        }

        const loadHostedEvents = async () => {
            if (!user) return;
            setEventsLoading(true);
            try {
                // Use the dedicated endpoint to get all events hosted by the user
                const response = await fetchHostedEvents(); 
                
                // Filter to only show UPCOMING active events
                const upcomingEvents = response.data.filter(e => new Date(e.date) >= new Date() && e.isCancelled === false);
                setHostedEvents(upcomingEvents);
            } catch (err) {
                console.error("Failed to load hosted events for resource linking:", err);
            } finally {
                setEventsLoading(false);
            }
        };

        if (isAuthenticated) {
            loadHostedEvents();
        }
    }, [authLoading, isAuthenticated, navigate, user]);

    // --- Handlers ---

    const onSubmit = async (data) => {
        setSubmitError('');
        setIsSubmitting(true);

        try {
            // 1. Prepare data for 'multipart/form-data' upload
            const formData = new FormData();
            
            // Append all fields
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('contactNumber', data.contactNumber);
            formData.append('neededDate', data.neededDate);
            formData.append('linkedEventId', data.linkedEventId);
            
            // Append file (Multer expects 'resourceImage' key)
            if (data.resourceImage && data.resourceImage.length > 0) {
                formData.append('resourceImage', data.resourceImage[0]);
            } else {
                return setSubmitError('Resource image is required.');
            }

            // 2. Call the API
            const response = await postResource(formData);
            
            // 3. Success: Redirect to the Resources feed or the new resource's detail page
            navigate(`/resources/${response.data._id}`);

        } catch (err) {
            console.error('Post Resource Error:', err);
            const apiError = err.response?.data?.error || 'Failed to post resource request.';
            setSubmitError(apiError);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (eventsLoading || authLoading || !isAuthenticated) {
        return <div className="text-blue-400 text-center text-xl py-10">Loading Host Data...</div>;
    }
    
    if (hostedEvents.length === 0) {
        return (
            <div className="text-white text-center py-20">
                <h2 className="text-2xl font-bold mb-4">No Upcoming Events</h2>
                <p className="text-gray-400 mb-6">You must have an upcoming active event to post a resource request.</p>
                <Link to="/create-event" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition">
                    Post a New Event First
                </Link>
            </div>
        );
    }


    return (
        <div className="create-resource-page-rp">
            {/* <h1 className="text-4xl font-extrabold mb-8 text-yellow-400 flex items-center">
                <Zap className="w-8 h-8 mr-3"/> Post a Resource Request
            </h1> */}
            <h3 className='create-the-resource-heading-rp'>Post The Resource</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="create-post-form-rp">
                
                {submitError && <p className="text-red-400 mb-4 p-3 bg-red-900/30 rounded-lg font-medium">{submitError}</p>}

                {/* Resource Image Upload */}
                <div className="border border-gray-700 p-4 rounded-lg">
                    <label className="block text-gray-300 text-lg font-semibold mb-2" htmlFor="resourceImage">Resource Image (Required)</label>
                    <input 
                        type="file" 
                        id="resourceImage" 
                        accept="image/*" 
                        {...register("resourceImage", { required: "Resource image is required" })}
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition duration-200"
                    />
                    {errors.resourceImage && <p className="mt-1 text-xs text-red-500">{errors.resourceImage.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Resource Title */}
                    <div>
                        <label className="form-label" htmlFor="title">Item/Volunteer Needed <span className="text-red-400">*</span></label>
                        <input type="text" id="title" {...register("title", { required: "Title is required" })} className="form-input form-detail-input-rp" placeholder="e.g., Acoustic Guitar, 5 Volunteers" />
                        {errors.title && <p className="input-error">{errors.title.message}</p>}
                    </div>
                    
                    {/* Linked Event ID (Dropdown) */}
                    <div>
                        <label className="form-label" htmlFor="linkedEventId">Link to Event <span className="text-red-400">*</span></label>
                        <div className='relative'>
                            <select 
                                id="linkedEventId" 
                                {...register("linkedEventId", { required: "Event linkage is required" })} 
                                className="form-input appearance-none pl-10"
                            >
                                <option value="">--- Select Your Upcoming Event ---</option>
                                {hostedEvents.map(event => (
                                    <option key={event._id} value={event._id}>
                                        {event.title} ({new Date(event.date).toLocaleDateString()})
                                    </option>
                                ))}
                            </select>
                            <Link className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500' />
                        </div>
                        {errors.linkedEventId && <p className="input-error">{errors.linkedEventId.message}</p>}
                    </div>
                    
                    {/* Needed Date */}
                    <div>
                        <label className="form-label" htmlFor="neededDate">Needed By Date <span className="text-red-400">*</span></label>
                        <input type="date" id="neededDate" {...register("neededDate", { required: "Needed Date is required" })} className="form-input form-detail-input-rp" />
                        {errors.neededDate && <p className="input-error">{errors.neededDate.message}</p>}
                    </div>

                    {/* Contact Number */}
                    <div>
                        <label className="form-label" htmlFor="contactNumber">Contact Number <span className="text-red-400">*</span></label>
                        <div className='relative'>
                            <input 
                                type="tel" 
                                id="contactNumber" 
                                {...register("contactNumber", { 
                                    required: "Contact number is required",
                                    pattern: {
                                        value: /^\d{10}$/,
                                        message: "Must be a 10-digit number"
                                    }
                                })} 
                                className="form-input pl-10 form-detail-input-rp" 
                                placeholder="e.g., 9876543210"
                            />
                            {/* <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500' /> */}
                        </div>
                        {errors.contactNumber && <p className="input-error">{errors.contactNumber.message}</p>}
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-6">
                    <div>
                        <label className="form-label" htmlFor="description">Detailed Description of Need</label>
                        <textarea id="description" rows="" {...register("description")} className="form-input resize-none form-detail-input-rp form-detail-input-rp-description" placeholder="Specify requirements, dimensions, or time commitment..."></textarea>
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 flex items-center justify-center"
                >
                    {isSubmitting ? 'Posting Request...' : 'Post Resource Request'}
                </button>
            </form>
        </div>
    );
};

export default PostResourcePage;