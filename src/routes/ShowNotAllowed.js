import React from "react";
import {useEffect} from "react";
import {logoutFromAdminAreaApi} from "../axiosCalls/axiosAPICalls";
import {checkResponseStatus} from "../utils/checkResponseStatus";
import {
    getRestaurantMenu,
    resetStateChange,
    logoutFromAdminArea,
} from "../slices/restaurantMenuSlice";
import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";
import {useDispatch, useSelector} from "react-redux";
import {useContext} from "react";
import * as global from "../globalDefinitions/globalConstants";
import {toastError} from "../utils/toastMessages";

// good

export default function ShowNotAllowed() {
    const reduxStateDispatch = useDispatch();
    const menu = useSelector(getRestaurantMenu);
    const {globalStateDispatch} = useContext(GlobalStateContext);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.notAllowedPath,
        });
        globalStateDispatch({
            type: globalStateContextActions.setDoNotOpenDrawer,
        });
    });

    useEffect(() => {
        async function logout() {
            try {
                const result = await logoutFromAdminAreaApi(menu.restaurant.id);
                if (checkResponseStatus(result.status)) {
                    reduxStateDispatch(logoutFromAdminArea());
                    reduxStateDispatch(resetStateChange());
                }
            } catch (error) {
                toastError(global.connectionErrorOrUserCanNotPerformOperations);
            }
        }
        globalStateDispatch({
            type: globalStateContextActions.setDoNotShowNavigators,
        });
        globalStateDispatch({
            type: globalStateContextActions.setPreviousPath,
            payload: global.notAllowedPath,
        });

        logout();
    }, [globalStateDispatch, menu.restaurant.id, reduxStateDispatch]);

    return (
        <div
            style={{
                textAlign: "center",
                margin: "100px",
                fontSize: "40px",
            }}
        >
            {global.enterAgain}
        </div>
    );
}
