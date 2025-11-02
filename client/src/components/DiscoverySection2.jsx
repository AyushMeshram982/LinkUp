import React, { useState, useEffect } from 'react';
// import { Search, X, Calendar, Clock } from 'lucide-react'; // Added Calendar, Clock, X icons

// Initial state for all filters and search input
const initialDiscoveryState = {
    city: 'Indore', // Default to a selected city
    search: '',
    isPaid: null, 
    seatsAvailable: null,
    // NEW FILTER STATES:
    dateFilter: '', // Using empty string for date inputs (better for controlled component)
    timeFrom: '',
    timeTo: '',
};

const DiscoverySection = ({ onFilterChange, selectedCity, setCity }) => {
    // State for managing all filters
    const [filters, setFilters] = useState(initialDiscoveryState);
    const [searchQuery, setSearchQuery] = useState('');

    // --- Static Filter Data ---
    const filterChips = [
        { key: 'isPaid', label: 'Paid', value: true },
        { key: 'isPaid', label: 'Free', value: false },
        { key: 'seatsAvailable', label: 'Seats Available', value: true },
    ];

    // --- Handlers ---

    // Handles changes to ALL inputs (city, search, date, time)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'city') {
            setCity(value); // Update parent state for display and API
        } else if (name === 'search') {
            setSearchQuery(value); // Update local search state
        } else {
            // Update the consolidated filters state for date/time
            const newFilters = { ...filters, [name]: value };
            setFilters(newFilters);

            console.log('name: ', [name], ' value: ', value)
            
            // Auto-submit filters on Date/Time change for instant feedback
            // Pass the current search query and chip filters along
            onFilterChange({
                ...newFilters,
                city: selectedCity,
                search: searchQuery,
            });
        }
    };

    // Handles clearing a specific filter (Date, Time From/To)
    const handleClearFilter = (key) => {
        const newFilters = { ...filters, [key]: '' }; // Set back to empty string
        setFilters(newFilters);
        
        // Immediately dispatch filter change
        onFilterChange({
            ...newFilters,
            city: selectedCity,
            search: searchQuery,
        });
    }

    // Handles the Chip toggling (Paid, Available)
    const handleChipClick = (key, value) => {
        const currentValue = filters[key];
        
        // Toggle logic: if clicked again, set to null to disable filter
        const newValue = currentValue === value ? null : value;
        
        const newFilters = { ...filters, [key]: newValue };
        setFilters(newFilters);

        // Immediately dispatch filter change
        onFilterChange({
            ...newFilters,
            city: selectedCity,
            search: searchQuery,
        });
    };
    
    // Handles the official Search Button click (main search bar only)
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        
        // Dispatch the current state of filters and search to the parent page
        onFilterChange({
            ...filters,
            city: selectedCity,
            search: searchQuery,
        });
    };

    return (
        <section className="py-10 text-white">
            <div className="max-w-4xl mx-auto text-center">
                
                {/* CTA */}
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                    Discover what's happening right now in 
                    <span className="text-blue-400"> {selectedCity || '[City Name]'}</span>
                </h1>
                
                {/* Search Bar and City Selector */}
                <form onSubmit={handleSearchSubmit} className="flex items-center justify-center space-x-2 mb-8">
                    {/* City Selector */}
                    <select
                        name="city"
                        value={selectedCity}
                        onChange={handleInputChange}
                        className="bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/4"
                    >
                        <option value="Indore">Indore</option>
                        <option value="Bhopal">Bhopal</option>
                        <option value="Mumbai">Mumbai</option>
                    </select>

                    {/* Search Input */}
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            name="search"
                            placeholder="Search events, venues, or keywords..."
                            value={searchQuery}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 pl-10 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /> */}
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" >Se</span>
                    </div>
                    
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition duration-200">
                        Search
                    </button>
                </form>

                {/* Filter Strip (Chips and Date/Time) */}
                <div className="flex justify-center flex-wrap space-x-3 mb-4">
                    <span className="text-gray-400 text-sm font-semibold pt-2 mr-2">Filter By:</span>
                    
                    {/* Paid/Free and Availability Chips */}
                    {filterChips.map((chip) => (
                        <button
                            key={chip.label}
                            type="button"
                            onClick={() => handleChipClick(chip.key, chip.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                                filters[chip.key] === chip.value
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {chip.label}
                        </button>
                    ))}
                    
                    {/* Date Filter Input */}
                    <div className="relative flex items-center group">
                        <input 
                            type="date" 
                            name="dateFilter" 
                            value={filters.dateFilter} 
                            onChange={handleInputChange}
                            className="bg-gray-700 text-gray-300 px-3 py-2 rounded-full text-sm font-medium ml-3 appearance-none focus:ring-2 focus:ring-blue-500 border border-gray-700 pr-10"
                        />
                        {/* <Calendar className="absolute right-4 text-gray-400 h-5 w-5 pointer-events-none group-hover:text-white" /> */}
                        <span className="absolute right-4 text-gray-400 h-5 w-5 pointer-events-none group-hover:text-white" >Ca</span>
                        
                        {/* Clear Button */}
                        {filters.dateFilter && (
                            <button 
                                type="button"
                                onClick={() => handleClearFilter('dateFilter')}
                                className="absolute right-0 mr-3 text-red-400 hover:text-red-500 transition focus:outline-none z-10 p-1"
                            >
                                {/* <X className="h-4 w-4" /> */}
                                <span className="h-4 w-4" >X</span>

                            </button>
                        )}
                    </div>
                    
                    {/* Time From Filter Input */}
                    <div className="relative flex items-center group">
                        <input 
                            type="time" 
                            name="timeFrom" 
                            value={filters.timeFrom} 
                            onChange={handleInputChange}
                            placeholder="Time From"
                            className="bg-gray-700 text-gray-300 px-3 py-2 rounded-full text-sm font-medium ml-3 appearance-none focus:ring-2 focus:ring-blue-500 border border-gray-700 pr-10"
                        />
                         {/* <Clock className="absolute right-4 text-gray-400 h-5 w-5 pointer-events-none group-hover:text-white" /> */}
                         <span className="absolute right-4 text-gray-400 h-5 w-5 pointer-events-none group-hover:text-white" ></span>
                         {filters.timeFrom && (
                            <button 
                                type="button"
                                onClick={() => handleClearFilter('timeFrom')}
                                className="absolute right-0 mr-3 text-red-400 hover:text-red-500 transition focus:outline-none z-10 p-1"
                            >
                                {/* <X className="h-4 w-4" /> */}
                                <span className="h-4 w-4" >X</span>
                            </button>
                        )}
                    </div>
                    
                    {/* Time To Filter Input */}
                    <div className="relative flex items-center group">
                        <input 
                            type="time" 
                            name="timeTo" 
                            value={filters.timeTo} 
                            onChange={handleInputChange}
                            placeholder="Time To"
                            className="bg-gray-700 text-gray-300 px-3 py-2 rounded-full text-sm font-medium ml-3 appearance-none focus:ring-2 focus:ring-blue-500 border border-gray-700 pr-10"
                        />
                        {/* <Clock className="absolute right-4 text-gray-400 h-5 w-5 pointer-events-none group-hover:text-white" /> */}
                        <span className="absolute right-4 text-gray-400 h-5 w-5 pointer-events-none group-hover:text-white">Cl</span>
                        {filters.timeTo && (
                            <button 
                                type="button"
                                onClick={() => handleClearFilter('timeTo')}
                                className="absolute right-0 mr-3 text-red-400 hover:text-red-500 transition focus:outline-none z-10 p-1"
                            >
                                {/* <X className="h-4 w-4" /> */}
                                <span className="h-4 w-4">X</span>
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default DiscoverySection;