import React, {createContext, useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";

// Create the context
const NavigationContext = createContext();

// Provider component
export const NavigationProvider = ({children}) => {
    const [isAuthorizedNavigation, setIsAuthorizedNavigation] = useState(false);

    const navigate = useNavigate();

    // Function to allow access to the next route
    const appNavigate = (path, options = {}) => {
        setIsAuthorizedNavigation(true);
        navigate(path, {state: {...options.state, isAuthorized: true}}); // Pass authorization state
    };

    // Reset the authorization state
    const resetNavigation = () => {
        setIsAuthorizedNavigation(false);
    };

    return (
        <NavigationContext.Provider
            value={{isAuthorizedNavigation, appNavigate, resetNavigation}}
        >
            {children}
        </NavigationContext.Provider>
    );
};

// Custom hook to use the Navigation Context
export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error(
            "useNavigation must be used within a NavigationProvider"
        );
    }
    return context;
};

NavigationProvider.propTypes = {
    children: PropTypes.node.isRequired, // children should be a valid React node and is required
};
