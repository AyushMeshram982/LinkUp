// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { useAuth } from '../contexts/AuthContext.jsx';
// // We need to create the createEvent API service function (not yet created)
// import { createEvent } from '../api/eventApi.js'; 
// import { PlusCircle, MapPin, DollarSign, Clock, Users } from 'lucide-react'; 

// // NOTE: Since the registration process uses signup, we need the createEvent logic in eventApi.js

// const CreateEventPage = () => {
//     // Hooks and Context
//     const { isAuthenticated, user } = useAuth();
//     const navigate = useNavigate();
    
//     // Redirect unauthenticated users
//     useEffect(() => {
//         if (!isAuthenticated) {
//             alert("You must be logged in to host an event.");
//             navigate('/login');
//         }
//     }, [isAuthenticated, navigate]);

//     // React Hook Form Setup
//     const { 
//         register, 
//         handleSubmit, 
//         watch, 
//         formState: { errors } 
//     } = useForm({
//         defaultValues: {
//             title: '',
//             description: '',
//             city: user?.city || 'Indore', // Default to user's city
//             address: '',
//             keywords: '',
//             date: '',
//             time: '',
//             totalSeats: 50,
//             isPaid: 'false', // Default to free (string value for form)
//             price: 0,
//             hours: 1,
//             eventImage: null,
//         }
//     });

//     const isPaid = watch('isPaid'); // Watch the radio button state
//     const [submitError, setSubmitError] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     // --- Handlers ---

//     const onSubmit = async (data) => {
//         setSubmitError('');
//         setIsSubmitting(true);

//         try {
//             // 1. Prepare data for 'multipart/form-data' upload
//             const formData = new FormData();
            
//             // Append required text fields
//             formData.append('title', data.title);
//             formData.append('description', data.description);
//             formData.append('city', data.city);
//             formData.append('address', data.address);
//             formData.append('date', data.date);
//             formData.append('time', data.time);
//             formData.append('totalSeats', data.totalSeats);
//             formData.append('isPaid', data.isPaid);
            
//             // Append optional fields
//             if (data.keywords) formData.append('keywords', data.keywords);
//             if (data.price > 0) formData.append('price', data.price);
//             if (data.hours) formData.append('hours', data.hours);
            
//             // Append file (Multer expects 'eventImage' key)
//             if (data.eventImage && data.eventImage.length > 0) {
//                 formData.append('eventImage', data.eventImage[0]);
//             } else {
//                 return setSubmitError('Event image is required.');
//             }

//             // 2. Call the API (Assuming a createEvent service is added to eventApi.js)
//             const response = await createEvent(formData);
            
//             // Placeholder for API Call:
//             // const response = await new Promise(resolve => setTimeout(() => resolve({data: { _id: 'test_id'}}), 1000));
//             console.log('Event Created:', response.data);

//             // 3. Success: Redirect to the newly created event's detail page or dashboard
//             navigate(`/host/dashboard`);

//         } catch (err) {
//             console.error('Create Event Error:', err);
//             const apiError = err.response?.data?.error || 'Failed to create event. Check server logs.';
//             setSubmitError(apiError);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (!isAuthenticated && !user) {
//         return null; // Let useEffect handle redirect
//     }

//     return (
//         <div className="flex flex-col items-center py-10 bg-gray-900">
//             {/* <h1 className="text-4xl font-extrabold mb-8 text-blue-400 flex items-center">
//                 <PlusCircle className="w-8 h-8 mr-3"/> Host a New Event
//             </h1> */}
            
//             <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full border border-gray-700 space-y-6">
                
//                 {submitError && <p className="text-red-400 mb-4 p-3 bg-red-900/30 rounded-lg font-medium">{submitError}</p>}

//                 {/* Event Image Upload */}
//                 <div className="border border-gray-700 p-4 rounded-lg">
//                     <label className="block text-gray-300 text-lg font-semibold mb-2" htmlFor="eventImage">Event Image (Required)</label>
//                     <input 
//                         type="file" 
//                         id="eventImage" 
//                         accept="image/*" 
//                         {...register("eventImage", { required: "Event image is required" })}
//                         className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition duration-200"
//                     />
//                     {errors.eventImage && <p className="mt-1 text-xs text-red-500">{errors.eventImage.message}</p>}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
//                     {/* Event Title */}
//                     <div>
//                         <label className="form-label" htmlFor="title">Title <span className="text-red-400">*</span></label>
//                         <input type="text" id="title" {...register("title", { required: "Title is required" })} className="form-input" />
//                         {errors.title && <p className="input-error">{errors.title.message}</p>}
//                     </div>
                    
//                     {/* Total Seats */}
//                     <div>
//                         <label className="form-label" htmlFor="totalSeats">Total Seats <span className="text-red-400">*</span></label>
//                         <div className='relative'>
//                              <input type="number" id="totalSeats" min="1" {...register("totalSeats", { 
//                                 required: "Total seats is required", 
//                                 valueAsNumber: true,
//                                 min: { value: 1, message: "Must be at least 1 seat" }
//                              })} className="form-input pl-10" />
//                             <Users className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500' />
//                         </div>
//                         {errors.totalSeats && <p className="input-error">{errors.totalSeats.message}</p>}
//                     </div>

//                     {/* Date and Time (Side-by-side) */}
//                     <div>
//                         <label className="form-label" htmlFor="date">Date <span className="text-red-400">*</span></label>
//                         <input type="date" id="date" {...register("date", { required: "Date is required" })} className="form-input" />
//                         {errors.date && <p className="input-error">{errors.date.message}</p>}
//                     </div>

//                     <div>
//                         <label className="form-label" htmlFor="time">Time <span className="text-red-400">*</span></label>
//                         <input type="time" id="time" {...register("time", { required: "Time is required" })} className="form-input" />
//                         {errors.time && <p className="input-error">{errors.time.message}</p>}
//                     </div>

//                     {/* City (Non-editable, taken from user profile) */}
//                     <div>
//                         <label className="form-label" htmlFor="city">City (Location) <span className="text-red-400">*</span></label>
//                         <div className='relative'>
//                             <input 
//                                 type="text" 
//                                 id="city" 
//                                 {...register("city", { required: "City is required" })} 
//                                 defaultValue={user?.city}
//                                 readOnly
//                                 className="form-input read-only-input bg-gray-700/50 cursor-not-allowed pl-10" 
//                             />
//                             <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500' />
//                         </div>
//                         {errors.city && <p className="input-error">{errors.city.message}</p>}
//                     </div>
                    
//                     {/* Address/Venue */}
//                     <div>
//                         <label className="form-label" htmlFor="address">Venue Address <span className="text-red-400">*</span></label>
//                         <input type="text" id="address" {...register("address", { required: "Venue address is required" })} className="form-input" />
//                         {errors.address && <p className="input-error">{errors.address.message}</p>}
//                     </div>
//                 </div>

//                 {/* Description and Keywords */}
//                 <div className="space-y-6">
//                     <div>
//                         <label className="form-label" htmlFor="description">Description</label>
//                         <textarea id="description" rows="4" {...register("description")} className="form-input resize-none" placeholder="Provide a detailed description of your event..."></textarea>
//                     </div>
//                     <div>
//                         <label className="form-label" htmlFor="keywords">Keywords (comma separated)</label>
//                         <input type="text" id="keywords" {...register("keywords")} className="form-input" placeholder="e.g., standup, comedy, local talent" />
//                     </div>
                    
//                     {/* Duration (Hours) */}
//                     <div>
//                         <label className="form-label" htmlFor="hours">Duration (Hours)</label>
//                         <div className='relative'>
//                             <input type="number" id="hours" step="0.5" {...register("hours", { valueAsNumber: true })} className="form-input pl-10" placeholder="e.g., 2.5" />
//                             <Clock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500' />
//                         </div>
//                         {errors.hours && <p className="input-error">{errors.hours.message}</p>}
//                     </div>
//                 </div>

//                 {/* Payment Options (IsPaid and Price) */}
//                 <div className="border border-gray-700 p-4 rounded-lg space-y-4">
//                     <h3 className="text-xl font-bold flex items-center text-yellow-400"><DollarSign className="w-6 h-6 mr-2" /> Pricing</h3>

//                     {/* Radio Buttons for IsPaid */}
//                     <div className="flex space-x-6">
//                         <label className="flex items-center text-gray-300">
//                             <input 
//                                 type="radio" 
//                                 value="false" 
//                                 {...register("isPaid")} 
//                                 className="mr-2"
//                             />
//                             Free Event
//                         </label>
//                         <label className="flex items-center text-gray-300">
//                             <input 
//                                 type="radio" 
//                                 value="true" 
//                                 {...register("isPaid")} 
//                                 className="mr-2"
//                             />
//                             Paid Event
//                         </label>
//                     </div>

//                     {/* Price Input (Conditional Validation) */}
//                     {isPaid === 'true' && (
//                         <div>
//                             <label className="form-label" htmlFor="price">Price (per seat) <span className="text-red-400">*</span></label>
//                             <input 
//                                 type="number" 
//                                 id="price" 
//                                 step="0.01" 
//                                 {...register("price", { 
//                                     valueAsNumber: true,
//                                     required: isPaid === 'true' ? "Price is required for paid events" : false,
//                                     min: { value: 0.01, message: "Price must be greater than 0" }
//                                 })} 
//                                 className="form-input" 
//                             />
//                             {errors.price && <p className="input-error">{errors.price.message}</p>}
//                         </div>
//                     )}
//                 </div>

//                 {/* Submit Button */}
//                 <button 
//                     type="submit" 
//                     disabled={isSubmitting}
//                     className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 flex items-center justify-center"
//                 >
//                     {isSubmitting ? 'Posting Event...' : 'Post Event & Generate QR'}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default CreateEventPage;

//--------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext.jsx';
// We need to create the createEvent API service function (not yet created)
import { createEvent } from '../api/eventApi.js'; 
import { PlusCircle, MapPin, DollarSign, Clock, Users } from 'lucide-react'; 
import "../styles/CreateEventPage.css"

// NOTE: Since the registration process uses signup, we need the createEvent logic in eventApi.js

const CreateEventPage = () => {
    // Hooks and Context
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    
    // Redirect unauthenticated users
    useEffect(() => {
        if (!isAuthenticated) {
            alert("You must be logged in to host an event.");
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // React Hook Form Setup
    const { 
        register, 
        handleSubmit, 
        watch, 
        formState: { errors } 
    } = useForm({
        defaultValues: {
            title: '',
            description: '',
            city: user?.city || 'Indore', // Default to user's city
            address: '',
            keywords: '',
            date: '',
            time: '',
            totalSeats: 50,
            isPaid: 'false', // Default to free (string value for form)
            price: 0,
            hours: 1,
            eventImage: null,
        }
    });

    const isPaid = watch('isPaid'); // Watch the radio button state
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Handlers ---

    const onSubmit = async (data) => {
        setSubmitError('');
        setIsSubmitting(true);

        try {
            // 1. Prepare data for 'multipart/form-data' upload
            const formData = new FormData();
            
            // Append required text fields
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('city', data.city);
            formData.append('address', data.address);
            formData.append('date', data.date);
            formData.append('time', data.time);
            formData.append('totalSeats', data.totalSeats);
            formData.append('isPaid', data.isPaid);
            
            // Append optional fields
            if (data.keywords) formData.append('keywords', data.keywords);
            if (data.price > 0) formData.append('price', data.price);
            if (data.hours) formData.append('hours', data.hours);
            
            // Append file (Multer expects 'eventImage' key)
            if (data.eventImage && data.eventImage.length > 0) {
                formData.append('eventImage', data.eventImage[0]);
            } else {
                return setSubmitError('Event image is required.');
            }

            // 2. Call the API (Assuming a createEvent service is added to eventApi.js)
            const response = await createEvent(formData);
            
            // Placeholder for API Call:
            // const response = await new Promise(resolve => setTimeout(() => resolve({data: { _id: 'test_id'}}), 1000));
            console.log('Event Created:', response.data);

            // 3. Success: Redirect to the newly created event's detail page or dashboard
            navigate(`/host/dashboard`);

        } catch (err) {
            console.error('Create Event Error:', err);
            const apiError = err.response?.data?.error || 'Failed to create event. Check server logs.';
            setSubmitError(apiError);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated && !user) {
        return null; // Let useEffect handle redirect
    }

    return (
        <div className="create-event-page-cp">
            {/* <h1 className="text-4xl font-extrabold mb-8 text-blue-400 flex items-center">
                <PlusCircle className="w-8 h-8 mr-3"/> Host a New Event
            </h1> */}
            <h3 className='create-the-event-heading-cp'>Create The Event</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="create-event-form-cp">
                
                {submitError && <p className="text-red-400 mb-4 p-3 bg-red-900/30 rounded-lg font-medium">{submitError}</p>}

                {/* Event Image Upload */}
                {/* <div className="border border-gray-700 p-4 rounded-lg"> */}
                <div className="create-event-image-upload">
                    <label className="block text-gray-300 text-lg font-semibold mb-2" htmlFor="eventImage">Event Image (Required)</label>
                    <input 
                        type="file" 
                        id="eventImage" 
                        accept="image/*" 
                        {...register("eventImage", { required: "Event image is required" })}
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition duration-200"
                    />
                    {errors.eventImage && <p className="mt-1 text-xs text-red-500">{errors.eventImage.message}</p>}
                </div>

                <div className="create-event-form-title-details-cp">
                    
                    {/* Event Title */}
                    <div>
                        <label className="form-label" htmlFor="title">Title <span className="text-red-400">*</span></label>
                        <input type="text" id="title" {...register("title", { required: "Title is required" })} className="form-input form-detail-input" />
                        {errors.title && <p className="input-error">{errors.title.message}</p>}
                    </div>
                    
                    {/* Total Seats */}
                    <div>
                        <label className="form-label" htmlFor="totalSeats">Total Seats <span className="text-red-400">*</span></label>
                        <div className='relative'>
                             <input type="number" id="totalSeats" min="1" {...register("totalSeats", { 
                                required: "Total seats is required", 
                                valueAsNumber: true,
                                min: { value: 1, message: "Must be at least 1 seat" }
                             })} className="form-detail-input form-input pl-10" />
                            
                        </div>
                        {errors.totalSeats && <p className="input-error">{errors.totalSeats.message}</p>}
                    </div>

                    {/* Date and Time (Side-by-side) */}
                    <div>
                        <label className="form-label" htmlFor="date">Date <span className="text-red-400">*</span></label>
                        <input type="date" id="date" {...register("date", { required: "Date is required" })} className="form-input form-detail-input" />
                        {errors.date && <p className="input-error">{errors.date.message}</p>}
                    </div>

                    <div>
                        <label className="form-label" htmlFor="time">Time <span className="text-red-400">*</span></label>
                        <input type="time" id="time" {...register("time", { required: "Time is required" })} className="form-input form-detail-input" />
                        {errors.time && <p className="input-error">{errors.time.message}</p>}
                    </div>

                    {/* City (Non-editable, taken from user profile) */}
                    <div>
                        <label className="form-label" htmlFor="city">City (Location) <span className="text-red-400">*</span></label>
                        <div className='relative'>
                            <input 
                                type="text" 
                                id="city" 
                                {...register("city", { required: "City is required" })} 
                                defaultValue={user?.city}
                                readOnly
                                className="form-detail-input form-input read-only-input bg-gray-700/50 cursor-not-allowed pl-10" 
                            />

                        </div>
                        {errors.city && <p className="input-error">{errors.city.message}</p>}
                    </div>
                    
                    {/* Address/Venue */}
                    <div>
                        <label className="form-label" htmlFor="address">Venue Address <span className="text-red-400">*</span></label>
                        <input type="text" id="address" {...register("address", { required: "Venue address is required" })} className="form-input form-detail-input" />
                        {errors.address && <p className="input-error">{errors.address.message}</p>}
                    </div>
                </div>

                {/* Description and Keywords */}
                <div className="create-event-page-description-keywords-duration-cp">
                    <div className='create-event-page-description'>
                        <label className="form-label" htmlFor="description">Description</label>
                        <textarea id="description" rows="" {...register("description")} className="form-input form-detail-input form-detail-input-description-box resize-none" placeholder="Description..."></textarea>
                    </div>
                    <div>
                        <label className="form-label" htmlFor="keywords">Keywords (comma separated)</label>
                        <input type="text" id="keywords" {...register("keywords")} className="form-input form-detail-input" placeholder="keywords" />
                    </div>
                    
                    {/* Duration (Hours) */}
                    <div>
                        <label className="form-label" htmlFor="hours">Duration (Hours)</label>
                        <div className='relative'>
                            <input type="number" id="hours" step="0.5" {...register("hours", { valueAsNumber: true })} className="form-input form-detail-input pl-10" placeholder="e.g., 2.5" />
                            <Clock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500' />
                        </div>
                        {errors.hours && <p className="input-error">{errors.hours.message}</p>}
                    </div>
                </div>

                {/* Payment Options (IsPaid and Price) */}
                <div className="border border-gray-700 p-4 rounded-lg space-y-4">
                    <h3 className="text-xl font-bold flex items-center text-yellow-400"><DollarSign className="w-6 h-6 mr-2" /> Pricing</h3>

                    {/* Radio Buttons for IsPaid */}
                    <div className="flex space-x-6">
                        <label className="flex items-center text-gray-300">
                            <input 
                                type="radio" 
                                value="false" 
                                {...register("isPaid")} 
                                className="mr-2"
                            />
                            Free Event
                        </label>
                        <label className="flex items-center text-gray-300">
                            <input 
                                type="radio" 
                                value="true" 
                                {...register("isPaid")} 
                                className="mr-2"
                            />
                            Paid Event
                        </label>
                    </div>

                    {/* Price Input (Conditional Validation) */}
                    {isPaid === 'true' && (
                        <div>
                            <label className="form-label" htmlFor="price">Price (per seat) <span className="text-red-400">*</span></label>
                            <input 
                                type="number" 
                                id="price" 
                                step="0.01" 
                                {...register("price", { 
                                    valueAsNumber: true,
                                    required: isPaid === 'true' ? "Price is required for paid events" : false,
                                    min: { value: 0.01, message: "Price must be greater than 0" }
                                })} 
                                className="form-input" 
                            />
                            {errors.price && <p className="input-error">{errors.price.message}</p>}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 flex items-center justify-center"
                >
                    {isSubmitting ? 'Posting Event...' : 'Post Event & Generate QR'}
                </button>
            </form>
        </div>
    );
};

export default CreateEventPage;