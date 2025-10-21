import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { signup } from '../api/authApi.js'; 
import { useForm } from 'react-hook-form'; // <-- NEW IMPORT

const SignUpPage = () => {
    // 1. Initialize React Hook Form
    const { 
        register, 
        handleSubmit, 
        setValue, // Used to manually set the file input value
        formState: { errors } 
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            city: '',
        }
    });

    const [profileImage, setProfileImage] = useState(null); // Separate state for file
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    // --- Handlers ---

    // Handles file input change and updates the local state
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
        // We use setValue to manually update the RHF state with the file object if needed later, 
        // but for FormData, the File object is cleaner in a separate state.
    };

    // Handles form submission (called only on valid input)
    const onSubmit = async (data) => {
        setSubmitError('');
        setIsSubmitting(true);

        try {
            // 1. Prepare data for 'multipart/form-data' upload
            const formData = new FormData();
            
            // Append text fields from RHF data
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('city', data.city);
            
            // Append file if it exists
            if (profileImage) {
                formData.append('profileImage', profileImage); // Use the File object from state
            }

            // 2. Call the API
            const response = await signup(formData);

            // 3. Success: Log the user in globally and redirect
            const { token, user } = response.data;
            login(user, token);
            
            navigate('/');

        } catch (err) {
            console.error('Sign Up Error:', err);
            // 4. Handle API error responses
            const apiError = err.response?.data?.error || err.response?.data?.message || 'An unexpected error occurred during registration.';
            setSubmitError(apiError);

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="signup-page flex flex-col items-center justify-center min-h-screen min-w-screen bg-[#121212]">
            <h2 className="text-3xl font-extrabold mb-8 text-[#F0F0F0]">Join LinkUp</h2>
            {/* RHF's handleSubmit wraps the onSubmit function and handles validation */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-[#1E1E1E] rounded-xl shadow-2xl max-w-md w-full border border-gray-700">
                
                {/* Error Message from API */}
                {submitError && <p className="text-red-400 mb-4 p-3 bg-red-900/30 rounded-lg font-medium">{submitError}</p>}

                {/* Name */}
                <div className="mb-5">
                    <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="name">Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        {...register("name", { required: "Name is required" })} // RHF registration
                        className="w-full px-4 py-2 text-white bg-[#333333] border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:[#F0F0F0]"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>

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
                        className="w-full px-4 py-2 text-white bg-[#333333] border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:[#F0F0F0]"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div className="mb-5">
                    <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        {...register("password", { 
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters"
                            }
                        })}
                        className="w-full px-4 py-2 text-white bg-[#333333] border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:[#F0F0F0]"
                    />
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                </div>
                
                {/* City */}
                <div className="mb-5">
                    <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="city">City</label>
                    <input 
                        type="text" 
                        id="city" 
                        {...register("city", { required: "City is required" })}
                        className="w-full px-4 py-2 text-white bg-[#333333] border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:[#F0F0F0]"
                    />
                    {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
                </div>
                
                {/* Profile Image (File Input) */}
                <div className="mb-6">
                    <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="profileImage">Profile Image (Optional)</label>
                    <input 
                        type="file" 
                        id="profileImage" 
                        accept="image/*" 
                        onChange={handleFileChange} // Manual change handler for file state
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition duration-200"
                    />
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Registering...' : 'Sign Up'}
                </button>
            </form>
            
            <p className="mt-6 text-center text-gray-400">
                Already have an account? <Link to="/login" className="text-blue-500 font-semibold hover:underline">Log In</Link>
            </p>
        </div>
    );
};

export default SignUpPage;