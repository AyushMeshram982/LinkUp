import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { login } from '../api/authApi.js'; 
import { useForm } from 'react-hook-form';

const LoginPage = () => {
    // 1. Initialize React Hook Form
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { login: authLogin } = useAuth(); // Rename 'login' to avoid conflict

    // --- Handlers ---

    // Handles form submission (called only on valid input)
    const onSubmit = async (data) => {
        setSubmitError('');
        setIsSubmitting(true);

        try {
            // 1. Call the API (data is automatically sent as JSON by Axios)
            const response = await login(data);

            // 2. Success: Log the user in globally and redirect
            const { token, ...userData } = response.data;
            authLogin(userData, token); // Update AuthContext
            
            navigate('/'); // Redirect to the homepage/events feed

        } catch (err) {
            console.error('Login Error:', err);
            // 3. Handle specific API error responses (e.g., 400 Invalid Credentials)
            const apiError = err.response?.data?.error || err.response?.data?.message || 'Login failed. Please check your network.';
            setSubmitError(apiError);

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-page flex flex-col items-center justify-center h-screen w-screen bg-[#121212]">
            <h2 className="text-3xl font-extrabold mb-8 text-[#F0F0F0]">Log In to LinkUp</h2>
            {/* RHF's handleSubmit wraps the onSubmit function */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-[#1E1E1E] rounded-xl shadow-2xl max-w-md w-full border border-gray-700">
                
                {/* Error Message from API */}
                {submitError && <p className="text-red-400 mb-4 p-3 bg-red-900/30 rounded-lg font-medium">{submitError}</p>}

                {/* Email */}
                <div className="mb-5">
                    <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        {...register("email", { 
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Invalid email format"
                            }
                        })}
                        className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:[#F0F0F0]"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div className="mb-6">
                    <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        {...register("password", { 
                            required: "Password is required",
                        })}
                        className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:[#F0F0F0]"
                    />
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                    
                    {/* Forgot Password Link (Placeholder for future route) */}
                    <Link to="/forgot-password" className="block text-right mt-2 text-sm text-gray-500 hover:text-blue-400 transition">
                        Forgot Password?
                    </Link>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Verifying...' : 'Log In'}
                </button>
            </form>
            
            <p className="mt-6 text-center text-gray-400">
                Don't have an account? <Link to="/signup" className="text-blue-500 font-semibold hover:underline">Sign Up</Link>
            </p>
        </div>
    );
};

export default LoginPage;