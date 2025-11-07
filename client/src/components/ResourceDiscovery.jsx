import React from 'react';
import { Search, X, Zap, DollarSign, Calendar } from 'lucide-react'; 
import "../styles/ResourceDiscovery.css"

const ResourceDiscovery = ({ onFilterChange, filters }) => { 
    
    // --- Static Filter Data ---
    const urgencyChips = [
        // Urgency filter is handled by the backend checking 'Needed This Week' logic (4 days)
        { key: 'urgency', label: 'Needed ASAP (4 Days)', value: true }, 
    ];

    // --- Handlers (Consistent with other discovery components) ---
    const handleInputChange = (e) => {
        onFilterChange({ [e.target.name]: e.target.value });
    };

    const handleChipClick = (key, value) => {
        const currentValue = filters[key];
        const newValue = currentValue === value ? null : value;
        onFilterChange({ [key]: newValue });
    };
    
    const handleClearFilter = (key) => {
        const clearValue = (key === 'urgency') ? null : ''; 
        onFilterChange({ [key]: clearValue });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onFilterChange({ search: filters.search }); 
    };

    return (
        <section className="">
            <div className="header-actionpart-r">
                
                {/* CTA */}
                <div className="call-to-action-r">
                    Lend a Hand. Grow Local Events in {filters.city || '[City Name]'}
                    {/* <span className="text-blue-400"> {filters.city || '[City Name]'}</span> */}
                </div>
                
                {/* Search Bar and City Selector */}
                <div className="city-search-r">
                <form onSubmit={handleSearchSubmit} className="city-search-form-r">
                    {/* City Selector */}
                    <select
                        name="city"
                        value={filters.city} 
                        onChange={handleInputChange}
                        className="city-selector-r"
                    >
                        <option value="Indore">Indore</option>
                        <option value="Bhopal">Bhopal</option>
                        <option value="Mumbai">Mumbai</option>
                    </select>

                    {/* Search Input with Clear Button */}
                    <div className="search-wrapper-r">
                        <input
                            type="text"
                            name="search"
                            placeholder="search"
                            value={filters.search}
                            onChange={handleInputChange}
                            className="search-selector-r"
                        />
                        {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /> */}
                        {filters.search && (
                            <button 
                                type="button"
                                onClick={() => handleClearFilter('search')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-500 transition focus:outline-none z-10"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    
                    <button type="submit" className="search-icon-r">
                        <span className="material-symbols-outlined">search</span>
                    </button>
                </form>

                {/* Filter Strip (Urgency and Date) */}
                <div className="filter-r">
                    {/* <span className="text-gray-400 text-sm font-semibold pt-2 mr-2">Filter By:</span> */}
                    
                    {/* Urgency Chip (sends 'urgency=true' to backend) */}
                    {urgencyChips.map((chip) => (
                        <button
                            key={chip.label}
                            type="button"
                            onClick={() => handleChipClick(chip.key, chip.value)}
                            className={`filter-chips-r ${filters[chip.key] === chip.value ? 'filter-selected-r' : '' }`}
                        >
                             {chip.label}
                        </button>
                    ))}

                    {/* Needed Date Filter Input (Allows filtering resources needed on a specific day) */}
                    <div className="relative flex items-center group">
                        <input 
                            type="date" 
                            name="neededDate" // Backend expects neededDate
                            value={filters.neededDate} 
                            onChange={handleInputChange}
                            className="filter-chips-r"
                        />
                        <Calendar className="absolute right-4 text-gray-400 h-5 w-5 pointer-events-none group-hover:text-white" />
                        {filters.neededDate && (
                            <button 
                                type="button"
                                onClick={() => handleClearFilter('neededDate')}
                                className="absolute right-0 mr-3 text-red-400 hover:text-red-500 transition focus:outline-none z-10 p-1"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    
                    {/* Placeholder for posting new resource request */}
                    {/* <button 
                        className="ml-6 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full text-sm font-semibold flex items-center transition duration-200"
                        onClick={() => console.log("Navigate to Post Resource")}
                    >
                        <DollarSign className="h-4 w-4 mr-1"/> Post A Request
                    </button> */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResourceDiscovery;