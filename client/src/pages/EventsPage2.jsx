// ... (imports and useState remain the same)
import React, { useState, useEffect, useCallback } from 'react';
import DiscoverySection2 from '../components/DiscoverySection2.jsx';
import EventCard from '../components/EventCard.jsx'; // <-- NEW IMPORT
import { fetchEvents } from '../api/eventApi.js'; // API Service

const EventsPage2 = () => {
    const [events, setEvents] = useState([]);
    const [city, setCity] = useState('Indore'); // Default City State
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState(null);

    // Function to fetch data based on current filters (Inside EventsPage component)
    const fetchEventsData = useCallback(async (currentFilters) => {
        setLoading(true);
        setPageError(null);
        
        // 1. Prepare params for backend
        const params = {
            city: currentFilters.city || city,
            search: currentFilters.search || '',
            isPaid: currentFilters.isPaid,
            seatsAvailable: currentFilters.seatsAvailable,
            
            // CRITICAL: Mapping new date/time filters
            date: currentFilters.dateFilter || undefined, // Use backend's preferred key 'date'
            timeFrom: currentFilters.timeFrom || undefined,
            timeTo: currentFilters.timeTo || undefined,
        };
        
        // Remove empty or null parameters before sending to API
        Object.keys(params).forEach(key => {
            if (params[key] === null || params[key] === undefined || params[key] === '') {
                delete params[key];
            }
        });
        
        try {
            const response = await fetchEvents(params);
            setEvents(response.data);
            console.log('Fetching events with filters:', params);
        } catch (error) {
            console.error('Failed to fetch events:', error);
            setPageError('Could not load events. Please check your network connection.');
        } finally {
            setLoading(false);
        }
    }, [city]); 

// ... (rest of the component remains the same)'

    // Handler passed to DiscoverySection
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        fetchEventsData(newFilters); // Trigger API call
    };
    
    // Initial fetch when component mounts
    useEffect(() => { 
        fetchEventsData({ city, ...filters }); 
    }, [fetchEventsData]);


    return (
        <div className="events-page">
            <DiscoverySection2 
                onFilterChange={handleFilterChange} 
                selectedCity={city}
                setCity={setCity}
            />
            
            <h2 className="text-3xl font-extrabold text-white mt-4 mb-6 border-b border-gray-700 pb-2">Local Events</h2>
            
            {loading && <div className="text-blue-400 text-center text-xl py-10">Loading events...</div>}
            {pageError && <div className="text-red-400 text-center text-xl py-10">{pageError}</div>}
            
            {/* Event Grid */}
            {!loading && !pageError && events.length === 0 && (
                <div className="text-gray-500 text-center py-10">No events found in {city} matching your filters.</div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {!loading && events.map((event) => (
                    <EventCard key={event._id} event={event} />
                ))}


            </div>
        </div>
    );
};

export default EventsPage2;