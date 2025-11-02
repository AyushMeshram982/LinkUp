// import React, { useState, useEffect, useCallback } from 'react';
// import DiscoverySection from '../components/DiscoverySection.jsx';
// import EventCard from '../components/EventCard.jsx'; // <-- NEW IMPORT
// import { fetchEvents } from '../api/eventApi.js'; // API Service

// const EventsPage = () => {
//     const [events, setEvents] = useState([]);
//     const [city, setCity] = useState(''); // Default City State
//     const [filters, setFilters] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [pageError, setPageError] = useState(null);

//     // Function to fetch data based on current filters (Debounced/Memoized for efficiency)
//     const fetchEventsData = useCallback(async (currentFilters) => {
//         setLoading(true);
//         setPageError(null);
        
//         // 1. Prepare params for backend
//         const params = {
//             city: currentFilters.city || city, // Use selected city
//             search: currentFilters.search || '',
//             isPaid: currentFilters.isPaid,
//             seatsAvailable: currentFilters.seatsAvailable,
//             // ... include date/time filters here when implemented
//         };

//         try {
//             const response = await fetchEvents(params);
//             setEvents(response.data);
//             console.log(`Fetched ${response.data.length} events.`);
//         } catch (error) {
//             console.error('Failed to fetch events:', error);
//             setPageError('Could not load events. Please check your network connection.');
//         } finally {
//             setLoading(false);
//         }
//     }, [city]); // Dependency array includes 'city' for clean state management

//     // Handler passed to DiscoverySection
//     const handleFilterChange = (newFilters) => {
//         setFilters(newFilters);
//         fetchEventsData(newFilters); // Trigger API call
//     };
    
//     // Initial fetch when component mounts
//     useEffect(() => { 
//         fetchEventsData({ city, ...filters }); 
//     }, [fetchEventsData]);


//     return (
//         <div className="events-page">
//             <DiscoverySection 
//                 onFilterChange={handleFilterChange} 
//                 selectedCity={city}
//                 setCity={setCity}
//             />
            
//             <h2 className="text-3xl font-extrabold text-white mt-4 mb-6 border-b border-gray-700 pb-2">Local Events</h2>
            
//             {loading && <div className="text-blue-400 text-center text-xl py-10">Loading events...</div>}
//             {pageError && <div className="text-red-400 text-center text-xl py-10">{pageError}</div>}
            
//             {/* Event Grid */}
//             {!loading && !pageError && events.length === 0 && (
//                 <div className="text-gray-500 text-center py-10">No events found in {city} matching your filters.</div>
//             )}
            
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {!loading && events.map((event) => (
//                     <EventCard key={event._id} event={event} />
//                 ))}


//             </div>
//         </div>
//     );
// };

// export default EventsPage;

//-------------------------------------------------------------------------------------------------------

// client/src/pages/EventsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import DiscoverySection from '../components/DiscoverySection.jsx';
import EventCard from '../components/EventCard.jsx';
import { fetchEvents } from '../api/eventApi.js'; 
import { useDebounce } from '../hooks/useDebounce.js'; // <-- NEW IMPORT

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
        <div className="events-page">
            <DiscoverySection 
                filters={filters} 
                onFilterChange={handleFilterChange} 
            />
            
            <h2 className="text-3xl font-extrabold text-white mt-4 mb-6 border-b border-gray-700 pb-2">Local Events</h2>
            
            {loading && <div className="text-blue-400 text-center text-xl py-10">Loading events...</div>}
            {pageError && <div className="text-red-400 text-center text-xl py-10">{pageError}</div>}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {!loading && events.map((event) => (
                    <EventCard key={event._id} event={event} seatsAvailable={filters.seatsAvailable}/> 
                ))}
            </div>
             {!loading && !pageError && events.length === 0 && (
                <div className="text-gray-500 text-center py-10">No events found in {filters.city} matching your filters.</div>
            )}
        </div>
    );
};

export default EventsPage;

//--------------------------------------------------------------------------------------------------------

// client/src/pages/EventsPage.jsx

// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import DiscoverySection from '../components/DiscoverySection.jsx';
// import EventCard from '../components/EventCard.jsx';
// import { fetchEvents } from '../api/eventApi.js'; 

// // Initial state for ALL filters, including city and search
// const initialFilters = {
//     city: 'Indore', 
//     search: '',
//     isPaid: null, // Critical: null means send nothing to backend
//     seatsAvailable: null, // Critical: Filtered on frontend
//     dateFilter: '',
//     timeFrom: '',
//     timeTo: '',
// };

// const EventsPage = () => {
//     const [events, setEvents] = useState([]); // Raw data from the backend
//     const [filters, setFilters] = useState(initialFilters); 
//     const [loading, setLoading] = useState(false);
//     const [pageError, setPageError] = useState(null);

//     // --- Data Fetching Logic (Triggers on filters change) ---

//     const fetchEventsData = useCallback(async (currentFilters) => {
//         setLoading(true);
//         setPageError(null);
        
//         const params = {};
//         Object.keys(currentFilters).forEach(key => {
//             const value = currentFilters[key];
            
//             // 1. OMIT null, undefined, or empty string values (This handles the UNSELECTED state)
//             if (value === null || value === undefined || value === '') {
//                 return; 
//             }
            
//             // 2. OMIT the seatsAvailable filter (handled locally)
//             if (key === 'seatsAvailable') {
//                 return;
//             }

//             // 3. Map frontend names to backend names (dateFilter -> date)
//             const backendKey = key === 'dateFilter' ? 'date' : key;
            
//             // 4. Convert booleans to strings ('true' or 'false') for backend
//             params[backendKey] = (typeof value === 'boolean') ? String(value) : value;
//         });

//         try {
//             const response = await fetchEvents(params);
//             setEvents(response.data);
//             console.log('Fetching events with filters:', params);
//         } catch (error) {
//             console.error('Failed to fetch events:', error);
//             setPageError(error.response?.status === 404 ? 'No events found.' : 'Could not load events. Server error.');
//             setEvents([]); // Clear events on error
//         } finally {
//             setLoading(false);
//         }
//     }, []); 

//     // Handler passed to DiscoverySection for ANY filter change
//     const handleFilterChange = (updates) => {
//         setFilters(prev => ({ ...prev, ...updates }));
//     };
    
//     // CRITICAL: Single useEffect hook watches the entire filters object
//     useEffect(() => { 
//         fetchEventsData(filters); 
//     }, [filters, fetchEventsData]);

//     // --- Local Filtering Logic (Seats Available) ---

//     const filteredEvents = useMemo(() => {
//         let currentEvents = events;
//         const seatsFilter = filters.seatsAvailable;

//         if (seatsFilter === true) {
//             // Filter: Only show events where seatsRemaining > 0
//             currentEvents = currentEvents.filter(event => {
//                 const seatsRemaining = event.totalSeats - (event.seatsTaken || 0);
//                 return seatsRemaining > 0;
//             });
//         }
        
//         return currentEvents;
//     }, [events, filters.seatsAvailable]);


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
//                 {/* Render the locally filtered list */}
//                 {!loading && filteredEvents.map((event) => (
//                     <EventCard key={event._id} event={event} />
//                 ))}
//             </div>
//             {!loading && filteredEvents.length === 0 && !pageError && (
//                 <div className="text-gray-500 text-center py-10">
//                     No events found in {filters.city} matching your filters.
//                 </div>
//             )}
//         </div>
//     );
// };

// export default EventsPage;
