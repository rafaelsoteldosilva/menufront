import React, {useContext, useState} from "react";

import styled from "styled-components";
import {useSelector} from "react-redux";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faDoorOpen,
    faArrowLeft,
    faQuestion,
    faPersonCircleQuestion,
    faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";

import CompLeftDrawerOptionItems from "./CompLeftDrawerOptionItems";
import {CompShowDrawerBackdrop} from "./CompShowDrawerBackdrop";

import {Button} from "../globalDefinitions/globalStyles";

import * as global from "../globalDefinitions/globalConstants";

import {getRestaurantMenu} from "../slices/restaurantMenuSlice";
import {
    EnvironmentOptionItemsContext,
    environmentOptionItems,
} from "../contexts/environmentOptionItemsContext";
import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";
import {isItPublicApi} from "../axiosCalls/axiosAPICalls";
import {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {useNavigation} from "../contexts/navigationContext";

import {toastWarning} from "../utils/toastMessages";
import {getHelpVideoName, monthsAppart} from "../utils/severalFunctions";

const ContentContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: "5%";
`;

const LeftRightButtonsContainer = styled.div`
    position: fixed;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
`;

const LeftRightButtonPosition = styled.div`
    position: fixed;
`;

const HamburgerButtonPosition = styled(LeftRightButtonPosition)`
    left: 0;
    top: 15px;
`;

const GoBackButtonPosition = styled(LeftRightButtonPosition)`
    left: 0;
    top: 50px;
`;

const HelpButtonPosition = styled(LeftRightButtonPosition)`
    left: 0;
    top: 105px;
`;

const TopicsHelpButtonPosition = styled(LeftRightButtonPosition)`
    left: 0;
    top: 160px;
`;

const HamburgerButton = styled(Button)`
    width: 50px;
    border-radius: 10px;
    display: ${({dontShowNavigators}) =>
        dontShowNavigators ? "none" : "block"};
`;

const GoBackButton = styled(Button)`
    width: 50px;
    border-radius: 10px;
    display: ${({dontShowNavigators}) =>
        dontShowNavigators ? "none" : "block"};
`;

const HelpButton = styled(Button)`
    width: 50px;
    border-radius: 10px;
    background-color: #ff8c00;
    display: ${({dontShowNavigators}) =>
        dontShowNavigators ? "none" : "block"};
`;

function CompShowHeaderStrip() {
    const location = useLocation();
    const {appNavigate} = useNavigation();

    let currentLocation = location.pathname.split("/");

    const menu = useSelector(getRestaurantMenu);
    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);

    const {environmentOptionItemsState} = useContext(
        EnvironmentOptionItemsContext
    );

    const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);

    const [hasToPay, setHasToPay] = useState(null);

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
            )
                setHasToPay(true);
        }
    }, [menu]);

    useEffect(() => {
        if (currentLocation[1].length === 0) {
            currentLocation[1] = global.defaultPath.split("/")[1];
        }
    }, [currentLocation]);

    useEffect(() => {
        if (
            globalState.drawerOpenSignal &&
            location.pathname !== global.notAllowedPath
        ) {
            if (!globalState.doNotOpenLeftDrawer) {
                toggleDrawer();
                globalStateDispatch({
                    type: globalStateContextActions.sendDrawerOpenSignal,
                    payload: false,
                });
            } else {
                globalStateDispatch({
                    type: globalStateContextActions.clearDoNotOpenLeftDrawer,
                });
            }
        }
    }, [
        globalState.drawerOpenSignal,
        location.pathname,
        globalState.doNotOpenLeftDrawer,
        globalStateDispatch,
    ]);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setPreviousPath,
            payload: globalState.currentPath,
        });
        globalStateDispatch({
            type: globalStateContextActions.setCurrentPath,
            payload: `/${currentLocation[1]}`,
        });
    }, [
        location.pathname,
        currentLocation,
        globalStateDispatch,
        globalState.currentPath,
    ]);

    function handleLeftOpenDrawerOnClick() {
        setLeftDrawerOpen(!leftDrawerOpen);
    }

    function handleTopicsHelp() {
        appNavigate(global.frequentlyAskedQuestionsPath);
    }

    function handleHelpOnHelp() {
        appNavigate(global.helpPath, {
            state: {
                videoName: "private_helponhelp",
            },
        });
    }

    async function handleHelp() {
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
    }

    function handleBackdropClick() {
        setLeftDrawerOpen(false);
    }

    function toggleDrawer() {
        setLeftDrawerOpen((prevLeftDrawer) => !prevLeftDrawer);
    }

    function handleRealGoBack() {
        switch (globalState.currentPath) {
            case global.SelectPublicRestaurantDeliveriesPath: {
                switch (globalState.lastSignificantPathVisited) {
                    case global.dishPath:
                        appNavigate(
                            `${global.dishPath}/${menu.restaurant.id}/${globalState.currentCategoryIndex}/${globalState.currentDishIndex}`
                        );
                        break;

                    case global.homePath:
                        appNavigate(`${global.homePath}/${menu.restaurant.id}`);
                        break;

                    default:
                        break;
                }
                break;
            }

            case global.payPalOnePaymentPath: {
                appNavigate(global.selectPaymentOptionPath);
                break;
            }

            case global.DialogCategoryPath: {
                appNavigate(`${global.categoriesPath}/${menu.restaurant.id}`);
                break;
            }

            case global.DialogDishPath: {
                switch (globalState.lastSignificantPathVisited) {
                    case global.dishesPath:
                        appNavigate(
                            `${global.dishesPath}/${menu.restaurant.id}/${globalState.currentCategoryIndex}`
                        );
                        break;

                    case global.dishPath:
                        appNavigate(
                            `${global.dishPath}/${menu.restaurant.id}/${globalState.currentCategoryIndex}/${globalState.currentDishIndex}`
                        );
                        break;

                    default:
                        break;
                }
                break;
            }

            case global.dishPath: {
                appNavigate(
                    `${global.dishesPath}/${menu.restaurant.id}/${globalState.currentCategoryIndex}`
                );
                break;
            }

            case global.dishesPath: {
                appNavigate(`${global.categoriesPath}/${menu.restaurant.id}`);
                break;
            }

            case global.managementPath: {
                toastWarning(global.useLeftDrawerOrLogout);
                break;
            }

            case global.categoriesPath: {
                if (globalState.previousPath === global.managementPath) {
                    if (
                        environmentOptionItemsState.environmentOptionItems ===
                            environmentOptionItems.menuPrivateEnvironment ||
                        environmentOptionItemsState.environmentOptionItems ===
                            environmentOptionItems.sortMenuPrivateEnvironment
                    )
                        toastWarning(global.publishOrCancel);
                } else {
                    if (
                        environmentOptionItemsState.environmentOptionItems !==
                        environmentOptionItems.publicEnvironment
                    ) {
                        if (
                            globalState.previousPath === globalState.currentPath
                        ) {
                            toastWarning(global.publishOrCancel);
                        } else
                            appNavigate(
                                `${global.dishesPath}/${menu.restaurant.id}/${globalState.currentCategoryIndex}`
                            );
                    } else toastWarning(global.useDrawerOrCheckMenu, 4000);
                }
                break;
            }

            case global.showImageUsesPath: {
                appNavigate(global.showImageCollectionPath);
                break;
            }

            case global.showImageCollectionPath: {
                // it's going back
                if (globalState.previousPath === global.managementPath) {
                    toastWarning(global.useLeftDrawerOrLogout);
                } else {
                    if (globalState.featuresOfTheEditionObject.objectAdded) {
                        let categoryIndex = 0;
                        let dishIndex = 0;
                        let userIndex = 0;

                        switch (
                            globalState.featuresOfTheEditionObject
                                .objectOriginPath
                        ) {
                            case global.DialogCategoryPath:
                                categoryIndex =
                                    globalState.editionObject.categoryIndex;
                                appNavigate(
                                    globalState.featuresOfTheEditionObject
                                        .objectOriginPath,
                                    {state: {categoryIndex}}
                                );
                                break;
                            case global.DialogDishPath:
                                categoryIndex =
                                    globalState.editionObject.dishCategoryIndex;
                                dishIndex = globalState.editionObject.dishIndex;
                                appNavigate(
                                    globalState.featuresOfTheEditionObject
                                        .objectOriginPath,
                                    {
                                        state: {
                                            categoryIndex,
                                            dishIndex,
                                        },
                                    }
                                );
                                break;
                            case global.DialogPreferencesPath:
                                appNavigate(
                                    globalState.featuresOfTheEditionObject
                                        .objectOriginPath
                                );
                                break;
                            case global.DialogRestaurantUserPath:
                                userIndex = globalState.editionObject.userIndex;
                                appNavigate(
                                    globalState.featuresOfTheEditionObject
                                        .objectOriginPath,
                                    {state: {userIndex}}
                                );

                                break;

                            default:
                                break;
                        }
                    } else toastWarning(global.chooseQuitFromLeftDrawer);
                }
                break;
            }

            case global.homePath: {
                appNavigate(`${global.categoriesPath}/${menu.restaurant.id}`);
                break;
            }

            case global.managementLoginPath: {
                appNavigate(`${global.categoriesPath}/${menu.restaurant.id}`);
                break;
            }

            case global.showPublicPromotionPath: {
                appNavigate(global.showPublicPromotionsPath);
                break;
            }

            case global.showReviewsPath: {
                if (
                    environmentOptionItemsState.environmentOptionItems ===
                    environmentOptionItems.publicEnvironment
                ) {
                    switch (globalState.currentlyWatching) {
                        case global.dish:
                            appNavigate(
                                `${global.dishPath}/${menu.restaurant.id}/${globalState.currentCategoryIndex}/${globalState.currentDishIndex}`
                            );
                            break;

                        case global.restaurant:
                            appNavigate(
                                `${global.homePath}/${menu.restaurant.id}`
                            );
                            break;

                        default:
                            break;
                    }
                } else if (
                    globalState.previousPath === globalState.currentPath
                ) {
                    toastWarning(global.publishOrCancel);
                }
                break;
            }

            case global.DialogAddNewReviewPath: {
                switch (globalState.lastSignificantPathVisited) {
                    case global.dishPath: {
                        appNavigate(
                            `${global.dishPath}/${menu.restaurant.id}/${globalState.currentCategoryIndex}/${globalState.currentDishIndex}`
                        );
                        break;
                    }

                    case global.homePath: {
                        appNavigate(`${global.homePath}/${menu.restaurant.id}`);
                        break;
                    }

                    default: {
                        break;
                    }
                }
                break;
            }

            case global.DialogWhatsappSharePath: {
                switch (globalState.lastSignificantPathVisited) {
                    case global.dishPath: {
                        appNavigate(
                            `${global.dishPath}/${menu.restaurant.id}/${globalState.currentCategoryIndex}/${globalState.currentDishIndex}`
                        );
                        break;
                    }

                    case global.homePath: {
                        appNavigate(`${global.homePath}/${menu.restaurant.id}`);
                        break;
                    }

                    default: {
                        break;
                    }
                }
                break;
            }

            case global.showReviewPath: {
                let isDish;
                if (
                    globalState.currentReviewObject.review.parent_type ===
                    global.restaurant
                ) {
                    isDish = false;
                } else {
                    isDish = true;
                }
                appNavigate(`${global.showReviewsPath}`, {
                    state: {
                        isDish,
                        categoryIndex: globalState.currentCategoryIndex,
                        dishIndex: globalState.currentDishIndex,
                    },
                });
                break;
            }

            case global.showPublicPromotionsPath: {
                toastWarning(global.useLeftDrawer);
                break;
            }

            case global.showChangesMadePath: {
                switch (globalState.lastSignificantPathVisited) {
                    case global.categoriesPath: {
                        appNavigate(
                            `${global.categoriesPath}/${menu.restaurant.id}`
                        );
                        break;
                    }

                    case global.dishesPath: {
                        appNavigate(
                            `${global.dishesPath}/${menu.restaurant.id}/${globalState.currentCategoryIndex}`
                        );
                        break;
                    }

                    case global.dishPath: {
                        appNavigate(
                            `${global.dishPath}/${menu.restaurant.id}/${globalState.currentCategoryIndex}/${globalState.currentDishIndex}`
                        );
                        break;
                    }

                    default: {
                        break;
                    }
                }
                break;
            }

            default: {
                toastWarning(global.chooseQuitFromLeftDrawer);
                break;
            }
        }
    }
    return (
        <ContentContainer>
            {!globalState.doNotOpenDrawer && (
                <CompLeftDrawerOptionItems
                    show={leftDrawerOpen}
                    toggleShow={toggleDrawer}
                />
            )}

            {leftDrawerOpen && (
                <CompShowDrawerBackdrop closeDrawer={handleBackdropClick} />
            )}

            <LeftRightButtonsContainer>
                {!globalState.doNotOpenDrawer && (
                    <HamburgerButtonPosition>
                        <HamburgerButton
                            dontShowNavigators={globalState.dontShowNavigators}
                            onClick={handleLeftOpenDrawerOnClick}
                        >
                            {/* Having it inside other component, prevents it from occupying the whole height */}
                            {!hasToPay && (
                                <FontAwesomeIcon
                                    icon={faDoorOpen}
                                    style={{color: "white"}}
                                />
                            )}
                            {hasToPay && (
                                <FontAwesomeIcon
                                    icon={faDoorOpen}
                                    style={{color: "#57FCF2"}}
                                />
                            )}
                        </HamburgerButton>
                    </HamburgerButtonPosition>
                )}

                {!globalState.doNotOpenDrawer && (
                    <GoBackButtonPosition>
                        <GoBackButton
                            dontShowNavigators={globalState.dontShowNavigators}
                            onClick={handleRealGoBack}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </GoBackButton>
                    </GoBackButtonPosition>
                )}

                {environmentOptionItemsState.environmentOptionItems ===
                    environmentOptionItems.privateEnvironment &&
                    !globalState.doNotOpenDrawer && (
                        <TopicsHelpButtonPosition>
                            <HelpButton onClick={handleHelpOnHelp}>
                                <FontAwesomeIcon icon={faCircleQuestion} />
                            </HelpButton>
                            <HelpButton
                                dontShowNavigators={
                                    globalState.dontShowNavigators
                                }
                                onClick={handleTopicsHelp}
                            >
                                <FontAwesomeIcon
                                    icon={faPersonCircleQuestion}
                                />
                            </HelpButton>
                        </TopicsHelpButtonPosition>
                    )}
                {!globalState.doNotOpenDrawer && (
                    <div>
                        <HelpButtonPosition>
                            <HelpButton
                                dontShowNavigators={
                                    globalState.dontShowNavigators
                                }
                                onClick={handleHelp}
                            >
                                <FontAwesomeIcon icon={faQuestion} />
                            </HelpButton>
                        </HelpButtonPosition>
                    </div>
                )}
            </LeftRightButtonsContainer>
        </ContentContainer>
    );
}

export default CompShowHeaderStrip;
