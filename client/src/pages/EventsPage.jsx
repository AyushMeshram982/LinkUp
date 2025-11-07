
// // client/src/pages/EventsPage.jsx

// import React, { useState, useEffect, useCallback } from 'react';
// import DiscoverySection from '../components/DiscoverySection.jsx';
// import EventCard from '../components/EventCard.jsx';
// import { fetchEvents } from '../api/eventApi.js'; 
// import { useDebounce } from '../hooks/useDebounce.js'; // <-- NEW IMPORT

// // The single source of truth for all filters
// const initialFilters = {
//     city: 'Indore', 
//     search: '', // Live search input
//     isPaid: null, 
//     seatsAvailable: null,
//     dateFilter: '',
//     timeFrom: '',
//     timeTo: '',
// };

// const EventsPage = () => {
//     const [events, setEvents] = useState([]);
//     const [filters, setFilters] = useState(initialFilters); 
//     const [loading, setLoading] = useState(false);
//     const [pageError, setPageError] = useState(null);

//     // Apply debounce to the live search input field value
//     const debouncedSearchTerm = useDebounce(filters.search, 500); // 500ms delay

//     // Function to fetch data based on current filters
//     const fetchEventsData = useCallback(async (currentFilters) => {
//         setLoading(true);
//         setPageError(null);
        
//         const params = {};
//         Object.keys(currentFilters).forEach(key => {
//             const value = currentFilters[key];
            
//             // Exclude null, undefined, or empty string values
//             if (value !== null && value !== undefined && value !== '') {
                
//                 // Map frontend key names to backend names
//                 const backendKey = key === 'dateFilter' ? 'date' : key;

//                 // Convert booleans to strings for backend: true -> 'true'
//                     params[backendKey] = (typeof value === 'boolean') ? String(value) : value;
//             }
//         });
//         // CRITICAL CHECK: Always ensure a city is sent
//         if (!params.city) {
//             params.city = initialFilters.city;
//         }

//         try {
//             const response = await fetchEvents(params);
//             // console.log('response data: ', response.data);  //response data
//             setEvents(response.data);
//             // console.log('Fetching events with filters:', params);
//         } catch (error) {
//             // console.error('Failed to fetch events:', error);
//             setPageError(error.response?.status === 404 ? 'No events found.' : 'Could not load events. Server error.');
//         } finally {
//             setLoading(false);
//         }
//     }, []); 

//     // Handler passed to DiscoverySection for ANY filter change
//     const handleFilterChange = (updates) => {
//         // Use functional state update to merge existing filters with new changes
//         setFilters(prevFilters => ({ ...prevFilters, ...updates }));
//     };
    
//     // CRITICAL: Unified useEffect hook watches the filters object AND the debounced search term.
//     useEffect(() => { 
//         // We only trigger a fetch when the debounced search term changes, or when other filters change.
//         // We pass the full filters object, which includes the debounced search value.
        
//         // This ensures:
//         // 1. City/Chip/Date change triggers immediate fetch (filters changes)
//         // 2. Search typing triggers fetch only after 500ms (debouncedSearchTerm changes)
//         fetchEventsData({ ...filters, search: debouncedSearchTerm }); 
        
//     }, [filters, debouncedSearchTerm, fetchEventsData]);


//     return (
//         <div className="events-page">
//             <DiscoverySection 
//                 filters={filters} 
//                 onFilterChange={handleFilterChange} 
//             />
            
//             <h2 className="text-3xl font-extrabold text-white mt-4 mb-6 border-b border-gray-700 pb-2">Local Events</h2>
            
//             {loading && <div className="text-blue-400 text-center text-xl py-10">Loading events...</div>}
//             {pageError && <div className="text-red-400 text-center text-xl py-10">{pageError}</div>}
            
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {!loading && events.map((event) => (
//                     <EventCard key={event._id} event={event} seatsAvailable={filters.seatsAvailable}/> 
//                 ))}
//             </div>
//              {!loading && !pageError && events.length === 0 && (
//                 <div className="text-gray-500 text-center py-10">No events found in {filters.city} matching your filters.</div>
//             )}
//         </div>
//     );
// };

// export default EventsPage;

//----------------------------------------------------------------------------------------


// client/src/pages/EventsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import DiscoverySection from '../components/DiscoverySection.jsx';
import EventCard from '../components/EventCard.jsx';
import { fetchEvents } from '../api/eventApi.js'; 
import { useDebounce } from '../hooks/useDebounce.js'; // <-- NEW IMPORT

import "../styles/EventsPage.css"
import { Link } from 'react-router-dom';

// The single source of truth for all filters
const initialFilters = {
    city: 'Indore', 
    search: '', // Live search input
    isPaid: null, 
    seatsAvailable: null,
    dateFilter: '',
    timeFrom: '',
    timeTo: '',
};

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [filters, setFilters] = useState(initialFilters); 
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState(null);

    // Apply debounce to the live search input field value
    const debouncedSearchTerm = useDebounce(filters.search, 500); // 500ms delay

    // Function to fetch data based on current filters
    const fetchEventsData = useCallback(async (currentFilters) => {
        setLoading(true);
        setPageError(null);
        
        const params = {};
        Object.keys(currentFilters).forEach(key => {
            const value = currentFilters[key];
            
            // Exclude null, undefined, or empty string values
            if (value !== null && value !== undefined && value !== '') {
                
                // Map frontend key names to backend names
                const backendKey = key === 'dateFilter' ? 'date' : key;

                // Convert booleans to strings for backend: true -> 'true'
                    params[backendKey] = (typeof value === 'boolean') ? String(value) : value;
            }
        });
        // CRITICAL CHECK: Always ensure a city is sent
        if (!params.city) {
            params.city = initialFilters.city;
        }

        try {
            const response = await fetchEvents(params);
            // console.log('response data: ', response.data);  //response data
            setEvents(response.data);
            // console.log('Fetching events with filters:', params);
        } catch (error) {
            // console.error('Failed to fetch events:', error);
            setPageError(error.response?.status === 404 ? 'No events found.' : 'Could not load events. Server error.');
        } finally {
            setLoading(false);
        }
    }, []); 

    // Handler passed to DiscoverySection for ANY filter change
    const handleFilterChange = (updates) => {
        // Use functional state update to merge existing filters with new changes
        setFilters(prevFilters => ({ ...prevFilters, ...updates }));
    };
    
    // CRITICAL: Unified useEffect hook watches the filters object AND the debounced search term.
    useEffect(() => { 
        // We only trigger a fetch when the debounced search term changes, or when other filters change.
        // We pass the full filters object, which includes the debounced search value.
        
        // This ensures:
        // 1. City/Chip/Date change triggers immediate fetch (filters changes)
        // 2. Search typing triggers fetch only after 500ms (debouncedSearchTerm changes)
        fetchEventsData({ ...filters, search: debouncedSearchTerm }); 
        
    }, [filters, debouncedSearchTerm, fetchEventsData]);


    return (
        <>

            <DiscoverySection 
                filters={filters} 
                onFilterChange={handleFilterChange} 
            />
        <div className="events-page">
            
            {loading && <div className="text-blue-400 text-center text-xl py-10">Loading events...</div>}
            {pageError && <div className="text-red-400 text-center text-xl py-10">{pageError}</div>}
            
            <div className="all-event-cards-ep">
                {!loading && events.map((event) => (
                    <div className='each-card-boundary-ep'>
                    <EventCard key={event._id} event={event} seatsAvailable={filters.seatsAvailable}/> 
                    </div>
                ))}
            </div>

             {!loading && !pageError && events.length === 0 && (
                <div className="text-gray-500 text-center py-10">No events found in {filters.city} matching your filters.</div>
            )}
        </div>

        <Link to={`/create-event`}>
            <div className="create-new-event">
                <span class="material-symbols-outlined">add_circle</span>
            </div>
        </Link>

        <Link to={`/host/dashboard`}>
            <div className="go-to-dashboard">
                <span class="material-symbols-outlined">analytics</span>
            </div>
        </Link>

        <Link to={`/qrscan`}>
            <div className="scan-the-ticket">
                <span class="material-symbols-outlined">qr_code_scanner</span>
            </div>
        </Link>
        </>
    );
};

export default EventsPage;
