import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner'
import {useNavigate} from 'react-router-dom';
import { checkInUser } from '../api/eventApi.js';
import { useAuth } from '../contexts/AuthContext.jsx';

function QrScanner() {

    const navigate = useNavigate();

    const { isAuthenticated, authLoading } = useAuth();

    // const [scanResult, setScanResult ] = useState(null);
    const [ error, setError ] = useState(null);
    const [ isProcessing, setIsProcessing ] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            alert("You must be logged in to use the check-in scanner.");
            navigate('/login');
        }
    }, [authLoading, isAuthenticated, navigate]);

    const verifyToken = async (qrToken) => {
        if(isProcessing) return;

        setIsProcessing(true);
        setError(null);

        try{
            //sending token to beckend for verification
            const response = await checkInUser(qrToken);
            console.log('qr response is coming: ', response);

            navigate('/checkin/status', { 
                state: { 
                    status: 'success',
                    data: response.data // Contains eventTitle, seatsReserved
                } 
            });
        }
        catch(error){
            console.log('error is coming in qrscannerpage.jsx')

            let errorMessage = "Access Denied: Not a registered attendee.";
            let eventTitle = 'Unknown Event';

            navigate('/checkin/status', {
                state: {
                    status: 'failure',
                    data: { message: errorMessage, eventTitle }
                }
            });
        }
        finally{
            setIsProcessing(false);
        }
    }

    const handleScanSuccess = (detectedCodes) => {
        if(!detectedCodes) return ;

        console.log('Detected codes raw value: ', detectedCodes[0].rawValue)

        // detectedCodes.forEach(code => {
        //     console.log(`Format: ${code.format}, Value: ${code.rawValue}`);
        // })

        const contentLink = detectedCodes[0].rawValue
        const parts = contentLink.split('/');
        const qrToken = parts[parts.length - 1];
    
        // setScanResult(qrToken);
        verifyToken(qrToken);
    }

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
        <div style={{width: '100vw', height: '100vh', display: 'flex', justifyContent:'center', alignItems: 'center', borderRadius: '20px'}}>
            <div style={{height: '70%', width: 'auto', borderRadius: '20px'}}>

            <Scanner
            onScan = {handleScanSuccess}
            onError={handleError}
            />

            {isProcessing && (
                <div className="absolute inset-0 bg-amber-500 flex items-center justify-center text-white text-xl">
                    Verifying...
                </div>
                
            )}
            </div>
        </div>
    )
}

export default QrScanner