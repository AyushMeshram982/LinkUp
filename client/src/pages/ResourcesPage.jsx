// import React, { useState, useEffect, useCallback } from 'react';
// import ResourceDiscovery from '../components/ResourceDiscovery.jsx';
// import ResourceCard from '../components/ResourceCard.jsx'; // Will create next
// import { fetchResources } from '../api/resourceApi.js'; 
// import { useDebounce } from '../hooks/useDebounce.js';

// // Initial state for ALL Resource filters
// const initialFilters = {
//     city: 'Indore', 
//     search: '',
//     urgency: null, // boolean true for 'Needed ASAP'
//     neededDate: '', // Specific date filter
// };

// const ResourcesPage = () => {
//     const [resources, setResources] = useState([]);
//     const [filters, setFilters] = useState(initialFilters); 
//     const [loading, setLoading] = useState(false);
//     const [pageError, setPageError] = useState(null);

//     // Apply debounce to the live search input field value
//     const debouncedSearchTerm = useDebounce(filters.search, 500); 

//     // --- Data Fetching Logic ---
//     const fetchResourcesData = useCallback(async (currentFilters) => {
//         setLoading(true);
//         setPageError(null);
        
//         const params = {};
        
//         // Construct API parameters
//         for (const key in currentFilters) {
//             const value = currentFilters[key];
//             if (value !== null && value !== undefined && value !== '') {
//                 // All filters are sent as-is, except for boolean conversion
//                 params[key] = (typeof value === 'boolean') ? String(value) : value;
//             }
//         }
        
//         if (!params.city) {
//             params.city = initialFilters.city;
//         }

//         try {
//             const response = await fetchResources(params);
//             setResources(response.data);
//             console.log('Fetching resources with filters:', params);
//         } catch (error) {
//             console.error('Failed to fetch resources:', error);
//             setResources([]);
//             setPageError(error.response?.status === 404 ? 'No resources found.' : 'Could not load resources. Server error.');
//         } finally {
//             setLoading(false);
//         }
//     }, []); 

//     const handleFilterChange = (updates) => {
//         setFilters(prevFilters => ({ ...prevFilters, ...updates }));
//     };
    
//     // CRITICAL: Unified useEffect hook watches the filters object AND the debounced search term.
//     useEffect(() => { 
//         const finalFilters = { ...filters, search: debouncedSearchTerm };
        
//         if (finalFilters.city) {
//             fetchResourcesData(finalFilters); 
//         }
        
//     }, [filters.city, filters.urgency, filters.neededDate, debouncedSearchTerm, fetchResourcesData]);


//     return (
//         <div className="resources-page">
//             <ResourceDiscovery 
//                 filters={filters} 
//                 onFilterChange={handleFilterChange} 
//             />
            
//             <h2 className="text-3xl font-extrabold text-white mt-4 mb-6 border-b border-gray-700 pb-2">Local Resources & Volunteers</h2>
            
//             {loading && <div className="text-red-400 text-center text-xl py-10">Loading resource requests...</div>}
//             {pageError && <div className="text-red-400 text-center text-xl py-10">{pageError}</div>}
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {/* Resource Cards will be mapped here */}
//                 {!loading && resources.length > 0 && resources.map((resource) => (
//                     // <div key={resource._id} className="bg-gray-800 p-4 rounded-lg text-white border border-gray-700">
//                     //     <p className="text-xl font-bold">{resource.title}</p>
//                     //     <p className="text-sm text-gray-400">Needed for: {resource.linkedEventId?.title || 'Unknown Event'}</p>
//                     //     <p className="text-sm text-yellow-400">Date: {new Date(resource.neededDate).toLocaleDateString()}</p>
//                     // </div>
//                     <ResourceCard key={resource._id} resource={resource} />
//                 ))}
//             </div>
            
//             {!loading && resources.length === 0 && !pageError && (
//                 <div className="text-gray-500 text-center py-10">No active resource requests found in {filters.city}.</div>
//             )}
//         </div>
//     );
// };

// export default ResourcesPage;

//---------------------------------------------------------------------

import React, { useState, useEffect, useCallback } from 'react';
import ResourceDiscovery from '../components/ResourceDiscovery.jsx';
import ResourceCard from '../components/ResourceCard.jsx'; // Will create next
import { fetchResources } from '../api/resourceApi.js'; 
import { useDebounce } from '../hooks/useDebounce.js';
import { Link } from 'react-router-dom';

import "../styles/ResourcesPage.css"

// Initial state for ALL Resource filters
const initialFilters = {
    city: 'Indore', 
    search: '',
    urgency: null, // boolean true for 'Needed ASAP'
    neededDate: '', // Specific date filter
};

const ResourcesPage = () => {
    const [resources, setResources] = useState([]);
    const [filters, setFilters] = useState(initialFilters); 
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState(null);

    // Apply debounce to the live search input field value
    const debouncedSearchTerm = useDebounce(filters.search, 500); 

    // --- Data Fetching Logic ---
    const fetchResourcesData = useCallback(async (currentFilters) => {
        setLoading(true);
        setPageError(null);
        
        const params = {};
        
        // Construct API parameters
        for (const key in currentFilters) {
            const value = currentFilters[key];
            if (value !== null && value !== undefined && value !== '') {
                // All filters are sent as-is, except for boolean conversion
                params[key] = (typeof value === 'boolean') ? String(value) : value;
            }
        }
        
        if (!params.city) {
            params.city = initialFilters.city;
        }

        try {
            const response = await fetchResources(params);
            setResources(response.data);
            console.log('Fetching resources with filters:', params);
        } catch (error) {
            console.error('Failed to fetch resources:', error);
            setResources([]);
            setPageError(error.response?.status === 404 ? 'No resources found.' : 'Could not load resources. Server error.');
        } finally {
            setLoading(false);
        }
    }, []); 

    const handleFilterChange = (updates) => {
        setFilters(prevFilters => ({ ...prevFilters, ...updates }));
    };
    
    // CRITICAL: Unified useEffect hook watches the filters object AND the debounced search term.
    useEffect(() => { 
        const finalFilters = { ...filters, search: debouncedSearchTerm };
        
        if (finalFilters.city) {
            fetchResourcesData(finalFilters); 
        }
        
    }, [filters.city, filters.urgency, filters.neededDate, debouncedSearchTerm, fetchResourcesData]);


    return (
        <>
            <ResourceDiscovery 
                filters={filters} 
                onFilterChange={handleFilterChange} 
            />
        <div className="resources-page">
            
            {/* <h2 className="text-3xl font-extrabold text-white mt-4 mb-6 border-b border-gray-700 pb-2">Local Resources & Volunteers</h2> */}
            
            {loading && <div className="text-red-400 text-center text-xl py-10">Loading resource requests...</div>}
            {pageError && <div className="text-red-400 text-center text-xl py-10">{pageError}</div>}
            
            <div className="all-resource-cards-rc">
                {/* Resource Cards will be mapped here */}
                {!loading && resources.length > 0 && resources.map((resource) => (
                    // <div key={resource._id} className="bg-gray-800 p-4 rounded-lg text-white border border-gray-700">
                    //     <p className="text-xl font-bold">{resource.title}</p>
                    //     <p className="text-sm text-gray-400">Needed for: {resource.linkedEventId?.title || 'Unknown Event'}</p>
                    //     <p className="text-sm text-yellow-400">Date: {new Date(resource.neededDate).toLocaleDateString()}</p>
                    // </div>
                    <div className='each-card-boundary-rc'>
                        <ResourceCard key={resource._id} resource={resource} />
                    </div>
                ))}
            </div>
            
            {!loading && resources.length === 0 && !pageError && (
                <div className="text-gray-500 text-center py-10">No active resource requests found in {filters.city}.</div>
            )}
        </div>
        <Link to={`/post-resource`}>
            <div className="create-new-resource">
                <span class="material-symbols-outlined">add_circle</span>
            </div>
        </Link>
        </>
    );
};

export default ResourcesPage;