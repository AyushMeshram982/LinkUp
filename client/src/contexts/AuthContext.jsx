import React, { createContext, useState, useEffect, useContext } from "react";
import   API  from "../api/axiosInstance.js"

//defining initial state (null means user is logged out)
const AuthContext = createContext(null);

//defining Provider component
export const AuthProvider = ({ children }) => {
    //state to hold user's data and token
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); //tracks initial load

    //initial load: checks local storage for existing session
    useEffect(() => {
        //retrieve token and user data from local storage
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if(storedToken && storedUser){
            try{
                const userData = JSON.parse(storedUser);

                setToken(storedToken);
                setUser(userData);

                console.log('Session restored from local storage.');
            }
            catch(error){
                //Handle corrupted storage data
                console.error("Failed to parse user data from storage.");

                localStorage.clear();
            }
        }
        setLoading(false); //Done checking storage
    }, []);

    //Authentication functions
    
    //function to handle successful login or registration
    const login = (userData, jwtToken) => {
        setToken(jwtToken);
        setUser(userData);

        //Storage session data securely in local storage
        localStorage.setItem('token', jwtToken);

        localStorage.setItem('user', JSON.stringify(userData));

        //note : the axios interceptor (to be added next) will now attack this token to headers
    };

    //function to handle logout
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.clear(); //clear all session data
    };

    //context value
    const contextValue = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
    };

    //render provider
    if(loading){
        return <div>
            Loading Application...
        </div>;
    }

    return (
        <AuthContext.Provider value={contextValue}>
            { children }
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
