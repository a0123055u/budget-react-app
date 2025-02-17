import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AUTH } from "../../config/dev/Config";
import qs from 'qs';
import { useCallback } from "react";

// Create a context
const AuthContext = createContext();

export const TokenProvider = ({ children }) => {
  
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
    const [expires, setExpires] = useState(localStorage.getItem("expires"));
    
    const isTokenValid = useCallback(() => {
        if (!expires) return false;
        console.log("Checking token validity:", expires, Date.now());
        return parseFloat(expires) * 1000 > Date.now();
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) return false;

        let data = qs.stringify({
            'refresh_token': refreshToken,
            'client_id': AUTH.APP_CLIENT_ID,
            'grant_type': 'refresh_token'
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: AUTH.AUTH_URL,
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded' // Must be x-www-form-urlencoded for this request
            },
            data: data
        };

        try {
            const response = await axios(config);
            localStorage.setItem("authToken", response.data.access_token);
            let currentTimestamp = Math.floor(Date.now() / 1000);
            let expires = currentTimestamp + parseFloat(response.data.expires_in);
            console.log("Token refreshed successfully. New expires:", expires);
            localStorage.setItem("expires", expires);
            localStorage.setItem("refreshToken", response.data.refresh_token);
            return response.data.access_token ? true : false; // Refresh successful
        } catch (error) {
            console.log("Error refreshing token:", error);
            return false;
        }
    };

    // Automatically refresh token if expired
    useEffect(() => {
        if (!isTokenValid()) {
            refreshToken();
        }
    }, [isTokenValid]);

    // Set up Axios instance with interceptors
    const axiosInstance = axios.create();
    
    // Add interceptor to handle token refresh
    axiosInstance.interceptors.response.use(
        (response) => response, // If response is successful, return it
        async (error) => {
            if (error.response.status === 401) { // If token is expired (401 Unauthorized)
                const tokenRefreshed = await refreshToken();
                if (tokenRefreshed) {
                    // Retry the original request with the new token
                    error.config.headers['Authorization'] = `Bearer ${localStorage.getItem("authToken")}`;
                    return axiosInstance(error.config); // Retry the request
                }
            }
            return Promise.reject(error); // Otherwise, reject the error
        }
    );

    return (
        <AuthContext.Provider value={{ authToken, isTokenValid, refreshToken, axiosInstance }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
