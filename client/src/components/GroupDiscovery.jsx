import React from 'react';
import { Search, X, Users, Zap, Star } from 'lucide-react'; // Icons
import "../styles/GroupDiscovery.css"

const GroupDiscovery = ({ onFilterChange, filters }) => { 
    
    // --- Static Filter Data ---
    const sizeChips = [
        { key: 'size', label: 'Small (<50)', value: 'small' },
        { key: 'size', label: 'Medium (50-200)', value: 'medium' },
        { key: 'size', label: 'Large (>200)', value: 'large' },
    ];
    
    const activityChips = [
        { key: 'active', label: 'Active Today', value: true },
        { key: 'newGroups', label: 'New Groups', value: true },
    ];

    // --- Handlers (Identical to EventDiscovery, ensuring consistency) ---
    
    const handleInputChange = (e) => {
        onFilterChange({ [e.target.name]: e.target.value });
    };

    const handleChipClick = (key, value) => {
        const currentValue = filters[key];
        // Toggle logic: if clicked again, set to null to disable filter
        const newValue = currentValue === value ? null : value;
        
        onFilterChange({ [key]: newValue });
    };
    
    const handleClearFilter = (key) => {
        const clearValue = (key === 'active' || key === 'newGroups') ? null : ''; 
        onFilterChange({ [key]: clearValue });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onFilterChange({ search: filters.search }); 
    };

    return (
        <section className="">
            <div className="header-actionpart-g">
                
                {/* CTA (Hybrid Model Focus) */}
                <div className="call-to-action-g">
                    Find Your Tribe. Connect Local in {filters.city || '[City Name]'}
                    {/* // <span className="text-blue-400"> {filters.city || '[City Name]'}</span> */}
                </div>
                
                {/* Search Bar and City Selector */}
                <div className="city-search-g">
                    <form onSubmit={handleSearchSubmit} className="city-search-form-g">
                        {/* City Selector */}
                        <select name="city" value={filters.city} onChange={handleInputChange} className="city-selector-g">
                            <option value="Indore">Indore</option>
                            <option value="Bhopal">Bhopal</option>
                            <option value="Mumbai">Mumbai</option>
                        </select>

                        {/* Search Input with Clear Button */}
                        <div className="search-wrapper-g">
                            <input type="text" name="search" placeholder="search" value={filters.search} onChange={handleInputChange} className="search-selector-g"/>

                            {filters.search && (
                                <button type="button" onClick={() => handleClearFilter('search')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-500 transition focus:outline-none z-10">
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    
                        <button type="submit" className="search-icon-g">
                            <span className="material-symbols-outlined">search</span>
                        </button>
                    </form>

                    {/* Filter Strip (Activity and Size Chips) */}
                    <div className="filter-g">
                     
                        {/* Activity Chips */}
                        {activityChips.map((chip) => (
                            <button key={chip.label} type="button" onClick={() => handleChipClick(chip.key, chip.value)} className={`filter-chips-g ${filters[chip.key] === chip.value ? 'filter-selected-g': '' }`}>
                                {chip.label}
                            </button>
                        ))}

                        {/* Size Chips */}
                        {sizeChips.map((chip) => (
                            <button key={chip.label} type="button" onClick={() => handleChipClick(chip.key, chip.value)} className={`filter-chips-g ${filters.size === chip.value ? 'filter-selected-g' : '' }`}>
                                {chip.label}
                            </button>
                        ))}
                    
                        {/* Placeholder: Add button for creating a new group */}
                        {/* <button 
                            className="ml-6 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full text-sm font-semibold flex items-center transition duration-200"
                            onClick={() => console.log("Navigate to Create Group")}
                        >
                            <Zap className="h-4 w-4 mr-1"/> Start a Group
                        </button> */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GroupDiscovery;