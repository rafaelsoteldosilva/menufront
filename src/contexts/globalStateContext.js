import React, {createContext, useReducer} from "react";
import produce from "immer";

import * as global from "../globalDefinitions/globalConstants";
import PropTypes from "prop-types";

export const globalStateContextActions = {
    setDrawerWidth: "SET_DRAWER_WIDTH",
    resetDrawerWidth: "RESET_DRAWER_WIDTH",
    setSelectedTheme: "SET_SELECTED_THEME",
    setCurrentLanguage: "SET_CURRENT_LANGUAGE",
    setCurrentPath: "SET_CURRENT_PATH",
    setPreviousPath: "SET_PREVIOUS_PATH",
    setLastSignificantPathVisited: "SET_LAST_SIGNIFICANT_PATH_VISITED",
    setCurrentRestaurant: "SET_CURRENT_RESTAURANT",
    setCurrentCategoryIndex: "SET_CURRENT_CATEGORY_INDEX",
    setCurrentDishIndex: "SET_CURRENT_DISH_INDEX",
    setCurrentFunction: "SET_CURRENT_FUNCTION",
    clearCurrentFunction: "CLEAR_CURRENT_FUNCTION",
    setCurrentlyWatching: "SET_CURRENTLY_WATCHING",
    setSortElementsListHead: "SET_SORT_ELEMENTS_LIST_HEAD",
    setDoNotShowNavigators: "SET_DONT_SHOW_HAMBURGER",
    clearSortElementsListHead: "SET_SORT_ELEMENTS_LIST_HEAD",
    setCategoryEditionObject: "SET_CATEGORY_EDITION_OBJECT",
    setDishEditionObject: "SET_DISH_EDITION_OBJECT",
    setPreferencesEditionObject: "SET_PREFERENCES_EDITION_OBJECT",
    setUserEditionObject: "SET_USER_EDITION_OBJECT",
    setPromotionEditionObject: "SET_PROMOTION_OBJECT",
    setAddReviewEditionObject: "SET_ADD_REVIEW_EDITION_OBJECT",
    setWhatsappShareEditionObject: "SET_WHATSAPP_SHARE_EDITION_OBJECT",
    setImageNameEditionObject: "SET_IMAGE_NAME_EDITION_OBJECT",
    setRejectionReasonEditionObject: "SET_REJECTION_REASON_EDITION_OBJECT",
    setSelectFileSourceEditionObject: "SET_SELECT_FILE_SOURCE_EDITION_OBJECT",
    clearSelectFileSourceEditionObject:
        "CLEAR_SELECT_FILE_SOURCE_EDITION_OBJECT",
    setSelectLocalImageFileEditionObject:
        "SET_SELECT_LOCAL_IMAGE_FILE_EDITION_OBJECT",
    clearSelectLocalImageFileEditionObject:
        "CLEAR_SELECT_LOCAL_IMAGE_FILE_EDITION_OBJECT",
    setGetCameraPhotoEditionObject: "SET_GET_CAMERA_PHOTO_EDITION_OBJECT",
    clearGetCameraPhotoEditionObject: "CLEAR_GET_CAMERA_PHOTO_EDITION_OBJECT",
    setManagementLoginObject: "SET_MANAGEMENT_LOGIN_OBJECT",
    setPhotoEditionObject: "SET_PHOTO_EDITION_OBJECT",
    setEditionObjectChangeWasDone: "SET_EDITION_OBJECT_CHANGE_WAS_DONE",
    setEditionObjectChangeWasCancelled:
        "SET_EDITION_OBJECT_CHANGE_WAS_CANCELLED",
    clearEditionObject: "CLEAR_EDITION_OBJECT",
    setFinalPreferencesObject: "SET_FINAL_PREFERENCES_OBJECT",
    setFinalPreferencesObjectWasDone: "SET_FINAL_PREFERENCES_OBJECT_WAS_DONE",
    setCancelFinalPreferencesObject: "SET_CANCEL_PREFERENCES_OBJECT",
    setFinalPreferencesObjectWasUsed: "PREFERENCES_OBJECT_WAS_USED",
    setDontPerformAnyFurtherActionsTrue: "DONT_PERFORM_FURTHER_ACTIONS_TRUE",
    setDontPerformAnyFurtherActionsFalse: "DONT_PERFORM_FURTHER_ACTIONS_FALSE",
    setNotifyOfAChangeMade: "SET_NOTIFY_OF_A_CHANGE_MADE_TRUE",
    clearNotifyOfAChangeMade: "CLEAR_NOTIFY_OF_A_CHANGE_MADE_FALSE",
    setDeliveryObjectEditionObject: "SET_RESTAURANT_DELIVERY_OBJECT",
    setDeliverySelected: "SET_DELIVERY_SELECTED",
    resetDeliverySelected: "RESET_DELIVERY_SELECTED",
    setPaymentOptionEditionObject: "SET_PAYMENT_OPTION_OBJECT",
    setPaymentOptionSelected: "SET_PAYMENT_OPTION",
    resetPaymentOptionSelected: "RESET_PAYMENT_OPTION",
    clearObjectForDialogReset: "CLEAR_OBJECT_FOR_RESET",
    doNotGetObjectForDialogReset: "DO_NOT_GET_OBJECT_FOR_RESET",
    restartGetObjectForDialogReset: "RESTART_GET_OBJECT_FOR_RESET",
    activateARestaurantDeliveryCompany:
        "ACTIVATE_A_RESTAURANT_DELIVERY_COMPANY",
    resetActivateRestaurantDeliveryCompany:
        "RESET_ACTIVATE_RESTAURANT_DELIVERY_COMPANY",
    sendDrawerOpenSignal: "SET_DRAWER_OPEN_SIGNAL",
    setd: "SET_DO_NOT_OPEN_LEFT_DRAWER",
    cleard: "CLEAR_DO_NOT_OPEN_LEFT_DRAWER",
    setCurrentImageIndex: "SET_CURRENT_IMAGE_INDEX",
    clearCurrentImageIndex: "CLEAR_CURRENT_IMAGE_INDEX",
    setMediaStream: "SET_MEDIA_STREAM",
    clearMediaStream: "CLEAR_MEDIA_STREAM",
    setCurrentImageFileSource: "SET_CURRENT_IMAGE_FILE_SOURCE",
    clearCurrentImageFileSource: "CLEAR_CURRENT_IMAGE_FILE_SOURCE",
    setShowReviewsWaitingForRejectionReason:
        "SET_SHOW_REVIEWS_WAITING_FOR_REJECTION_REASON",
    setShowReviewWaitingForRejectionReason:
        "SET_SHOW_REVIEW_WAITING_FOR_REJECTION_REASON",
    setEditReviewRejectionReasonAnsweringObject:
        "SET_EDIT_REVIEW_REJECTION_REASON_ANSWERING_OBJECT",
    clearShowReviewsWaitingForRejectionReason:
        "CLEAR_SHOW_REVIEWS_WAITING_FOR_REJECTION_REASON",
    clearShowReviewWaitingForRejectionReason:
        "CLEAR_SHOW_REVIEW_WAITING_FOR_REJECTION_REASON",
    clearEditReviewRejectionReasonAnsweringObject:
        "CLEAR_EDIT_REVIEW_REJECTION_REASON_ANSWERING_OBJECT",
    setGeneralMessage: "SET_GENERAL_MESSAGE",
    clearGeneralMessage: "CLEAR_GENERAL_MESSAGE",
    setEMailWasValidated: "SET_EMAIL_WAS_VALIDATED",
    clearEMailWasValidated: "CLEAR_EMAIL_WAS_VALIDATED",
    setSendEMail: "SET_SEND_EMAIL",
    clearSendEMail: "CLEAR_SEND_EMAIL",
    setCurrentMenuOption: "SET_CURRENT_MENU_OPTION",
    resetCurrentMenuOption: "RESET_CURRENT_MENU_OPTION",
    setDoNotOpenDrawer: "SET_DO_NOT_OPEN_DRAWER",
    clearDoNotOpenDrawer: "CLEAR_DO_NOT_OPEN_DRAWER",
    setDoNotOpenLeftDrawer: "SET_DO_NOT_OPEN_LEFT_DRAWER",
    clearDoNotOpenLeftDrawer: "CLEAR_DO_NOT_OPEN_LEFT_DRAWER",
    setCurrentReviewObject: "SET_REVIEW_OBJECT_FOR_HELP_RETURN",
    clearReviewObjectForHelpReturn: "CLEAR_REVIEW_OBJECT_FOR_HELP_RETURN",
    setPromotionObjectForHelpReturn: "SET_PROMOTION_OBJECT_FOR_HELP_RETURN",
    clearPromotionObjectForHelpReturn: "CLEAR_PROMOTION_OBJECT_FOR_HELP_RETURN",
    setShowCategoriesModal: "SET_SHOW_CATEGORIES_MODAL",
    clearShowCategoriesModal: "CLEAR_SHOW_CATEGORIES_MODAL",
    setDoYouWantToDeleteAllSortings: "SET_DO_YOU_WANT_TO_DELETE_ALL_SORTINGS",
    clearDoYouWantToDeleteAllSortings:
        "CLEAR_DO_YOU_WANT_TO_DELETE_ALL_SORTINGS",
    setNameOfTheItemSelectingAnImage: "SET_NAME_OF_THE_ITEM_SELECTING_AN_IMAGE",
    clearNameOfTheItemSelectingAnImage:
        "CLEAR_NAME_OF_THE_ITEM_SELECTING_AN_IMAGE",
    setNewChangeMade: "SET_NEW_CHANGE_MADE",
    clearChangesMade: "CLEAR_CHANGES_MADE",
};

// Define the initial state for your context
const initialState = {
    drawerOpenSignal: false,
    doNotOpenDrawer: false,
    doNotOpenLeftDrawer: false,
    drawerWidth: 260,
    selectedTheme: global.privateTheme,
    currentLanguage: "es",
    currentPath: global.defaultPath,
    currentRestaurant: global.noValue,
    currentCategoryIndex: global.noValue,
    currentDishIndex: global.noValue,
    previousPath: global.defaultPath,
    lastSignificantPathVisited: global.defaultPath,
    currentFunction: global.categories,
    currentMenuOption: global.menuOptions.public.menu,
    currentlyWatching: global.categories,
    sortElementsListHead: null,
    doNotShowNavigators: false,
    editionObject: null,
    featuresOfTheEditionObject: {
        objectAdded: false,
        objectType: "",
        status: "",
        objectOriginPath: "",
    },
    selectFileSourceEditionObject: null,
    featuresOfTheSelectFileSourceEditionObject: {
        objectAdded: false,
        objectType: "",
        status: "",
        objectOriginPath: "",
    },
    selectLocalImageFileEditionObject: null,
    featuresOfTheSelectLocalImageFileEditionObject: {
        objectAdded: false,
        objectType: "",
        status: "",
        objectOriginPath: "",
    },
    getCameraPhotoEditionObject: null,
    featuresOfTheGetcameraPhotoEditionObject: {
        objectAdded: false,
        objectType: "",
        status: "",
        objectOriginPath: "",
    },
    waitingForAnAnswer: false,
    waitingForAnAnswerFeatures: {
        reviewObj: null,
        waitingForObjectType: "",
        componentAskingPath: "",
        componentAnsweringPath: "",
    },
    answerReady: false,
    answerReadyFeatures: {
        reviewObj: null,
        answerObjectType: "",
        answerObject: null,
        componentAskingPath: "",
        componentAnsweringPath: "",
    },
    finalPreferencesObject: null,
    aFinalPreferencesObjectWasAdded: {
        status: "",
    },
    dontPerformAnyFurtherActions: false,
    notifyOfAChangeMade: false,
    selectedDelivery: null,
    // privateMenuEditionTitle: "",
    currentImageIndex: global.noValue,
    mediaStream: null,
    currentImageFileSource: global.localImage,
    generalMessage: "",
    eMailWasValidated: false,
    sendEMail: false,
    getObjectForDialogReset: true,
    objectForDialogReset: null,
    someFeaturesOfTheObjectForDialogReset: {
        objectAdded: false,
        objectType: "",
        status: "",
        objectOriginPath: "",
    },
    currentReviewObject: null,
    promotionObjectForHelpReturn: null,
    showCategoriesModal: false,
    doYouWantToDeleteAllSortings: false,
    nameOfTheItemSelectingAnImage: null,
    listOfChangesMade: [],
};

const globalStateReducer = (state, action) => {
    switch (action.type) {
        case globalStateContextActions.setNewChangeMade: {
            return produce(state, (draftState) => {
                draftState.listOfChangesMade = [
                    ...draftState.listOfChangesMade,
                    action.payload,
                ];
            });
        }
        case globalStateContextActions.clearChangesMade: {
            return produce(state, (draftState) => {
                draftState.listOfChangesMade = [];
            });
        }
        case globalStateContextActions.setNameOfTheItemSelectingAnImage: {
            return produce(state, (draftState) => {
                draftState.nameOfTheItemSelectingAnImage = action.payload;
            });
        }
        case globalStateContextActions.clearNameOfTheItemSelectingAnImage: {
            return produce(state, (draftState) => {
                draftState.nameOfTheItemSelectingAnImage = null;
            });
        }
        case globalStateContextActions.setDoYouWantToDeleteAllSortings: {
            return produce(state, (draftState) => {
                draftState.showCategoriesModal = true;
                draftState.doYouWantToDeleteAllSortings = true;
            });
        }
        case globalStateContextActions.clearDoYouWantToDeleteAllSortings: {
            return produce(state, (draftState) => {
                draftState.showCategoriesModal = false;
                draftState.doYouWantToDeleteAllSortings = false;
            });
        }
        case globalStateContextActions.setCurrentReviewObject: {
            return produce(state, (draftState) => {
                draftState.currentReviewObject = action.payload;
            });
        }
        case globalStateContextActions.clearReviewObjectForHelpReturn: {
            return produce(state, (draftState) => {
                draftState.currentReviewObject = null;
            });
        }
        case globalStateContextActions.setPromotionObjectForHelpReturn: {
            return produce(state, (draftState) => {
                draftState.promotionObjectForHelpReturn = action.payload;
            });
        }
        case globalStateContextActions.clearPromotionObjectForHelpReturn: {
            return produce(state, (draftState) => {
                draftState.promotionObjectForHelpReturn = null;
            });
        }
        case globalStateContextActions.setCurrentMenuOption: {
            return produce(state, (draftState) => {
                const allValues = Object.values(
                    global.menuOptions.public
                ).concat(Object.values(global.menuOptions.private));
                if (allValues.includes(action.payload))
                    draftState.currentMenuOption = action.payload;
                else {
                    // it is like a reset
                    alert("globalStateContext:: unknown menu option");
                    draftState.currentMenuOption =
                        global.menuOptions.public.menu;
                }
            });
        }
        case globalStateContextActions.resetCurrentMenuOption: {
            return produce(state, (draftState) => {
                draftState.currentMenuOption = global.menuOptions.public.menu;
            });
        }
        case globalStateContextActions.setSendEMail: {
            return produce(state, (draftState) => {
                draftState.sendEMail = true;
            });
        }
        case globalStateContextActions.setDoNotOpenLeftDrawer: {
            return produce(state, (draftState) => {
                draftState.doNotOpenLeftDrawer = true;
            });
        }
        case globalStateContextActions.clearDoNotOpenLeftDrawer: {
            return produce(state, (draftState) => {
                draftState.doNotOpenLeftDrawer = false;
            });
        }
        case globalStateContextActions.setDoNotOpenDrawer: {
            return produce(state, (draftState) => {
                draftState.doNotOpenDrawer = true;
            });
        }
        case globalStateContextActions.clearDoNotOpenDrawer: {
            return produce(state, (draftState) => {
                draftState.doNotOpenDrawer = false;
            });
        }
        case globalStateContextActions.clearSendEMail: {
            return produce(state, (draftState) => {
                draftState.sendEMail = false;
            });
        }
        case globalStateContextActions.setEMailWasValidated: {
            return produce(state, (draftState) => {
                draftState.eMailWasValidated = action.payload;
                if (draftState.featuresOfTheEditionObject) {
                    draftState.featuresOfTheEditionObject = {
                        ...draftState.featuresOfTheEditionObject,
                        status: global.doneStatus,
                    };
                }
            });
        }
        case globalStateContextActions.clearEMailWasValidated: {
            return produce(state, (draftState) => {
                draftState.eMailWasValidated = false;
                if (draftState.featuresOfTheEditionObject) {
                    draftState.featuresOfTheEditionObject = {
                        ...draftState.featuresOfTheEditionObject,
                        status: global.cancelledStatus,
                    };
                }
            });
        }
        case globalStateContextActions.setGeneralMessage: {
            return produce(state, (draftState) => {
                draftState.generalMessage = action.payload;
            });
        }
        case globalStateContextActions.clearGeneralMessage: {
            return produce(state, (draftState) => {
                draftState.generalMessage = "";
            });
        }
        case globalStateContextActions.setMediaStream: {
            return produce(state, (draftState) => {
                draftState.mediaStream = action.payload;
            });
        }
        case globalStateContextActions.clearMediaStream: {
            return produce(state, (draftState) => {
                draftState.mediaStream = null;
            });
        }
        case globalStateContextActions.setCurrentImageFileSource: {
            return produce(state, (draftState) => {
                draftState.currentImageFileSource = action.payload;
            });
        }
        case globalStateContextActions.clearCurrentImageFileSource: {
            return produce(state, (draftState) => {
                draftState.currentImageFileSource = null;
            });
        }
        case globalStateContextActions.setCurrentImageIndex: {
            return produce(state, (draftState) => {
                draftState.currentImageIndex = action.payload;
            });
        }
        case globalStateContextActions.clearCurrentImageIndex: {
            return produce(state, (draftState) => {
                draftState.currentImageIndex = global.noValue;
            });
        }
        case globalStateContextActions.sendDrawerOpenSignal: {
            return produce(state, (draftState) => {
                draftState.drawerOpenSignal = action.payload;
            });
        }
        case globalStateContextActions.setd: {
            return produce(state, (draftState) => {
                draftState.d = true;
            });
        }
        case globalStateContextActions.cleard: {
            return produce(state, (draftState) => {
                draftState.d = false;
            });
        }
        case globalStateContextActions.setDrawerWidth: {
            return produce(state, (draftState) => {
                draftState.drawerWidth = action.payload;
            });
        }
        case globalStateContextActions.setDeliverySelected: {
            return produce(state, (draftState) => {
                draftState.selectedDelivery = {
                    deliveryObj: action.payload.deliveryCompany,
                };
            });
        }
        case globalStateContextActions.resetDeliverySelected: {
            return produce(state, (draftState) => {
                draftState.selectedDelivery = null;
            });
        }
        case globalStateContextActions.resetDrawerWidth: {
            return produce(state, (draftState) => {
                draftState.drawerWidth = 260;
            });
        }
        case globalStateContextActions.doNotGetObjectForDialogReset: {
            return produce(state, (draftState) => {
                draftState.getObjectForDialogReset = false;
            });
        }
        case globalStateContextActions.restartGetObjectForDialogReset: {
            return produce(state, (draftState) => {
                draftState.getObjectForDialogReset = true;
            });
        }
        case globalStateContextActions.setSortElementsListHead: {
            return produce(state, (draftState) => {
                draftState.sortElementsListHead = action.payload;
            });
        }
        case globalStateContextActions.clearSortElementsListHead: {
            return produce(state, (draftState) => {
                draftState.sortElementsListHead = null;
            });
        }
        case globalStateContextActions.setSelectedTheme: {
            return produce(state, (draftState) => {
                draftState.selectedTheme = action.payload;
            });
        }
        case globalStateContextActions.setCurrentFunction: {
            return produce(state, (draftState) => {
                draftState.currentFunction = action.payload;
            });
        }
        case globalStateContextActions.clearCurrentFunction: {
            return produce(state, (draftState) => {
                draftState.currentFunction = null;
            });
        }
        case globalStateContextActions.setCurrentLanguage: {
            return produce(state, (draftState) => {
                draftState.currentLanguage = action.payload;
            });
        }

        case globalStateContextActions.setLastSignificantPathVisited: {
            return produce(state, (draftState) => {
                draftState.lastSignificantPathVisited = action.payload;
            });
        }

        case globalStateContextActions.setCurrentRestaurant: {
            return produce(state, (draftState) => {
                draftState.currentRestaurant = action.payload;
            });
        }
        case globalStateContextActions.setCurrentCategoryIndex: {
            return produce(state, (draftState) => {
                draftState.currentCategoryIndex = action.payload;
            });
        }
        case globalStateContextActions.setCurrentDishIndex: {
            return produce(state, (draftState) => {
                draftState.currentDishIndex = action.payload;
            });
        }
        case globalStateContextActions.setCurrentlyWatching: {
            return produce(state, (draftState) => {
                draftState.currentlyWatching = action.payload;
            });
        }
        case globalStateContextActions.setDoNotShowNavigators: {
            return produce(state, (draftState) => {
                draftState.doNotShowNavigators = true;
            });
        }
        case globalStateContextActions.setCategoryEditionObject: {
            return produce(state, (draftState) => {
                draftState.editionObject = action.payload;
                draftState.featuresOfTheEditionObject = {
                    objectAdded: true,
                    objectType: global.categories,
                    status: global.waitingStatus,
                    objectOriginPath: global.DialogCategoryPath,
                };
            });
        }
        case globalStateContextActions.setDishEditionObject: {
            return produce(state, (draftState) => {
                draftState.editionObject = action.payload;
                draftState.featuresOfTheEditionObject = {
                    objectAdded: true,
                    objectType: global.dishes,
                    status: global.waitingStatus,
                    objectOriginPath: global.DialogDishPath,
                };
            });
        }
        case globalStateContextActions.setPreferencesEditionObject: {
            return produce(state, (draftState) => {
                draftState.editionObject = action.payload;
                draftState.featuresOfTheEditionObject = {
                    objectAdded: true,
                    objectType: global.preferences,
                    status: global.waitingStatus,
                    objectOriginPath: global.DialogPreferencesPath,
                };
            });
        }
        case globalStateContextActions.setUserEditionObject: {
            return produce(state, (draftState) => {
                draftState.editionObject = action.payload;
                draftState.featuresOfTheEditionObject = {
                    objectType: global.dialogRestaurantUser,
                    objectAdded: true,
                    status: global.waitingStatus,
                    objectOriginPath: global.DialogRestaurantUserPath,
                };
            });
        }
        case globalStateContextActions.setPromotionEditionObject: {
            return produce(state, (draftState) => {
                draftState.editionObject = action.payload;
                draftState.featuresOfTheEditionObject = {
                    objectType: global.promotions,
                    objectAdded: true,
                    status: global.waitingStatus,
                    objectOriginPath: global.DialogPromotionPrivatePath,
                };
            });
        }

        case globalStateContextActions.setAddReviewEditionObject: {
            return produce(state, (draftState) => {
                draftState.editionObject = action.payload;
                draftState.featuresOfTheEditionObject = {
                    objectType: global.addReview,
                    objectAdded: true,
                    status: global.waitingStatus,
                    objectOriginPath: global.DialogAddNewReviewPath,
                };
            });
        }

        case globalStateContextActions.setWhatsappShareEditionObject: {
            return produce(state, (draftState) => {
                draftState.editionObject = action.payload;
                draftState.featuresOfTheEditionObject = {
                    objectType: global.whatsappShare,
                    objectAdded: true,
                    status: global.waitingStatus,
                    objectOriginPath: global.DialogWhatsappSharePath,
                };
            });
        }

        case globalStateContextActions.setImageNameEditionObject: {
            return produce(state, (draftState) => {
                draftState.editionObject = action.payload;
                draftState.featuresOfTheEditionObject = {
                    objectType: global.DialogImageName,
                    objectAdded: true,
                    status: global.waitingStatus,
                    objectOriginPath: global.DialogImageNamePath,
                };
            });
        }

        case globalStateContextActions.setRejectionReasonEditionObject: {
            return produce(state, (draftState) => {
                draftState.editionObject = action.payload;
                draftState.featuresOfTheEditionObject = {
                    objectType: global.selectRejectionReason,
                    objectAdded: true,
                    status: global.waitingStatus,
                    objectOriginPath: global.DialogReviewRejectionReasonPath,
                };
            });
        }

        case globalStateContextActions.setDeliveryObjectEditionObject: {
            return produce(state, (draftState) => {
                draftState.editionObject = action.payload;
                draftState.featuresOfTheEditionObject = {
                    objectType: global.DialogRestaurantDeliveryToken,
                    objectAdded: true,
                    status: global.waitingStatus,
                    objectOriginPath: global.DialogRestaurantDeliveryTokenPath,
                };
            });
        }

        case globalStateContextActions.setSelectFileSourceEditionObject: {
            return produce(state, (draftState) => {
                draftState.selectFileSourceEditionObject = action.payload;
                draftState.featuresOfTheSelectFileSourceEditionObject = {
                    objectType: global.SelectFileSource,
                    objectAdded: true,
                    status: global.waitingStatus,
                    objectOriginPath: global.DialogSelectFileSourcePath,
                };
            });
        }

        case globalStateContextActions.setSelectLocalImageFileEditionObject: {
            return produce(state, (draftState) => {
                draftState.selectLocalImageFileEditionObject = action.payload;
                draftState.featuresOfTheSelectLocalImageFileEditionObject = {
                    objectType: global.selectLocalImageFile,
                    objectAdded: true,
                    status: global.waitingStatus,
                    objectOriginPath: global.DialogSelectLocalImagePath,
                };
            });
        }

        case globalStateContextActions.setGetCameraPhotoEditionObject: {
            return produce(state, (draftState) => {
                draftState.getCameraPhotoEditionObject = action.payload;
                draftState.featuresOfTheGetCameraPhotoEditionObject = {
                    objectType: global.getCameraPhoto,
                    objectAdded: true,
                    status: global.waitingStatus,
                    objectOriginPath: global.DialogGetCameraPhotoPath,
                };
            });
        }

        case globalStateContextActions.setManagementLoginObject: {
            return produce(state, (draftState) => {
                draftState.editionObject = action.payload;
                draftState.featuresOfTheEditionObject = {
                    objectType: global.managementLogin,
                    objectAdded: true,
                    status: global.waitingStatus,
                    objectOriginPath: global.managementLoginPath,
                };
            });
        }

        case globalStateContextActions.setPhotoEditionObject: {
            return produce(state, (draftState) => {
                draftState.editionObject = action.payload;
                draftState.featuresOfTheEditionObject = {
                    objectType: global.getCameraImage,
                    objectAdded: true,
                    status: global.waitingStatus,
                    objectOriginPath: global.DialogGetCameraPhotoPath,
                };
            });
        }

        case globalStateContextActions.setShowReviewsWaitingForRejectionReason: {
            return produce(state, (draftState) => {
                draftState.waitingForAnAnswer = true;
                draftState.waitingForAnAnswerFeatures = {
                    reviewObj: action.payload.reviewObj,
                    waitingForObjectType: global.rejectionReasonObject,
                    componentAskingPath: global.showReviewsPath,
                    componentAnsweringPath:
                        global.DialogReviewRejectionReasonPath,
                };
            });
        }

        case globalStateContextActions.setShowReviewWaitingForRejectionReason: {
            return produce(state, (draftState) => {
                draftState.waitingForAnAnswer = true;
                draftState.waitingForAnAnswerFeatures = {
                    reviewObj: action.payload.reviewObj,
                    waitingForObjectType: global.rejectionReasonObject,
                    componentAskingPath: global.showReviewPath,
                    componentAnsweringPath:
                        global.DialogReviewRejectionReasonPath,
                };
            });
        }

        case globalStateContextActions.setEditReviewRejectionReasonAnsweringObject: {
            return produce(state, (draftState) => {
                draftState.answerReady = true;
                draftState.answerReadyFeatures = {
                    reviewObj: action.payload.reviewObj,
                    answerObjectType: global.rejectionReasonObject,
                    answerObject: action.payload.answerObject,
                    componentAskingPath: global.showReviewPath,
                    componentAnsweringPath:
                        global.DialogReviewRejectionReasonPath,
                };
            });
        }

        case globalStateContextActions.clearShowReviewsWaitingForRejectionReason: {
            return produce(state, (draftState) => {
                draftState.waitingForAnAnswer = false;
                draftState.waitingForAnAnswerFeatures = {
                    reviewObj: null,
                    waitingForObjectType: "",
                    componentAskingPath: "",
                    componentAnsweringPath: "",
                };
            });
        }

        case globalStateContextActions.clearShowReviewWaitingForRejectionReason: {
            return produce(state, (draftState) => {
                draftState.waitingForAnAnswer = false;
                draftState.waitingForAnAnswerFeatures = {
                    reviewObj: null,
                    waitingForObjectType: "",
                    componentAskingPath: "",
                    componentAnsweringPath: "",
                };
            });
        }

        case globalStateContextActions.clearEditReviewRejectionReasonAnsweringObject: {
            return produce(state, (draftState) => {
                draftState.answerReady = false;
                draftState.answerReadyFeatures = {
                    reviewObj: null,
                    answerObjectType: "",
                    answerObject: null,
                    componentAskingPath: "",
                    componentAnsweringPath: "",
                };
            });
        }

        case globalStateContextActions.clearObjectForDialogReset: {
            return produce(state, (draftState) => {
                if (draftState.someFeaturesOfTheObjectForDialogReset) {
                    draftState.objectForDialogReset = null;
                    draftState.someFeaturesOfTheObjectForDialogReset.objectAdded = false;
                    draftState.someFeaturesOfTheObjectForDialogReset.status =
                        "";
                    draftState.someFeaturesOfTheObjectForDialogReset.objectType =
                        "";
                    draftState.someFeaturesOfTheObjectForDialogReset.objectOriginPath =
                        "";
                }
            });
        }

        case globalStateContextActions.setEditionObjectChangeWasDone: {
            return produce(state, (draftState) => {
                if (draftState.featuresOfTheEditionObject)
                    draftState.featuresOfTheEditionObject.status =
                        global.doneStatus;
            });
        }

        case globalStateContextActions.setEditionObjectChangeWasCancelled: {
            return produce(state, (draftState) => {
                if (draftState.featuresOfTheEditionObject) {
                    draftState.featuresOfTheEditionObject.objectAdded = false;
                    draftState.featuresOfTheEditionObject.status =
                        global.cancelledStatus;
                    // draftState.featuresOfTheEditionObject.objectType = "";
                }
            });
        }

        case globalStateContextActions.clearEditionObject: {
            return produce(state, (draftState) => {
                draftState.editionObject = null;
                if (draftState.featuresOfTheEditionObject) {
                    draftState.featuresOfTheEditionObject.objectAdded = false;
                    draftState.featuresOfTheEditionObject.status = "";
                    draftState.featuresOfTheEditionObject.objectOriginPath = "";
                }
            });
        }

        case globalStateContextActions.clearSelectFileSourceEditionObject: {
            return produce(state, (draftState) => {
                draftState.selectFileSourceEditionObject = null;
                if (draftState.featuresOfTheSelectFileSourceEditionObject) {
                    draftState.featuresOfTheSelectFileSourceEditionObject.objectAdded = false;
                    draftState.featuresOfTheSelectFileSourceEditionObject.status =
                        "";
                    draftState.featuresOfTheSelectFileSourceEditionObject.objectOriginPath =
                        "";
                }
            });
        }

        case globalStateContextActions.clearSelectLocalImageFileEditionObject: {
            return produce(state, (draftState) => {
                draftState.selectLocalImageFileEditionObject = null;
                if (draftState.featuresOfTheSelectLocalImageFileEditionObject) {
                    draftState.featuresOfTheSelectLocalImageFileEditionObject.objectAdded = false;
                    draftState.featuresOfTheSelectLocalImageFileEditionObject.status =
                        "";
                    draftState.featuresOfTheSelectLocalImageFileEditionObject.objectOriginPath =
                        "";
                }
            });
        }

        case globalStateContextActions.clearGetCameraPhotoEditionObject: {
            return produce(state, (draftState) => {
                draftState.getCameraPhotoEditionObject = null;
                if (draftState.featuresOfTheGetCameraPhotoEditionObject) {
                    draftState.featuresOfTheGetCameraPhotoEditionObject.objectAdded = false;
                    draftState.featuresOfTheGetCameraPhotoEditionObject.status =
                        "";
                    draftState.featuresOfTheGetCameraPhotoEditionObject.objectOriginPath =
                        "";
                }
            });
        }

        case globalStateContextActions.setCurrentPath: {
            return produce(state, (draftState) => {
                draftState.currentPath = action.payload;
            });
        }

        case globalStateContextActions.setPreviousPath: {
            return produce(state, (draftState) => {
                draftState.previousPath = action.payload;
            });
        }

        case globalStateContextActions.setFinalPreferencesObject: {
            return produce(state, (draftState) => {
                draftState.finalPreferencesObject = action.payload;
                draftState.aFinalPreferencesObjectWasAdded = {
                    status: global.waitingStatus,
                };
            });
        }

        case globalStateContextActions.setFinalPreferencesObjectWasDone: {
            return produce(state, (draftState) => {
                if (draftState.aFinalPreferencesObjectWasAdded)
                    draftState.aFinalPreferencesObjectWasAdded = {
                        status: global.doneStatus,
                    };
            });
        }

        case globalStateContextActions.setCancelFinalPreferencesObject: {
            return produce(state, (draftState) => {
                if (draftState.aFinalPreferencesObjectWasAdded)
                    draftState.aFinalPreferencesObjectWasAdded = {
                        status: global.cancelledStatus,
                    };
            });
        }

        case globalStateContextActions.setFinalPreferencesObjectWasUsed: {
            return produce(state, (draftState) => {
                if (draftState.aFinalPreferencesObjectWasAdded)
                    draftState.aFinalPreferencesObjectWasAdded = {
                        status: global.usedStatus,
                    };
            });
        }

        case globalStateContextActions.setDontPerformAnyFurtherActionsTrue: {
            return produce(state, (draftState) => {
                draftState.dontPerformAnyFurtherActions = true;
            });
        }

        case globalStateContextActions.setDontPerformAnyFurtherActionsFalse: {
            return produce(state, (draftState) => {
                draftState.dontPerformAnyFurtherActions = false;
            });
        }

        case globalStateContextActions.setNotifyOfAChangeMade: {
            return produce(state, (draftState) => {
                draftState.notifyOfAChangeMade = true;
            });
        }

        case globalStateContextActions.clearNotifyOfAChangeMade: {
            return produce(state, (draftState) => {
                draftState.notifyOfAChangeMade = false;
            });
        }

        default: {
            break;
        }
    }
};

// Create your context using createContext and pass the initial state and reducer function
const GlobalStateContext = createContext();

// Create a component to provide your context
const GlobalStateContextProvider = ({children}) => {
    const [globalState, globalStateDispatch] = useReducer(
        globalStateReducer,
        initialState
    );

    return (
        <GlobalStateContext.Provider value={{globalState, globalStateDispatch}}>
            {children}
        </GlobalStateContext.Provider>
    );
};

export {GlobalStateContext, GlobalStateContextProvider};

GlobalStateContextProvider.propTypes = {
    children: PropTypes.node.isRequired, // children should be a valid React node and is required
};
