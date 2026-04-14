import {useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import PropTypes from "prop-types";
import {useNavigation} from "../contexts/navigationContext"; // Custom hook from your NavigationContext

export const RouteProtector = ({children}) => {
    const {isAuthorizedNavigation, resetNavigation} = useNavigation();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Function to validate authorization
        const validateAuthorization = () => {
            if (!isAuthorizedNavigation) {
                // Reset navigation state to prevent unauthorized access
                resetNavigation();
                // Redirect to a fallback page, e.g., home or login
                navigate("/", {replace: true});
            }
        };

        // Call validation function every time the pathname changes
        validateAuthorization();
    }, [location.pathname, isAuthorizedNavigation, resetNavigation, navigate]);

    // Render children if authorized, otherwise logic above will redirect/block
    return isAuthorizedNavigation ? children : null;
};

RouteProtector.propTypes = {
    children: PropTypes.node.isRequired, // children should be a valid React node and is required
};
