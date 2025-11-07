// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Users, Zap, MapPin } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext.jsx';
// // import { joinGroup, leaveGroup } from '../api/groupApi.js'; // Will be created next

// // Placeholder for the backend server URL where images are hosted
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// const GroupCard = ({ group }) => {
//     const { isAuthenticated, user } = useAuth();
//     const [isMember, setIsMember] = useState(() => 
//         // Initial check: is the current user's ID in the group.members array?
//         // Note: For simplicity, we assume group.members array is already an array of ObjectIds in this feed.
//         group.members.some(memberId => memberId === user?._id)
//     );
//     const [loading, setLoading] = useState(false);
    
//     // Total members is the array length
//     const memberCount = group.members ? group.members.length : 0;
    
//     // --- Handlers ---
    
//     const handleToggleMembership = async () => {
//         if (!isAuthenticated) {
//             alert("Please log in to join or leave a group."); // Using alert only as a temporary placeholder message
//             return;
//         }
        
//         setLoading(true);
//         // const action = isMember ? leaveGroup : joinGroup;
        
//         try {
//             // Placeholder: Replace with actual API call (e.g., await action(group._id))
//             console.log(`${isMember ? 'Leaving' : 'Joining'} group ID: ${group._id}`);
            
//             // Simulating API success
//             await new Promise(resolve => setTimeout(resolve, 500)); 
            
//             setIsMember(!isMember); // Toggle local state on success
//             // In a real app, you would dispatch a global update here to refresh the feed
            
//         } catch (error) {
//             console.error('Membership toggle failed:', error);
//             // Handle error, e.g., set an error message
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     return (
//         <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700/50 flex flex-col h-full">
            
//             {/* Image Area (Top) */}
//             <div className="relative h-48">
//                 <img 
//                     src={`${BACKEND_URL}/${group.groupImageUrl}`} 
//                     alt={group.name} 
//                     className="w-full h-full object-cover"
//                 />
                
//                 {/* Member Count Badge (Top Right) */}
//                 <span className="absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-600 text-white flex items-center">
//                     <Users className="h-4 w-4 mr-1"/> {memberCount} Members
//                 </span>
                
//                 {/* City Tag (Top Left) */}
//                 <span className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full bg-black/50 text-gray-200 flex items-center">
//                     <MapPin className="h-4 w-4 mr-1"/> {group.primaryCity}
//                 </span>
//             </div>

//             {/* Content Area (Bottom) */}
//             <div className="p-5 flex flex-col justify-between flex-grow">
                
//                 {/* Title and Description */}
//                 <Link to={`/groups/${group._id}`} className="block">
//                     <h3 className="text-2xl font-extrabold text-white hover:text-blue-400 mb-2 truncate">
//                         {group.name}
//                     </h3>
//                 </Link>
                
//                 {/* Description Snippet with Gradient Fade (UX matching the design) */}
//                 <div className="relative text-gray-400 text-sm overflow-hidden mb-4 h-12">
//                     <p className="line-clamp-2">{group.description}</p>
//                     {/* Visual fade for longer descriptions */}
//                     <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-gray-800 to-transparent"></div>
//                 </div>

//                 {/* Actions Row */}
//                 <div className="border-t border-gray-700 pt-4 flex items-center justify-between">
                    
//                     {/* Activity Placeholder */}
//                     <span className="text-xs text-yellow-500 flex items-center">
//                         <Zap className='h-4 w-4 mr-1'/> Active
//                     </span>

//                     {/* Join/Leave Button (Primary Action) */}
//                     <button
//                         onClick={handleToggleMembership}
//                         disabled={loading || !isAuthenticated}
//                         className={`py-2 px-6 text-sm font-bold rounded-lg transition duration-200 flex items-center ${
//                             loading ? 'bg-gray-600 text-gray-400' :
//                             isMember 
//                                 ? 'bg-red-600 hover:bg-red-700 text-white' // Leave (Red)
//                                 : 'bg-blue-600 hover:bg-blue-700 text-white' // Join (Blue/Primary)
//                         }`}
//                     >
//                         {loading ? 'Processing...' : isMember ? 'LEAVE' : 'JOIN GROUP'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default GroupCard;

//-------------------------------------------------------------------

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Zap, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
// import { joinGroup, leaveGroup } from '../api/groupApi.js'; // Will be created next
import "../styles/GroupCard.css"

// Placeholder for the backend server URL where images are hosted
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const GroupCard = ({ group }) => {
    const { isAuthenticated, user } = useAuth();
    const [isMember, setIsMember] = useState(() => 
        // Initial check: is the current user's ID in the group.members array?
        // Note: For simplicity, we assume group.members array is already an array of ObjectIds in this feed.
        group.members.some(memberId => memberId === user?._id)
    );
    const [loading, setLoading] = useState(false);
    
    // Total members is the array length
    const memberCount = group.members ? group.members.length : 0;
    
    // --- Handlers ---
    
    const handleToggleMembership = async () => {
        if (!isAuthenticated) {
            alert("Please log in to join or leave a group."); // Using alert only as a temporary placeholder message
            return;
        }
        
        setLoading(true);
        // const action = isMember ? leaveGroup : joinGroup;
        
        try {
            // Placeholder: Replace with actual API call (e.g., await action(group._id))
            console.log(`${isMember ? 'Leaving' : 'Joining'} group ID: ${group._id}`);
            
            // Simulating API success
            await new Promise(resolve => setTimeout(resolve, 500)); 
            
            setIsMember(!isMember); // Toggle local state on success
            // In a real app, you would dispatch a global update here to refresh the feed
            
        } catch (error) {
            console.error('Membership toggle failed:', error);
            // Handle error, e.g., set an error message
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="group-card-gc">
            
            {/* Image Area (Top) */}
            <div className="group-card-image-gc">
                <img 
                    src={`${BACKEND_URL}/${group.groupImageUrl}`} 
                    alt={group.name} 
                    // className="w-full h-full object-cover"
                    className="group-image-gc"
                />
                
                {/* Member Count Badge (Top Right) */}
                <div className="members-gc">
                    <Users className="members-icon"/> {memberCount} 
                </div>
                
                {/* Title and Description */}
                <Link to={`/groups/${group._id}`} className="block">
                    <h3 className="group-name-gc">
                        {group.name}
                    </h3>
                </Link>

                {/* Description Snippet with Gradient Fade (UX matching the design) */}
                <div className="description-container-gc">
                    <p className="group-description-gc">{group.description}</p>
                    {/* Visual fade for longer descriptions */}
                    <div className="group-description-line-fade-gc absolute bottom-3 left-2  h-4 bg-gradient-to-t from-gray-800 to-transparent"></div>
                </div>
               
            </div>

            {/* Content Area (Bottom) */}
            <div className="join-leave-container-gc">
                
                
                
                

                

                    {/* Join/Leave Button (Primary Action) */}
                    <button
                        onClick={handleToggleMembership}
                        disabled={loading || !isAuthenticated}
                        className="join-leave-gc"
                    >
                        {loading ? 'Processing...' : isMember ? 'LEAVE' : 'JOIN GROUP'}
                    </button>
                
            </div>
        </div>
    );
};

export default GroupCard;