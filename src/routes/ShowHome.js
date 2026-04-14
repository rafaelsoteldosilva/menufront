import React, {useEffect, useContext} from "react";
import * as global from "../globalDefinitions/globalConstants";
import {useSelector} from "react-redux";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";
import {getRestaurantMenu} from "../slices/restaurantMenuSlice";
import {
    EnvironmentOptionItemsContext,
    environmentOptionItems,
} from "../contexts/environmentOptionItemsContext";

import CompShowHomePage from "../components/CompShowHomePage";
import {useNavigation} from "../contexts/navigationContext";

// globalDefinitions
export default function Home() {
    const {appNavigate} = useNavigation();

    const {globalStateDispatch} = useContext(GlobalStateContext);
    const {environmentOptionItemsState} = useContext(
        EnvironmentOptionItemsContext
    );

    const menu = useSelector(getRestaurantMenu);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setLastSignificantPathVisited,
            payload: global.homePath,
        });
        globalStateDispatch({
            type: globalStateContextActions.setCurrentlyWatching,
            payload: global.restaurant,
        });
        if (
            environmentOptionItemsState.environmentOptionItems !==
                environmentOptionItems.publicEnvironment &&
            menu.restaurant.currently_logged_in === global.noValue
        ) {
            appNavigate(global.notAllowedPath);
        }
    });

    useEffect(() => {
        // globalStateDispatch({
        //     type: globalStateContextActions.setCurrentMajorFunction,
        //     payload: global.home,
        // });
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.homePath,
        });
    });

    return (
        <div>
            <CompShowHomePage />
        </div>
    );
}
