import React from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const CommentItem = ({ comment }) => {
    // Check if the comment has user details (should be populated by backend)
    const commenter = comment.userDetails || { name: 'Anonymous', profileImageUrl: '' };
    
    // Fallback for profile image
    const profilePic = commenter.profileImageUrl ? `${BACKEND_URL}/${commenter.profileImageUrl}` : '/default-avatar.png';
    const createdAt = comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'N/A';

    return (
        <div className="flex space-x-4 p-4 border-b border-gray-700/50 hover:bg-gray-800/50 transition duration-150">
            {/* Avatar */}
            <div className="flex-shrink-0">
                <img 
                    src={profilePic} 
                    alt={commenter.name} 
                    className="w-10 h-10 rounded-full object-cover border border-gray-600"
                />
            </div>
            
            {/* Content */}
            <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-blue-400 text-sm">{commenter.name}</span>
                    <span className="text-xs text-gray-500">{createdAt}</span>
                </div>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{comment.text}</p>
            </div>
        </div>
    );
};

export default CommentItem;