// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import GroupDiscovery from '../components/GroupDiscovery.jsx';
// import GroupCard from '../components/GroupCard.jsx'; // Will create next
// import { fetchGroups } from '../api/groupApi.js'; 
// import { useDebounce } from '../hooks/useDebounce.js';

// // Initial state for ALL Group filters
// const initialFilters = {
//     city: 'Indore', 
//     search: '',
//     active: null, 
//     newGroups: null,
//     size: null, // 'small', 'medium', 'large'
// };

// const GroupsPage = () => {
//     const [groups, setGroups] = useState([]);
//     const [filters, setFilters] = useState(initialFilters); 
//     const [loading, setLoading] = useState(false);
//     const [pageError, setPageError] = useState(null);

//     // Apply debounce to the live search input field value
//     const debouncedSearchTerm = useDebounce(filters.search, 500); 

//     // --- Data Fetching Logic ---

//     const fetchGroupsData = useCallback(async (currentFilters) => {
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
//             const response = await fetchGroups(params);
//             setGroups(response.data);
//             console.log('Fetching groups with filters:', params);
//         } catch (error) {
//             console.error('Failed to fetch groups:', error);
//             setGroups([]);
//             setPageError(error.response?.status === 404 ? 'No groups found.' : 'Could not load groups. Server error.');
//         } finally {
//             setLoading(false);
//         }
//     }, []); 

//     const handleFilterChange = (updates) => {
//         setFilters(prevFilters => ({ ...prevFilters, ...updates }));
//     };
    
//     // CRITICAL: Unified useEffect hook watches the filters object AND the debounced search term.
//     useEffect(() => { 
//         // Create the final filter object by substituting the raw 'search' value with the debounced one
//         const finalFilters = { ...filters, search: debouncedSearchTerm };
        
//         // Only fetch if the city is defined
//         if (finalFilters.city) {
//             fetchGroupsData(finalFilters); 
//         }
        
//     }, [filters.city, filters.active, filters.newGroups, filters.size, debouncedSearchTerm, fetchGroupsData]); //different from events


//     return (
//         <div className="groups-page">
//             <GroupDiscovery 
//                 filters={filters} 
//                 onFilterChange={handleFilterChange} 
//             />
            
//             <h2 className="text-3xl font-extrabold text-white mt-4 mb-6 border-b border-gray-700 pb-2">Local Communities</h2>
            
//             {loading && <div className="text-blue-400 text-center text-xl py-10">Loading groups...</div>}
//             {pageError && <div className="text-red-400 text-center text-xl py-10">{pageError}</div>}
            
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {/* Group Cards will be mapped here */}
//                 {!loading && groups.length > 0 && groups.map((group) => (
//                     <GroupCard key={group._id} group={group} /> 
//                     // <div key={group._id} className="bg-gray-800 p-4 rounded-lg text-white">
//                     //     {group.name} - {group.primaryCity}
//                     // </div>
//                 ))}
//             </div>
            
//             {!loading && groups.length === 0 && !pageError && (
//                 <div className="text-gray-500 text-center py-10">No groups found in {filters.city} matching your filters.</div>
//             )}
//         </div>
//     );
// };

// export default GroupsPage;

//----------------------------------------------------------------------------------------------------

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import GroupDiscovery from '../components/GroupDiscovery.jsx';
import GroupCard from '../components/GroupCard.jsx'; // Will create next
import { fetchGroups } from '../api/groupApi.js'; 
import { useDebounce } from '../hooks/useDebounce.js';
import { Link } from 'react-router-dom';

import "../styles/GroupPage.css"

// Initial state for ALL Group filters
const initialFilters = {
    city: 'Indore', 
    search: '',
    active: null, 
    newGroups: null,
    size: null, // 'small', 'medium', 'large'
};

const GroupsPage = () => {
    const [groups, setGroups] = useState([]);
    const [filters, setFilters] = useState(initialFilters); 
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState(null);

    // Apply debounce to the live search input field value
    const debouncedSearchTerm = useDebounce(filters.search, 500); 

    // --- Data Fetching Logic ---

    const fetchGroupsData = useCallback(async (currentFilters) => {
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
            const response = await fetchGroups(params);
            setGroups(response.data);
            console.log('Fetching groups with filters:', params);
        } catch (error) {
            console.error('Failed to fetch groups:', error);
            setGroups([]);
            setPageError(error.response?.status === 404 ? 'No groups found.' : 'Could not load groups. Server error.');
        } finally {
            setLoading(false);
        }
    }, []); 

    const handleFilterChange = (updates) => {
        setFilters(prevFilters => ({ ...prevFilters, ...updates }));
    };
    
    // CRITICAL: Unified useEffect hook watches the filters object AND the debounced search term.
    useEffect(() => { 
        // Create the final filter object by substituting the raw 'search' value with the debounced one
        const finalFilters = { ...filters, search: debouncedSearchTerm };
        
        // Only fetch if the city is defined
        if (finalFilters.city) {
            fetchGroupsData(finalFilters); 
        }
        
    }, [filters.city, filters.active, filters.newGroups, filters.size, debouncedSearchTerm, fetchGroupsData]); //different from events


    return (
        <>

            <GroupDiscovery 
                filters={filters} 
                onFilterChange={handleFilterChange} 
            /> 
        <div className="groups-page">
            
            {/* <h2 className="text-3xl font-extrabold text-white mt-4 mb-6 border-b border-gray-700 pb-2">Local Communities</h2> */}
            
            {loading && <div className="text-blue-400 text-center text-xl py-10">Loading groups...</div>}
            {pageError && <div className="text-red-400 text-center text-xl py-10">{pageError}</div>}
            
            <div className="all-group-cards-gc">
                {/* Group Cards will be mapped here */}
                {!loading && groups.length > 0 && groups.map((group) => (
                    <div className='each-card-boundary-gc'>
                    <GroupCard key={group._id} group={group} /> 
                    </div>
                    // <div key={group._id} className="bg-gray-800 p-4 rounded-lg text-white">
                    //     {group.name} - {group.primaryCity}
                    // </div>
                ))}
            </div>
            
            {!loading && groups.length === 0 && !pageError && (
                <div className="text-gray-500 text-center py-10">No groups found in {filters.city} matching your filters.</div>
            )}
        </div>
        <Link to={`/create-group`}>
            <div className="create-new-group">
                <span class="material-symbols-outlined">add_circle</span>
            </div>
        </Link>
        </>
    );
};

export default GroupsPage;