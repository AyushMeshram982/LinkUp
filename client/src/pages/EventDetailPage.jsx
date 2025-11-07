// import React, { useState, useEffect, useMemo } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { fetchSingleEvent, registerUserForEvent } from '../api/eventApi.js';
// import { useAuth } from '../contexts/AuthContext.jsx';
// import { MapPin, Calendar, Clock, DollarSign, Users, MessageCircle, Heart } from 'lucide-react';
// import { useForm } from 'react-hook-form';
// import CommentForm from '../components/CommentForm.jsx';
// import CommentItem from '../components/CommentItem.jsx';
// import LikeButton from '../components/LikeButton.jsx';

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// const EventDetailPage = () => {
//     // Hooks and Contexts
//     const { id: eventId } = useParams();
//     const navigate = useNavigate();
//     const { isAuthenticated, user } = useAuth();
//     const { register, handleSubmit, formState: { errors } } = useForm({
//         defaultValues: { seats: 1 }
//     });

//     // State Management
//     const [event, setEvent] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [registrationMessage, setRegistrationMessage] = useState('');
//     const [isRegistering, setIsRegistering] = useState(false);

//     // --- Derived State ---
//     const seatsRemaining = useMemo(() => {
//         if (!event) return 0;
//         // event.seatsTaken is provided by the aggregation pipeline
//         return event.totalSeats - (event.seatsTaken || 0);
//     }, [event]);

//     const isSoldOut = seatsRemaining <= 0;
//     const isRegistered = useMemo(() => {
//         if (!event || !isAuthenticated) return false;
//         // Check if the current authenticated user's ID exists in the registeredAttendees list
//         return event.registeredAttendees.some(
//             (attendee) => attendee.userId.toString() === user._id.toString()
//         );
//     }, [event, isAuthenticated, user]);

//     // --- Data Fetching Effect ---
    
//         const loadEvent = async () => {
//             setLoading(true);
//             try {
//                 const response = await fetchSingleEvent(eventId);
//                 setEvent(response.data);
//             } catch (err) {
//                 console.error("Failed to load event details:", err);
//                 setError('Could not load event. It may not exist or the server is unavailable.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//     useEffect(() => {
//         if (eventId) {
//             loadEvent();
//         }
//     }, [eventId]);

//     // Function passed to CommentForm to trigger a refresh
//     const handleCommentSuccess = () => {
//         loadEvent(); // Re-fetch the event data to see the new comment
//     };

//     const handleInteractionSuccess = () => {
//         loadEvent();
//     };

//     // --- Handlers ---
//     const handleRegistration = async (data) => {
//         if (!isAuthenticated) {
//             alert("Please log in to register for an event.");
//             navigate('/login');
//             return;
//         }
        
//         const seatsToRegister = parseInt(data.seats);

//         if (seatsToRegister > seatsRemaining) {
//             return setRegistrationMessage(`Error: Only ${seatsRemaining} seats left.`);
//         }
//         if (isRegistered) {
//             return setRegistrationMessage('You are already registered for this event.');
//         }

//         setIsRegistering(true);
//         setRegistrationMessage('');

//         try {
//             const response = await registerUserForEvent(eventId, seatsToRegister);
//             setRegistrationMessage(response.data.message || 'Registration successful!');
            
//             // Re-fetch event data to update seat count and registration status immediately
//             const updatedResponse = await fetchSingleEvent(eventId);
//             setEvent(updatedResponse.data);

//         } catch (err) {
//             console.error('Registration Error:', err);
//             const apiError = err.response?.data?.error || 'Registration failed due to a server error.';
//             setRegistrationMessage(`Error: ${apiError}`);
//         } finally {
//             setIsRegistering(false);
//         }
//     };

//     // --- Render Logic ---
//     if (loading) {
//         return <div className="text-blue-400 text-center text-xl py-10">Loading event details...</div>;
//     }

//     if (error) {
//         return <div className="text-red-400 text-center text-xl py-10">{error}</div>;
//     }

//     if (!event) return null; // Should not happen if error logic is correct

//     const eventDate = new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
//     const isFree = event.isPaid === false || event.price === 0;
//     const eventPrice = isFree ? 'Free' : `$${(event.price || 0).toFixed(2)}`;
    
//     // Check if the current user is the host
//     const isHost = isAuthenticated && event.hostId._id.toString() === user._id.toString();

//     // Sort comments by date descending (newest first)
//     const sortedComments = event.comments?.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];

//     return (
//         <div className="event-detail-page text-white py-8">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
//                 {/* --- Left Column: Image, Description, Metadata --- */}
//                 <div className="lg:col-span-2">
//                     {/* Event Image */}
//                     <img 
//                         src={`${BACKEND_URL}/${event.imageUrl}`} 
//                         alt={event.title} 
//                         className="w-full h-96 object-cover rounded-xl shadow-2xl mb-6"
//                     />

//                     {/* Title and Host Info */}
//                     <div className="border-b border-gray-700 pb-4 mb-6">
//                         <h1 className="text-5xl font-extrabold text-blue-400 mb-2">{event.title}</h1>
//                         <p className="text-gray-400 text-lg">Hosted by: <span className='font-semibold'>{event.hostId.name}</span></p>
//                     </div>

//                     {/* Description */}
//                     <h2 className="text-2xl font-bold mb-3 text-white border-b border-gray-700 pb-2">About the Event</h2>
//                     <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{event.description || "No detailed description provided."}</p>

//                     {/* Comments Section (Placeholder) */}
//                     <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
//                         <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2 mb-4">
//                             Discussion ({sortedComments.length})
//                         </h3>
                        
//                         {/* Comment Form */}
//                         <CommentForm eventId={eventId} onSuccess={handleCommentSuccess} />

//                         {/* Comment List */}
//                         <div className="mt-6 space-y-4">
//                             {sortedComments.length > 0 ? (
//                                 sortedComments.map((comment, index) => (
//                                     // CRITICAL: Need to use index as key since comment._id might not exist immediately
//                                     <CommentItem key={comment._id || index} comment={comment} /> 
//                                 ))
//                             ) : (
//                                 <p className="text-gray-500 text-center py-4">Be the first to comment!</p>
//                             )}
//                         </div>
//                     </div>
//                 </div>

                
//                 {/* --- Right Column: Booking Panel, Details, Interactions --- */}
//                 <div className="lg:col-span-1 space-y-6">
                    
//                     {/* Booking/Registration Panel */}
//                     <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
//                         <h2 className="text-2xl font-bold mb-4 flex items-center justify-between">
//                             Ticket Details 
//                             <span className={`text-3xl font-extrabold ${isFree ? 'text-green-400' : 'text-yellow-400'}`}>
//                                 {eventPrice}
//                             </span>
//                         </h2>

//                         {/* Availability Bar */}
//                         <div className="mb-4">
//                             <p className="text-gray-400 text-sm mb-1">
//                                 Seats Remaining: <span className='font-bold text-white'>{seatsRemaining} / {event.totalSeats}</span>
//                             </p>
//                             <div className="w-full bg-gray-700 rounded-full h-2.5">
//                                 <div 
//                                     className={`h-2.5 rounded-full ${isSoldOut ? 'bg-red-500' : 'bg-blue-500'}`} 
//                                     style={{ width: `${(1 - seatsRemaining / event.totalSeats) * 100}%` }}
//                                 ></div>
//                             </div>
//                         </div>

//                         {/* Registration Form */}
//                         <form onSubmit={handleSubmit(handleRegistration)} className="space-y-4">
//                             <div className='flex items-center space-x-3'>
//                                 <label htmlFor="seats" className="text-gray-300 font-medium">Seats:</label>
//                                 <input
//                                     type="number"
//                                     id="seats"
//                                     min="1"
//                                     max={seatsRemaining}
//                                     {...register("seats", { 
//                                         required: "Seats required", 
//                                         min: { value: 1, message: "Min 1 seat" },
//                                         max: { value: seatsRemaining, message: `Max ${seatsRemaining} seats` }
//                                     })}
//                                     disabled={isSoldOut || isRegistered || isRegistering}
//                                     className="w-20 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
//                                 />
//                                 <span className='text-red-400 text-xs'>{errors.seats?.message}</span>
//                             </div>

//                             <button
//                                 type="submit"
//                                 disabled={isSoldOut || isRegistered || isRegistering || !isAuthenticated}
//                                 className={`w-full py-3 font-bold rounded-lg transition duration-300 ${
//                                     isRegistered ? 'bg-green-600' :
//                                     isSoldOut ? 'bg-red-800 cursor-not-allowed' :
//                                     'bg-blue-600 hover:bg-blue-700'
//                                 }`}
//                             >
//                                 {isRegistering ? 'Processing...' : isRegistered ? 'REGISTERED' : isSoldOut ? 'SOLD OUT' : 'REGISTER NOW'}
//                             </button>
//                             {registrationMessage && <p className={`text-center text-sm ${registrationMessage.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>{registrationMessage}</p>}
//                             {!isAuthenticated && <p className="text-center text-sm text-yellow-500 mt-2">Log in to register.</p>}
//                             {isHost && <Link to={`/host/dashboard/${eventId}`} className="block text-center text-sm text-purple-400 hover:underline mt-2">Go to Host Dashboard</Link>}
//                         </form>
//                     </div>

//                     {/* Event Metadata Card */}
//                     <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
//                         <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Event Details</h2>
//                         <ul className="space-y-3 text-gray-300">
//                             <li className='flex items-center'><MapPin className='w-5 h-5 mr-3 text-red-400'/> Location: <span className='font-semibold ml-2 text-white'>{event.address}, {event.city}</span></li>
//                             <li className='flex items-center'><Calendar className='w-5 h-5 mr-3 text-yellow-400'/> Date: <span className='font-semibold ml-2 text-white'>{eventDate}</span></li>
//                             <li className='flex items-center'><Clock className='w-5 h-5 mr-3 text-blue-400'/> Time: <span className='font-semibold ml-2 text-white'>{event.time} ({event.hours || '?'} hrs)</span></li>
//                         </ul>
//                     </div>
                    
//                     {/* Interaction Summary */}
//                     <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex justify-around">
//                         {/* Use LikeButton component here */}
//                         <LikeButton event={event} onLikeToggle={handleInteractionSuccess} />
//                         <span className="flex items-center text-gray-400"><MessageCircle className='w-5 h-5 mr-2 text-yellow-500'/> {event.comments?.length || 0} Comments</span>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EventDetailPage;

//-------------------------------------------------------------------------------------

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchSingleEvent, registerUserForEvent } from '../api/eventApi.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { MapPin, Calendar, Clock, DollarSign, Users, MessageCircle, Heart } from 'lucide-react';
import { useForm } from 'react-hook-form';
import CommentForm from '../components/CommentForm.jsx';
import CommentItem from '../components/CommentItem.jsx';
import LikeButton from '../components/LikeButton.jsx';

import "../styles/EventDetailPage.css"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const EventDetailPage = () => {
    // Hooks and Contexts
    const { id: eventId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { seats: 1 }
    });

    // State Management
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registrationMessage, setRegistrationMessage] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    // --- Derived State ---
    const seatsRemaining = useMemo(() => {
        if (!event) return 0;
        // event.seatsTaken is provided by the aggregation pipeline
        return event.totalSeats - (event.seatsTaken || 0);
    }, [event]);

    const isSoldOut = seatsRemaining <= 0;
    const isRegistered = useMemo(() => {
        if (!event || !isAuthenticated) return false;
        // Check if the current authenticated user's ID exists in the registeredAttendees list
        return event.registeredAttendees.some(
            (attendee) => attendee.userId.toString() === user._id.toString()
        );
    }, [event, isAuthenticated, user]);

    // --- Data Fetching Effect ---
    
        const loadEvent = async () => {
            setLoading(true);
            try {
                const response = await fetchSingleEvent(eventId);
                setEvent(response.data);
            } catch (err) {
                console.error("Failed to load event details:", err);
                setError('Could not load event. It may not exist or the server is unavailable.');
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        if (eventId) {
            loadEvent();
        }
    }, [eventId]);

    // Function passed to CommentForm to trigger a refresh
    const handleCommentSuccess = () => {
        loadEvent(); // Re-fetch the event data to see the new comment
    };

    const handleInteractionSuccess = () => {
        loadEvent();
    };

    // --- Handlers ---
    const handleRegistration = async (data) => {
        if (!isAuthenticated) {
            alert("Please log in to register for an event.");
            navigate('/login');
            return;
        }
        
        const seatsToRegister = parseInt(data.seats);

        if (seatsToRegister > seatsRemaining) {
            return setRegistrationMessage(`Error: Only ${seatsRemaining} seats left.`);
        }
        if (isRegistered) {
            return setRegistrationMessage('You are already registered for this event.');
        }

        setIsRegistering(true);
        setRegistrationMessage('');

        try {
            const response = await registerUserForEvent(eventId, seatsToRegister);
            setRegistrationMessage(response.data.message || 'Registration successful!');
            
            // Re-fetch event data to update seat count and registration status immediately
            const updatedResponse = await fetchSingleEvent(eventId);
            setEvent(updatedResponse.data);

        } catch (err) {
            console.error('Registration Error:', err);
            const apiError = err.response?.data?.error || 'Registration failed due to a server error.';
            setRegistrationMessage(`Error: ${apiError}`);
        } finally {
            setIsRegistering(false);
        }
    };

    // --- Render Logic ---
    if (loading) {
        return <div className="text-blue-400 text-center text-xl py-10">Loading event details...</div>;
    }

    if (error) {
        return <div className="text-red-400 text-center text-xl py-10">{error}</div>;
    }

    if (!event) return null; // Should not happen if error logic is correct

    const eventDate = new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const isFree = event.isPaid === false || event.price === 0;
    const eventPrice = isFree ? 'Free' : `$${(event.price || 0).toFixed(2)}`;
    
    // Check if the current user is the host
    const isHost = isAuthenticated && event.hostId._id.toString() === user._id.toString();

    // Sort comments by date descending (newest first)
    const sortedComments = event.comments?.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];

    return (
        <div className="event-detail-page-ep">
           
                
                {/* --- Left Column: Image, Description, Metadata --- */}
                <div className="left-interaction-ep">
                    {/* Event Image */}
                    <img 
                        src={`${BACKEND_URL}/${event.imageUrl}`} 
                        alt={event.title} 
                        className="event-detail-page-image-ep"
                    />

                    {/* Title and Host Info */}
                    <div className="event-detail-page-title-host-container-ep">
                        <h1 className="event-detail-page-title-ep">{event.title}</h1>
                        <p className="event-detail-page-host-ep">Hosted by: <span className='font-semibold'>{event.hostId.name}</span></p>
                    </div>

                    {/* Description */}
                    <h2 className="event-detail-page-description-heading-ep">About the Event</h2>
                    <p className="event-detail-page-description-ep">{event.description || "No detailed description provided."}</p>

                    {/* Comments Section (Placeholder) */}
                    <div className="event-detail-page-discussion-container-ep">
                        <h3 className="event-detail-page-discussion-heading-ep">
                            Discussion ({sortedComments.length})
                        </h3>
                        
                        {/* Comment Form */}
                        <CommentForm eventId={eventId} onSuccess={handleCommentSuccess} />

                        {/* Comment List */}
                        <div className="event-detail-page-comment-list-ep">
                            {sortedComments.length > 0 ? (
                                sortedComments.map((comment, index) => (
                                    // CRITICAL: Need to use index as key since comment._id might not exist immediately
                                    <div className="each-event-detail-page-comment-ep">
                                        <CommentItem key={comment._id || index} comment={comment} /> 
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">Be the first to comment!</p>
                            )}
                        </div>
                    </div>
                </div>

                
                {/* --- Right Column: Booking Panel, Details, Interactions --- */}
                <div className="right-interaction-ep">
                    
                    {/* Booking/Registration Panel */}
                    <div className="event-detail-page-ticket-details-ep">
                        <h2 className="event-detail-page-ticket-heading-ep">
                            <span>Ticket Details </span>
                            <span className={`eventprice`}>
                                {eventPrice}
                            </span>
                            {/* <span className={`text-3xl font-extrabold ${isFree ? 'text-green-400' : 'text-yellow-400'}`}>
                                {eventPrice}
                            </span> */}
                        </h2>

                        {/* Availability Bar */}
                        <div className="event-details-page-availibility-bar-ep">
                            <p className="text-gray-400 text-sm mb-1">
                                Seats Remaining: <span className='font-bold text-white'>{seatsRemaining} / {event.totalSeats}</span>
                            </p>
                            <div className="event-detail-page-availibility-ep w-full bg-gray-700 rounded-full h-2.5">
                                <div 
                                    className={`h-2.5 rounded-full ${isSoldOut ? 'bg-red-500' : 'bg-blue-500'}`} 
                                    style={{ width: `${(1 - seatsRemaining / event.totalSeats) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Registration Form */}
                        <form onSubmit={handleSubmit(handleRegistration)} className="space-y-4">
                            <div className='flex items-center space-x-3'>
                                <label htmlFor="seats" className="text-gray-300 font-medium">Seats:</label>
                                <input
                                    type="number"
                                    id="seats"
                                    min="1"
                                    max={seatsRemaining}
                                    {...register("seats", { 
                                        required: "Seats required", 
                                        min: { value: 1, message: "Min 1 seat" },
                                        max: { value: seatsRemaining, message: `Max ${seatsRemaining} seats` }
                                    })}
                                    disabled={isSoldOut || isRegistered || isRegistering}
                                    className="event-detail-page-seats-changing-ep w-20 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
                                />
                                <span className='text-red-400 text-xs'>{errors.seats?.message}</span>
                            </div>

                            <button
                                type="submit"
                                disabled={isSoldOut || isRegistered || isRegistering || !isAuthenticated}
                                className={`event-detail-page-registration-button-ep w-full py-3 font-bold rounded-lg transition duration-300 ${
                                    isRegistered ? 'bg-green-600' :
                                    isSoldOut ? 'bg-red-800 cursor-not-allowed' :
                                    'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {isRegistering ? 'Processing...' : isRegistered ? 'REGISTERED' : isSoldOut ? 'SOLD OUT' : 'REGISTER NOW'}
                            </button>
                            {registrationMessage && <p className={`text-center text-sm ${registrationMessage.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>{registrationMessage}</p>}
                            {!isAuthenticated && <p className="text-center text-sm text-yellow-500 mt-2">Log in to register.</p>}
                            {isHost && <Link to={`/host/dashboard/${eventId}`} className="event-detail-page-host-dashboard-button-ep block text-center text-sm text-purple-400 hover:underline mt-2">Go to Host Dashboard</Link>}
                        </form>
                    </div>

                    {/* Event Metadata Card */}
                    <div className="event-detail-page-location-time-data-ep">
                        <h2 className="event-detail-page-event-details-heading-ep">Event Details</h2>
                        <ul className="space-y-3 text-gray-300">
                            <li className='flex items-center'> Location: <span className='event-detail-meta-data-ep font-semibold ml-2 text-white'>{event.address}, {event.city}</span></li>
                            <li className='flex items-center'> Date: <span className='event-detail-meta-data-ep font-semibold ml-2 text-white'>{eventDate}</span></li>
                            <li className='flex items-center'> Time: <span className='event-detail-meta-data-ep font-semibold ml-2 text-white'>{event.time} ({event.hours || '?'} hrs)</span></li>
                        </ul>
                    </div>
                    
                    {/* Interaction Summary */}
                    <div className="event-details-page-like-share-ep">
                        {/* Use LikeButton component here */}
                        <LikeButton event={event} onLikeToggle={handleInteractionSuccess} />
                        <span className="flex items-center text-gray-400"><MessageCircle className='w-5 h-5 mr-2 text-yellow-500'/> {event.comments?.length || 0} Comments</span>
                    </div>

                </div>
        </div>
    );
};

export default EventDetailPage;