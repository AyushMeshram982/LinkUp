import React, { useState, useEffect, useCallback } from 'react';
import DiscoverySection from '../components/DiscoverySection.jsx';
import EventCard from '../components/EventCard.jsx'; // <-- NEW IMPORT
import { fetchEvents } from '../api/eventApi.js'; // API Service

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [city, setCity] = useState(''); // Default City State
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState(null);

    // Function to fetch data based on current filters (Debounced/Memoized for efficiency)
    const fetchEventsData = useCallback(async (currentFilters) => {
        setLoading(true);
        setPageError(null);
        
        // 1. Prepare params for backend
        const params = {
            city: currentFilters.city || city, // Use selected city
            search: currentFilters.search || '',
            isPaid: currentFilters.isPaid,
            seatsAvailable: currentFilters.seatsAvailable,
            // ... include date/time filters here when implemented
        };

        try {
            const response = await fetchEvents(params);
            setEvents(response.data);
            console.log(`Fetched ${response.data.length} events.`);
        } catch (error) {
            console.error('Failed to fetch events:', error);
            setPageError('Could not load events. Please check your network connection.');
        } finally {
            setLoading(false);
        }
    }, [city]); // Dependency array includes 'city' for clean state management

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
            <DiscoverySection 
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

export default EventsPage;