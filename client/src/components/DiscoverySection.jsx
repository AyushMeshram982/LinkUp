// import React, { useState } from 'react';
// // import { Search } from 'lucide-react'; // Example import for the search icon
// import "../styles/DiscoverySection.css"

// import Cal from "./Cal.jsx"

// // Initial state for all filters and search input
// const initialDiscoveryState = {
//     city: 'Indore', // Default to a selected city
//     search: '',
//     isPaid: null, // null = show all; true = show paid; false = show free
//     seatsAvailable: null,
//     // Note: Date and Time filters will be more complex and managed separately or simplified here.
//     dateFilter: '', // Using empty string for date inputs (better for controlled component)
//     timeFrom: '',
//     timeTo: '',
// };

// const DiscoverySection = ({ onFilterChange, selectedCity, setCity }) => {
//     // State for managing search and filter chip selection
//     const [filters, setFilters] = useState(initialDiscoveryState);
//     const [searchQuery, setSearchQuery] = useState('');

//     // --- Static Filter Data ---
//     const filterChips = [
//         { key: 'isPaid', label: 'Paid', value: true },
//         { key: 'isPaid', label: 'Free', value: false },
//         { key: 'seatsAvailable', label: 'Seats Available', value: true },
//     ];

//     // --- Handlers ---

//     // Handles changes to City and Search inputs
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;

//         if (name === 'city') {
//             setCity(value); // Update parent state for display and API
//         } else if (name === 'search') {
//             setSearchQuery(value);
//         } else {
//             // Update the consolidated filters state for date/time
//             const newFilters = { ...filters, [name]: value };
//             setFilters(newFilters);
            
//             // Auto-submit filters on Date/Time change for instant feedback
//             // Pass the current search query and chip filters along
//             onFilterChange({
//                 ...newFilters,
//                 city: selectedCity,
//                 search: searchQuery,
//             });
//         }
//     };

//     // Handles the actual API filter dispatch (e.g., when clicking search button)
//     const handleSearchSubmit = (e) => {
//         e.preventDefault();

//         // Dispatch the current state of filters and search to the parent page
//         onFilterChange({
//             ...filters,
//             city: selectedCity,
//             search: searchQuery,
//         });
//     };

//     // Handles toggling of the chip filters (Paid, Available)
//     const handleChipClick = (key, value) => {
//         const currentValue = filters[key];

//         // Toggle logic: if clicked again, set to null to disable filter
//         const newValue = currentValue === value ? null : value;

//         const newFilters = { ...filters, [key]: newValue };
//         setFilters(newFilters);

//         // Immediately dispatch filter change
//         onFilterChange({
//             ...newFilters,
//             city: selectedCity,
//             search: searchQuery,
//         });
//     };

//      const handleClearFilter = (key) => {
//         const newFilters = { ...filters, [key]: '' }; // Set back to empty string
//         setFilters(newFilters);
        
//         // Immediately dispatch filter change
//         onFilterChange({
//             ...newFilters,
//             city: selectedCity,
//             search: searchQuery,
//         });
//     }

//     return (
//         <section className="">
//             <div className="header-actionpart">

//                 {/* CTA */}
//                 <div className='call-to-action'>
//                     Discover what's happening right now in  {selectedCity || 'Your City'}
//                 </div>
               

//                 <div className='city-search'>
//                     <form onSubmit={handleSearchSubmit} className="city-search-form">
//                         {/* City Selector */}
                        
//                         <select name="city" value={selectedCity} onChange={handleInputChange} className="city-selector" >
//                             {/* Placeholder/Initial City */}
//                             <option value="Indore">Indore</option>
//                             <option value="Bhopal">Bhopal</option>
//                             <option value="Mumbai">Mumbai</option>
//                         </select>

//                         {/* Search Input */}

//                         <div className="search-wrapper">

//                             <input type="text" name="search" value={searchQuery} onChange={handleInputChange} className="search-selector" placeholder='search' />

//                             <button type="submit" className="search-icon"> <span className="material-symbols-outlined">search</span> </button>
//                         </div>
//                     </form>


//                     {/* Filter Strip (Chips) */}
//                     <div className='filter'>
                        
//                         {filterChips.map((chip) => (
//                             <button key={chip.label} type="button" onClick={() => handleChipClick(chip.key, chip.value)} className={`filter-chips ${filters[chip.key] === chip.value ? 'filter-selected' : '' }`} > {chip.label} </button>
//                         ))}
//                         {/* Placeholder for Date/Time Filter Inputs */}
//                         {/* <input type="date" className="date-filter"/> */}
//                         <Cal />
//                         <button className='filter-chips'>Time From</button>
//                         <button className='filter-chips'>Time To</button>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default DiscoverySection;

// ----------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------

// client/src/components/DiscoverySection.jsx

import React from 'react';
import { Search, X, Calendar, Clock } from 'lucide-react'; 
import "../styles/DiscoverySection.css"

const DiscoverySection = ({ onFilterChange, filters }) => { 
    
    const filterChips = [
        { key: 'isPaid', label: 'Paid', value: true },
        { key: 'isPaid', label: 'Free', value: false },
        { key: 'seatsAvailable', label: 'Seats Available', value: true },
    ];

    // --- Handlers ---
    
    // Handles changes to ALL inputs (city, search, date, time)
    // Directly dispatches the change to the parent, which updates the centralized state
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ [name]: value });
    };

    // Handles the Chip toggling (Paid, Available, Seats)
    const handleChipClick = (key, value) => {
        const currentValue = filters[key];
        const newValue = currentValue === value ? null : value;
        onFilterChange({ [key]: newValue });
    };
    
    // Handles clearing a specific filter (Date, Time From/To, Search)
    const handleClearFilter = (key) => {
        // Use appropriate clear value: '' for strings/dates, null for chips
        const clearValue = (key === 'isPaid' || key === 'seatsAvailable') ? null : ''; 
        onFilterChange({ [key]: clearValue });
    };

    // The Search submit button is now redundant but kept for accessibility (Enter key)
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Since the fetch is already debounced, we just force the input value update if needed
    };

    return (
        <section className="discovery-section">
            <div className="header-actionpart">
                
                {/* CTA */}
                <div className="call-to-action">
                    Discover what's happening right now in {filters.city || '[City Name]'}
                    {/* <span className="text-blue-400"> {filters.city || '[City Name]'}</span> */}
                </div>
                
                {/* Search Bar and City Selector */}
                <div className="city-search">
                    <form onSubmit={handleSearchSubmit} className="city-search-form">
                        {/* City Selector */}
                        <select name="city" value={filters.city} onChange={handleInputChange} className="city-selector" >
                            <option value="Indore">Indore</option>
                            <option value="Bhopal">Bhopal</option>
                            <option value="Mumbai">Mumbai</option>
                        </select>

                        {/* Search Input with Clear Button */}
                        <div className="search-wrapper">
                            <input type="text" name="search" value={filters.search} placeholder='search' onChange={handleInputChange} className="search-selector" />

                                {/* need to see */}
                                {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /> */}
                                {filters.search && (
                                    <button type="button" onClick={() => handleClearFilter('search')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-500 transition focus:outline-none z-10">
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                                {/* uptil here need to see */}
                        </div>
                    
                        <button type="submit" className="search-icon">
                             <span className="material-symbols-outlined">search</span>
                        </button>
                    </form>

                    {/* Filter Strip (Chips and Date/Time) */}
                    <div className="filter">
                    
                        {/* Paid/Free and Availability Chips */}
                        {filterChips.map((chip) => (
                            <button key={chip.label} type="button" onClick={() => handleChipClick(chip.key, chip.value)} className={`filter-chips ${filters[chip.key] === chip.value ? 'filter-selected' : '' }`}>
                                {chip.label}
                            </button>
                        ))}
                    
                        {/* Date Filter Input */}
                        <div className="relative flex items-center group">
                            <input type="date" name="dateFilter" value={filters.dateFilter} onChange={handleInputChange} className="filter-chips"/>

                            <Calendar className="absolute right-4 text-gray-400 h-5 w-5 pointer-events-none group-hover:text-white" />

                            {filters.dateFilter && (
                                <button type="button" onClick={() => handleClearFilter('dateFilter')} className="absolute right-0 mr-3 text-red-400 hover:text-red-500 transition focus:outline-none z-10 p-1">
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    
                        {/* Time From Filter Input */}
                        <div className="relative flex items-center group">
                            <input type="time" name="timeFrom" value={filters.timeFrom} onChange={handleInputChange} className="filter-chips"/>

                            <Clock className="absolute right-4 text-gray-400 h-5 w-5 pointer-events-none group-hover:text-white" />

                            {filters.timeFrom && (
                                <button type="button" onClick={() => handleClearFilter('timeFrom')} className="absolute right-0 mr-3 text-red-400 hover:text-red-500 transition focus:outline-none z-10 p-1">
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    
                        {/* Time To Filter Input */}
                        <div className="relative flex items-center group">
                            <input type="time" name="timeTo" value={filters.timeTo} onChange={handleInputChange} className="filter-chips"/>

                            <Clock className="absolute right-4 text-gray-400 h-5 w-5 pointer-events-none group-hover:text-white" />

                            {filters.timeTo && (
                                <button type="button" onClick={() => handleClearFilter('timeTo')} className="absolute right-0 mr-3 text-red-400 hover:text-red-500 transition focus:outline-none z-10 p-1">
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default DiscoverySection;

//---------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------

// client/src/components/DiscoverySection.jsx

// import React from 'react';
// import { Search, X, Calendar, Clock } from 'lucide-react'; 

// const DiscoverySection = ({ onFilterChange, filters }) => { 
    
//     // ... Static Filter Data ...
//     const filterChips = [
//         { key: 'isPaid', label: 'Paid', value: true },
//         { key: 'isPaid', label: 'Free', value: false },
//         { key: 'seatsAvailable', label: 'Seats Available', value: true },
//     ];

//     // --- Handlers ---
    
//     const handleInputChange = (e) => {
//         onFilterChange({ [e.target.name]: e.target.value });
//     };

//     const handleChipClick = (key, value) => {
//         const currentValue = filters[key];
//         const newValue = currentValue === value ? null : value;
//         onFilterChange({ [key]: newValue });
//     };
    
//     const handleClearFilter = (key) => {
//         // Clear value is used for strings ('') or null for chips
//         const clearValue = (key === 'isPaid' || key === 'seatsAvailable') ? null : ''; 
//         onFilterChange({ [key]: clearValue });
//     };

//     const handleSearchSubmit = (e) => {
//         e.preventDefault();
//         // Trigger fetch via onFilterChange (ensures event is caught even if search input didn't change)
//         onFilterChange({ search: filters.search }); 
//     };

//     return (
//         <section className="py-10 text-white">
//             <div className="max-w-4xl mx-auto text-center">
                
//                 {/* CTA */}
//                 <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
//                     Discover what's happening right now in 
//                     <span className="text-blue-400"> {filters.city || '[City Name]'}</span>
//                 </h1>
                
//                 {/* Search Bar and City Selector */}
//                 <form onSubmit={handleSearchSubmit} className="flex items-center justify-center space-x-2 mb-8">
//                     {/* City Selector (Change triggers fetch via handleInputChange) */}
//                     <select
//                         name="city"
//                         value={filters.city} 
//                         onChange={handleInputChange}
//                         className="bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/4"
//                     >
//                         <option value="Indore">Indore</option>
//                         <option value="Bhopal">Bhopal</option>
//                         <option value="Mumbai">Mumbai</option>
//                     </select>

//                     {/* Search Input with Clear Button */}
//                     <div className="relative flex-grow">
//                         <input
//                             type="text"
//                             name="search"
//                             placeholder="Search events, venues, or keywords..."
//                             value={filters.search}
//                             onChange={handleInputChange}
//                             className="w-full px-4 py-3 pl-10 pr-10 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                         {filters.search && (
//                             <button 
//                                 type="button"
//                                 onClick={() => handleClearFilter('search')} // Clear button for search
//                                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-500 transition focus:outline-none z-10"
//                             >
//                                 <X className="h-4 w-4" />
//                             </button>
//                         )}
//                     </div>
                    
//                     <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition duration-200">
//                         Search
//                     </button>
//                 </form>

//                 {/* Filter Strip (Chips and Date/Time) */}
//                 <div className="flex justify-center flex-wrap space-x-3 mb-4">
//                     <span className="text-gray-400 text-sm font-semibold pt-2 mr-2">Filter By:</span>
                    
//                     {/* Paid/Free and Availability Chips */}
//                     {filterChips.map((chip) => (
//                         <button
//                             key={chip.label}
//                             type="button"
//                             onClick={() => handleChipClick(chip.key, chip.value)}
//                             className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
//                                 filters[chip.key] === chip.value
//                                     ? 'bg-blue-600 text-white shadow-lg'
//                                     : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                             }`}
//                         >
//                             {chip.label}
//                         </button>
//                     ))}
                    
//                     {/* Date Filter Input (Change triggers fetch via handleInputChange) */}
//                     <div className="relative flex items-center group">
//                         <input 
//                             type="date" 
//                             name="dateFilter" 
//                             value={filters.dateFilter} 
//                             onChange={handleInputChange}
//                             className="bg-gray-700 text-gray-300 px-3 py-2 rounded-full text-sm font-medium ml-3 appearance-none focus:ring-2 focus:ring-blue-500 border border-gray-700 pr-10"
//                         />
//                         <Calendar className="absolute right-4 text-gray-400 h-5 w-5 pointer-events-none group-hover:text-white" />
//                         {filters.dateFilter && (
//                             <button 
//                                 type="button"
//                                 onClick={() => handleClearFilter('dateFilter')}
//                                 className="absolute right-0 mr-3 text-red-400 hover:text-red-500 transition focus:outline-none z-10 p-1"
//                             >
//                                 <X className="h-4 w-4" />
//                             </button>
//                         )}
//                     </div>
                    
//                     {/* Time From Filter Input */}
//                     <div className="relative flex items-center group">
//                         <input 
//                             type="time" 
//                             name="timeFrom" 
//                             value={filters.timeFrom} 
//                             onChange={handleInputChange}
//                             className="bg-gray-700 text-gray-300 px-3 py-2 rounded-full text-sm font-medium ml-3 appearance-none focus:ring-2 focus:ring-blue-500 border border-gray-700 pr-10"
//                         />
//                          <Clock className="absolute right-4 text-gray-400 h-5 w-5 pointer-events-none group-hover:text-white" />
//                          {filters.timeFrom && (
//                             <button 
//                                 type="button"
//                                 onClick={() => handleClearFilter('timeFrom')}
//                                 className="absolute right-0 mr-3 text-red-400 hover:text-red-500 transition focus:outline-none z-10 p-1"
//                             >
//                                 <X className="h-4 w-4" />
//                             </button>
//                         )}
//                     </div>
                    
//                     {/* Time To Filter Input */}
//                     <div className="relative flex items-center group">
//                         <input 
//                             type="time" 
//                             name="timeTo" 
//                             value={filters.timeTo} 
//                             onChange={handleInputChange}
//                             className="bg-gray-700 text-gray-300 px-3 py-2 rounded-full text-sm font-medium ml-3 appearance-none focus:ring-2 focus:ring-blue-500 border border-gray-700 pr-10"
//                         />
//                         <Clock className="absolute right-4 text-gray-400 h-5 w-5 pointer-events-none group-hover:text-white" />
//                         {filters.timeTo && (
//                             <button 
//                                 type="button"
//                                 onClick={() => handleClearFilter('timeTo')}
//                                 className="absolute right-0 mr-3 text-red-400 hover:text-red-500 transition focus:outline-none z-10 p-1"
//                             >
//                                 <X className="h-4 w-4" />
//                             </button>
//                         )}
//                     </div>

//                 </div>
//             </div>
//         </section>
//     );
// };

// export default DiscoverySection;





// ----------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------

// client/src/components/DiscoverySection.jsx  -- For Security

// import React from 'react';
// import { Search, X, Calendar, Clock } from 'lucide-react'; 

// const DiscoverySection = ({ onFilterChange, filters }) => { 
    
//     const filterChips = [
//         { key: 'isPaid', label: 'Paid', value: true },
//         { key: 'isPaid', label: 'Free', value: false },
//         { key: 'seatsAvailable', label: 'Seats Available', value: true },
//     ];

//     // --- Handlers ---
    
//     // Handles changes to ALL inputs (city, search, date, time)
//     // Directly dispatches the change to the parent, which updates the centralized state
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         onFilterChange({ [name]: value });
//     };

//     // Handles the Chip toggling (Paid, Available, Seats)
//     const handleChipClick = (key, value) => {
//         const currentValue = filters[key];
//         const newValue = currentValue === value ? null : value;
//         onFilterChange({ [key]: newValue });
//     };
    
//     // Handles clearing a specific filter (Date, Time From/To, Search)
//     const handleClearFilter = (key) => {
//         // Use appropriate clear value: '' for strings/dates, null for chips
//         const clearValue = (key === 'isPaid' || key === 'seatsAvailable') ? null : ''; 
//         onFilterChange({ [key]: clearValue });
//     };

//     // The Search submit button is now redundant but kept for accessibility (Enter key)
//     const handleSearchSubmit = (e) => {
//         e.preventDefault();
//         // Since the fetch is already debounced, we just force the input value update if needed
//     };

//     return (
//         <section className="py-10 text-white">
//             <div className="max-w-4xl mx-auto text-center">
                
//                 {/* CTA */}
//                 <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
//                     Discover what's happening right now in 
//                     <span className="text-blue-400"> {filters.city || '[City Name]'}</span>
//                 </h1>
                
//                 {/* Search Bar and City Selector */}
//                 <form onSubmit={handleSearchSubmit} className="flex items-center justify-center space-x-2 mb-8">
//                     {/* City Selector */}
//                     <select
//                         name="city"
//                         value={filters.city} // Controlled input from filters state
//                         onChange={handleInputChange}
//                         className="bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/4"
//                     >
//                         <option value="Indore">Indore</option>
//                         <option value="Bhopal">Bhopal</option>
//                         <option value="Mumbai">Mumbai</option>
//                     </select>

//                     {/* Search Input with Clear Button */}
//                     <div className="relative flex-grow">
//                         <input
//                             type="text"
//                             name="search"
//                             placeholder="Search events, venues, or keywords..."
//                             value={filters.search} // Controlled input from filters state
//                             onChange={handleInputChange}
//                             className="w-full px-4 py-3 pl-10 pr-10 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                         {filters.search && (
//                             <button 
//                                 type="button"
//                                 onClick={() => handleClearFilter('search')}
//                                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-500 transition focus:outline-none z-10"
//                             >
//                                 <X className="h-4 w-4" />
//                             </button>
//                         )}
//                     </div>
                    
//                     <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition duration-200">
//                         Search
//                     </button>
//                 </form>

//                 {/* Filter Strip (Chips and Date/Time) */}
//                 <div className="flex justify-center flex-wrap space-x-3 mb-4">
//                     <span className="text-gray-400 text-sm font-semibold pt-2 mr-2">Filter By:</span>
                    
//                     {/* Paid/Free and Availability Chips */}
//                     {filterChips.map((chip) => (
//                         <button
//                             key={chip.label}
//                             type="button"
//                             onClick={() => handleChipClick(chip.key, chip.value)}
//                             className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
//                                 filters[chip.key] === chip.value
//                                     ? 'bg-blue-600 text-white shadow-lg'
//                                     : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                             }`}
//                         >
//                             {chip.label}
//                         </button>
//                     ))}
                    
//                     {/* Date Filter Input */}
//                     <div className="relative flex items-center group">
//                         <input 
//                             type="date" 
//                             name="dateFilter" 
//                             value={filters.dateFilter} 
//                             onChange={handleInputChange}
//                             className="bg-gray-700 text-gray-300 px-3 py-2 rounded-full text-sm font-medium ml-3 appearance-none focus:ring-2 focus:ring-blue-500 border border-gray-700 pr-10"
//                         />
//                         <Calendar className="absolute right-4 text-gray-400 h-5 w-5 pointer-events-none group-hover:text-white" />
//                         {filters.dateFilter && (
//                             <button 
//                                 type="button"
//                                 onClick={() => handleClearFilter('dateFilter')}
//                                 className="absolute right-0 mr-3 text-red-400 hover:text-red-500 transition focus:outline-none z-10 p-1"
//                             >
//                                 <X className="h-4 w-4" />
//                             </button>
//                         )}
//                     </div>
                    
//                     {/* Time From Filter Input */}
//                     <div className="relative flex items-center group">
//                         <input 
//                             type="time" 
//                             name="timeFrom" 
//                             value={filters.timeFrom} 
//                             onChange={handleInputChange}
//                             className="bg-gray-700 text-gray-300 px-3 py-2 rounded-full text-sm font-medium ml-3 appearance-none focus:ring-2 focus:ring-blue-500 border border-gray-700 pr-10"
//                         />
//                          <Clock className="absolute right-4 text-gray-400 h-5 w-5 pointer-events-none group-hover:text-white" />
//                          {filters.timeFrom && (
//                             <button 
//                                 type="button"
//                                 onClick={() => handleClearFilter('timeFrom')}
//                                 className="absolute right-0 mr-3 text-red-400 hover:text-red-500 transition focus:outline-none z-10 p-1"
//                             >
//                                 <X className="h-4 w-4" />
//                             </button>
//                         )}
//                     </div>
                    
//                     {/* Time To Filter Input */}
//                     <div className="relative flex items-center group">
//                         <input 
//                             type="time" 
//                             name="timeTo" 
//                             value={filters.timeTo} 
//                             onChange={handleInputChange}
//                             className="bg-gray-700 text-gray-300 px-3 py-2 rounded-full text-sm font-medium ml-3 appearance-none focus:ring-2 focus:ring-blue-500 border border-gray-700 pr-10"
//                         />
//                         <Clock className="absolute right-4 text-gray-400 h-5 w-5 pointer-events-none group-hover:text-white" />
//                         {filters.timeTo && (
//                             <button 
//                                 type="button"
//                                 onClick={() => handleClearFilter('timeTo')}
//                                 className="absolute right-0 mr-3 text-red-400 hover:text-red-500 transition focus:outline-none z-10 p-1"
//                             >
//                                 <X className="h-4 w-4" />
//                             </button>
//                         )}
//                     </div>

//                 </div>
//             </div>
//         </section>
//     );
// };

// export default DiscoverySection;

//---------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
