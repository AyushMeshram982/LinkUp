// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Heart, MessageCircle, Share2 } from 'lucide-react'; // Icons
// import LikeButton from './LikeButton.jsx';

// // Placeholder function to derive seats remaining
// const calculateRemainingSeats = (event) => {
//     // We assume 'seatsTaken' is provided by the aggregation in the backend
//     const seatsRemaining = event.totalSeats - (event.seatsTaken || 0); 
//     return seatsRemaining > 0 ? seatsRemaining : 0;
// };

// // Placeholder for the backend server URL where images are hosted
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// const EventCard = ({ event, seatsAvailable}) => {
//     // Derived values
//     const seatsRemaining = calculateRemainingSeats(event);
//     const isSoldOut = seatsRemaining === 0;
//     const isFree = event.isPaid === false;
//     const eventPrice = isFree ? 'Free' : `$${(event.price || 0).toFixed(2)}`;
    
//     // Format date and time for display
//     const eventDate = new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
//     const eventTime = event.time; // Assuming time is stored as "HH:MM" string

//     return ( (seatsAvailable && seatsRemaining > 0 || !seatsAvailable) &&  (
//         <Link to={`/events/${event._id}`}>
//         <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition duration-300 ease-in-out border border-gray-700/50 flex flex-col">
            
//             {/* Image Area (Top 70% - Visual) */}
//             <div className="relative h-48 sm:h-56">
//                 {/* Event Image */}
//                 <img 
//                     src={`${BACKEND_URL}/${event.imageUrl}`} 
//                     // src={`${event.imageUrl}`} 
//                     alt={event.title} 
//                     className="w-full h-full object-cover"
//                 />
                
//                 {/* Availability Badge (Top Right) */}
//                 <span className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full ${
//                     isSoldOut ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
//                 }`}>
//                     {isSoldOut ? 'SOLD OUT' : `${seatsRemaining} Seats Left`}
//                 </span>
                
//                 {/* Cancellation Overlay (if applicable) */}
//                 {event.isCancelled && (
//                     <div className="absolute inset-0 bg-red-900/70 flex items-center justify-center">
//                         <span className="text-white text-xl font-bold">CANCELLED</span>
//                     </div>
//                 )}
//             </div>

//             {/* Content Area (Bottom 30% - Details and Actions) */}
//             <div className="p-4 flex flex-col justify-between flex-grow">
                
//                 {/* Title and Price */}
//                 <Link to={`/events/${event._id}`} className="block">
//                     <h3 className="text-xl font-bold text-white hover:text-blue-400 mb-2 truncate">{event.title}</h3>
//                 </Link>
                
//                 {/* Metadata Row: Date/Time */}
//                 <div className="flex items-center text-sm text-gray-400 mb-3">
//                     <span className="material-symbols-outlined text-base mr-1">calendar_month</span>
//                     <span>{eventDate} at {eventTime}</span>
//                     <span className="ml-3 material-symbols-outlined text-base mr-1">schedule</span>
//                     <span>{event.hours ? `${event.hours} hrs` : 'Duration N/A'}</span>
//                 </div>

//                 {/* Interaction Row: Likes, Comments, Share */}
//                 <div className="flex items-center justify-between border-t border-gray-700 pt-3">
                    
//                     {/* Left: Interactions */}
//                     <div className="flex space-x-4 text-gray-400">
//                         {/* Use the new LikeButton component */}
//                         <LikeButton event={event} /> 
                
//                         {/* Comment and Share buttons remain */}
//                         <Link to={`/events/${event._id}`} className="flex items-center hover:text-yellow-400 transition">
//                             <MessageCircle className="w-5 h-5 mr-1" />
//                             <span>{event.comments.length}</span>
//                         </Link>
//                         <button className="flex items-center hover:text-white transition">
//                             <Share2 className="w-5 h-5" />
//                         </button>
//                     </div>
//                     {/* Right: Register Button */}
//                     <div>
//                         {/* <Link to={`/events/${event._id}`}> */}
//                         <Link to={`/resources`}>
//                             <button
//                                 disabled={isSoldOut || event.isCancelled}
//                                 className={`px-4 py-2 text-sm font-bold rounded-lg transition duration-200 ${
//                                     isSoldOut || event.isCancelled
//                                     ? 'bg-red-800 text-white opacity-70 cursor-not-allowed'
//                                     : 'bg-blue-600 hover:bg-blue-700 text-white'
//                                 }`}
//                                 >
//                                 {isSoldOut ? 'CLOSED' : isFree ? 'REGISTER (FREE)' : `BUY TICKET (${eventPrice})`}
//                             </button>
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </Link>
        
//     ));
// };

// export default EventCard;

//-------------------------------------------------------------------

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2 } from 'lucide-react'; // Icons
import LikeButton from './LikeButton.jsx';
import "../styles/EventCard.css"

// Placeholder function to derive seats remaining
const calculateRemainingSeats = (event) => {
    // We assume 'seatsTaken' is provided by the aggregation in the backend
    const seatsRemaining = event.totalSeats - (event.seatsTaken || 0); 
    return seatsRemaining > 0 ? seatsRemaining : 0;
};

// Placeholder for the backend server URL where images are hosted
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const EventCard = ({ event, seatsAvailable}) => {
    // Derived values
    const seatsRemaining = calculateRemainingSeats(event);
    const isSoldOut = seatsRemaining === 0;
    const isFree = event.isPaid === false;
    const eventPrice = isFree ? 'Free' : `$${(event.price || 0).toFixed(2)}`;
    
    // Format date and time for display
    const eventDate = new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const eventTime = event.time; // Assuming time is stored as "HH:MM" string

    return ( (seatsAvailable && seatsRemaining > 0 || !seatsAvailable) &&  (
        <Link to={`/events/${event._id}`}>
        {/* <div className="event-card-ec  bg-gray-800 rounded-xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition duration-300 ease-in-out border border-gray-700/50 flex flex-col"> */}
        <div className="event-card-ec ">
            
            {/* Image Area (Top 70% - Visual) */}
            {/* <div className="relative h-48 sm:h-56"> */}
            <div className="event-card-image-ec">
                {/* Event Image */}
                <img 
                    src={`${BACKEND_URL}/${event.imageUrl}`} 
                    // src={`${event.imageUrl}`} 
                    alt={event.title} 
                    // className="w-full h-full object-cover"
                    className="event-image"
                />
                
                {/* Availability Badge (Top Right) */}
                {/* <span className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full ${
                    isSoldOut ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                }`}>
                    {isSoldOut ? 'SOLD OUT' : `${seatsRemaining} Seats Left`}
                </span> */}
                <div className={`seats-remain-ec ${
                    // isSoldOut ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                    isSoldOut ? 'seats-not-remain-ec' : 'seats-still-remain-ec'
                }`}>
                    {isSoldOut ? 'SOLD OUT' : `${seatsRemaining} Seats Left`}
                </div>
                
                {/* Cancellation Overlay (if applicable) */}
                {event.isCancelled && (
                    <div className="absolute inset-0 bg-red-900/70 flex items-center justify-center">
                        <span className="text-white text-xl font-bold">CANCELLED</span>
                    </div>
                )}

                {/* Title and Price */}
                <Link to={`/events/${event._id}`} className="block">
                    <h3 className="event-title-ec">{event.title}</h3>
                </Link>

                <Link to={`/events/${event._id}`} className="event-card-comments-ec">
                    <span>{`${event.comments.length} comments`}</span>
                </Link>

                <div>
                    {/* <Link to={`/events/${event._id}`}> */}
                    <Link to={`/resources`}>
                        <button
                            disabled={isSoldOut || event.isCancelled}
                            // className={`px-4 py-2 text-sm font-bold rounded-lg transition duration-200 ${
                            //     isSoldOut || event.isCancelled
                            //         ? 'bg-red-800 text-white opacity-70 cursor-not-allowed'
                            //         : 'bg-blue-600 hover:bg-blue-700 text-white'
                            // }`}
                            className={`register-closed-button-ec`}
                        >
                            {/* {isSoldOut ? 'CLOSED' : isFree ? 'REGISTER (FREE)' : `BUY TICKET (${eventPrice})`} */}
                            {isSoldOut ? 'CLOSED' : 'REGISTER'}
                        </button>
                    </Link>
                </div>
            </div>

               
                
                
            <div className='lower-part-ec'>

                {/* Left: Interactions */}
                <div className="like-share-ec">
                    {/* Use the new LikeButton component */}
                    <LikeButton event={event} /> 
                    {/* share button */}
                    <button className="share-button-ec">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
                
                <div className='date-time-ec'>
                    {/* Metadata Row: Date/Time */}
                    <div className="flex items-center text-sm text-gray-400 mb-3">
                        <span>{eventDate} @ {eventTime}</span>
                    </div>
                </div>
            </div>

        </div>
        
    </Link>
        
    ));
};

export default EventCard;
