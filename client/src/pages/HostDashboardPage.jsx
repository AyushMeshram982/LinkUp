// import React, { useState, useEffect } from 'react';
// import { fetchHostedEvents } from '../api/userApi.js';
// import { useAuth } from '../contexts/AuthContext.jsx';
// import { Link, useNavigate } from 'react-router-dom';
// import { ChevronRight, Calendar, Users, QrCode, Zap, Edit } from 'lucide-react';

// const HostDashboardPage = () => {
//     const { isAuthenticated, user, loading: authLoading } = useAuth();
//     const navigate = useNavigate();
    
//     const [events, setEvents] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // --- Authentication Check ---
//     useEffect(() => {
//         if (!authLoading && !isAuthenticated) {
//             navigate('/login');
//         }
//     }, [authLoading, isAuthenticated, navigate]);

//     // --- Data Fetching ---
//     useEffect(() => {
//         const loadHostedEvents = async () => {
//             if (!isAuthenticated) return;
//             setLoading(true);
//             try {
//                 const response = await fetchHostedEvents();
//                 setEvents(response.data);
//             } catch (err) {
//                 console.error("Failed to load hosted events:", err);
//                 setError('Could not load your hosted events. Please try logging in again.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (isAuthenticated) {
//             loadHostedEvents();
//         }
//     }, [isAuthenticated]);

//     // --- Helper Component for Status Tag ---
//     const StatusTag = ({ event }) => {
//         if (event.isCancelled) {
//             return <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">Cancelled</span>;
//         }
//         if (new Date(event.date) < new Date()) {
//             return <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-semibold">Past</span>;
//         }
//         return <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">Active</span>;
//     };

//     // --- Render Logic ---
//     if (authLoading || loading) {
//         return <div className="text-blue-400 text-center text-xl py-10">Loading Dashboard...</div>;
//     }
    
//     if (error) {
//         return <div className="text-red-400 text-center text-xl py-10">{error}</div>;
//     }

//     if (events.length === 0) {
//         return (
//             <div className="text-white text-center py-20">
//                 <h2 className="text-2xl font-bold mb-4">No Events Hosted Yet</h2>
//                 <p className="text-gray-400 mb-6">Start your community! Post your first event to manage it here.</p>
//                 <Link to="/create-event" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition">
//                     Post New Event
//                 </Link>
//             </div>
//         );
//     }

//     return (
//         <div className="host-dashboard-page">
//             <h1 className="text-4xl font-extrabold text-white mb-8 border-b border-gray-700 pb-3">
//                 {user?.name}'s Host Dashboard
//             </h1>

//             <div className="space-y-6">
//                 {events.map((event) => {
//                     const seatsTaken = event.seatsTaken || 0;
//                     const seatsRemaining = event.totalSeats - seatsTaken;
//                     const isUpcoming = new Date(event.date) >= new Date();
                    
//                     return (
//                         <div 
//                             key={event._id} 
//                             className="bg-gray-800 p-6 rounded-xl shadow-lg flex justify-between items-center transition duration-200 hover:bg-gray-700/70 border border-gray-700"
//                         >
//                             {/* Left: Metadata and Status */}
//                             <div className="flex flex-col space-y-2">
//                                 <Link to={`/host/event/${event._id}`} className="text-2xl font-bold text-blue-400 hover:underline">
//                                     {event.title}
//                                 </Link>
//                                 <div className="text-gray-400 text-sm flex items-center space-x-4">
//                                     <StatusTag event={event} />
//                                     <span className="flex items-center"><Calendar className='w-4 h-4 mr-1'/> {new Date(event.date).toLocaleDateString()}</span>
//                                     {/* <span className="flex items-center"><MapPin className='w-4 h-4 mr-1'/> {event.city}</span> */}
//                                     <span className="flex items-center">{event.city}</span>
//                                 </div>
//                             </div>
                            
//                             {/* Center: Stats */}
//                             <div className="flex items-center space-x-8 text-white">
//                                 <div className="text-center">
//                                     <p className="text-3xl font-extrabold text-green-400">{seatsTaken}</p>
//                                     <p className="text-sm text-gray-400">Checked In / Taken</p>
//                                 </div>
//                                 <div className="text-center">
//                                     <p className="text-3xl font-extrabold">{event.totalSeats}</p>
//                                     <p className="text-sm text-gray-400">Total Seats</p>
//                                 </div>
//                                 <div className="text-center">
//                                     <p className="text-3xl font-extrabold text-yellow-400">{seatsRemaining}</p>
//                                     <p className="text-sm text-gray-400">Remaining</p>
//                                 </div>
//                             </div>

//                             {/* Right: Actions */}
//                             <div className="flex space-x-3">
//                                 {isUpcoming && (
//                                     <>
//                                         <Link to={`/host/checkin/${event._id}`} className="bg-purple-600 hover:bg-purple-700 p-3 rounded-lg text-white transition flex items-center">
//                                             <QrCode className='w-5 h-5 mr-2'/> Check-in
//                                         </Link>
//                                         <Link to={`/host/edit/${event._id}`} className="bg-gray-600 hover:bg-gray-700 p-3 rounded-lg text-white transition flex items-center">
//                                             <Edit className='w-5 h-5'/>
//                                         </Link>
//                                     </>
//                                 )}
//                                 <Link to={`/host/event/${event._id}`} className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-white transition flex items-center">
//                                     <ChevronRight className='w-5 h-5'/>
//                                 </Link>
//                                 <img src={`${event.qrCodeUrl}`} alt="" />
//                             </div>

//                             {console.log('title: ', event.title)};
//                             {console.log('city: ', event.city)};
//                             {console.log('date: ', event.date)};
//                             {console.log('time: ', event.time)};
//                             {console.log('ispaid: ', event.isPaid)};
//                             {console.log('price: ', event.price)};
//                             {console.log('seats taken: ', event.seatsTaken)};
//                             {/* {console.log('seats remaining: ', event.seatsRemaining)};  */}
//                             {console.log('total seats: ', event.totalSeats)}; 
//                             {console.log('isCancelled: ', event.isCancelled)}; 
//                             {console.log('qr: ', event.qrCodeUrl)}; 

//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// export default HostDashboardPage;

//-------------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { fetchHostedEvents } from '../api/userApi.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, Users, QrCode, Zap, Edit } from 'lucide-react';

import "../styles/HostDashboardPage.css"

const HostDashboardPage = () => {
    const { isAuthenticated, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [qrImage, setQrImage] = useState()

    // --- Authentication Check ---
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [authLoading, isAuthenticated, navigate]);

    // --- Data Fetching ---
    useEffect(() => {
        
        const loadHostedEvents = async () => {
            if (!isAuthenticated) return;
            setLoading(true);
            try {
                const response = await fetchHostedEvents();
                setEvents(response.data);
            } catch (err) {
                console.error("Failed to load hosted events:", err);
                setError('Could not load your hosted events. Please try logging in again.');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            loadHostedEvents();
        }
    }, [isAuthenticated]);

    // --- Helper Component for Status Tag ---
    const StatusTag = ({ event }) => {
        if (event.isCancelled) {
            return <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">Cancelled</span>;
        }
        if (new Date(event.date) < new Date()) {
            return <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-semibold">Past</span>;
        }
        return <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">Active</span>;
    };

    // --- Render Logic ---
    if (authLoading || loading) {
        return <div className="text-blue-400 text-center text-xl py-10">Loading Dashboard...</div>;
    }
    
    if (error) {
        return <div className="text-red-400 text-center text-xl py-10">{error}</div>;
    }

    if (events.length === 0) {
        return (
            <div className="text-white text-center py-20">
                <h2 className="text-2xl font-bold mb-4">No Events Hosted Yet</h2>
                <p className="text-gray-400 mb-6">Start your community! Post your first event to manage it here.</p>
                <Link to="/create-event" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition">
                    Post New Event
                </Link>
            </div>
        );
    }

   


    return (
        
        <div className="host-dashboard-page-hp">
            <h1 className="host-dashboard-host-name-hp">
                {user?.name}'s Host Dashboard
            </h1>

            <div className="host-dashboard-all-event-details-hp">
                {events.map((event) => {
                    const seatsTaken = event.seatsTaken || 0;
                    const seatsRemaining = event.totalSeats - seatsTaken;
                    const isUpcoming = new Date(event.date) >= new Date();
                    
                    return (
                        <>
                        <div 
                            key={event._id} 
                            className="host-dashboard-each-event-detail-hp"
                        >
                            {/* Left: Metadata and Status */}
                            <div className="host-dashboard-event-name-hp">
                                <Link to={`/host/event/${event._id}`} className="text-2xl font-bold text-blue-400 hover:underline">
                                    {event.title}
                                </Link>
                                {/* <div className="text-gray-400 text-sm flex items-center space-x-4">
                                    <StatusTag event={event} />
                                    <span className="flex items-center"><Calendar className='w-4 h-4 mr-1'/> {new Date(event.date).toLocaleDateString()}</span>
                                    
                                    <span className="flex items-center">{event.city}</span>
                                </div> */}
                            </div>

                            <div className="host-dashboard-event-city-hp">
                                <span>{event.city}</span>
                            </div>

                            <div className="host-dashboard-event-date-hp">
                                <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>

                            <div className="host-dashboard-event-time-hp">
                                <span>{event.time}</span>
                            </div>

                            <div className="host-dashboard-event-isPaid-hp">
                                <span>{event.isPaid ? 'true' : 'false'}</span>
                            </div>

                            <div className="host-dashboard-event-price-hp">
                                <span>{event.price}</span>
                            </div>

                            <div className="host-dashboard-event-seats-hp">
                                <span>{event.seatsTaken}/{event.totalSeats}</span>
                            </div>

                            <div className="host-dashboard-event-isCancelled-hp">
                                <span>{event.isCancelled ? 'true' : 'false'}</span>
                            </div>

                            <div className="host-dashboard-event-image-qr-hp">
                                <button className='qr-image-button-hp' onClick={() => setQrImage(event.qrCodeUrl)}>Qr Code</button>
                                
                            </div>

                            
                            
                            {/* Center: Stats */}
                            {/* <div className="flex items-center space-x-8 text-white">
                                <div className="text-center">
                                    <p className="text-3xl font-extrabold text-green-400">{seatsTaken}</p>
                                    <p className="text-sm text-gray-400">Checked In / Taken</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-extrabold">{event.totalSeats}</p>
                                    <p className="text-sm text-gray-400">Total Seats</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-extrabold text-yellow-400">{seatsRemaining}</p>
                                    <p className="text-sm text-gray-400">Remaining</p>
                                </div>
                            </div> */}

                            {/* Right: Actions */}
                            {/* <div className="flex space-x-3">
                                {isUpcoming && (
                                    <>
                                        <Link to={`/host/checkin/${event._id}`} className="bg-purple-600 hover:bg-purple-700 p-3 rounded-lg text-white transition flex items-center">
                                            <QrCode className='w-5 h-5 mr-2'/> Check-in
                                        </Link>
                                        <Link to={`/host/edit/${event._id}`} className="bg-gray-600 hover:bg-gray-700 p-3 rounded-lg text-white transition flex items-center">
                                            <Edit className='w-5 h-5'/>
                                        </Link>
                                    </>
                                )}
                                <Link to={`/host/event/${event._id}`} className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-white transition flex items-center">
                                    <ChevronRight className='w-5 h-5'/>
                                </Link> */}
                                {/* <img src={`${event.qrCodeUrl}`} alt="" /> */}
                            {/* </div> */}

                            {/* {console.log('title: ', event.title)};
                            {console.log('city: ', event.city)};
                            {console.log('date: ', event.date)};
                            {console.log('time: ', event.time)};
                            {console.log('ispaid: ', event.isPaid)};
                            {console.log('price: ', event.price)};
                            {console.log('seats taken: ', event.seatsTaken)}; */}
                            {/* {console.log('seats remaining: ', event.seatsRemaining)};  */}
                            {/* {console.log('total seats: ', event.totalSeats)}; 
                            {console.log('isCancelled: ', event.isCancelled)}; 
                            {console.log('qr: ', event.qrCodeUrl)};  */}

                        </div>
                        
                            </>
                    );
                    
                })}
            </div>
            <div className={qrImage ? 'host-dashboard-qr-image-hp' : 'no-host-dashboard-qr-image-hp'}>
                <img src={`${qrImage}`} alt="" />
            </div>
        </div>
    );
};

export default HostDashboardPage;