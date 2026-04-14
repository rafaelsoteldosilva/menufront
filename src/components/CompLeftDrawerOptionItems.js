import React, {useEffect, useContext, useState} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    Divider,
} from "@mui/material";

import DoorFrontIcon from "@mui/icons-material/DoorFront";

import {Link, useLocation} from "react-router-dom";
import {useNavigation} from "../contexts/navigationContext";

import * as global from "../globalDefinitions/globalConstants";
import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";
import {
    EnvironmentOptionItemsContext,
    environmentOptionItemsContextActions,
    environmentOptionItems,
} from "../contexts/environmentOptionItemsContext";
import {
    fetchAllReviews,
    allReviewsResetLocalData,
} from "../slices/allReviewsSlice";
import {
    getRestaurantMenu,
    logoutFromAdminArea,
    stopEditingMenu,
    startUpdatingReviews,
    stopUpdatingReviews,
    startEditingPreferences,
    stopEditingPreferences,
    fetchMenu,
    resetStateChange,
    startSortingMenu,
    stopSortingMenu,
    startPromotionsEdition,
    stopPromotionsEdition,
    startRestaurantDeliveriesEdition,
    stopRestaurantDeliveriesEdition,
    clearCategoriesPrivateViewOrders,
    clearCategoryDishesPrivateViewOrders,
    startEditingRestaurantUsers,
    stopEditingRestaurantUsers,
} from "../slices/restaurantMenuSlice";

import {fetchDeliveryCompanies} from "../slices/deliveryCompaniesSlice";

import {useDispatch, useSelector} from "react-redux";
import {
    discardEditedMenuApi,
    discardMenuSortingApi,
    discardReviewsUpdatesApi,
    discardEditingPreferencesApi,
    discardPromotionsEditingApi,
    clearCategoriesPrivateViewOrdersApi,
    clearCategoryDishesPrivateViewOrdersApi,
    logoutFromAdminAreaApi,
    publishEditedMenuApi,
    publishMenuSortedApi,
    publishRestaurantDeliveriesEditedApi,
    publishReviewsUpdatedApi,
    publishEditedPreferencesApi,
    publishPromotionsUpdatedApi,
    startEditingMenuApi,
    startEditingPreferencesApi,
    startEditingMenuSortApi,
    startEditingRestaurantDeliveryCompaniesApi,
    startEditingPromotionsApi,
    startEditingReviewsApi,
    startEditingUsersApi,
    publishEditedUsersApi,
    discardEditingRestaurantUsersApi,
    discardRestaurantDeliveriesEditingApi,
    handleLoadedImagesApi,
    showRestarurantNumberApi,
    payApi,
    qrApi,
    sendQRCodeToEMailApi,
    isItPublicApi,
} from "../axiosCalls/axiosAPICalls";
import {
    toastError,
    toastSuccess,
    toastInfo,
    toastOkCancel,
} from "../utils/toastMessages";
import {useRef} from "react";
import {CategoryOrderList} from "../utils/viewOrderTree";
import {checkResponseStatus} from "../utils/checkResponseStatus";
import {getHelpVideoName, monthsAppart} from "../utils/severalFunctions";

const StyledDrawer = styled(Drawer)(({drawerwidth}) => ({
    // If I use drawerWidth I get 'React does not recognize the `drawerWidth` prop on a DOM element'
    width: drawerwidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
        width: drawerwidth,
        backgroundColor: "#1A1A23",
        boxShadow: "0px 3px 5px #6669A3",
    },
}));

// eslint-disable-next-line no-unused-vars
const StyledListItemText = styled(ListItemText)(({theme}) => ({
    textTransform: "none",
    marginTop: "1px",
    marginBottom: "1px",
}));

const StyledLinkItem = styled(Link)`
    text-decoration: none;
    button:focus {
        outline: none;
    }
`;

const StyledButtonItem = styled(Button)``;

const StyledList = styled(List)({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
});

export default function CompLeftDrawerOptionItems({show, toggleShow}) {
    const reduxStateDispatch = useDispatch();

    const {environmentOptionItemsState, environmentOptionItemsStateDispatch} =
        useContext(EnvironmentOptionItemsContext);
    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);

    const [hasToPay, setHasToPay] = useState(false);

    const menu = useSelector(getRestaurantMenu);

    const location = useLocation();
    const {appNavigate} = useNavigation();
    const proceed = useRef(false);

    const handleClose = () => {
        toggleShow();
    };

    useEffect(() => {
        function FillSortElementsListFromCurrentMenu() {
            var currentSortElementsList = new CategoryOrderList();
            menu.categories.forEach((categoryObj) => {
                currentSortElementsList.addCategoryViewOrderNode(
                    categoryObj.category.id,
                    categoryObj.category.private_view_order !== null
                        ? categoryObj.category.private_view_order
                        : global.noValue
                );
                categoryObj.dishes.forEach((dishObj) => {
                    currentSortElementsList.addDishViewOrderNode(
                        categoryObj.category.id,
                        dishObj.dish.id,
                        dishObj.dish.private_view_order !== null
                            ? dishObj.dish.private_view_order
                            : global.noValue
                    );
                });
            });

            currentSortElementsList.logElementsViewOrderList();

            globalStateDispatch({
                type: globalStateContextActions.setSortElementsListHead,
                payload: currentSortElementsList,
            });
        }
        if (
            environmentOptionItemsState.environmentOptionItems ===
            environmentOptionItems.sortMenuPrivateEnvironment
        ) {
            FillSortElementsListFromCurrentMenu();
        }
    }, [
        menu,
        environmentOptionItemsState.environmentOptionItems,
        globalStateDispatch,
    ]);

    useEffect(() => {
        if (
            monthsAppart(
                menu.restaurant.last_payment_date,
                menu.restaurant.restaurant_current_date
            ) === 0
        ) {
            setHasToPay(false);
        } else {
            if (
                monthsAppart(
                    menu.restaurant.last_payment_date,
                    menu.restaurant.restaurant_current_date
                ) -
                    menu.restaurant.number_of_pending_free_months >
                0
            ) {
                setHasToPay(true);
            }
        }
    }, [menu]);

    function shouldHighlightTheMenuItem(menuItem, currentLocation) {
        const itemsAssociatedWithRestaurantMenu = [
            global.rootPath,
            global.categoriesPath,
            global.dishesPath,
            global.dishPath,
        ];
        function isCurrentConsideredRestaurantMenu(menuItem, currentLocation) {
            if (
                itemsAssociatedWithRestaurantMenu.includes(menuItem.menuItemTo)
            ) {
                const str = currentLocation;
                const strToLookFor = global.dishPath;

                const regex = new RegExp(`^${strToLookFor}s?(?=\\/|$)`);
                const match = str.match(regex);
                let strippedCurrentLocation = "";
                if (match) {
                    strippedCurrentLocation = match[0];
                } else strippedCurrentLocation = "no match";

                if (
                    itemsAssociatedWithRestaurantMenu.includes(
                        strippedCurrentLocation
                    )
                ) {
                    return true;
                } else {
                    return false;
                }
            } else return false;
        }
        if (
            currentLocation === global.rootPath &&
            menuItem.menuItemTo === global.defaultPath &&
            menuItem.title !== global.managementLogoutOptionTitle
        ) {
            return true;
        } else if (
            currentLocation === menuItem.menuItemTo &&
            menuItem.title !== global.managementLogoutOptionTitle
        ) {
            if (menuItem.title === global.helpOptionTitle) return false;
            else return true;
        } else if (
            isCurrentConsideredRestaurantMenu(menuItem, currentLocation)
        ) {
            return true;
        } else {
            return false;
        }
    }

    // eslint-disable-next-line no-unused-vars
    async function handleMenuOptionsClick(menuItemOriginalTitle, event) {
        const isDish = false;
        const categoryIndex = global.noValue;
        const dishIndex = global.noValue;
        let restaurantId = global.noValue;
        switch (menuItemOriginalTitle) {
            case global.homeOptionTitle: {
                globalStateDispatch({
                    type: globalStateContextActions.setCurrentMenuOption,
                    payload: global.menuOptions.public.home,
                });
                appNavigate(`${global.homePath}/${menu.restaurant.id}`);
                break;
            }

            case global.menuCardOptionTitle: {
                globalStateDispatch({
                    type: globalStateContextActions.setCurrentMenuOption,
                    payload: global.menuOptions.public.menu,
                });
                appNavigate(`${global.categoriesPath}/${menu.restaurant.id}`);
                break;
            }

            case global.promotionsPublicOptionTitle: {
                globalStateDispatch({
                    type: globalStateContextActions.setCurrentMenuOption,
                    payload: global.menuOptions.public.promotions,
                });
                appNavigate(global.showPublicPromotionsPath);
                break;
            }

            case global.managementLogoutOptionTitle: {
                globalStateDispatch({
                    type: globalStateContextActions.setCurrentMenuOption,
                    payload: global.menuOptions.public.menu,
                });
                let result = {status: 300, error: "not using data"};
                restaurantId = menu.restaurant.id;
                try {
                    if (global.accessBackend) {
                        result = await logoutFromAdminAreaApi(
                            menu.restaurant.id
                        );
                    }
                    if (
                        checkResponseStatus(
                            result.status || !global.accessBackend
                        )
                    ) {
                        if (global.accessBackend) toastSuccess(result.message);
                        reduxStateDispatch(logoutFromAdminArea());
                        reduxStateDispatch(allReviewsResetLocalData());
                        reduxStateDispatch(fetchMenu(restaurantId));
                        reduxStateDispatch(resetStateChange());
                        environmentOptionItemsStateDispatch({
                            type: environmentOptionItemsContextActions.setPublicEnvironment,
                        });
                        globalStateDispatch({
                            type: globalStateContextActions.setDontPerformAnyFurtherActionsFalse,
                        });

                        appNavigate(
                            `${global.categoriesPath}/${menu.restaurant.id}`
                        );
                    } else
                        toastError(
                            global.connectionErrorOrUserCanNotPerformOperations
                        );
                } catch (error) {
                    toastError(
                        global.connectionErrorOrUserCanNotPerformOperations
                    );
                }

                break;
            }

            case global.showChangesMadeTitle: {
                appNavigate(global.showChangesMadePath);
                break;
            }

            case global.editMenuOptionTitle: {
                globalStateDispatch({
                    type: globalStateContextActions.setCurrentMenuOption,
                    payload: global.menuOptions.private.menu,
                });
                restaurantId = menu.restaurant.id;
                if (globalState.dontPerformAnyFurtherActions) {
                    toastError(global.logOutFirst);
                    break;
                }

                try {
                    let result = {
                        status: 300,
                        error: "",
                        message: global.wellcome,
                    };
                    if (global.accessBackend) {
                        result = await startEditingMenuApi(
                            menu.restaurant.id,
                            menu.restaurant.currently_logged_in,
                            menu.restaurant.logged_in_user_random_number
                        );
                    }
                    if (checkResponseStatus(result.status)) {
                        // toastSuccess(result.message);
                        // startEditingMenuApi copies public fields to private fields
                        globalStateDispatch({
                            type: globalStateContextActions.clearChangesMade,
                        });
                        reduxStateDispatch(fetchMenu(restaurantId));
                        reduxStateDispatch(resetStateChange());

                        environmentOptionItemsStateDispatch({
                            type: environmentOptionItemsContextActions.setEditMenuPrivateEnvironment,
                        });
                        appNavigate(
                            `${global.categoriesPath}/${menu.restaurant.id}`
                        );
                    } else {
                        toastError(
                            global.connectionErrorOrUserCanNotPerformOperations
                        );
                    }
                } catch (error) {
                    toastError(
                        global.connectionErrorOrUserCanNotPerformOperations
                    );
                }

                break;
            }

            case global.inappropriateReviewsOptionTitle: {
                globalStateDispatch({
                    type: globalStateContextActions.setCurrentMenuOption,
                    payload: global.menuOptions.private.evaluations,
                });
                // execute backend's start_updating_reviews, and dispatch startUpdatingReviews menuSlice
                if (globalState.dontPerformAnyFurtherActions) {
                    toastError(global.logOutFirst);
                    break;
                }
                try {
                    let result = {
                        status: 300,
                        error: "",
                        message: global.wellcome,
                    };
                    if (global.accessBackend) {
                        result = await startEditingReviewsApi(
                            menu.restaurant.id,
                            menu.restaurant.currently_logged_in,
                            menu.restaurant.logged_in_user_random_number
                        );
                    }
                    if (checkResponseStatus(result.status)) {
                        // toastSuccess(result.message);
                        reduxStateDispatch(startUpdatingReviews());
                        reduxStateDispatch(fetchAllReviews(menu.restaurant.id));
                        reduxStateDispatch(resetStateChange());

                        environmentOptionItemsStateDispatch({
                            type: environmentOptionItemsContextActions.setInappropriateRevisionsPrivateEnvironment,
                        });

                        appNavigate(global.showReviewsPath, {
                            state: {
                                isDish,
                                categoryIndex,
                                dishIndex,
                            },
                        });
                    } else {
                        toastError(
                            global.connectionErrorOrUserCanNotPerformOperations
                        );
                    }
                } catch (error) {
                    toastError(
                        global.connectionErrorOrUserCanNotPerformOperations
                    );
                }

                break;
            }

            case global.sortMenuOptionTitle: {
                globalStateDispatch({
                    type: globalStateContextActions.setCurrentMenuOption,
                    payload: global.menuOptions.private.sorting,
                });
                restaurantId = menu.restaurant.id;
                if (globalState.dontPerformAnyFurtherActions) {
                    toastError(global.logOutFirst);
                    break;
                }
                try {
                    let result = {
                        status: 300,
                        error: "",
                        message: global.wellcome,
                    };
                    if (global.accessBackend) {
                        result = await startEditingMenuSortApi(
                            menu.restaurant.id,
                            menu.restaurant.currently_logged_in,
                            menu.restaurant.logged_in_user_random_number
                        );
                    }
                    if (checkResponseStatus(result.status)) {
                        // toastSuccess(result.message);
                        reduxStateDispatch(fetchMenu(restaurantId));

                        // In this component there's an useEffect that waits for menu updates, and executes
                        // ***** FillSortElementsListFromCurrentMenu(); *****

                        reduxStateDispatch(startSortingMenu());
                        reduxStateDispatch(resetStateChange());

                        environmentOptionItemsStateDispatch({
                            type: environmentOptionItemsContextActions.setSortMenuPrivateEnvironment,
                        });
                        appNavigate(
                            `${global.categoriesPath}/${menu.restaurant.id}`
                        );
                    } else {
                        toastError(
                            global.connectionErrorOrUserCanNotPerformOperations
                        );
                    }
                } catch (error) {
                    toastError(
                        global.connectionErrorOrUserCanNotPerformOperations
                    );
                }

                break;
            }

            case global.restaurantDeliveriesOptionTitle: {
                globalStateDispatch({
                    type: globalStateContextActions.setCurrentMenuOption,
                    payload: global.menuOptions.private.deliveries,
                });
                restaurantId = menu.restaurant.id;
                if (globalState.dontPerformAnyFurtherActions) {
                    toastError(global.logOutFirst);
                    break;
                }
                try {
                    let result = {
                        status: 300,
                        error: "",
                        message: global.wellcome,
                    };
                    if (global.accessBackend) {
                        result =
                            await startEditingRestaurantDeliveryCompaniesApi(
                                menu.restaurant.id,
                                menu.restaurant.currently_logged_in,
                                menu.restaurant.logged_in_user_random_number
                            );
                    }
                    if (checkResponseStatus(result.status)) {
                        // toastSuccess(result.message);
                        reduxStateDispatch(fetchMenu(restaurantId));
                        reduxStateDispatch(
                            fetchDeliveryCompanies(restaurantId)
                        );
                        reduxStateDispatch(startRestaurantDeliveriesEdition());
                        reduxStateDispatch(resetStateChange());
                        environmentOptionItemsStateDispatch({
                            type: environmentOptionItemsContextActions.setRestaurantDeliveriesPrivateEnvironment,
                        });
                        appNavigate(global.ShowPrivateRestaurantDeliveriesPath);
                    } else {
                        toastError(
                            global.connectionErrorOrUserCanNotPerformOperations
                        );
                    }
                } catch (error) {
                    toastError(
                        global.connectionErrorOrUserCanNotPerformOperations
                    );
                }

                break;
            }

            case global.promotionsPrivateOptionTitle: {
                globalStateDispatch({
                    type: globalStateContextActions.setCurrentMenuOption,
                    payload: global.menuOptions.private.promotions,
                });
                restaurantId = menu.restaurant.id;
                if (globalState.dontPerformAnyFurtherActions) {
                    toastError(global.logOutFirst);
                    break;
                }
                try {
                    let result = {
                        status: 300,
                        error: "",
                        message: global.wellcome,
                    };
                    if (global.accessBackend) {
                        result = await startEditingPromotionsApi(
                            menu.restaurant.id,
                            menu.restaurant.currently_logged_in,
                            menu.restaurant.logged_in_user_random_number
                        );
                    }
                    if (checkResponseStatus(result.status)) {
                        reduxStateDispatch(fetchMenu(restaurantId));
                        reduxStateDispatch(startPromotionsEdition());
                        reduxStateDispatch(resetStateChange());
                        environmentOptionItemsStateDispatch({
                            type: environmentOptionItemsContextActions.setPromotionsPrivateEnvironment,
                        });
                        appNavigate(global.showPrivatePromotionsPath);
                    } else {
                        toastError(
                            global.connectionErrorOrUserCanNotPerformOperations
                        );
                    }
                } catch (error) {
                    toastError(
                        global.connectionErrorOrUserCanNotPerformOperations
                    );
                }

                break;
            }

            case global.showPreferencesOptionTitle: {
                globalStateDispatch({
                    type: globalStateContextActions.setCurrentMenuOption,
                    payload: global.menuOptions.private.preferences,
                });
                restaurantId = menu.restaurant.id;
                if (globalState.dontPerformAnyFurtherActions) {
                    toastError(global.logOutFirst);
                    break;
                }
                try {
                    let result = {
                        status: 300,
                        error: "",
                        message: global.wellcome,
                    };
                    if (global.accessBackend) {
                        result = await startEditingPreferencesApi(
                            menu.restaurant.id,
                            menu.restaurant.currently_logged_in,
                            menu.restaurant.logged_in_user_random_number
                        );
                    }
                    if (checkResponseStatus(result.status)) {
                        reduxStateDispatch(fetchMenu(restaurantId));

                        reduxStateDispatch(startEditingPreferences());
                        reduxStateDispatch(resetStateChange());

                        environmentOptionItemsStateDispatch({
                            type: environmentOptionItemsContextActions.setPreferencesPrivateEnvironment,
                        });
                        appNavigate(global.showPreferencesPath);
                    } else {
                        toastError(
                            global.connectionErrorOrUserCanNotPerformOperations
                        );
                    }
                } catch (error) {
                    toastError(
                        global.connectionErrorOrUserCanNotPerformOperations
                    );
                }

                break;
            }

            case global.showUsersOptionTitle: {
                globalStateDispatch({
                    type: globalStateContextActions.setCurrentMenuOption,
                    payload: global.menuOptions.private.restaurant_users,
                });
                restaurantId = menu.restaurant.id;
                if (globalState.dontPerformAnyFurtherActions) {
                    toastError(global.logOutFirst);
                    break;
                }
                try {
                    let result = {
                        status: 300,
                        error: "",
                        message: global.wellcome,
                    };
                    if (global.accessBackend) {
                        result = await startEditingUsersApi(
                            menu.restaurant.id,
                            menu.restaurant.currently_logged_in,
                            menu.restaurant.logged_in_user_random_number
                        );
                    }
                    if (checkResponseStatus(result.status)) {
                        reduxStateDispatch(fetchMenu(restaurantId));

                        reduxStateDispatch(startEditingRestaurantUsers());
                        reduxStateDispatch(resetStateChange());

                        environmentOptionItemsStateDispatch({
                            type: environmentOptionItemsContextActions.setUsersEditionPrivateEnvironment,
                        });
                        appNavigate(global.showRestaurantUsersPath);
                    } else {
                        toastError(
                            global.connectionErrorOrUserCanNotPerformOperations
                        );
                    }
                } catch (error) {
                    toastError(
                        global.connectionErrorOrUserCanNotPerformOperations
                    );
                }

                break;
            }

            case global.imageCollectionOptionTitle: {
                globalStateDispatch({
                    type: globalStateContextActions.setCurrentMenuOption,
                    payload: global.menuOptions.private.image_collection,
                });
                if (globalState.dontPerformAnyFurtherActions) {
                    toastError(global.logOutFirst);
                    break;
                }
                try {
                    let result = {
                        status: 300,
                        error: "",
                        message: global.wellcome,
                    };
                    if (global.accessBackend) {
                        result = await handleLoadedImagesApi(
                            menu.restaurant.id,
                            menu.restaurant.currently_logged_in,
                            menu.restaurant.logged_in_user_random_number
                        );
                    }
                    if (checkResponseStatus(result.status)) {
                        environmentOptionItemsStateDispatch({
                            type: environmentOptionItemsContextActions.setHandleImagesPrivateEnvironment,
                        });
                        appNavigate(global.showImageCollectionPath);
                    } else {
                        toastError(
                            global.connectionErrorOrUserCanNotPerformOperations
                        );
                    }
                } catch (error) {
                    toastError(
                        global.connectionErrorOrUserCanNotPerformOperations
                    );
                }

                break;
            }

            case global.showRestaurantNumberOptionTitle: {
                globalStateDispatch({
                    type: globalStateContextActions.setCurrentMenuOption,
                    payload: global.menuOptions.private.restaurant_number,
                });
                restaurantId = menu.restaurant.id;
                if (globalState.dontPerformAnyFurtherActions) {
                    toastError(global.logOutFirst);
                    break;
                }
                try {
                    let result = {
                        status: 300,
                        error: "",
                    };
                    if (global.accessBackend) {
                        result = await showRestarurantNumberApi(
                            menu.restaurant.id,
                            menu.restaurant.currently_logged_in,
                            menu.restaurant.logged_in_user_random_number
                        );
                    }
                    if (checkResponseStatus(result.status)) {
                        reduxStateDispatch(fetchMenu(restaurantId));
                        reduxStateDispatch(resetStateChange());

                        environmentOptionItemsStateDispatch({
                            type: environmentOptionItemsContextActions.randomPrivateEnvironment,
                        });
                        appNavigate(global.showRestaurantNumberPath);
                    } else {
                        toastError(
                            global.connectionErrorOrUserCanNotPerformOperations
                        );
                    }
                } catch (error) {
                    toastError(
                        global.connectionErrorOrUserCanNotPerformOperations
                    );
                }

                break;
            }

            case global.paymentStateTitle: {
                globalStateDispatch({
                    type: globalStateContextActions.setCurrentMenuOption,
                    payload: global.menuOptions.private.payment,
                });
                if (globalState.dontPerformAnyFurtherActions) {
                    toastError(global.logOutFirst);
                    break;
                }
                try {
                    let result = {
                        status: 300,
                        error: "",
                        message: global.wellcome,
                    };
                    if (global.accessBackend) {
                        result = await payApi(
                            menu.restaurant.id,
                            menu.restaurant.currently_logged_in,
                            menu.restaurant.logged_in_user_random_number
                        );
                    }
                    if (checkResponseStatus(result.status)) {
                        environmentOptionItemsStateDispatch({
                            type: environmentOptionItemsContextActions.payPrivateEnvironment,
                        });
                        appNavigate(global.paymentStatePath);
                    } else {
                        toastError(
                            global.connectionErrorOrUserCanNotPerformOperations
                        );
                    }
                } catch (error) {
                    toastError(
                        global.connectionErrorOrUserCanNotPerformOperations
                    );
                }

                break;
            }

            case global.showQROptionTitle: {
                globalStateDispatch({
                    type: globalStateContextActions.setCurrentMenuOption,
                    payload: global.menuOptions.private.QR,
                });
                if (globalState.dontPerformAnyFurtherActions) {
                    toastError(global.logOutFirst);
                    break;
                }
                try {
                    let result = {
                        status: 300,
                        error: "",
                        message: global.wellcome,
                    };
                    if (global.accessBackend) {
                        result = await qrApi(
                            menu.restaurant.id,
                            menu.restaurant.currently_logged_in,
                            menu.restaurant.logged_in_user_random_number
                        );
                    }
                    if (checkResponseStatus(result.status)) {
                        environmentOptionItemsStateDispatch({
                            type: environmentOptionItemsContextActions.QRPrivateEnvironment,
                        });
                        appNavigate(global.showQRPath);
                    } else {
                        toastError(
                            global.connectionErrorOrUserCanNotPerformOperations
                        );
                    }
                } catch (error) {
                    toastError(
                        global.connectionErrorOrUserCanNotPerformOperations
                    );
                }
                break;
            }

            case global.eMailQROptionTitle: {
                const userIndex =
                    menu.restaurant_user_images_and_names.findIndex(
                        (user) =>
                            user.user.id === menu.restaurant.currently_logged_in
                    );
                if (
                    !menu.restaurant_user_images_and_names[userIndex].user
                        .public_email_validated
                ) {
                    globalStateDispatch({
                        type: globalStateContextActions.setSendEMail,
                    });
                } else {
                    const ToEMailAddress =
                        menu.restaurant_user_images_and_names[userIndex].user
                            .public_email;
                    // const categoriesPath = `${global.categoriesPath}`.replace(
                    //     "/",
                    //     "",
                    //     1
                    // );
                    const reactBaseUrl = "https://atonna-frontend.vercel.app";
                    const categoriesPath = global.categoriesPath; // No encoding needed!

                    sendQRCodeToEMailApi(
                        menu.restaurant.id,
                        reactBaseUrl, // Send raw URL, not encoded!
                        categoriesPath,
                        ToEMailAddress,
                        menu.restaurant.currently_logged_in,
                        menu.restaurant.logged_in_user_random_number
                    );
                    toastSuccess(global.qrEMailSent);
                }

                break;
            }

            // ----------------------- PUBLISH -------------------------

            case global.publishOptionTitle: {
                let Publishing = globalState.notifyOfAChangeMade
                    ? await toastOkCancel(global.areYouSureToPublish)
                    : true;
                // const result = await toastOkCancel(global.areYouSureToPublish);
                const notifyOfAChangeMade = globalState.notifyOfAChangeMade;
                if (Publishing) {
                    restaurantId = menu.restaurant.id;
                    proceed.current = false;
                    globalStateDispatch({
                        type: globalStateContextActions.clearNotifyOfAChangeMade,
                    });

                    switch (
                        environmentOptionItemsState.environmentOptionItems
                    ) {
                        case environmentOptionItems.menuPrivateEnvironment: {
                            try {
                                const result = await publishEditedMenuApi(
                                    menu.restaurant.id,
                                    menu.restaurant.currently_logged_in,
                                    menu.restaurant.logged_in_user_random_number
                                );
                                if (checkResponseStatus(result.status)) {
                                    // toastSuccess(result.message);
                                    globalStateDispatch({
                                        type: globalStateContextActions.clearChangesMade,
                                    });
                                    reduxStateDispatch(stopEditingMenu());
                                    reduxStateDispatch(fetchMenu(restaurantId));
                                    reduxStateDispatch(resetStateChange());

                                    proceed.current = true;
                                } else
                                    toastError(
                                        global.connectionErrorOrUserCanNotPerformOperations
                                    );
                            } catch (error) {
                                toastError(
                                    global.connectionErrorOrUserCanNotPerformOperations
                                );
                            }
                            break;
                        }

                        case environmentOptionItems.inappropriateRevisionsPrivateEnvironment: {
                            try {
                                const result = await publishReviewsUpdatedApi(
                                    menu.restaurant.id,
                                    menu.restaurant.currently_logged_in,
                                    menu.restaurant.logged_in_user_random_number
                                );
                                if (checkResponseStatus(result.status)) {
                                    // toastSuccess(result.message);
                                    reduxStateDispatch(stopUpdatingReviews());
                                    reduxStateDispatch(fetchMenu(restaurantId));
                                    reduxStateDispatch(resetStateChange());

                                    proceed.current = true;
                                } else
                                    toastError(
                                        global.connectionErrorOrUserCanNotPerformOperations
                                    );
                            } catch (error) {
                                toastError(
                                    global.connectionErrorOrUserCanNotPerformOperations
                                );
                            }
                            break;
                        }

                        case environmentOptionItems.sortMenuPrivateEnvironment: {
                            try {
                                const result = await publishMenuSortedApi(
                                    menu.restaurant.id,
                                    menu.restaurant.currently_logged_in,
                                    menu.restaurant.logged_in_user_random_number
                                );
                                if (checkResponseStatus(result.status)) {
                                    // toastSuccess(result.message);
                                    reduxStateDispatch(stopSortingMenu());
                                    reduxStateDispatch(fetchMenu(restaurantId));
                                    reduxStateDispatch(resetStateChange());
                                    // In this component there's an useEffect that waits for menu updates, and executes
                                    // ***** FillSortElementsListFromCurrentMenu(); *****
                                    proceed.current = true;
                                } else
                                    toastError(
                                        global.connectionErrorOrUserCanNotPerformOperations
                                    );
                            } catch (error) {
                                toastError(
                                    global.connectionErrorOrUserCanNotPerformOperations
                                );
                            }
                            break;
                        }

                        case environmentOptionItems.restaurantDeliveriesPrivateEnvironment: {
                            try {
                                const result =
                                    await publishRestaurantDeliveriesEditedApi(
                                        menu.restaurant.id,
                                        menu.restaurant.currently_logged_in,
                                        menu.restaurant
                                            .logged_in_user_random_number
                                    );
                                if (checkResponseStatus(result.status)) {
                                    // toastSuccess(result.message);
                                    reduxStateDispatch(
                                        stopRestaurantDeliveriesEdition()
                                    );
                                    reduxStateDispatch(fetchMenu(restaurantId));
                                    reduxStateDispatch(resetStateChange());

                                    proceed.current = true;
                                } else {
                                    toastError(result.message);
                                }
                            } catch (error) {
                                toastError(
                                    "can't execute publishRestaurantDeliveriesEditedApi"
                                );
                            }
                            break;
                        }

                        case environmentOptionItems.usersPrivateEnvironment: {
                            try {
                                const result = await publishEditedUsersApi(
                                    menu.restaurant.id,
                                    menu.restaurant.currently_logged_in,
                                    menu.restaurant.logged_in_user_random_number
                                );
                                if (checkResponseStatus(result.status)) {
                                    // toastSuccess(result.message);
                                    reduxStateDispatch(
                                        stopEditingRestaurantUsers()
                                    );
                                    reduxStateDispatch(fetchMenu(restaurantId));
                                    reduxStateDispatch(resetStateChange());
                                    proceed.current = true;
                                } else
                                    toastError(
                                        global.connectionErrorOrUserCanNotPerformOperations
                                    );
                            } catch (error) {
                                toastError(
                                    global.connectionErrorOrUserCanNotPerformOperations
                                );
                            }
                            break;
                        }

                        case environmentOptionItems.preferencesPrivateEnvironment: {
                            try {
                                const result =
                                    await publishEditedPreferencesApi(
                                        menu.restaurant.id,
                                        menu.restaurant.currently_logged_in,
                                        menu.restaurant
                                            .logged_in_user_random_number
                                    );
                                if (checkResponseStatus(result.status)) {
                                    reduxStateDispatch(
                                        stopEditingPreferences()
                                    );
                                    reduxStateDispatch(fetchMenu(restaurantId));
                                    reduxStateDispatch(resetStateChange());
                                    proceed.current = true;
                                } else {
                                    toastError(
                                        global.connectionErrorOrUserCanNotPerformOperations
                                    );
                                }
                            } catch (error) {
                                toastError(
                                    global.connectionErrorOrUserCanNotPerformOperations
                                );
                            }
                            break;
                        }

                        case environmentOptionItems.promotionsPrivateEnvironment: {
                            try {
                                const result =
                                    await publishPromotionsUpdatedApi(
                                        menu.restaurant.id,
                                        menu.restaurant.currently_logged_in,
                                        menu.restaurant
                                            .logged_in_user_random_number
                                    );
                                if (checkResponseStatus(result.status)) {
                                    reduxStateDispatch(stopPromotionsEdition());
                                    reduxStateDispatch(fetchMenu(restaurantId));
                                    reduxStateDispatch(resetStateChange());
                                    proceed.current = true;
                                } else {
                                    toastError(
                                        global.connectionErrorOrUserCanNotPerformOperations
                                    );
                                }
                            } catch (error) {
                                toastError(
                                    global.connectionErrorOrUserCanNotPerformOperations
                                );
                            }
                            break;
                        }

                        default: {
                            break;
                        }
                    }
                    if (!notifyOfAChangeMade)
                        toastInfo(global.noChagesWerePublished);

                    if (proceed.current) {
                        proceed.current = false;

                        environmentOptionItemsStateDispatch({
                            type: environmentOptionItemsContextActions.setPrivateEnvironment,
                        });
                        appNavigate(global.managementPath);
                    }
                    break;
                }
                break;
            }

            // ----------------------- PUBLISH -------------------------

            // ----------------------- DISCARD -------------------------

            case global.discardOptionTitle: {
                if (
                    globalState.notifyOfAChangeMade
                        ? await toastOkCancel(global.areYouSureToDiscard)
                        : true
                ) {
                    const notifyOfAChangeMade = globalState.notifyOfAChangeMade;
                    proceed.current = false;
                    globalStateDispatch({
                        type: globalStateContextActions.clearNotifyOfAChangeMade,
                    });
                    switch (
                        environmentOptionItemsState.environmentOptionItems
                    ) {
                        case environmentOptionItems.menuPrivateEnvironment: {
                            try {
                                let result = {
                                    status: 300,
                                    error: "",
                                    message: global.wellcome,
                                };
                                if (global.accessBackend) {
                                    result = await discardEditedMenuApi(
                                        menu.restaurant.id
                                    );
                                }
                                if (checkResponseStatus(result.status)) {
                                    // // toastSuccess(result.message);
                                    globalStateDispatch({
                                        type: globalStateContextActions.clearChangesMade,
                                    });
                                    reduxStateDispatch(stopEditingMenu());
                                    reduxStateDispatch(resetStateChange());
                                    proceed.current = true;
                                } else
                                    toastError(
                                        global.connectionErrorOrUserCanNotPerformOperations
                                    );
                            } catch (error) {
                                toastError(
                                    global.connectionErrorOrUserCanNotPerformOperations
                                );
                            }
                            break;
                        }

                        case environmentOptionItems.inappropriateRevisionsPrivateEnvironment: {
                            try {
                                let result = {
                                    status: 300,
                                    error: "",
                                    message: global.wellcome,
                                };
                                if (global.accessBackend) {
                                    result = await discardReviewsUpdatesApi(
                                        menu.restaurant.id
                                    );
                                }
                                if (checkResponseStatus(result.status)) {
                                    reduxStateDispatch(stopUpdatingReviews());
                                    reduxStateDispatch(resetStateChange());

                                    proceed.current = true;
                                } else
                                    toastError(
                                        global.connectionErrorOrUserCanNotPerformOperations
                                    );
                            } catch (error) {
                                toastError(
                                    global.connectionErrorOrUserCanNotPerformOperations
                                );
                            }
                            break;
                        }

                        case environmentOptionItems.sortMenuPrivateEnvironment: {
                            try {
                                let result = {
                                    status: 300,
                                    error: "",
                                    message: global.wellcome,
                                };
                                if (global.accessBackend) {
                                    result = await discardMenuSortingApi(
                                        menu.restaurant.id
                                    );
                                }
                                if (checkResponseStatus(result.status)) {
                                    reduxStateDispatch(stopSortingMenu());
                                    reduxStateDispatch(resetStateChange());
                                    proceed.current = true;
                                } else
                                    toastError(
                                        global.connectionErrorOrUserCanNotPerformOperations
                                    );
                            } catch (error) {
                                toastError(
                                    global.connectionErrorOrUserCanNotPerformOperations
                                );
                            }
                            break;
                        }

                        case environmentOptionItems.restaurantDeliveriesPrivateEnvironment: {
                            try {
                                let result = {
                                    status: 300,
                                    error: "",
                                    message: global.wellcome,
                                };
                                if (global.accessBackend) {
                                    result =
                                        await discardRestaurantDeliveriesEditingApi(
                                            menu.restaurant.id
                                        );
                                }
                                if (checkResponseStatus(result.status)) {
                                    reduxStateDispatch(
                                        stopRestaurantDeliveriesEdition()
                                    );
                                    reduxStateDispatch(resetStateChange());
                                    proceed.current = true;
                                } else
                                    toastError(
                                        global.connectionErrorOrUserCanNotPerformOperations
                                    );
                            } catch (error) {
                                toastError(
                                    global.connectionErrorOrUserCanNotPerformOperations
                                );
                            }
                            break;
                        }

                        case environmentOptionItems.preferencesPrivateEnvironment: {
                            try {
                                let result = {
                                    status: 300,
                                    error: "",
                                    message: global.wellcome,
                                };
                                if (global.accessBackend) {
                                    result = await discardEditingPreferencesApi(
                                        menu.restaurant.id
                                    );
                                }
                                if (checkResponseStatus(result.status)) {
                                    reduxStateDispatch(
                                        stopEditingPreferences()
                                    );
                                    reduxStateDispatch(resetStateChange());
                                    proceed.current = true;
                                } else
                                    toastError(
                                        global.connectionErrorOrUserCanNotPerformOperations
                                    );
                            } catch (error) {
                                toastError(
                                    global.connectionErrorOrUserCanNotPerformOperations
                                );
                            }
                            break;
                        }

                        case environmentOptionItems.promotionsPrivateEnvironment: {
                            try {
                                let result = {
                                    status: 300,
                                    error: "",
                                    message: global.wellcome,
                                };
                                if (global.accessBackend) {
                                    result = await discardPromotionsEditingApi(
                                        menu.restaurant.id
                                    );
                                }
                                if (checkResponseStatus(result.status)) {
                                    reduxStateDispatch(stopPromotionsEdition());
                                    reduxStateDispatch(resetStateChange());
                                    proceed.current = true;
                                } else
                                    toastError(
                                        global.connectionErrorOrUserCanNotPerformOperations
                                    );
                            } catch (error) {
                                toastError(
                                    global.connectionErrorOrUserCanNotPerformOperations
                                );
                            }
                            break;
                        }

                        case environmentOptionItems.usersPrivateEnvironment: {
                            try {
                                let result = {
                                    status: 300,
                                    error: "",
                                    message: global.wellcome,
                                };
                                if (global.accessBackend) {
                                    result =
                                        await discardEditingRestaurantUsersApi(
                                            menu.restaurant.id
                                        );
                                }
                                if (checkResponseStatus(result.status)) {
                                    // toastSuccess(result.message);
                                    reduxStateDispatch(
                                        stopEditingRestaurantUsers()
                                    );
                                    reduxStateDispatch(resetStateChange());
                                    proceed.current = true;
                                } else
                                    toastError(
                                        global.connectionErrorOrUserCanNotPerformOperations
                                    );
                            } catch (error) {
                                toastError(
                                    global.connectionErrorOrUserCanNotPerformOperations
                                );
                            }
                            break;
                        }

                        default: {
                            break;
                        }
                    }
                    if (!notifyOfAChangeMade)
                        toastInfo(global.noChagesWereDiscarded);
                    if (proceed.current) {
                        proceed.current = false;

                        environmentOptionItemsStateDispatch({
                            type: environmentOptionItemsContextActions.setPrivateEnvironment,
                        });
                        appNavigate(global.managementPath);
                    }
                    break;
                }
                break;
            }
            // ----------------------- DISCARD -------------------------

            case global.clearAllSortingsOptionTitle: {
                globalStateDispatch({
                    type: globalStateContextActions.setDoYouWantToDeleteAllSortings,
                });

                break;
            }

            case global.clearTheseSortingsOptionTitle: {
                switch (globalState.currentlyWatching) {
                    case global.categories: {
                        try {
                            let result = {
                                status: 300,
                                error: "",
                                message: global.wellcome,
                            };
                            if (global.accessBackend) {
                                result =
                                    await clearCategoriesPrivateViewOrdersApi(
                                        menu.restaurant.id,
                                        menu.restaurant.currently_logged_in,
                                        menu.restaurant
                                            .logged_in_user_random_number
                                    );
                            }
                            if (checkResponseStatus(result.status)) {
                                reduxStateDispatch(
                                    clearCategoriesPrivateViewOrders()
                                );
                                reduxStateDispatch(resetStateChange());
                                globalStateDispatch({
                                    type: globalStateContextActions.setNotifyOfAChangeMade,
                                });
                            } else
                                toastError(
                                    global.connectionErrorOrUserCanNotPerformOperations
                                );
                        } catch (error) {
                            toastError(
                                global.connectionErrorOrUserCanNotPerformOperations
                            );
                        }
                        break;
                    }

                    case global.dishes: {
                        try {
                            let result = {
                                status: 300,
                                error: "",
                                message: global.wellcome,
                            };
                            if (global.accessBackend) {
                                result =
                                    await clearCategoryDishesPrivateViewOrdersApi(
                                        menu.categories[
                                            globalState.currentCategoryIndex
                                        ].category.id,
                                        menu.restaurant.currently_logged_in,
                                        menu.restaurant
                                            .logged_in_user_random_number
                                    );
                            }

                            if (checkResponseStatus(result.status)) {
                                reduxStateDispatch(
                                    clearCategoryDishesPrivateViewOrders(
                                        menu.categories[
                                            globalState.currentCategoryIndex
                                        ].category.id
                                    )
                                );
                                reduxStateDispatch(resetStateChange());
                            } else
                                toastError(
                                    global.connectionErrorOrUserCanNotPerformOperations
                                );
                        } catch (error) {
                            toastError(
                                global.connectionErrorOrUserCanNotPerformOperations
                            );
                        }
                        break;
                    }

                    default: {
                        break;
                    }
                }
                break;
            }

            case global.exitOptionTitle: {
                environmentOptionItemsStateDispatch({
                    type: environmentOptionItemsContextActions.setPrivateEnvironment,
                });
                appNavigate(global.managementPath);
                break;
            }

            case global.managementLoginOptionTitle: {
                globalStateDispatch({
                    type: globalStateContextActions.setCurrentMenuOption,
                    payload: global.menuOptions.public.login,
                });
                appNavigate(global.managementLoginPath);
                break;
            }

            case global.dishesOptionTitle: {
                appNavigate(global.dishesPath);
                break;
            }

            case global.dishOptionTitle: {
                appNavigate(global.dishPath);
                break;
            }

            case global.showReviewsOptionTitle: {
                appNavigate(global.showReviewsPath);
                break;
            }

            case global.helpOptionTitle: {
                appNavigate(global.helpPath, {
                    state: {
                        videoName: getHelpVideoName(
                            await isItPublicApi(menu.restaurant.id),
                            globalState.currentFunction,
                            globalState.currentMenuOption,
                            globalState.currentlyWatching
                        ),
                    },
                });
                break;
            }

            default: {
                alert("DrawerOptionItems:: hit default");
                break;
            }
        }
    }

    return (
        <div>
            <StyledDrawer
                drawerwidth={`${environmentOptionItemsState.navigationOptions.menuWidth}px`}
                variant="temporary"
                open={show}
                onClose={handleClose}
                anchor="left"
                slotProps={{
                    backdrop: {
                        sx: {
                            backgroundColor: "rgba(0, 0, 0, 0.2)",
                        },
                    },
                }}
                sx={{
                    "& .MuiBackdrop-root": {
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                    },
                }}
            >
                <StyledList>
                    <div
                        style={{
                            height: "95vh",
                            color: "white",
                        }}
                    >
                        <ListItem
                            component={global.buttonItemType}
                            onClick={() => {
                                handleClose("");
                            }}
                            sx={{
                                backgroundColor: "#6669A3",
                                color: "white",
                                width: "100%",
                            }}
                        >
                            {!hasToPay && (
                                <ListItemIcon sx={{color: "white"}}>
                                    <DoorFrontIcon />
                                </ListItemIcon>
                            )}
                            {hasToPay && (
                                <ListItemIcon sx={{color: "#57FCF2"}}>
                                    <DoorFrontIcon />
                                </ListItemIcon>
                            )}
                            <StyledListItemText primary={global.closeDrawer} />
                        </ListItem>
                        {environmentOptionItemsState.navigationOptions.optionsArray.map(
                            (menuItem, index) => {
                                return (
                                    <div key={index}>
                                        {menuItem.type ===
                                        global.dividerItemType ? (
                                            <Divider
                                                sx={{
                                                    backgroundColor:
                                                        menuItem.color === null
                                                            ? "gray"
                                                            : menuItem.color,
                                                }}
                                            />
                                        ) : (
                                            !menuItem.hidden && (
                                                <ListItem
                                                    component={
                                                        menuItem.type ===
                                                        global.linkItemType
                                                            ? StyledLinkItem
                                                            : StyledButtonItem
                                                    }
                                                    to={
                                                        menuItem.type ===
                                                        global.linkItemType
                                                            ? menuItem.menuItemTo
                                                            : undefined
                                                    }
                                                    onClick={(event) => {
                                                        if (
                                                            menuItem.clickeable
                                                        ) {
                                                            handleMenuOptionsClick(
                                                                menuItem.originalTitle,
                                                                event
                                                            );
                                                            handleClose(
                                                                menuItem.title,
                                                                event
                                                            );
                                                        }
                                                    }}
                                                    sx={{
                                                        "&:hover": {
                                                            boxShadow:
                                                                "0px 0px 5px white",
                                                        },
                                                        width: `${
                                                            environmentOptionItemsState
                                                                .navigationOptions
                                                                .menuWidth - 7
                                                        }px`,
                                                        height: "35px",
                                                        marginLeft:
                                                            menuItem.indented
                                                                ? "30px"
                                                                : "5px",
                                                        opacity:
                                                            menuItem.disabled
                                                                ? 0.3
                                                                : 1,
                                                        pointerEvents:
                                                            menuItem.disabled
                                                                ? "none"
                                                                : "auto",
                                                        color:
                                                            menuItem.color !==
                                                            null
                                                                ? menuItem.color
                                                                : null,
                                                        filter:
                                                            menuItem.blur !==
                                                            null
                                                                ? menuItem.blur
                                                                : null,
                                                    }}
                                                >
                                                    <ListItemIcon
                                                        sx={{
                                                            color:
                                                                menuItem.color !==
                                                                null
                                                                    ? menuItem.color
                                                                    : "white",
                                                            filter:
                                                                menuItem.blur !==
                                                                null
                                                                    ? menuItem.blur
                                                                    : null,
                                                        }}
                                                    >
                                                        {menuItem.icon}
                                                    </ListItemIcon>
                                                    <StyledListItemText
                                                        primary={menuItem.title}
                                                        sx={{
                                                            color: shouldHighlightTheMenuItem(
                                                                menuItem,
                                                                location.pathname
                                                            )
                                                                ? "lightblue"
                                                                : menuItem.color !==
                                                                    null
                                                                  ? menuItem.color
                                                                  : "white",
                                                            width: "100%",
                                                            marginLeft: "-10px",
                                                        }}
                                                    />
                                                </ListItem>
                                            )
                                        )}
                                    </div>
                                );
                            }
                        )}
                        {
                            <div
                                style={{
                                    position: "absolute",
                                    right: "5px",
                                    bottom: 5,
                                    color: "#BEACAC",
                                    pointerEvents: "none",
                                    fontFamily: "Roboto",
                                }}
                            >
                                {global.snSoftwareCopyright}
                            </div>
                        }
                    </div>
                </StyledList>
            </StyledDrawer>
        </div>
    );
}

CompLeftDrawerOptionItems.propTypes = {
    show: PropTypes.bool.isRequired, // show should be a boolean and is required
    toggleShow: PropTypes.func.isRequired, // toggleShow should be a function and is required
};
