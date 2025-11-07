import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext.jsx';
import { commentEvent } from '../api/eventApi.js';

const CommentForm = ({ eventId, onSuccess }) => {
    const { isAuthenticated, user } = useAuth();
    const { register, handleSubmit, reset } = useForm({
        defaultValues: { text: '' }
    });
    const [isPosting, setIsPosting] = useState(false);
    const [error, setError] = useState('');

    const onSubmit = async (data) => {
        if (!isAuthenticated) {
            setError("You must be logged in to post a comment.");
            return;
        }

        setIsPosting(true);
        setError('');

        try {
            await commentEvent(eventId, data.text);
            
            // Success: Reset the form and trigger the parent to re-fetch/update state
            reset(); 
            onSuccess(); 

        } catch (err) {
            console.error('Comment Post Error:', err);
            const apiError = err.response?.data?.error || 'Failed to post comment.';
            setError(apiError);
        } finally {
            setIsPosting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="p-4 bg-gray-700/50 rounded-lg text-center text-yellow-400">
                Please log in to participate in the discussion.
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
            <textarea
                {...register("text", { required: true })}
                rows="3"
                placeholder={`Comment as ${user?.name}...`}
                disabled={isPosting}
                className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
                type="submit"
                disabled={isPosting}
                className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
                {isPosting ? 'Posting...' : 'Post Comment'}
            </button>
        </form>
    );
};

export default CommentForm;