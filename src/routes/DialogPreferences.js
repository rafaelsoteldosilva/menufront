import React, {
    useEffect,
    useRef,
    useState,
    useContext,
    useCallback,
} from "react";
import {useForm, Controller} from "react-hook-form";

import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    TextField,
    Typography,
    Paper,
    MenuItem,
    Select,
} from "@mui/material";

import CancelIcon from "@mui/icons-material/Cancel";

import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";

import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";

import {faQuestion} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {toastError, toastInfo, toastSuccess} from "../utils/toastMessages";

import {useDispatch, useSelector} from "react-redux";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";
import * as global from "../globalDefinitions/globalConstants";

import {useNavigation} from "../contexts/navigationContext";

import {
    getRestaurantMenu,
    fetchMenu,
    resetStateChange,
    resetChangeNumber,
    setSpecificChange,
    changePreferencesData,
} from "../slices/restaurantMenuSlice";

import {ShowImage} from "../utils/ImageFunctions";

import {makeStyles} from "@mui/styles";
import {updatePreferencesPrivatelyApi} from "../axiosCalls/axiosAPICalls";

import {checkResponseStatus} from "../utils/checkResponseStatus";

import styled from "styled-components";
import {sanitizeStr} from "../utils/severalFunctions";

const ContentContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 10px;
    margin-left: -5px;
    width: 100%;
    height: 300vh;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 100;
    user-select: none;
`;

const DialogBox = styled.div`
    width: 70%;
    margin-top: 50px;
    margin-left: 10px;
    padding: 5px;
`;

const useStyles = makeStyles(() => ({
    whiteIcon: {
        color: "#716EFA",
    },
}));

const DaysLine = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 10px;
    margin-right: 0px;
    gap: 8px 1px;
`;

const FlagOption = styled(MenuItem)`
    && {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
    }
`;

export default function DialogPreferences() {
    // *************************** warning *****************************
    // When adding a new field, you must put it's watcher in the useEffect list of watchers,
    // so the publish button can be disabled when updating it
    // *****************************************************************
    const {appNavigate} = useNavigation();
    const classes = useStyles();
    const reduxStateDispatch = useDispatch();

    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);

    const menu = useSelector(getRestaurantMenu);

    const [maxDescriptionChars] = useState(500);

    const nameRef = useRef(null);

    const [initialValues] = useState({
        defaults: {
            restaurantRut: menu.restaurant.private_rut,
            restaurantName: menu.restaurant.private_name,
            restaurantDescription: menu.restaurant.private_description,
            restaurantAddress: menu.restaurant.private_address,
            restaurantCountry: menu.restaurant.private_country.flag_image_url,
            // RHF doesn't work well with objects in the select, so, I have to work with
            // just the flag and let the backend to find the corresponding country
            restaurantPhone: menu.restaurant.private_phone,
            restaurantInstagramURL:
                menu.restaurant.private_instagram_url.replace(
                    /^https?:\/\//,
                    "",
                ),
            restaurantFacebookURL: menu.restaurant.private_facebook_url.replace(
                /^https?:\/\//,
                "",
            ),
            restaurantTwitterURL: menu.restaurant.private_twitter_url.replace(
                /^https?:\/\//,
                "",
            ),
            restaurantWebsiteURL: menu.restaurant.private_website_url.replace(
                /^https?:\/\//,
                "",
            ),
            restaurantFacadeImageId: menu.restaurant.private_facade_image_id,
            restaurantLogoImageId: menu.restaurant.private_logo_image_id,
            restaurantShowImages: menu.restaurant.private_show_images,
            restaurantShowRestaurantReviews:
                menu.restaurant.private_show_restaurant_reviews,
            restaurantShowDishesReviews:
                menu.restaurant.private_show_dishes_reviews,
            restaurantShowPrices: menu.restaurant.private_show_prices,
            restaurantShowAskButton: menu.restaurant.private_show_ask_button,
            // Open hours
            openday1: decimalToTimeStr(
                menu.restaurant.private_monday_open_hour_in_minutes / 60,
            ),
            openday2: decimalToTimeStr(
                menu.restaurant.private_tuesday_open_hour_in_minutes / 60,
            ),
            openday3: decimalToTimeStr(
                menu.restaurant.private_wednesday_open_hour_in_minutes / 60,
            ),
            openday4: decimalToTimeStr(
                menu.restaurant.private_thursday_open_hour_in_minutes / 60,
            ),
            openday5: decimalToTimeStr(
                menu.restaurant.private_friday_open_hour_in_minutes / 60,
            ),
            openday6: decimalToTimeStr(
                menu.restaurant.private_saturday_open_hour_in_minutes / 60,
            ),
            openday7: decimalToTimeStr(
                menu.restaurant.private_sunday_open_hour_in_minutes / 60,
            ),
            // Close hours
            closeday1: decimalToTimeStr(
                menu.restaurant.private_monday_close_hour_in_minutes / 60,
            ),
            closeday2: decimalToTimeStr(
                menu.restaurant.private_tuesday_close_hour_in_minutes / 60,
            ),
            closeday3: decimalToTimeStr(
                menu.restaurant.private_wednesday_close_hour_in_minutes / 60,
            ),
            closeday4: decimalToTimeStr(
                menu.restaurant.private_thursday_close_hour_in_minutes / 60,
            ),
            closeday5: decimalToTimeStr(
                menu.restaurant.private_friday_close_hour_in_minutes / 60,
            ),
            closeday6: decimalToTimeStr(
                menu.restaurant.private_saturday_close_hour_in_minutes / 60,
            ),
            closeday7: decimalToTimeStr(
                menu.restaurant.private_sunday_close_hour_in_minutes / 60,
            ),
        },
    });

    // For some reason, restaurantFacadeImageId and restaurantLogoImageId don't work, so I
    // had to declare this two external useState variables in order to have working correctly
    const [
        restaurantFacadeImageIdValueState,
        setRestaurantFacadeImageIdValueState,
    ] = useState(initialValues.defaults.restaurantFacadeImageId || -1);

    const [
        restaurantLogoImageIdValueState,
        setRestaurantLogoImageIdValueState,
    ] = useState(initialValues.defaults.restaurantLogoImageId || -1);

    useEffect(() => {
        reduxStateDispatch(resetStateChange());
    }, [reduxStateDispatch]);

    useEffect(() => {
        if (initialValues.defaults.restaurantFacadeImageId !== undefined) {
            setRestaurantFacadeImageIdValueState(
                initialValues.defaults.restaurantFacadeImageId,
            );
        }
        if (initialValues.defaults.restaurantLogoImageId !== undefined) {
            setRestaurantLogoImageIdValueState(
                initialValues.defaults.restaurantLogoImageId,
            );
        }
    }, [
        initialValues.defaults.restaurantFacadeImageId,
        initialValues.defaults.restaurantLogoImageId,
    ]);

    const days = [
        global.mondayAbrvText,
        global.tuesdayAbrvText,
        global.wednesdayAbrvText,
        global.thursdayAbrvText,
        global.fridayAbrvText,
        global.saturdayAbrvText,
        global.sundayAbrvText,
    ];

    const openHourTimeOptions = [
        "06:00",
        "06:30",
        "07:00",
        "07:30",
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
    ];

    const closeHourTimeOptions = [
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
        "20:30",
        "21:00",
        "21:30",
        "22:00",
        "22:30",
        "23:00",
        "23:30",
        "00:00",
        "00:30",
        "01:00",
        "01:30",
        "02:00",
        "02:30",
        "03:00",
        "03:30",
        "04:00",
        "04:30",
        "05:00",
        "05:30",
        "06:00",
    ];

    function decimalToTimeStr(decimalHours) {
        if (decimalHours === null) return null;
        const totalMinutes = decimalHours * 60;

        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor(totalMinutes % 60);

        const formattedHours = ((24 + hours) % 24).toString().padStart(2, "0");
        const formattedMinutes = Math.abs(minutes).toString().padStart(2, "0");

        return `${formattedHours}:${formattedMinutes}`;
    }

    function timeToDecimal(timeString) {
        if (!timeString) return null;

        const [hoursStr, minutesStr] = timeString.split(":");
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);

        if (isNaN(hours) || isNaN(minutes)) return null;

        const totalMinutes = hours * 60 + minutes;
        const decimalHours = totalMinutes / 60;

        return decimalHours;
    }

    const {
        register,
        control,
        handleSubmit,
        formState: {errors},
        setValue,
        getValues,
        watch,
        reset,
    } = useForm({
        mode: "onChange",
        defaultValues: initialValues.defaults,
        criteriaMode: "all",
    });

    useEffect(() => {
        if (menu.restaurant.private_country)
            setValue("restaurantCountry", menu.restaurant.private_country);
    }, [menu.restaurant.private_country, setValue]);

    const restaurantRutValue = watch("restaurantRut");
    const restaurantNameValue = watch("restaurantName");
    const restaurantDescriptionValue = watch("restaurantDescription");
    const remainingDescriptionChars =
        maxDescriptionChars - restaurantDescriptionValue.length;
    const restaurantAddressValue = watch("restaurantAddress");
    const restaurantCountryValue = watch("restaurantCountry");
    const restaurantPhoneValue = watch("restaurantPhone");
    const restaurantInstagramURLValue = watch("restaurantInstagramURL");
    const restaurantFacebookURLValue = watch("restaurantFacebookURL");
    const restaurantTwitterURLValue = watch("restaurantTwitterURL");
    const restaurantWebsiteURLValue = watch("restaurantWebsiteURL");
    const restaurantShowImagesValue = watch("restaurantShowImages");
    const restaurantShowRestaurantReviewsValue = watch(
        "restaurantShowRestaurantReviews",
    );
    const restaurantShowDishesReviewsValue = watch(
        "restaurantShowDishesReviews",
    );
    const restaurantShowPricesValue = watch("restaurantShowPrices");
    const restaurantShowAskButtonValue = watch("restaurantShowAskButton");

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentlyWatching,
            payload: global.preferences,
        });

        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.DialogPreferencesPath,
        });
    }, [globalStateDispatch]);

    useEffect(() => {
        register("restaurantFacadeImageId");
        register("restaurantLogoImageId");

        if (
            globalState.editionObject !== null &&
            globalState.featuresOfTheEditionObject.objectType ===
                global.preferences
        ) {
            setValue("restaurantRut", globalState.editionObject.restaurantRut);
            setValue(
                "restaurantName",
                globalState.editionObject.restaurantName,
            );
            setValue(
                "restaurantDescription",
                globalState.editionObject.restaurantDescription,
            );
            setValue(
                "restaurantAddress",
                globalState.editionObject.restaurantAddress,
            );
            setValue(
                "restaurantCountry",
                globalState.editionObject.restaurantCountry,
            );
            setValue(
                "restaurantPhone",
                globalState.editionObject.restaurantPhone,
            );
            setValue(
                "restaurantTwitter",
                globalState.editionObject.restaurantTwitter,
            );
            setValue(
                "restaurantFacebook",
                globalState.editionObject.restaurantFacebook,
            );
            setValue(
                "restaurantInstagram",
                globalState.editionObject.restaurantInstagram,
            );
            setValue(
                "restaurantWebsiteURL",
                globalState.editionObject.restaurantWebsiteURL,
            );
            setRestaurantFacadeImageIdValueState(
                globalState.editionObject.restaurantFacadeImageId,
            );
            setValue(
                "restaurantFacadeImageId",
                globalState.editionObject.restaurantFacadeImageId,
            );
            setRestaurantLogoImageIdValueState(
                globalState.editionObject.restaurantLogoImageId,
            );
            setValue(
                "restaurantLogoImageId",
                globalState.editionObject.restaurantLogoImageId,
            );
            setValue(
                "restaurantShowImages",
                globalState.editionObject.restaurantShowImages,
            );
            setValue(
                "restaurantShowRestaurantReviews",
                globalState.editionObject.restaurantShowRestaurantReviews,
            );
            setValue(
                "restaurantShowDishesReviews",
                globalState.editionObject.restaurantShowDishesReviews,
            );
            setValue(
                "restaurantShowPrices",
                globalState.editionObject.restaurantShowPrices,
            );
            setValue(
                "restaurantShowAskButton",
                globalState.editionObject.restaurantShowAskButton,
            );
            globalStateDispatch({
                type: globalStateContextActions.clearEditionObject,
            });
        }
    }, [
        globalState.editionObject,
        globalState.featuresOfTheEditionObject,
        globalStateDispatch,
        register,
        setValue,
    ]);

    function handleGoBack() {
        reduxStateDispatch(setSpecificChange(global.specificChangeToNothing));
        reduxStateDispatch(resetStateChange());
        reduxStateDispatch(resetChangeNumber());

        globalStateDispatch({
            type: globalStateContextActions.clearObjectForDialogReset,
        });

        globalStateDispatch({
            type: globalStateContextActions.restartGetObjectForDialogReset,
        });
        appNavigate(global.showPreferencesPath);
    }

    const onSubmit = async () => {
        const updatedData = {};
        const newValues = getValues();
        let changedCountry = false;
        let changedShowPrices = false;
        let theStringIsURL = false;

        function turnIntoMinutes(oldValueCompleteStr) {
            let numericNewValueInMinutes = 0;
            let strNewValue = "";
            strNewValue = oldValueCompleteStr.slice(-5);
            numericNewValueInMinutes = timeToDecimal(strNewValue) * 60;
            return (
                oldValueCompleteStr.substring(
                    0,
                    oldValueCompleteStr.length - 5,
                ) + numericNewValueInMinutes.toString()
            );
        }
        for (const fieldName in newValues) {
            if (initialValues.defaults[fieldName] !== newValues[fieldName]) {
                let updatedFieldName;
                switch (fieldName) {
                    case "restaurantRut": {
                        updatedFieldName = "private_rut";
                        break;
                    }
                    case "restaurantName": {
                        updatedFieldName = "private_name";
                        break;
                    }
                    case "restaurantDescription": {
                        updatedFieldName = "private_description";
                        break;
                    }
                    case "restaurantAddress": {
                        updatedFieldName = "private_address";
                        break;
                    }
                    case "restaurantCountry": {
                        changedCountry = true;
                        updatedFieldName = "private_country";
                        break;
                    }
                    case "restaurantPhone": {
                        updatedFieldName = "private_phone";
                        break;
                    }
                    case "restaurantInstagramURL": {
                        updatedFieldName = "private_instagram_url";
                        theStringIsURL = true;
                        if (restaurantInstagramURLValue !== "")
                            newValues[fieldName] =
                                "https://" + restaurantInstagramURLValue.trim();
                        break;
                    }
                    case "restaurantFacebookURL": {
                        updatedFieldName = "private_facebook_url";
                        theStringIsURL = true;
                        if (restaurantFacebookURLValue !== "")
                            newValues[fieldName] =
                                "https://" + restaurantFacebookURLValue.trim();
                        break;
                    }
                    case "restaurantTwitterURL": {
                        updatedFieldName = "private_twitter_url";
                        theStringIsURL = true;
                        if (restaurantTwitterURLValue !== "")
                            newValues[fieldName] =
                                "https://" + restaurantTwitterURLValue.trim();
                        break;
                    }
                    case "restaurantWebsiteURL": {
                        updatedFieldName = "private_website_url";
                        theStringIsURL = true;
                        if (restaurantWebsiteURLValue !== "")
                            newValues[fieldName] =
                                "https://" + restaurantWebsiteURLValue.trim();
                        break;
                    }
                    case "restaurantFacadeImageId": {
                        updatedFieldName = "private_facade_image_id";
                        newValues[fieldName] =
                            restaurantFacadeImageIdValueState;
                        break;
                    }
                    case "restaurantLogoImageId": {
                        updatedFieldName = "private_logo_image_id";
                        newValues[fieldName] = restaurantLogoImageIdValueState;
                        break;
                    }
                    case "restaurantShowImages": {
                        updatedFieldName = "private_show_images";
                        break;
                    }
                    case "restaurantShowRestaurantReviews": {
                        updatedFieldName = "private_show_restaurant_reviews";
                        break;
                    }
                    case "restaurantShowDishesReviews": {
                        updatedFieldName = "private_show_dishes_reviews";
                        break;
                    }
                    case "restaurantShowPrices": {
                        if (restaurantShowPricesValue) changedShowPrices = true;
                        updatedFieldName = "private_show_prices";
                        break;
                    }
                    case "restaurantShowAskButton": {
                        // It is not generating any warning (like changedShowPrices)
                        updatedFieldName = "private_show_ask_button";
                        break;
                    }

                    case "openday1": {
                        updatedFieldName =
                            "private_monday_open_hour_in_minutes";
                        newValues["openday1"] = turnIntoMinutes(
                            newValues["openday1"],
                        );
                        break;
                    }
                    case "openday2": {
                        updatedFieldName =
                            "private_tuesday_open_hour_in_minutes";
                        newValues[fieldName] = turnIntoMinutes(
                            newValues[fieldName],
                        );
                        break;
                    }
                    case "openday3": {
                        updatedFieldName =
                            "private_wednesday_open_hour_in_minutes";
                        newValues[fieldName] = turnIntoMinutes(
                            newValues[fieldName],
                        );
                        break;
                    }
                    case "openday4": {
                        updatedFieldName =
                            "private_thursday_open_hour_in_minutes";
                        newValues[fieldName] = turnIntoMinutes(
                            newValues[fieldName],
                        );
                        break;
                    }
                    case "openday5": {
                        updatedFieldName =
                            "private_friday_open_hour_in_minutes";
                        newValues[fieldName] = turnIntoMinutes(
                            newValues[fieldName],
                        );
                        break;
                    }
                    case "openday6": {
                        updatedFieldName =
                            "private_saturday_open_hour_in_minutes";
                        newValues[fieldName] = turnIntoMinutes(
                            newValues[fieldName],
                        );
                        break;
                    }
                    case "openday7": {
                        updatedFieldName =
                            "private_sunday_open_hour_in_minutes";
                        newValues[fieldName] = turnIntoMinutes(
                            newValues[fieldName],
                        );
                        break;
                    }

                    case "closeday1": {
                        updatedFieldName =
                            "private_monday_close_hour_in_minutes";
                        newValues[fieldName] = turnIntoMinutes(
                            newValues[fieldName],
                        );
                        break;
                    }
                    case "closeday2": {
                        updatedFieldName =
                            "private_tuesday_close_hour_in_minutes";
                        newValues[fieldName] = turnIntoMinutes(
                            newValues[fieldName],
                        );
                        break;
                    }
                    case "closeday3": {
                        updatedFieldName =
                            "private_wednesday_close_hour_in_minutes";
                        newValues[fieldName] = turnIntoMinutes(
                            newValues[fieldName],
                        );
                        break;
                    }
                    case "closeday4": {
                        updatedFieldName =
                            "private_thursday_close_hour_in_minutes";
                        newValues[fieldName] = turnIntoMinutes(
                            newValues[fieldName],
                        );
                        break;
                    }
                    case "closeday5": {
                        updatedFieldName =
                            "private_friday_close_hour_in_minutes";
                        newValues[fieldName] = turnIntoMinutes(
                            newValues[fieldName],
                        );
                        break;
                    }
                    case "closeday6": {
                        updatedFieldName =
                            "private_saturday_close_hour_in_minutes";
                        newValues[fieldName] = turnIntoMinutes(
                            newValues[fieldName],
                        );
                        break;
                    }
                    case "closeday7": {
                        updatedFieldName =
                            "private_sunday_close_hour_in_minutes";
                        newValues[fieldName] = turnIntoMinutes(
                            newValues[fieldName],
                        );
                        break;
                    }

                    default: {
                        updatedFieldName = fieldName;
                    }
                }
                if (typeof newValues[fieldName] === "string") {
                    updatedData[updatedFieldName] = sanitizeStr(
                        newValues[fieldName].trim(),
                        theStringIsURL ? true : false,
                    );
                } else {
                    updatedData[updatedFieldName] = newValues[fieldName];
                }
            }
        }
        if (
            initialValues.defaults["restaurantFacadeImageId"] !==
            restaurantFacadeImageIdValueState
        ) {
            updatedData["private_facade_image_id"] =
                restaurantFacadeImageIdValueState;
        }
        if (
            initialValues.defaults["restaurantLogoImageId"] !==
            restaurantLogoImageIdValueState
        ) {
            updatedData["private_logo_image_id"] =
                restaurantLogoImageIdValueState;
        }

        try {
            let result = {status: 300, error: ""};
            let noModificationWereMade = true;
            if (Object.keys(updatedData).length > 0)
                noModificationWereMade = false;
            if (!noModificationWereMade) {
                result = await updatePreferencesPrivatelyApi(
                    menu.restaurant.id,
                    updatedData,
                    menu.restaurant.currently_logged_in,
                    menu.restaurant.logged_in_user_random_number,
                );
            }
            if (checkResponseStatus(result.status)) {
                if (changedCountry) {
                    toastInfo(global.eachCountryHasOwnDeliveries);
                }
                if (changedShowPrices) {
                    toastInfo(global.rememberToCheckPrices);
                }
                if (!noModificationWereMade) {
                    reduxStateDispatch(
                        changePreferencesData({
                            restaurantId: menu.restaurant.id,
                            updatedData: updatedData,
                        }),
                    );
                }
                reduxStateDispatch(fetchMenu(menu.restaurant.id));
                reduxStateDispatch(resetStateChange());
                globalStateDispatch({
                    type: globalStateContextActions.clearObjectForDialogReset,
                });
                if (!noModificationWereMade) {
                    globalStateDispatch({
                        type: globalStateContextActions.setNotifyOfAChangeMade,
                    });
                } else toastInfo(global.noChangesWereMade);
                handleGoBack();
            }
        } catch (error) {
            toastError(global.connectionErrorOrUserCanNotPerformOperations);
        }
    };

    function handleResetButton() {
        handleReset();
        toastSuccess(global.resetWasPerformed);
    }

    const handleReset = useCallback(() => {
        // eslint-disable-next-line no-console
        if (
            !(
                globalState.editionObject !== null &&
                globalState.featuresOfTheEditionObject.objectType ===
                    global.preferences
            )
        )
            reset(initialValues.defaults);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (
            !(
                globalState.editionObject !== null &&
                globalState.featuresOfTheEditionObject.objectType ===
                    global.preferences
            )
        ) {
            handleReset();
        }
    }, [
        globalState.editionObject,
        globalState.featuresOfTheEditionObject.objectType,
        handleReset,
    ]);

    function handleDeleteFacadeImage() {
        setRestaurantFacadeImageIdValueState(global.noValue);
        setValue("restaurantFacadeImageId", global.noValue);
    }

    function handleDeleteLogoImage() {
        setRestaurantLogoImageIdValueState(global.noValue);
        setValue("restaurantLogoImageId", global.noValue);
    }

    function handleFacadeImageClick() {
        let preferencesEditionObject = {};
        preferencesEditionObject.WhatIsItLookingFor = global.facade;
        preferencesEditionObject.restaurantRut = restaurantRutValue;
        preferencesEditionObject.restaurantName = restaurantNameValue;
        preferencesEditionObject.restaurantDescription =
            restaurantDescriptionValue;
        preferencesEditionObject.restaurantAddress = restaurantAddressValue;
        preferencesEditionObject.restaurantCountry = restaurantCountryValue;
        preferencesEditionObject.restaurantPhone = restaurantPhoneValue;

        preferencesEditionObject.restaurantIntsgramURL =
            restaurantInstagramURLValue;
        preferencesEditionObject.restaurantFacebookURL =
            restaurantFacebookURLValue;
        preferencesEditionObject.restaurantTwitterURL =
            restaurantTwitterURLValue;

        preferencesEditionObject.restaurantWebsiteURL =
            restaurantWebsiteURLValue;

        preferencesEditionObject.restaurantFacadeImageId =
            restaurantFacadeImageIdValueState;
        preferencesEditionObject.restaurantLogoImageId =
            restaurantLogoImageIdValueState;
        preferencesEditionObject.restaurantShowImages =
            restaurantShowImagesValue;
        preferencesEditionObject.restaurantShowRestaurantReviews =
            restaurantShowRestaurantReviewsValue;
        preferencesEditionObject.restaurantShowDishesReviews =
            restaurantShowDishesReviewsValue;
        preferencesEditionObject.restaurantShowPrices =
            restaurantShowPricesValue;
        preferencesEditionObject.restaurantShowAskButton =
            restaurantShowAskButtonValue;

        globalStateDispatch({
            type: globalStateContextActions.setPreferencesEditionObject,
            payload: preferencesEditionObject,
        });
        globalStateDispatch({
            type: globalStateContextActions.restartGetObjectForDialogReset,
        });
        // appNavigate(global.showImageCollectionPath);
        globalStateDispatch({
            type: globalStateContextActions.setNameOfTheItemSelectingAnImage,
            payload: global.facade,
        });

        appNavigate(global.showImageCollectionPath);
    }

    function handleLogoImageClick() {
        let preferencesEditionObject = {};
        preferencesEditionObject.WhatIsItLookingFor = global.logo;
        preferencesEditionObject.restaurantRut = restaurantRutValue;
        preferencesEditionObject.restaurantName = restaurantNameValue;
        preferencesEditionObject.restaurantDescription =
            restaurantDescriptionValue;
        preferencesEditionObject.restaurantAddress = restaurantAddressValue;
        preferencesEditionObject.restaurantCountry = restaurantCountryValue;
        preferencesEditionObject.restaurantPhone = restaurantPhoneValue;
        preferencesEditionObject.restaurantIntsgramURL =
            restaurantInstagramURLValue;
        preferencesEditionObject.restaurantFacebookURL =
            restaurantFacebookURLValue;
        preferencesEditionObject.restaurantTwitterURL =
            restaurantTwitterURLValue;
        preferencesEditionObject.restaurantWebsiteURL =
            restaurantWebsiteURLValue;
        preferencesEditionObject.restaurantFacadeImageId =
            restaurantFacadeImageIdValueState;
        preferencesEditionObject.restaurantLogoImageId =
            restaurantLogoImageIdValueState;
        preferencesEditionObject.restaurantShowImages =
            restaurantShowImagesValue;
        preferencesEditionObject.restaurantShowRestaurantReviews =
            restaurantShowRestaurantReviewsValue;
        preferencesEditionObject.restaurantShowDishesReviews =
            restaurantShowDishesReviewsValue;
        preferencesEditionObject.restaurantShowPrices =
            restaurantShowPricesValue;
        preferencesEditionObject.restaurantShowAskButton =
            restaurantShowAskButtonValue;

        globalStateDispatch({
            type: globalStateContextActions.setPreferencesEditionObject,
            payload: preferencesEditionObject,
        });
        globalStateDispatch({
            type: globalStateContextActions.restartGetObjectForDialogReset,
        });

        globalStateDispatch({
            type: globalStateContextActions.setNameOfTheItemSelectingAnImage,
            payload: global.logo,
        });

        appNavigate(global.showImageCollectionPath);
    }

    function handleHelp() {
        if (Object.keys(errors).length !== 0) {
            toastInfo(global.errorsInDialog);
            return;
        }
        let preferencesEditionObject = {};
        preferencesEditionObject.restaurantRut = restaurantRutValue;
        preferencesEditionObject.restaurantName = restaurantNameValue;
        preferencesEditionObject.restaurantDescription =
            restaurantDescriptionValue;
        preferencesEditionObject.restaurantAddress = restaurantAddressValue;
        preferencesEditionObject.restaurantCountry = restaurantCountryValue;
        preferencesEditionObject.restaurantPhone = restaurantPhoneValue;
        preferencesEditionObject.restaurantInstagramURL =
            restaurantInstagramURLValue;
        preferencesEditionObject.restaurantFacebookURL =
            restaurantFacebookURLValue;
        preferencesEditionObject.restaurantTwitterURL =
            restaurantTwitterURLValue;
        preferencesEditionObject.restaurantWebsiteURL =
            restaurantWebsiteURLValue;
        preferencesEditionObject.restaurantFacadeImageId =
            restaurantFacadeImageIdValueState;
        preferencesEditionObject.restaurantLogoImageId =
            restaurantLogoImageIdValueState;
        preferencesEditionObject.restaurantShowImages =
            restaurantShowImagesValue;
        preferencesEditionObject.restaurantShowRestaurantReviews =
            restaurantShowRestaurantReviewsValue;
        preferencesEditionObject.restaurantShowDishesReviews =
            restaurantShowDishesReviewsValue;
        preferencesEditionObject.restaurantShowPrices =
            restaurantShowPricesValue;
        preferencesEditionObject.restaurantShowAskButton =
            restaurantShowAskButtonValue;
        preferencesEditionObject.WhatIsItLookingFor = global.nothing;

        globalStateDispatch({
            type: globalStateContextActions.setPreferencesEditionObject,
            payload: preferencesEditionObject,
        });
        globalStateDispatch({
            type: globalStateContextActions.restartGetObjectForDialogReset,
        });
        appNavigate(global.helpPath, {
            state: {
                videoName: "private_dialog_preferences",
            },
        });
    }

    function handleCancel() {
        handleReset();
        handleGoBack();
    }

    // const handleBlur = () => {
    //     const safeURL = returnASafeLinkAddress(restaurantWebsiteURLValue);
    //     if (safeURL) {
    //         setRestaurantWebsiteURLValue(safeURL); // Update to sanitized URL if valid
    //         setErrorMessage(""); // Clear error if valid
    //     } else {
    //         setErrorMessage(global.enterValidURL); // Set error message if invalid
    //     }
    // };

    return (
        //
        <ContentContainer>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogBox>
                    <Paper
                        sx={{
                            padding: "1px",
                            marginLeft: "15px",
                            width: "330px",
                            margin: "0 auto", // Center the dialog
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-around",
                            }}
                        >
                            <Typography
                                align="center"
                                sx={{fontWeight: "bold", margin: "8px"}}
                            >
                                {global.editingPreferences}
                            </Typography>
                            <Button
                                onClick={handleHelp}
                                variant="contained"
                                color="warning"
                                style={{
                                    minWidth: "10px",
                                    width: "25px",
                                    maxHeight: "25px",
                                    marginTop: "5px",
                                }}
                            >
                                <FontAwesomeIcon icon={faQuestion} />
                            </Button>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginLeft: "4%",
                                width: "130%",
                                // maxWidth: "450px", // Adjust max-width as needed
                                margin: "0 auto", // Center the dialog
                            }}
                        >
                            {/* <TextField
                                label={global.restaurantRutText}
                                fullWidth
                                variant="filled"
                                disabled
                                value={restaurantRutValue}
                                inputProps={{
                                    autoComplete: "off",
                                    maxLength:
                                        global.maxDialogPreferencesRutLength,
                                }}
                                {...register("restaurantRut", {
                                    required: global.restaurantRutRequired,
                                    pattern: {
                                        value: /^(?!.*[<>&\\"'/]).*$/,
                                        message:
                                            global.pleaseAvoidSomeSpecialChars,
                                    },
                                })}
                                type="text"
                                error={!!errors.restaurantRut}
                                helperText={
                                    <span
                                        style={{
                                            whiteSpace: "normal",
                                            wordWrap: "break-word",
                                        }}
                                    >
                                        {errors.restaurantRut?.message}
                                    </span>
                                }
                                sx={{
                                    width: "75%",
                                    padding: "10px",
                                    "& .MuiFormHelperText-root": {
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        width: "280px",
                                        // maxWidth: "100%", // Ensure the helper text does not exceed TextField width
                                    },
                                }}
                            /> */}
                            <TextField
                                label={global.restaurantNameText}
                                fullWidth
                                variant="filled"
                                value={restaurantNameValue}
                                inputProps={{
                                    autoComplete: "off",
                                    maxLength:
                                        global.maxDialogPreferencesNameLength,
                                }}
                                {...register("restaurantName", {
                                    // required: global.restaurantNameRequired,
                                    pattern: {
                                        value: /^(?!.*[<>&\\"'/]).*$/,
                                        message:
                                            global.pleaseAvoidSomeSpecialChars,
                                    },
                                })}
                                type="text"
                                error={!!errors.restaurantName}
                                inputRef={nameRef}
                                helperText={
                                    <span
                                        style={{
                                            whiteSpace: "normal",
                                            wordWrap: "break-word",
                                        }}
                                    >
                                        {errors.restaurantName?.message}
                                    </span>
                                }
                                sx={{
                                    width: "75%",
                                    padding: "10px",
                                    "& .MuiFormHelperText-root": {
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        width: "280px",
                                        // maxWidth: "100%", // Ensure the helper text does not exceed TextField width
                                    },
                                }}
                            />
                            <TextField
                                label={global.restaurantDescriptionText}
                                fullWidth
                                variant="filled"
                                value={restaurantDescriptionValue}
                                inputProps={{
                                    autoComplete: "off",
                                    maxLength:
                                        global.maxDialogPreferencesDescriptionLength,
                                }}
                                {...register("restaurantDescription", {
                                    // required:
                                    //     global.categoryDescriptionRequired,
                                    validate: (value) => {
                                        const forbiddenChars = /[<>&\\"'/]/;
                                        return (
                                            !forbiddenChars.test(value) ||
                                            global.pleaseAvoidSomeSpecialChars
                                        );
                                    },
                                })}
                                multiline
                                rows={4} // set the number of visible rows to 4
                                type="text"
                                error={!!errors.restaurantDescription}
                                helperText={
                                    <span
                                        style={{
                                            whiteSpace: "normal",
                                            wordWrap: "break-word",
                                        }}
                                    >
                                        {errors.restaurantDescription?.message}
                                    </span>
                                }
                                sx={{
                                    width: "75%",
                                    padding: "10px",
                                    "& .MuiFormHelperText-root": {
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        width: "280px",
                                        // maxWidth: "100%", // Ensure the helper text does not exceed TextField width
                                    },
                                }}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                    alignItems: "flex-start",
                                    width: "73%",
                                    textAlign: "right",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "12px",
                                        marginTop: "-10px",
                                    }}
                                >
                                    {remainingDescriptionChars}
                                    {global.charactersLeftText}
                                </p>
                            </div>
                            <TextField
                                label={global.restaurantAddressText}
                                fullWidth
                                variant="filled"
                                value={restaurantAddressValue}
                                inputProps={{
                                    autoComplete: "off",
                                    maxLength:
                                        global.maxDialogPreferencesAddressLength,
                                }}
                                {...register("restaurantAddress", {
                                    // required:
                                    //     global.categoryDescriptionRequired,
                                    validate: (value) => {
                                        const forbiddenChars = /[<>&\\"'/]/;
                                        return (
                                            !forbiddenChars.test(value) ||
                                            global.pleaseAvoidSomeSpecialChars
                                        );
                                    },
                                })}
                                multiline
                                rows={4}
                                type="text"
                                error={!!errors.restaurantAddress}
                                helperText={
                                    <span
                                        style={{
                                            whiteSpace: "normal",
                                            wordWrap: "break-word",
                                        }}
                                    >
                                        {errors.restaurantAddress?.message}
                                    </span>
                                }
                                sx={{
                                    width: "75%",
                                    padding: "10px",
                                    "& .MuiFormHelperText-root": {
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        width: "280px",
                                        // maxWidth: "100%", // Ensure the helper text does not exceed TextField width
                                    },
                                }}
                            />
                            <InputLabel
                                htmlFor="restaurantFlag"
                                style={{
                                    color: "black",
                                    marginLeft: "10px",
                                    marginBottom: "-10px",
                                    fontSize: "12px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                    }}
                                >
                                    {global.restaurantCountryText}
                                </div>
                            </InputLabel>
                            {menu.restaurant.private_country && (
                                <FormControl
                                    fullWidth
                                    style={{width: "75%", padding: "10px"}}
                                    disabled
                                >
                                    <Select
                                        {...register("restaurantCountry")}
                                        value={restaurantCountryValue}
                                        fullWidth
                                        onChange={(e) => {
                                            const selectedValue =
                                                e.target.value;
                                            setValue(
                                                "restaurantCountry",
                                                selectedValue,
                                            );
                                        }}
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-evenly",
                                        }}
                                    >
                                        {menu.countries.map(
                                            (countryObj, index) => (
                                                <FlagOption
                                                    key={index}
                                                    value={
                                                        countryObj.country
                                                            .flag_image_url
                                                    }
                                                >
                                                    <img
                                                        src={
                                                            countryObj.country
                                                                .flag_image_url
                                                        }
                                                        alt={`Flag ${index + 1}`}
                                                        style={{
                                                            width: "50px",
                                                            height: "50px",
                                                        }}
                                                    />
                                                    <div>
                                                        {
                                                            countryObj.country
                                                                .name
                                                        }
                                                    </div>
                                                </FlagOption>
                                            ),
                                        )}
                                    </Select>
                                </FormControl>
                            )}

                            <TextField
                                label={global.restaurantPhoneText}
                                fullWidth
                                variant="filled"
                                value={restaurantPhoneValue}
                                inputProps={{
                                    autoComplete: "off",
                                    maxLength:
                                        global.maxDialogPreferencesPhoneLength,
                                }}
                                {...register("restaurantPhone", {
                                    // required: global.restaurantPhoneRequired,
                                    pattern: {
                                        value: /^(?!.*[<>&\\"'/]).*$/,
                                        message:
                                            global.pleaseAvoidSomeSpecialChars,
                                    },
                                })}
                                type="text"
                                error={!!errors.restaurantPhone}
                                helperText={
                                    <span
                                        style={{
                                            whiteSpace: "normal",
                                            wordWrap: "break-word",
                                        }}
                                    >
                                        {errors.restaurantPhone?.message}
                                    </span>
                                }
                                sx={{
                                    width: "75%",
                                    padding: "10px",
                                    "& .MuiFormHelperText-root": {
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        width: "280px",
                                        // maxWidth: "100%", // Ensure the helper text does not exceed TextField width
                                    },
                                }}
                            />
                            <TextField
                                label={global.restaurantInstagramURLText}
                                fullWidth
                                variant="filled"
                                value={restaurantInstagramURLValue}
                                {...register("restaurantInstagramURL", {
                                    pattern: {
                                        value: /^www\.instagram\.com\/[A-Za-z0-9._]+\/?$/,
                                        message: global.enterValidInstagramURL,
                                    },
                                })}
                                error={!!errors.restaurantInstagramURL}
                                helperText={
                                    errors.restaurantInstagramURL?.message
                                }
                                inputProps={{
                                    autoComplete: "off",
                                    maxLength:
                                        global.maxDialogPreferencesInstagramURLLength,
                                }}
                                sx={{
                                    width: "75%",
                                    padding: "10px",
                                    "& .MuiFormHelperText-root": {
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        width: "280px",
                                    },
                                }}
                            />
                            <TextField
                                label={global.restaurantFacebookURLText}
                                fullWidth
                                variant="filled"
                                value={restaurantFacebookURLValue}
                                {...register("restaurantFacebookURL", {
                                    pattern: {
                                        value: /^www\.(facebook|fb)\.com\/[A-Za-z0-9._-]+\/?$/,
                                        message: global.enterValidFacebookURL,
                                    },
                                })}
                                error={!!errors.restaurantFacebookURL}
                                helperText={
                                    errors.restaurantFacebookURL?.message
                                }
                                inputProps={{
                                    autoComplete: "off",
                                    maxLength:
                                        global.maxDialogPreferencesFacebookURLLength,
                                }}
                                sx={{
                                    width: "75%",
                                    padding: "10px",
                                    "& .MuiFormHelperText-root": {
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        width: "280px",
                                    },
                                }}
                            />
                            <TextField
                                label={global.restaurantTwitterURLText}
                                fullWidth
                                variant="filled"
                                value={restaurantTwitterURLValue}
                                {...register("restaurantTwitterURL", {
                                    pattern: {
                                        value: /^(www\.)?twitter\.com\/([A-Za-z0-9_]{1,15})\/?$/,
                                        message: global.enterValidTwitterURL,
                                    },
                                })}
                                error={!!errors.restaurantTwitterURL}
                                helperText={
                                    errors.restaurantTwitterURL?.message
                                }
                                inputProps={{
                                    autoComplete: "off",
                                    maxLength:
                                        global.maxDialogPreferencesTwitterURLLength,
                                }}
                                sx={{
                                    width: "75%",
                                    padding: "10px",
                                    "& .MuiFormHelperText-root": {
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        width: "280px",
                                    },
                                }}
                            />

                            <Paper
                                sx={{
                                    padding: "8px 0px 4px 0px",
                                    width: "75%",
                                    borderBottom: "1px solid lightblue",
                                }}
                            >
                                <Typography
                                    fontSize="12px"
                                    paddingBottom="5px"
                                    textAlign="left"
                                    marginTop="-10px"
                                    marginBottom="8px"
                                    marginLeft="3px"
                                >
                                    {global.restaurantScheduleText}
                                </Typography>
                                <Typography
                                    // color="lightblue"
                                    fontSize="12px"
                                    // backgroundColor="#1E1B37"
                                    paddingBottom="5px"
                                    width="100%"
                                    textAlign="center"
                                    marginTop="-10px"
                                    marginBottom="8px"
                                >
                                    {global.restaurantOpenHoursText}
                                </Typography>
                                <DaysLine>
                                    {days.map((day, index) => (
                                        <div key={index}>
                                            <Controller
                                                name={`openday${index + 1}`}
                                                control={control}
                                                render={({field}) => (
                                                    <TextField
                                                        select
                                                        {...field}
                                                        label={day}
                                                        SelectProps={{
                                                            style: {
                                                                backgroundColor:
                                                                    "#E9E9E9",
                                                                fontSize: "9px",
                                                            },
                                                            classes: {
                                                                icon: classes.whiteIcon,
                                                            },
                                                        }}
                                                    >
                                                        {openHourTimeOptions.map(
                                                            (
                                                                time,
                                                                timeIndex,
                                                            ) => (
                                                                <MenuItem
                                                                    key={
                                                                        timeIndex
                                                                    }
                                                                    value={time}
                                                                >
                                                                    {time}
                                                                </MenuItem>
                                                            ),
                                                        )}
                                                    </TextField>
                                                )}
                                            />
                                        </div>
                                    ))}
                                </DaysLine>

                                <Typography
                                    fontSize="12px"
                                    paddingBottom="5px"
                                    width="100%"
                                    textAlign="center"
                                    marginTop="5px"
                                    marginBottom="8px"
                                >
                                    {global.restaurantCloseHoursText}
                                </Typography>
                                <DaysLine>
                                    {days.map((day, index) => (
                                        <div key={index}>
                                            <Controller
                                                name={`closeday${index + 1}`}
                                                control={control}
                                                render={({field}) => (
                                                    <TextField
                                                        select
                                                        {...field}
                                                        label={day}
                                                        SelectProps={{
                                                            style: {
                                                                backgroundColor:
                                                                    "#E9E9E9",
                                                                fontSize: "9px",
                                                            },
                                                            classes: {
                                                                icon: classes.whiteIcon,
                                                            },
                                                        }}
                                                    >
                                                        {closeHourTimeOptions.map(
                                                            (
                                                                time,
                                                                timeIndex,
                                                            ) => (
                                                                <MenuItem
                                                                    key={
                                                                        timeIndex
                                                                    }
                                                                    value={time}
                                                                >
                                                                    {time}
                                                                </MenuItem>
                                                            ),
                                                        )}
                                                    </TextField>
                                                )}
                                            />
                                        </div>
                                    ))}
                                </DaysLine>
                            </Paper>
                            <TextField
                                label={global.restaurantWebsiteURLText}
                                fullWidth
                                variant="filled"
                                value={restaurantWebsiteURLValue}
                                {...register("restaurantWebsiteURL", {
                                    pattern: {
                                        value: /^www\.[\da-z.-]+\.[a-z.]{2,6}(\/[\w .-]*)*\/?$/,
                                        message: global.enterValidWebsiteURL,
                                    },
                                })}
                                error={!!errors.restaurantWebsiteURL}
                                helperText={
                                    errors.restaurantWebsiteURL?.message
                                }
                                inputProps={{
                                    autoComplete: "off",
                                    maxLength:
                                        global.maxDialogPreferencesWebsiteURLLength,
                                }}
                                sx={{
                                    width: "75%",
                                    padding: "10px",
                                    "& .MuiFormHelperText-root": {
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        width: "280px",
                                    },
                                }}
                            />
                            <div style={{width: "75%"}}>
                                <Controller
                                    name="restaurantShowImages"
                                    control={control}
                                    render={({field}) => (
                                        <FormControlLabel
                                            label={global.showImagesText}
                                            control={
                                                <Checkbox
                                                    {...field}
                                                    checked={
                                                        restaurantShowImagesValue
                                                    }
                                                    onChange={(e) => {
                                                        const newValue =
                                                            e.target.checked;
                                                        field.onChange(
                                                            newValue,
                                                        );
                                                    }}
                                                    sx={{
                                                        marginLeft: "10px",
                                                    }}
                                                />
                                            }
                                        />
                                    )}
                                />
                            </div>
                            {menu.restaurant.price_type ===
                                global.fullPrice && (
                                <div
                                    style={{
                                        width: "78%",
                                    }}
                                >
                                    <Controller
                                        name="restaurantShowRestaurantReviews"
                                        control={control}
                                        render={({field}) => (
                                            <FormControlLabel
                                                label={
                                                    global.showRestaurantReviewsText
                                                }
                                                control={
                                                    <Checkbox
                                                        {...field}
                                                        checked={
                                                            restaurantShowRestaurantReviewsValue
                                                        }
                                                        onChange={(e) => {
                                                            const newValue =
                                                                e.target
                                                                    .checked;
                                                            field.onChange(
                                                                newValue,
                                                            );
                                                        }}
                                                        sx={{
                                                            marginLeft: "10px",
                                                        }}
                                                    />
                                                }
                                            />
                                        )}
                                    />

                                    <Controller
                                        name="restaurantShowDishesReviews"
                                        control={control}
                                        render={({field}) => (
                                            <FormControlLabel
                                                label={
                                                    global.showDishesReviewsText
                                                }
                                                control={
                                                    <Checkbox
                                                        {...field}
                                                        checked={
                                                            restaurantShowDishesReviewsValue
                                                        }
                                                        onChange={(e) => {
                                                            const newValue =
                                                                e.target
                                                                    .checked;
                                                            field.onChange(
                                                                newValue,
                                                            );
                                                        }}
                                                        sx={{
                                                            marginLeft: "10px",
                                                        }}
                                                    />
                                                }
                                            />
                                        )}
                                    />
                                </div>
                            )}
                            <div style={{width: "75%"}}>
                                <Controller
                                    name="restaurantShowPrices"
                                    control={control}
                                    render={({field}) => (
                                        <FormControlLabel
                                            label={global.showPricesText}
                                            control={
                                                <Checkbox
                                                    {...field}
                                                    checked={
                                                        restaurantShowPricesValue
                                                    }
                                                    onChange={(e) => {
                                                        const newValue =
                                                            e.target.checked;
                                                        field.onChange(
                                                            newValue,
                                                        );
                                                    }}
                                                    sx={{
                                                        marginLeft: "10px",
                                                    }}
                                                />
                                            }
                                        />
                                    )}
                                />
                            </div>

                            <div style={{width: "75%"}}>
                                <Controller
                                    name="restaurantShowAskButton"
                                    control={control}
                                    render={({field}) => (
                                        <FormControlLabel
                                            label={global.showAskButtonText}
                                            control={
                                                <Checkbox
                                                    {...field}
                                                    checked={
                                                        restaurantShowAskButtonValue
                                                    }
                                                    onChange={(e) => {
                                                        const newValue =
                                                            e.target.checked;
                                                        field.onChange(
                                                            newValue,
                                                        );
                                                    }}
                                                    sx={{
                                                        marginLeft: "10px",
                                                    }}
                                                />
                                            }
                                        />
                                    )}
                                />
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexWrap: "wrap",
                                    width: "75%",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        marginTop: "10px",
                                    }}
                                >
                                    <div onClick={handleFacadeImageClick}>
                                        <Typography
                                            sx={{
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                                marginLeft: "5px",
                                                backgroundColor: "lightgray",
                                                width: "220px",
                                            }}
                                        >
                                            {global.facadeImageText}
                                        </Typography>
                                        {ShowImage(
                                            true,
                                            restaurantNameValue,
                                            restaurantFacadeImageIdValueState,
                                            menu,
                                            false,
                                            220,
                                            150,
                                            "",
                                        )}
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            marginTop: "25px",
                                            marginRight: "2px",
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={handleFacadeImageClick}
                                            style={{
                                                width: "50px",
                                                height: "30px",
                                                marginLeft: "3px",
                                            }}
                                        >
                                            <ImageSearchIcon />
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={handleDeleteFacadeImage}
                                            style={{
                                                width: "50px",
                                                height: "30px",
                                                marginLeft: "3px",
                                                marginTop: "10px",
                                            }}
                                        >
                                            <ImageNotSupportedIcon />
                                        </Button>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        marginTop: "10px",
                                    }}
                                >
                                    <div onClick={handleLogoImageClick}>
                                        <Typography
                                            sx={{
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                                marginLeft: "5px",
                                                backgroundColor: "lightgray",
                                                width: "220px",
                                            }}
                                        >
                                            {global.logoImageText}
                                        </Typography>
                                        {ShowImage(
                                            true,
                                            restaurantNameValue,
                                            restaurantLogoImageIdValueState,
                                            menu,
                                            false,
                                            220,
                                            150,
                                            "",
                                        )}
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            marginTop: "25px",
                                            marginBottom: "20px",
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={handleLogoImageClick}
                                            style={{
                                                width: "50px",
                                                height: "30px",
                                                marginLeft: "3px",
                                            }}
                                        >
                                            <ImageSearchIcon />
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={handleDeleteLogoImage}
                                            style={{
                                                width: "50px",
                                                height: "30px",
                                                marginLeft: "3px",
                                                marginTop: "10px",
                                            }}
                                        >
                                            <ImageNotSupportedIcon />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div style={{marginTop: "20px"}}></div>
                        </Box>
                        <Box
                            sx={{
                                margin: "10px",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-around",
                            }}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={!global.accessBackend}
                            >
                                <DoneOutlineIcon />
                            </Button>

                            <Button
                                onClick={handleResetButton}
                                variant={"outlined"}
                                color="primary"
                            >
                                <RestartAltIcon />
                            </Button>

                            <Button
                                onClick={handleCancel}
                                variant={"outlined"}
                                color="primary"
                            >
                                <CancelIcon />
                            </Button>
                        </Box>
                    </Paper>
                </DialogBox>
            </form>
        </ContentContainer>
    );
}
