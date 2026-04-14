import React, {useContext, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {getRestaurantMenu} from "../slices/restaurantMenuSlice";
import styled from "styled-components";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";
import * as global from "../globalDefinitions/globalConstants";
import CompShowRestaurantDeliveryInList from "../components/CompShowRestaurantDeliveryInList";

import {Button} from "../globalDefinitions/globalStyles";

import {
    EnvironmentOptionItemsContext,
    environmentOptionItems,
} from "../contexts/environmentOptionItemsContext";
import {getDeliveryCompaniesStatus} from "../slices/deliveryCompaniesSlice";

import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

import {useNavigation} from "../contexts/navigationContext";
import {createANewRestaurantDeliveryApi} from "../axiosCalls/axiosAPICalls";

import {addRestaurantDelivery} from "../slices/restaurantMenuSlice";
import {checkResponseStatus} from "../utils/checkResponseStatus";
import {toastError} from "../utils/toastMessages";

const ScreenName = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
    user-select: none;
    cursor: auto;
`;

const AddButton = styled(Button)`
    margin-top: 5px;
    width: 60px;
    height: 30px;
    margin-left: 5px;
`;

// good

function ShowRestaurantDeliveries() {
    const {environmentOptionItemsState} = useContext(
        EnvironmentOptionItemsContext
    );
    const reduxStateDispatch = useDispatch();

    const menu = useSelector(getRestaurantMenu);
    const deliveryCompaniesStatus = useSelector(getDeliveryCompaniesStatus);

    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);
    const {appNavigate} = useNavigation();

    useEffect(() => {
        async function insertSelectedDelivery() {
            if (
                globalState.selectedDelivery !== null &&
                deliveryCompaniesStatus === global.backendReadingSucceeded
            ) {
                if (
                    globalState.selectedDelivery.deliveryObj.name ===
                    global.propioDeliveryName
                ) {
                    appNavigate(global.DialogRestaurantDeliveryTokenPath, {
                        state: {
                            restaurantDeliveryCompanyBeingEditedIndex:
                                global.noValue,
                            deliverySelected:
                                globalState.selectedDelivery.deliveryObj,
                        },
                    });
                } else {
                    const updatedData = {
                        private_token:
                            globalState.selectedDelivery.deliveryObj.name,
                    };
                    const result = await createANewRestaurantDeliveryApi(
                        menu.restaurant.id,
                        globalState.selectedDelivery.deliveryObj.id,
                        updatedData,
                        menu.restaurant.currently_logged_in,
                        menu.restaurant.logged_in_user_random_number
                    );
                    if (checkResponseStatus(result.status)) {
                        // aquí newRestaurantDeliveryId, deliverySelected, updatedData
                        reduxStateDispatch(
                            addRestaurantDelivery({
                                newRestaurantDeliveryId: result.id,
                                deliverySelected:
                                    globalState.selectedDelivery.deliveryObj,
                                updatedData,
                            })
                        );
                        globalStateDispatch({
                            type: globalStateContextActions.setNotifyOfAChangeMade,
                        });
                    } else {
                        toastError(
                            global.connectionErrorOrUserCanNotPerformOperations
                        );
                    }
                }
            }
        }

        globalStateDispatch({
            type: globalStateContextActions.resetDeliverySelected,
        });
        insertSelectedDelivery();
    }, [
        appNavigate,
        deliveryCompaniesStatus,
        globalState.selectedDelivery,
        globalStateDispatch,
        menu.restaurant.currently_logged_in,
        menu.restaurant.id,
        menu.restaurant.logged_in_user_random_number,
        reduxStateDispatch,
    ]);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.ShowPrivateRestaurantDeliveriesPath,
        });
        globalStateDispatch({
            type: globalStateContextActions.setCurrentlyWatching,
            payload: global.ShowRestaurantDeliveries,
        });
    }, [globalStateDispatch]);

    function AddDelivery() {
        // it will insert globalState.selectedDelivery, so useEffect [globalState.selectedDelivery] will
        // get excecuted. (see above)
        appNavigate(global.selectDeliveryForAddingANewRestaurantDeliveryPath);
    }

    return (
        <div
            style={{
                marginTop: "65px",
                marginLeft: "45px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyItems: "center",
                alignItems: "flex-start",
            }}
        >
            <div
                style={{
                    marginLeft: "10px",
                    marginBottom: "15px",
                    borderLeft: "2px solid #4C867D",
                    borderBottom: "2px solid #4C867D",
                }}
            >
                <ScreenName
                    privateEnvironment={
                        environmentOptionItemsState.environmentOptionItems ===
                        environmentOptionItems.publicEnvironment
                    }
                    aria-hidden={false}
                >
                    <div style={{padding: "5px"}}>
                        <div>{global.showingDeliveries}</div>
                    </div>
                    <div style={{padding: "5px", color: "yellow"}}>
                        {globalState.notifyOfAChangeMade && (
                            <div>{global.thisInfoHasNotBeenPublished}</div>
                        )}
                    </div>
                </ScreenName>

                <div>
                    {environmentOptionItemsState.environmentOptionItems ===
                        environmentOptionItems.restaurantDeliveriesPrivateEnvironment && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                            }}
                        >
                            <AddButton
                                aria-hidden={false}
                                onClick={AddDelivery}
                            >
                                <LibraryAddIcon aria-hidden={false} />
                            </AddButton>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    userSelect: "none",
                                }}
                            >
                                {global.includeDeliveryCompanyText}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                }}
            >
                {menu.restaurant_delivery_companies.map(
                    (restaurantDelivery, index) => (
                        <div
                            key={index}
                            style={{
                                marginTop: "5px",
                                marginLeft: "10px",
                            }}
                        >
                            {restaurantDelivery.restaurant_delivery_company
                                .delivery_company_details.country ===
                                menu.restaurant.public_country.id && (
                                <CompShowRestaurantDeliveryInList
                                    restaurantDelivery={restaurantDelivery}
                                    restaurantDeliveryIndex={index}
                                    deliveryCompany={
                                        restaurantDelivery
                                            .restaurant_delivery_company
                                            .delivery_company_details.name // Example property
                                    }
                                />
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default ShowRestaurantDeliveries;
