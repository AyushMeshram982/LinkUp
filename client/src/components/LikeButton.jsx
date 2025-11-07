import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { likeEvent } from '../api/eventApi.js';

/**
 * Renders a button to toggle the like status for an event.
 * Handles optimistic UI update and re-fetches data on success.
 * @param {object} event - The event object.
 * @param {function} onLikeToggle - Function to call in the parent component to refresh data.
 */
const LikeButton = ({ event, onLikeToggle }) => {
    const { isAuthenticated, user } = useAuth();
    
    // Initial State: Check if the current user's ID is in the event.likes array
    const initialIsLiked = event.likes?.some(
        (likeId) => likeId === user?._id || likeId._id === user?._id
    ) || false;

    // Optimistic UI State
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    // Optimistic Count: Start with the actual count
    const [likeCount, setLikeCount] = useState(event.likes?.length || 0);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleLikeClick = async () => {
        if (!isAuthenticated) {
            alert("Please log in to like an event."); // Temporary placeholder message
            return;
        }

        setIsUpdating(true);
        
        // Optimistic Update: Change UI immediately
        const newLikedState = !isLiked;
        const newCount = isLiked ? likeCount - 1 : likeCount + 1;
        
        setIsLiked(newLikedState);
        setLikeCount(newCount);

        try {
            // API Call: Backend handles the actual toggle
            await likeEvent(event._id);

            // Success: Trigger the parent component to perform a hard data refresh
            if (onLikeToggle) {
                onLikeToggle();
            }

        } catch (error) {
            console.error("Like toggle failed:", error);
            // Revert optimistic changes on API failure
            setIsLiked(initialIsLiked);
            setLikeCount(event.likes?.length || 0);
            alert("Failed to update like status. Try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    // Determine color and style based on state
    const heartClass = isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400';

    return (
        <button
            onClick={handleLikeClick}
            disabled={isUpdating}
            className="flex items-center transition duration-200 disabled:cursor-wait"
        >
            <Heart className={`w-5 h-5 mr-1 ${heartClass}`} />
            <span className="text-gray-400 text-sm">{likeCount}</span>
        </button>
    );
};

export default LikeButton;