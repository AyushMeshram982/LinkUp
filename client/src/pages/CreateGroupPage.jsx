// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { useAuth } from '../contexts/AuthContext.jsx';
// import { createGroup } from '../api/groupApi.js'; 
// import { PlusCircle, Users, MapPin } from 'lucide-react'; 

// const CreateGroupPage = () => {
//     // Hooks and Context
//     const { isAuthenticated, user } = useAuth();
//     const navigate = useNavigate();
    
//     // Redirect unauthenticated users
//     useEffect(() => {
//         if (!isAuthenticated) {
//             alert("You must be logged in to create a group.");
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
//             name: '',
//             description: '',
//             keywords: '',
//             isPublic: 'true', // Default to public
//             groupImage: null,
//         }
//     });

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
//             formData.append('name', data.name);
//             formData.append('description', data.description);
//             formData.append('isPublic', data.isPublic); // 'true' or 'false' string
            
//             // Append optional fields
//             if (data.keywords) formData.append('keywords', data.keywords);
            
//             // Append file (Multer expects 'groupImage' key)
//             if (data.groupImage && data.groupImage.length > 0) {
//                 formData.append('groupImage', data.groupImage[0]);
//             } else {
//                 return setSubmitError('Group image is required.');
//             }

//             // 2. Call the API
//             const response = await createGroup(formData);
            
//             // 3. Success: Redirect to the newly created group's detail page
//             // navigate(`/groups/${response.data._id}`);
//             navigate(`/groups`);

//         } catch (err) {
//             console.error('Create Group Error:', err);
//             const apiError = err.response?.data?.error || 'Failed to create group. Check server logs.';
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
//             <h1 className="text-4xl font-extrabold mb-8 text-blue-400 flex items-center">
//                 <PlusCircle className="w-8 h-8 mr-3"/> Start a New Community Group
//             </h1>
            
//             <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full border border-gray-700 space-y-6">
                
//                 {submitError && <p className="text-red-400 mb-4 p-3 bg-red-900/30 rounded-lg font-medium">{submitError}</p>}

//                 {/* Group Image Upload */}
//                 <div className="border border-gray-700 p-4 rounded-lg">
//                     <label className="block text-gray-300 text-lg font-semibold mb-2" htmlFor="groupImage">Group Image (Required)</label>
//                     <input 
//                         type="file" 
//                         id="groupImage" 
//                         accept="image/*" 
//                         {...register("groupImage", { required: "Group image is required" })}
//                         className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition duration-200"
//                     />
//                     {errors.groupImage && <p className="mt-1 text-xs text-red-500">{errors.groupImage.message}</p>}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
//                     {/* Group Name */}
//                     <div>
//                         <label className="form-label" htmlFor="name">Group Name <span className="text-red-400">*</span></label>
//                         <input type="text" id="name" {...register("name", { required: "Group name is required" })} className="form-input" />
//                         {errors.name && <p className="input-error">{errors.name.message}</p>}
//                     </div>
                    
//                     {/* Primary City (Read-Only) */}
//                     <div>
//                         <label className="form-label" htmlFor="city">Primary City <span className="text-red-400">*</span></label>
//                         <div className='relative'>
//                             <input 
//                                 type="text" 
//                                 id="city" 
//                                 defaultValue={user?.city}
//                                 readOnly
//                                 className="form-input read-only-input bg-gray-700/50 cursor-not-allowed pl-10" 
//                             />
//                             <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500' />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Description and Keywords */}
//                 <div className="space-y-6">
//                     <div>
//                         <label className="form-label" htmlFor="description">Group Description <span className="text-red-400">*</span></label>
//                         <textarea id="description" rows="4" {...register("description", { required: "Description is required" })} className="form-input resize-none" placeholder="What is the purpose of this group? (e.g., Monthly book discussions, stand-up comedy practice)"></textarea>
//                         {errors.description && <p className="input-error">{errors.description.message}</p>}
//                     </div>
                    
//                     <div>
//                         <label className="form-label" htmlFor="keywords">Keywords (comma separated)</label>
//                         <input type="text" id="keywords" {...register("keywords")} className="form-input" placeholder="e.g., reading, fiction, comedy, open mic" />
//                     </div>
//                 </div>

//                 {/* Privacy Options (IsPublic) */}
//                 <div className="border border-gray-700 p-4 rounded-lg space-y-4">
//                     <h3 className="text-xl font-bold flex items-center text-yellow-400"><Users className="w-6 h-6 mr-2" /> Privacy Settings</h3>

//                     {/* Radio Buttons for IsPublic */}
//                     <div className="flex space-x-6">
//                         <label className="flex items-center text-gray-300">
//                             <input 
//                                 type="radio" 
//                                 value="true" 
//                                 {...register("isPublic")} 
//                                 className="mr-2"
//                             />
//                             Public (Anyone can join immediately)
//                         </label>
//                         <label className="flex items-center text-gray-300">
//                             <input 
//                                 type="radio" 
//                                 value="false" 
//                                 {...register("isPublic")} 
//                                 className="mr-2"
//                             />
//                             Private (Requires host approval)
//                         </label>
//                     </div>
//                 </div>

//                 {/* Submit Button */}
//                 <button 
//                     type="submit" 
//                     disabled={isSubmitting}
//                     className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 flex items-center justify-center"
//                 >
//                     {isSubmitting ? 'Creating Group...' : 'Create Group'}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default CreateGroupPage;

//--------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext.jsx';
import { createGroup } from '../api/groupApi.js'; 
import { PlusCircle, Users, MapPin } from 'lucide-react'; 
import "../styles/CreateGroupPage.css"

const CreateGroupPage = () => {
    // Hooks and Context
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    
    // Redirect unauthenticated users
    useEffect(() => {
        if (!isAuthenticated) {
            alert("You must be logged in to create a group.");
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
            name: '',
            description: '',
            keywords: '',
            isPublic: 'true', // Default to public
            groupImage: null,
        }
    });

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
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('isPublic', data.isPublic); // 'true' or 'false' string
            
            // Append optional fields
            if (data.keywords) formData.append('keywords', data.keywords);
            
            // Append file (Multer expects 'groupImage' key)
            if (data.groupImage && data.groupImage.length > 0) {
                formData.append('groupImage', data.groupImage[0]);
            } else {
                return setSubmitError('Group image is required.');
            }

            // 2. Call the API
            const response = await createGroup(formData);
            
            // 3. Success: Redirect to the newly created group's detail page
            // navigate(`/groups/${response.data._id}`);
            navigate(`/groups`);

        } catch (err) {
            console.error('Create Group Error:', err);
            const apiError = err.response?.data?.error || 'Failed to create group. Check server logs.';
            setSubmitError(apiError);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated && !user) {
        return null; // Let useEffect handle redirect
    }

    return (
        <div className="create-group-page-gp">
            {/* <h1 className="text-4xl font-extrabold mb-8 text-blue-400 flex items-center">
                <PlusCircle className="w-8 h-8 mr-3"/> Start a New Community Group
            </h1> */}
             <h3 className='create-the-group-heading-gp'>Create The Group</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="create-group-form-gp">
                
                {submitError && <p className="text-red-400 mb-4 p-3 bg-red-900/30 rounded-lg font-medium">{submitError}</p>}

                {/* Group Image Upload */}
                <div className="create-group-image-upload">
                    <label className="block text-gray-300 text-lg font-semibold mb-2" htmlFor="groupImage">Group Image (Required)</label>
                    <input 
                        type="file" 
                        id="groupImage" 
                        accept="image/*" 
                        {...register("groupImage", { required: "Group image is required" })}
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition duration-200"
                    />
                    {errors.groupImage && <p className="mt-1 text-xs text-red-500">{errors.groupImage.message}</p>}
                </div>

                <div className="create-group-form-title-details-gp">
                    
                    {/* Group Name */}
                    <div>
                        <label className="form-label" htmlFor="name">Group Name <span className="text-red-400">*</span></label>
                        <input type="text" id="name" {...register("name", { required: "Group name is required" })} className="form-input form-detail-input-gp" />
                        {errors.name && <p className="input-error">{errors.name.message}</p>}
                    </div>
                    
                    {/* Primary City (Read-Only) */}
                    <div>
                        <label className="form-label" htmlFor="city">Primary City <span className="text-red-400">*</span></label>
                        <div className='relative'>
                            <input 
                                type="text" 
                                id="city" 
                                defaultValue={user?.city}
                                readOnly
                                className="form-input form-detail-input-gp read-only-input bg-gray-700/50 cursor-not-allowed pl-10" 
                            />
                           
                        </div>
                    </div>
                </div>

                {/* Description and Keywords */}
                <div className="create-group-page-description-keywords-duration-gp">
                    <div className='create-group-page-description'>
                        <label className="form-label" htmlFor="description">Group Description <span className="text-red-400">*</span></label>
                        <textarea id="description" rows="" {...register("description", { required: "Description is required" })} className="form-input resize-none form-detail-input-description-box-gp" placeholder="Description..."></textarea>
                        {errors.description && <p className="input-error">{errors.description.message}</p>}
                    </div>
                    
                    <div>
                        <label className="form-label" htmlFor="keywords">Keywords (comma separated)</label>
                        <input type="text" id="keywords" {...register("keywords")} className="form-input form-detail-input-description-box-gp" placeholder="e.g., reading, comedy, open mic" />
                    </div>
                </div>

                {/* Privacy Options (IsPublic) */}
                <div className="border border-gray-700 p-4 rounded-lg space-y-4">
                    <h3 className="text-xl font-bold flex items-center text-yellow-400"><Users className="w-6 h-6 mr-2" /> Privacy Settings</h3>

                    {/* Radio Buttons for IsPublic */}
                    <div className="flex space-x-6">
                        <label className="flex items-center text-gray-300">
                            <input 
                                type="radio" 
                                value="true" 
                                {...register("isPublic")} 
                                className="mr-2"
                            />
                            Public (Anyone can join immediately)
                        </label>
                        <label className="flex items-center text-gray-300">
                            <input 
                                type="radio" 
                                value="false" 
                                {...register("isPublic")} 
                                className="mr-2"
                            />
                            Private (Requires host approval)
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 flex items-center justify-center"
                >
                    {isSubmitting ? 'Creating Group...' : 'Create Group'}
                </button>
            </form>
        </div>
    );
};

export default CreateGroupPage;