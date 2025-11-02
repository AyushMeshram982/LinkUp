import React, { useState } from 'react';
// import { Search } from 'lucide-react'; // Example import for the search icon
import "../styles/DiscoverySection.css"

import Cal from "./Cal.jsx"

// Initial state for all filters and search input
const initialDiscoveryState = {
    city: 'Indore', // Default to a selected city
    search: '',
    isPaid: null, // null = show all; true = show paid; false = show free
    seatsAvailable: null,
    // Note: Date and Time filters will be more complex and managed separately or simplified here.
    dateFilter: '', // Using empty string for date inputs (better for controlled component)
    timeFrom: '',
    timeTo: '',
};

const DiscoverySection = ({ onFilterChange, selectedCity, setCity }) => {
    // State for managing search and filter chip selection
    const [filters, setFilters] = useState(initialDiscoveryState);
    const [searchQuery, setSearchQuery] = useState('');

    // --- Static Filter Data ---
    const filterChips = [
        { key: 'isPaid', label: 'Paid', value: true },
        { key: 'isPaid', label: 'Free', value: false },
        { key: 'seatsAvailable', label: 'Seats Available', value: true },
    ];

    // --- Handlers ---

    // Handles changes to City and Search inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'city') {
            setCity(value); // Update parent state for display and API
        } else if (name === 'search') {
            setSearchQuery(value);
        } else {
            // Update the consolidated filters state for date/time
            const newFilters = { ...filters, [name]: value };
            setFilters(newFilters);
            
            // Auto-submit filters on Date/Time change for instant feedback
            // Pass the current search query and chip filters along
            onFilterChange({
                ...newFilters,
                city: selectedCity,
                search: searchQuery,
            });
        }
    };

    // Handles the actual API filter dispatch (e.g., when clicking search button)
    const handleSearchSubmit = (e) => {
        e.preventDefault();

        // Dispatch the current state of filters and search to the parent page
        onFilterChange({
            ...filters,
            city: selectedCity,
            search: searchQuery,
        });
    };

    // Handles toggling of the chip filters (Paid, Available)
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

    return (
        <section className="">
            <div className="header-actionpart">

                {/* CTA */}
                <div className='call-to-action'>
                    Discover what's happening right now in  {selectedCity || 'Your City'}
                </div>
               

                <div className='city-search'>
                    <form onSubmit={handleSearchSubmit} className="city-search-form">
                        {/* City Selector */}
                        
                        <select name="city" value={selectedCity} onChange={handleInputChange} className="city-selector" >
                            {/* Placeholder/Initial City */}
                            <option value="Indore">Indore</option>
                            <option value="Bhopal">Bhopal</option>
                            <option value="Mumbai">Mumbai</option>
                        </select>

                        {/* Search Input */}

                        <div className="search-wrapper">

                            <input type="text" name="search" value={searchQuery} onChange={handleInputChange} className="search-selector" placeholder='search' />

                            <button type="submit" className="search-icon"> <span className="material-symbols-outlined">search</span> </button>
                        </div>
                    </form>


                    {/* Filter Strip (Chips) */}
                    <div className='filter'>
                        
                        {filterChips.map((chip) => (
                            <button key={chip.label} type="button" onClick={() => handleChipClick(chip.key, chip.value)} className={`filter-chips ${filters[chip.key] === chip.value ? 'filter-selected' : '' }`} > {chip.label} </button>
                        ))}
                        {/* Placeholder for Date/Time Filter Inputs */}
                        {/* <input type="date" className="date-filter"/> */}
                        <Cal />
                        <button className='filter-chips'>Time From</button>
                        <button className='filter-chips'>Time To</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DiscoverySection;