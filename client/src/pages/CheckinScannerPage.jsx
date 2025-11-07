import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner'; // Scanner Library
import { checkInUser } from '../api/eventApi.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Search, CheckCircle, XCircle } from 'lucide-react';

const CheckinScannerPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, authLoading } = useAuth();
    
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // --- Authentication Check ---
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            alert("You must be logged in to use the check-in scanner.");
            navigate('/login');
        }
    }, [authLoading, isAuthenticated, navigate]);

    // --- Core Verification Logic ---
    const verifyToken = async (qrToken) => {
        if (isProcessing) return;

        setIsProcessing(true);
        setError(null);
        
        try {
            // 1. Send the token to the backend for verification
            const response = await checkInUser(qrToken);
            
            // 2. Success: Redirect to the success status page
            navigate('/checkin/status', { 
                state: { 
                    status: 'success',
                    data: response.data // Contains eventTitle, seatsReserved
                } 
            });
            
        } catch (err) {
            console.error('Check-in Verification Failed:', err);
            
            let errorMessage = "Access Denied: Not a registered attendee.";
            let eventTitle = "Unknown Event";
            
            if (err.response) {
                // Backend sent a specific error (e.g., 403 Access Denied)
                errorMessage = err.response.data.error || errorMessage;
                eventTitle = err.response.data.eventTitle || eventTitle;
            }

            // Redirect to the failure status page
            navigate('/checkin/status', {
                state: {
                    status: 'failure',
                    data: { message: errorMessage, eventTitle }
                }
            });
        } finally {
            setIsProcessing(false);
        }
    };

    // --- Scanner Handlers ---
    const handleScanSuccess = (result) => {
        if (result) {
            // Check if the content is a URL and extract the token part
            const content = result.text;
            const parts = content.split('/');
            const qrToken = parts[parts.length - 1]; // Assumes token is the last segment of the URL

            setScanResult(qrToken);
            verifyToken(qrToken);
        }
    };

    const handleError = (err) => {
        console.error("QR Scanner Error:", err);
        setError("Error accessing camera. Please check permissions.");
    };

    if (authLoading || isProcessing) {
        return <div className="text-blue-400 text-center text-xl py-10">Initializing Scanner...</div>;
    }

    if (!isAuthenticated) {
        return null; // Will redirect via useEffect hook
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
            <h1 className="text-4xl font-extrabold mb-6 text-blue-400">Scan Check-in Code</h1>
            
            <div className="w-full max-w-sm bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-700">
                {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
                
                <div className="relative overflow-hidden rounded-lg">
                    {/* QR Code Scanner Component */}
                    <Scanner
                        onDecode={handleScanSuccess}
                        onError={handleError}
                        constraints={{ facingMode: "environment" }} // Use rear camera
                        containerStyle={{ width: '100%', height: 'auto' }}
                        scanDelay={500} // Half-second delay to stabilize reading
                    />
                    {isProcessing && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-xl">
                            Verifying...
                        </div>
                    )}
                </div>
                
                <p className="mt-4 text-center text-gray-500 text-sm">Align the printed event QR code within the frame.</p>
            </div>
            
            {scanResult && <p className="mt-4 text-gray-400">Scanned Token: {scanResult.substring(0, 8)}...</p>}
        </div>
    );
};

export default CheckinScannerPage;