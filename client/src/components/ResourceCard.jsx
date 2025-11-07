// import React from 'react';
// import { Zap, Calendar, Phone, MapPin, X } from 'lucide-react';
// import { Link } from 'react-router-dom';

// // Placeholder for the backend server URL where images are hosted
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// const ResourceCard = ({ resource }) => {
//     // Derived values
//     const isUrgent = resource.isStillNeeded && 
//                      new Date(resource.neededDate).getTime() < (new Date().getTime() + 4 * 24 * 60 * 60 * 1000); // Needed in next 4 days
    
//     const isFulfilled = !resource.isStillNeeded;
    
//     // Format date for display
//     const neededDateDisplay = new Date(resource.neededDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
//     // Get linked event title for context
//     const linkedEventTitle = resource.linkedEventId?.title || 'Event Details Loading...';
    
//     // Format contact number (simple example)
//     const formattedContact = resource.contactNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

//     return (
//         <Link to={`/resources/${resource._id}`}>
//         <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700/50 flex flex-col h-full transform hover:scale-[1.01] transition duration-300">
            
//             {/* Image Area (Top) */}
//             <div className="relative h-48">
//                 <img 
//                     src={`${BACKEND_URL}/${resource.resourceImageUrl}`} 
//                     alt={resource.title} 
//                     className="w-full h-full object-cover"
//                 />
                
//                 {/* Status Badge */}
//                 <span className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full flex items-center ${
//                     isFulfilled ? 'bg-red-800 text-white' : 
//                     isUrgent ? 'bg-yellow-500 text-gray-900' : 'bg-green-600 text-white'
//                 }`}>
//                     {isFulfilled ? (
//                         <>
//                             <X className='h-4 w-4 mr-1'/> 
//                             'FULFILLED'
//                         </> 
//                     ): isUrgent ? (
//                         <>
//                             <Zap className='h-4 w-4 mr-1'/> 
//                             'URGENT'
//                         </>
//                     ) : (
//                         'OPEN'
//                     )}
//                 </span>
                
//                 {/* City Tag */}
//                 <span className="absolute bottom-0 right-0 text-xs font-semibold px-3 py-1 bg-black/70 text-gray-200 flex items-center rounded-tl-lg">
//                     <MapPin className="h-4 w-4 mr-1"/> {resource.city}
//                 </span>
//             </div>

//             {/* Content Area (Bottom) */}
//             <div className="p-5 flex flex-col justify-between grow">
                
//                 {/* Title and Context */}
//                 <h3 className="text-xl font-bold text-white mb-1 truncate">{resource.title}</h3>
//                 <p className="text-sm text-gray-400 mb-3 line-clamp-1">
//                     For: <span className='text-blue-400 font-semibold'>{linkedEventTitle}</span>
//                 </p>
                
//                 {/* Metadata */}
//                 <div className="text-sm text-gray-300 mb-4 space-y-1">
//                     <div className='flex items-center'>
//                         <Calendar className="h-4 w-4 mr-2 text-yellow-400"/>
//                         Needed By: <span className='font-semibold ml-1'>{neededDateDisplay}</span>
//                     </div>
//                     <p className="text-xs text-gray-500 line-clamp-2">{resource.description}</p>
//                 </div>

//                 {/* Contact Action */}
//                 <div className="border-t border-gray-700 pt-4">
//                     <a 
//                         href={`tel:${resource.contactNumber}`}
//                         className={`w-full py-3 text-center text-sm font-bold rounded-lg transition duration-200 flex items-center justify-center ${
//                             isFulfilled 
//                                 ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
//                                 : 'bg-green-600 hover:bg-green-700 text-white shadow-md'
//                         }`}
//                         aria-disabled={isFulfilled}
//                         onClick={(e) => { if (isFulfilled) e.preventDefault(); }}
//                     >
//                         <Phone className="h-4 w-4 mr-2"/> 
//                         {isFulfilled ? 'REQUEST FULFILLED' : `CALL HOST: ${formattedContact}`}
//                     </a>
//                 </div>
//             </div>
//         </div>
//         </Link>
//     );
// };

// export default ResourceCard;

//-------------------------------------------------------------------------

import React from 'react';
import { Zap, Calendar, Phone, MapPin, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import "../styles/ResourceCard.css"

// Placeholder for the backend server URL where images are hosted
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const ResourceCard = ({ resource }) => {
    // Derived values
    const isUrgent = resource.isStillNeeded && 
                     new Date(resource.neededDate).getTime() < (new Date().getTime() + 4 * 24 * 60 * 60 * 1000); // Needed in next 4 days
    
    const isFulfilled = !resource.isStillNeeded;
    
    // Format date for display
    const neededDateDisplay = new Date(resource.neededDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Get linked event title for context
    const linkedEventTitle = resource.linkedEventId?.title || 'Event Details Loading...';
    
    // Format contact number (simple example)
    const formattedContact = resource.contactNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

    return (
        <Link to={`/resources/${resource._id}`}>
        <div className="resource-card-rc">
            
            {/* Image Area (Top) */}
            <div className="resource-card-image-rc">
                <img 
                    src={`${BACKEND_URL}/${resource.resourceImageUrl}`} 
                    alt={resource.title} 
                    className="resource-image-rc"
                />
                
                {/* Status Badge */}
                <div className={`open-fulfilled-urgent-rc
                }`}>
                    {isFulfilled ? (
                        'FULFILLED'
                    ): isUrgent ? (
                            'URGENT'
                    ) : (
                        'OPEN'
                    )}
                </div>

                <Link to={`/resources/${resource._id}`} className="block">
                    <h3 className="resource-title-rc">{resource.title}</h3>
                </Link>
            </div>

        
            <div className="needed-by-container-rc">
                
                    <div className='needed-by-inner-container-rc'>
                        {/* <Calendar className="h-4 w-4 mr-2 text-yellow-400"/> */}
                        Needed By: <span className='needed-by-date-rc'>{neededDateDisplay}</span>
                    </div>
       
            </div>
        </div>
        </Link>
    );
};

export default ResourceCard;

