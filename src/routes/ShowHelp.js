import React, {useEffect, useState} from "react";
import {VideoPlayer} from "../utils/VideoPlayer";
import {useLocation} from "react-router-dom";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";

import {getRestaurantMenu} from "../slices/restaurantMenuSlice";
import {useContext} from "react";
import {useSelector} from "react-redux";
import {useNavigation} from "../contexts/navigationContext";
import * as global from "../globalDefinitions/globalConstants";
import {getHelpVideoUrlApi} from "../axiosCalls/axiosAPICalls";

import styled from "styled-components";
import {toastError} from "../utils/toastMessages";
import {checkResponseStatus} from "../utils/checkResponseStatus";

const ContentContainer = styled.div`
    width: 100vw;
    height: 100vh;
    // margin-left: 65px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 100;
`;

function ShowHelp() {
    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);

    const menu = useSelector(getRestaurantMenu);
    const {appNavigate} = useNavigation();
    const {state} = useLocation();
    const {videoName} = state;
    const [videoUrl, setVideoUrl] = useState("");

    async function getVideoUrl(videoName) {
        const result = await getHelpVideoUrlApi(videoName);
        if (checkResponseStatus(result.status)) {
            setVideoUrl(result.data.video_url);
        } else {
            toastError(global.connectionErrorOrUserCanNotPerformOperations);
        }
    }

    useEffect(() => {
        if (videoName !== "") {
            getVideoUrl(videoName);
        }
    }, [videoName]);

    function performHelpExit() {
        let isDish = false;
        switch (globalState.currentFunction) {
            case global.DialogAddNewReviewPath:
            case global.DialogWhatsappSharePath:
            case global.DialogGetCameraPhotoPath:
            case global.managementLoginPath:
            case global.DialogPreferencesPath:
            case global.ShowPrivateRestaurantDeliveriesPath:
            case global.SelectPublicRestaurantDeliveriesPath:
            case global.DialogSelectFileSourcePath:
            case global.DialogSelectLocalImagePath:
            case global.DialogReviewRejectionReasonPath:
            case global.showRestaurantUsersPath:
            case global.showImageCollectionPath:
            case global.payPalOnePaymentPath:
            case global.showRestaurantNumberPath:
            case global.showQRPath:
            case global.managementPath:
            case global.showPreferencesPath: {
                appNavigate(globalState.currentFunction);
                break;
            }

            case global.DialogCategoryPath: {
                appNavigate(global.DialogCategoryPath, {
                    state: {
                        categoryIndex: globalState.editionObject.categoryIndex,
                    },
                });
                break;
            }

            case global.DialogDishPath: {
                appNavigate(global.DialogDishPath, {
                    state: {
                        categoryIndex:
                            globalState.editionObject.dishCategoryIndex,
                        dishIndex: globalState.editionObject.dishIndex,
                    },
                });
                break;
            }

            case global.DialogRestaurantUserPath: {
                appNavigate(global.DialogRestaurantUserPath, {
                    state: {
                        userIndex: globalState.editionObject.userIndex,
                    },
                });
                break;
            }

            case global.DialogImageNamePath: {
                appNavigate(global.DialogImageNamePath, {
                    state: {
                        imageIndex: globalState.editionObject.imageIndex,
                    },
                });
                break;
            }

            case global.DialogPromotionPrivatePath: {
                appNavigate(global.DialogPromotionPrivatePath, {
                    state: {
                        promotionIndex:
                            globalState.editionObject.promotionIndex,
                    },
                });
                break;
            }

            case global.DialogRestaurantDeliveryTokenPath: {
                appNavigate(global.DialogRestaurantDeliveryTokenPath, {
                    state: {
                        restaurantDeliveryCompanyBeingEditedIndex:
                            globalState.editionObject
                                .restaurantDeliveryBeingEditedIndex,
                        deliverySelected:
                            globalState.editionObject.deliverySelected,
                    },
                });
                break;
            }

            case global.homePath: {
                appNavigate(`${global.homePath}/${menu.restaurant.id}`);
                break;
            }
            case global.categoriesPath: {
                appNavigate(`${global.categoriesPath}/${menu.restaurant.id}`);
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

            case global.showReviewsPath: {
                isDish = false;
                switch (globalState.currentlyWatching) {
                    case global.dish:
                        isDish = true;
                        break;

                    default:
                        break;
                }
                appNavigate(global.showReviewsPath, {
                    state: {
                        isDish,
                        categoryIndex: globalState.currentCategoryIndex,
                        dishIndex: globalState.currentDishIndex,
                    },
                });
                break;
            }

            case global.showPublicPromotionPath: {
                const promotionObj = globalState.promotionObjectForHelpReturn;
                globalStateDispatch({
                    type: globalStateContextActions.clearReviewObjectForHelpReturn,
                });
                if (promotionObj === null) alert("promotion object is null!!");
                else
                    appNavigate(global.showPublicPromotionPath, {
                        state: {
                            myPromotion:
                                globalState.promotionObjectForHelpReturn,
                        },
                    });
                break;
            }

            case global.showReviewPath: {
                const reviewObj = globalState.currentReviewObject;
                globalStateDispatch({
                    type: globalStateContextActions.clearReviewObjectForHelpReturn,
                });
                if (reviewObj === null) alert("review object is null!!");
                else
                    appNavigate(global.showReviewPath, {
                        state: {reviewObj},
                    });
                break;
            }

            default: {
                appNavigate(globalState.currentFunction);
                break;
            }
        }
    }

    function handleExit() {
        performHelpExit();
    }

    return (
        <ContentContainer>
            <VideoPlayer videoUrl={videoUrl} onExit={handleExit} />
        </ContentContainer>
    );
}

export default ShowHelp;
