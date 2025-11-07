import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

const CheckinStatusPage = () => {
    // Get state passed from the scanner page
    const location = useLocation();
    const { status, data } = location.state || { status: 'error', data: { message: 'No status received.' } };

    const isSuccess = status === 'success';

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
            <div className="w-full max-w-md p-8 rounded-xl shadow-2xl border border-gray-700 text-white text-center" style={{ backgroundColor: isSuccess ? '#1F3A3D' : '#3D1F1F' }}>
                
                {isSuccess ? (
                    <>
                        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h1 className="text-3xl font-extrabold text-green-400 mb-2">VERIFIED!</h1>
                        <p className="text-xl font-semibold mb-4 text-white">{data.eventTitle}</p>
                        
                        <div className="border-t border-gray-700 pt-4 mt-4">
                            <p className="text-lg text-gray-300">Reserved Seats:</p>
                            <p className="text-5xl font-extrabold text-green-300">{data.seatsReserved}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                        <h1 className="text-3xl font-extrabold text-red-400 mb-2">ACCESS DENIED</h1>
                        <p className="text-lg font-semibold text-white mb-4">{data.message}</p>
                        <p className="text-sm text-gray-400">Attendee is not registered or ticket is invalid.</p>
                    </>
                )}

                <Link 
                    to="/host/dashboard" 
                    className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default CheckinStatusPage;