import React, {useContext, useEffect, useRef} from "react";
import {Outlet, useLocation} from "react-router-dom";
import {useNavigation} from "../contexts/navigationContext";

import styled from "styled-components";

import {ToastContainer} from "react-toastify";

import CompShowHeaderStrip from "../components/CompShowHeaderStrip";
import {ShowImage} from "../utils/ImageFunctions";
import * as global from "../globalDefinitions/globalConstants";

import {
    EnvironmentOptionItemsContext,
    environmentOptionItems,
} from "../contexts/environmentOptionItemsContext";
import {GlobalStateContext} from "../contexts/globalStateContext";
import {
    getRestaurantMenu,
    getRestaurantMenuStatus,
} from "../slices/restaurantMenuSlice";

import {useSelector} from "react-redux";
import {toastWarning} from "../utils/toastMessages";

const ComponentContainer = styled.div``;

const ShowHeaderStripAndCheckForData = () => {
    const {environmentOptionItemsState} = useContext(
        EnvironmentOptionItemsContext
    );
    const {globalState} = useContext(GlobalStateContext);

    const menu = useSelector(getRestaurantMenu);

    const menuStatus = useSelector(getRestaurantMenuStatus);
    const {appNavigate} = useNavigation();
    const location = useLocation();
    const initialLocationRef = useRef(location.pathname);

    useEffect(() => {
        const handlePopstate = () => {
            let goingTo = location.pathname;
            if (
                environmentOptionItemsState.environmentOptionItems !==
                environmentOptionItems.publicEnvironment
            ) {
                toastWarning(global.sorryNotAllowedAction);
                appNavigate(global.notAllowedPath);
            } else {
                switch (location.pathname) {
                    case global.DialogPreferencesPath:
                    case global.DialogCategoryPath:
                    case global.DialogDishPath:
                    case global.DialogAddNewReviewPath:
                    case global.DialogRestaurantDeliveryTokenPath:
                    case global.DialogRestaurantUserPath:
                    case global.DialogWhatsappSharePath:
                    case global.DialogSelectFileSourcePath:
                    case global.DialogReviewRejectionReasonPath:
                    case global.SelectPublicRestaurantDeliveriesPath: {
                        toastWarning(global.pleaseUseCancelButton);
                        break;
                    }

                    case global.DialogSelectLocalImagePath: {
                        toastWarning(global.pleaseUseCancelButton);
                        appNavigate(global.DialogSelectFileSourcePath);
                        return;
                    }

                    case global.showPublicPromotionPath:
                    case global.showPublicPromotionsPath: {
                        appNavigate(global.showPublicPromotionsPath);
                        return;
                    }

                    case global.DialogImageNamePath: {
                        toastWarning(global.pleaseUseCancelButton);
                        appNavigate(global.showImageCollectionPath);
                        return;
                    }

                    case global.DialogPromotionPrivatePath: {
                        toastWarning(global.pleaseUseCancelButton);
                        appNavigate(global.showPrivatePromotionsPath);
                        return;
                    }

                    case global.showImageUsesPath: {
                        toastWarning(global.usePleaseUseGoBack);
                        appNavigate(global.showImageCollectionPath);
                        return;
                    }
                    case global.showImageCollectionPath: {
                        toastWarning(global.usePleaseUseGoBack);
                        appNavigate(global.showImageCollectionPath);
                        return;
                    }

                    case global.showRestaurantUsersPath: {
                        toastWarning(global.usePleaseUseGoBack);
                        appNavigate(global.showRestaurantUsersPath);
                        return;
                    }

                    case global.helpPath: {
                        switch (globalState.currentFunction) {
                            case global.DialogRestaurantUserPath: {
                                appNavigate(global.DialogRestaurantUserPath, {
                                    state: {
                                        userIndex:
                                            globalState.editionObject.userIndex,
                                    },
                                });
                                break;
                            }
                            case global.DialogPromotionPrivatePath: {
                                appNavigate(global.DialogPromotionPrivatePath, {
                                    state: {
                                        promotionIndex:
                                            globalState.editionObject
                                                .promotionIndex,
                                    },
                                });
                                break;
                            }
                            case global.DialogRestaurantDeliveryTokenPath: {
                                appNavigate(
                                    global.DialogRestaurantDeliveryTokenPath,
                                    {
                                        state: {
                                            restaurantDeliveryCompanyBeingEditedIndex:
                                                globalState.editionObject
                                                    .restaurantDeliveryBeingEditedIndex,
                                            deliverySelected:
                                                globalState.editionObject
                                                    .deliverySelected,
                                        },
                                    }
                                );
                                break;
                            }

                            default: {
                                break;
                            }
                        }
                        return;
                    }

                    case global.showReviewPath:
                    case global.showReviewsPath: {
                        toastWarning(global.usePleaseUseGoBack);
                        if (
                            environmentOptionItemsState.environmentOptionItems ===
                            environmentOptionItems.publicEnvironment
                        ) {
                            appNavigate(
                                `${global.categoriesPath}/${menu.restaurant.id}`,
                                {
                                    replace: true,
                                }
                            );
                        } else {
                            appNavigate(global.showReviewsPath);
                        }
                        return;
                    }

                    default: {
                        toastWarning(global.usePleaseUseGoBack);
                        break;
                    }
                }

                if (initialLocationRef.current === null) {
                    return;
                }
                // If the user navigates back to the initial location, do nothing
                if (initialLocationRef.current === location.pathname) {
                    return;
                }
                if (location.pathname !== goingTo) {
                    appNavigate(goingTo, {
                        replace: true,
                    });
                }
            }
        };

        // Add an event listener to the window for the 'popstate' event

        window.addEventListener("popstate", handlePopstate);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener("popstate", handlePopstate);
        };
    }, [
        location.pathname,
        menu,
        environmentOptionItemsState.environmentOptionItems,
        globalState.currentFunction,
        appNavigate,
        globalState.editionObject,
    ]);

    return (
        <ComponentContainer>
            <CompShowHeaderStrip />
            {environmentOptionItemsState.environmentOptionItems ===
                environmentOptionItems.publicEnvironment &&
                !globalState.doNotOpenDrawer && (
                    <div
                        style={{
                            marginTop: "60px",
                            marginBottom: "10px",
                            position: "absolute",
                            marginLeft: "105px",
                            transform: "translate(-50%, 0)",
                        }}
                    >
                        {ShowImage(
                            menu.restaurant.public_show_images,
                            "",
                            menu.restaurant.public_logo_image_id,
                            menu,
                            false,
                            80,
                            80,
                            "",
                            false,
                            true
                        )}
                    </div>
                )}
            <div style={{marginBottom: "-60px"}}></div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {menuStatus === global.backendReadingSucceeded && <Outlet />}
            </div>
            <ToastContainer />
        </ComponentContainer>
    );
};

export default ShowHeaderStripAndCheckForData;
