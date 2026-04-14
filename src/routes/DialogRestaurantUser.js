import React, {useEffect, useRef, useState, useContext} from "react";
import {useForm} from "react-hook-form";
import {Box, Button, Paper, TextField, Typography} from "@mui/material";

import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";

import {faQuestion} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {toastError, toastInfo, toastSuccess} from "../utils/toastMessages";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";
import * as global from "../globalDefinitions/globalConstants";

import {
    getRestaurantMenu,
    resetStateChange,
} from "../slices/restaurantMenuSlice";

import {
    getRestaurantUsers,
    fetchRestaurantUsers,
    changeRestaurantUserData,
    addANewRestaurantUser,
} from "../slices/restaurantUsersSlice";

import {useSelector, useDispatch} from "react-redux";
import {useLocation} from "react-router-dom";
import {useNavigation} from "../contexts/navigationContext";

import {ShowImage} from "../utils/ImageFunctions";
import {
    updateRestaurantUserPrivatelyApi,
    createANewRestaurantUserApi,
    retrieveRestaurantUserForEditionApi,
} from "../axiosCalls/axiosAPICalls";
import {checkResponseStatus} from "../utils/checkResponseStatus";

import styled from "styled-components";
import {sanitizeStr} from "../utils/severalFunctions";

const ContentContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    padding-left: 10px;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 100;
    user-select: none;
`;

const DialogBox = styled.div`
    max-width: 390px;
    margin-top: 80px;
`;

const StrikeThrough = styled.div`
    display: inline-block;
    transition:
        filter 0.3s,
        transform 0.1s;
    position: relative;

    &:hover {
        filter: brightness(60%);
    }

    &:active {
        transform: translateY(4px);
    }

    &::before,
    &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 150%; /* Extend the width sufficiently to cover the diagonal length */
        height: 2px; /* Line thickness */
        background-color: red;
        transform-origin: center;
    }

    &::before {
        transform: translate(-50%, -50%) rotate(45deg); /* First diagonal line */
    }

    &::after {
        transform: translate(-50%, -50%) rotate(-45deg); /* Second diagonal line */
    }
`;

function DialogRestaurantUser() {
    const {state} = useLocation();
    const reduxStateDispatch = useDispatch();

    const {appNavigate} = useNavigation();

    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);

    const menu = useSelector(getRestaurantMenu);
    const restaurantUsers = useSelector(getRestaurantUsers);

    const nameRef = useRef(null);

    const {userIndex} = state;

    const userInitiatedEMailChangeRef = useRef(false);
    // const userInitiatedPhoneChangeRef = useRef(false);
    // const [eMailWasValidated, setEMailWasValidated] = useState(
    //     initialValues.defaults.userEMailWasValidated
    // ); it is declared below, under initialValues

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const [emailWasValidatedChanged, setEMailWasValidatedChanged] =
        useState(false);
    // const [phoneWasValidatedChanged, setPhoneWasValidatedChanged] =
    //     useState(false);

    const [fillInitialValue, setFillInitialValue] = useState(true);
    const [userValues, setUserValues] = useState(null);
    const [userWasAlreadyRetrieved, setUserWasAlreadyRetrieved] =
        useState(false);

    const [initialValues, setInitialValues] = useState({
        userName: "",
        // userPhone: "",
        userImageId: global.noValue,
        userPassword: "",
        userRepeatPassword: "",
        userEmail: "",
        userEMailValidated: false,
    });

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        getValues,
        watch,
        reset,
    } = useForm({
        mode: "onChange",
        criteriaMode: "all",
    });

    const userNameValue = watch("userName");
    // const userPhoneValue = watch("userPhone");
    const userImageIdValue = watch("userImageId");
    const userPasswordValue = watch("userPassword");
    const userRepeatPasswordValue = watch("userRepeatPassword");
    const userEMailValue = watch("userEmail");

    const [eMailWasValidated, setEMailWasValidated] = useState(false);
    // const [phoneWasValidated, setPhoneWasValidated] = useState(false);

    const handleUserEMailInput = (e) => {
        userInitiatedEMailChangeRef.current = true;
        setValue("userEmail", e.target.value);
        setEMailWasValidatedChanged(true);
        setEMailWasValidated(false);
        globalStateDispatch({
            type: globalStateContextActions.clearEMailWasValidated,
        });
    };

    async function retrieveRestaurantUserForEdition(userId) {
        const result = await retrieveRestaurantUserForEditionApi(userId);
        setUserValues(result);
    }

    useEffect(() => {
        if (userValues && fillInitialValue) {
            setInitialValues(userValues);
            reset(userValues);
            setUserValues(null);
            setEMailWasValidated(userValues.userEmailValidated);
            // setPhoneWasValidated(userValues.userPhoneValidated);
        }
    }, [fillInitialValue, reset, userEMailValue, userValues]);

    useEffect(() => {
        if (
            userIndex !== undefined &&
            userIndex >= 0 &&
            restaurantUsers &&
            restaurantUsers[userIndex]
        ) {
            if (!userWasAlreadyRetrieved) {
                retrieveRestaurantUserForEdition(
                    restaurantUsers[userIndex].restaurant_user.id
                );
                setUserWasAlreadyRetrieved(true);
            }
        }
    }, [restaurantUsers, userIndex, userWasAlreadyRetrieved]);

    useEffect(() => {
        if (globalState.eMailWasValidated) {
            setEMailWasValidatedChanged(true);
            setEMailWasValidated(false);
            globalStateDispatch({
                type: globalStateContextActions.clearEMailWasValidated,
            });
        }
    }, [globalState.eMailWasValidated, globalStateDispatch]);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.DialogRestaurantUserPath,
        });
        nameRef.current.focus();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (
            globalState.editionObject !== null &&
            globalState.featuresOfTheEditionObject.objectType ===
                global.dialogRestaurantUser
        ) {
            setValue("userName", globalState.editionObject.userName);
            // setValue("userPhone", globalState.editionObject.userPhone);
            setValue("userImageId", globalState.editionObject.userImageId);
            setValue("userPassword", globalState.editionObject.userPassword);
            setValue(
                "userRepeatPassword",
                globalState.editionObject.userRepeatPassword
            );
            setValue("userEmail", globalState.editionObject.userEmail);
            userInitiatedEMailChangeRef.current = false;
            // userInitiatedPhoneChangeRef.current = false;
            setEMailWasValidated(
                globalState.editionObject.userEMailWasValidated
            );
            // setPhoneWasValidated(
            //     globalState.editionObject.userPhoneWasValidated
            // );
            if (globalState.eMailWasValidated) {
                setEMailWasValidated(true);
            }
            // if (globalState.phoneWasValidated) {
            //     setPhoneWasValidated(true);
            // }
            globalStateDispatch({
                type: globalStateContextActions.clearEditionObject,
            });
            setFillInitialValue(false);
        }
    }, [
        globalState.eMailWasValidated,
        // globalState.phoneWasValidated,
        globalState.editionObject,
        globalState.featuresOfTheEditionObject,
        globalStateDispatch,
        setValue,
    ]);

    function handleGoBack() {
        appNavigate(global.showRestaurantUsersPath);
    }

    const onSubmit = async () => {
        let updatedData = {};
        const newValues = getValues();
        let nameError = false;
        let newName = userNameValue.trim();
        restaurantUsers.forEach((restaurantUserObj, index) => {
            // check if the name is already taken
            if (userIndex !== index) {
                if (
                    newName.toLowerCase() ===
                    restaurantUserObj.restaurant_user.private_name.toLowerCase()
                ) {
                    nameError = true;
                }
            }
        });
        if (!nameError) {
            for (const fieldName in newValues) {
                if (initialValues[fieldName] !== newValues[fieldName]) {
                    let updatedFieldName;

                    switch (fieldName) {
                        case "userImageId":
                            updatedFieldName = "private_image_id";
                            break;
                        case "userName":
                            updatedFieldName = "private_name";
                            break;
                        // case "userPhone":
                        //     updatedFieldName = "private_phone";
                        //     break;
                        case "userPassword":
                            updatedFieldName = "private_password";
                            break;
                        case "userEmail":
                            updatedFieldName = "private_email";
                            break;
                        case "userEmailWasValidated":
                            updatedFieldName = "private_email_validated";
                            break;
                        // case "userPhoneWasValidated":
                        //     updatedFieldName = "private_phone_validated";
                        //     break;

                        default:
                            updatedFieldName = fieldName;
                    }
                    if (typeof newValues[fieldName] === "string") {
                        updatedData[updatedFieldName] = sanitizeStr(
                            newValues[fieldName].trim()
                        );
                    } else {
                        updatedData[updatedFieldName] = newValues[fieldName];
                    }
                }
            }
            try {
                if (!eMailWasValidated) {
                    if (
                        userIndex !== -1 &&
                        menu.restaurant.main_user_id ===
                            restaurantUsers[userIndex].restaurant_user.id
                    ) {
                        toastError(global.validateMainUserEMailFirst);
                        return;
                    }
                }
                if (emailWasValidatedChanged) {
                    if (eMailWasValidated) {
                        updatedData = {
                            ...updatedData,
                            private_email_validated: true,
                            has_been_modified: true,
                        };
                    } else {
                        updatedData = {
                            ...updatedData,
                            private_email_validated: false,
                            has_been_modified: true,
                        };
                    }
                }

                let result = {status: 300, error: ""};
                let noModificationWereMade = true;
                if (Object.keys(updatedData).length > 0) {
                    noModificationWereMade = false;
                }
                // eslint-disable-next-line no-console
                if (
                    (userPasswordValue === userRepeatPasswordValue &&
                        userIndex === -1) ||
                    userIndex !== -1
                ) {
                    if (global.accessBackend) {
                        if (userIndex === global.noValue) {
                            result = await createANewRestaurantUserApi(
                                menu.restaurant.id,
                                updatedData,
                                menu.restaurant.currently_logged_in,
                                menu.restaurant.logged_in_user_random_number
                            );
                        } else {
                            if (!noModificationWereMade) {
                                updatedData["user_id"] =
                                    menu.restaurant.currently_logged_in;
                                updatedData["user_random"] =
                                    menu.restaurant.logged_in_user_random_number;
                                updatedData["restaurant_id"] =
                                    menu.restaurant.id;
                                result = await updateRestaurantUserPrivatelyApi(
                                    restaurantUsers[userIndex].restaurant_user
                                        .id,
                                    updatedData
                                );
                                reduxStateDispatch(
                                    fetchRestaurantUsers(menu.restaurant.id)
                                );
                            }
                        }
                    }
                    if (checkResponseStatus(result.status)) {
                        if (userIndex === global.noValue) {
                            reduxStateDispatch(
                                addANewRestaurantUser({
                                    userId: result.id,
                                    updatedData: updatedData,
                                })
                            );
                        } else {
                            if (!noModificationWereMade) {
                                reduxStateDispatch(
                                    changeRestaurantUserData({
                                        userId: restaurantUsers[userIndex]
                                            .restaurant_user.id,
                                        updatedData: updatedData,
                                    })
                                );
                            }
                        }

                        reduxStateDispatch(resetStateChange());

                        if (!noModificationWereMade) {
                            globalStateDispatch({
                                type: globalStateContextActions.setNotifyOfAChangeMade,
                            });
                        } else toastInfo(global.noChangesWereMade);
                        handleGoBack();
                    } else {
                        toastError(
                            global.connectionErrorOrUserCanNotPerformOperations
                        );
                    }
                } else {
                    toastError(global.paswordsDoNotMatch);
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log("error: ", error);
                toastError(global.connectionErrorOrUserCanNotPerformOperations);
            }
        } else toastError(global.userNameIsTaken);
    };

    const handleReset = () => {
        reset(initialValues);
        globalStateDispatch({
            type: globalStateContextActions.clearEMailWasValidated,
        });

        setEMailWasValidated(initialValues.userEMailValidated);
        toastSuccess(global.resetWasPerformed);
    };

    function handleDeleteImage() {
        setValue("userImageId", global.noValue);
    }

    function handleImageClick() {
        if (Object.keys(errors).length !== 0) {
            toastInfo(global.errorsInDialog);
            return;
        }

        let userEditionObject = {};
        userEditionObject.userIndex = userIndex;
        userEditionObject.userName = userNameValue;
        // userEditionObject.userPhone = userPhoneValue;
        userEditionObject.userImageId = userImageIdValue;
        userEditionObject.userPassword = userPasswordValue;
        userEditionObject.userRepeatPassword = userRepeatPasswordValue;
        userEditionObject.userEmail = userEMailValue;
        userEditionObject.userEMailWasValidated = eMailWasValidated;
        // userEditionObject.userPhoneWasValidated = phoneWasValidated;

        globalStateDispatch({
            type: globalStateContextActions.setUserEditionObject,
            payload: userEditionObject,
        });

        globalStateDispatch({
            type: globalStateContextActions.setNameOfTheItemSelectingAnImage,
            payload: userNameValue,
        });

        appNavigate(global.showImageCollectionPath);
    }

    function handleHelp() {
        if (Object.keys(errors).length !== 0) {
            toastInfo(global.errorsInDialog);
            return;
        }
        let userEditionObject = {};
        userEditionObject.userIndex = userIndex;
        userEditionObject.userName = userNameValue;
        // userEditionObject.userPhone = userPhoneValue;
        userEditionObject.userImageId = userImageIdValue;
        userEditionObject.userPassword = userPasswordValue;
        userEditionObject.userRepeatPassword = userRepeatPasswordValue;
        userEditionObject.userEmail = userEMailValue;
        userEditionObject.userEMailWasvalidated = eMailWasValidated;
        // userEditionObject.userPhoneWasvalidated = phoneWasValidated;

        globalStateDispatch({
            type: globalStateContextActions.setUserEditionObject,
            payload: userEditionObject,
        });

        appNavigate(global.helpPath, {
            state: {
                videoName: "private_dialog_restaurant_user",
            },
        });
    }

    function togglePaswordVisibility() {
        setShowPassword(!showPassword);
    }

    function toggleRepeatPaswordVisibility() {
        setShowRepeatPassword(!showRepeatPassword);
    }

    function validateEMailFctn() {
        // If it is validated it won't take this path
        if (!eMailWasValidated) {
            let userEditionObject = {};
            userEditionObject.userIndex = userIndex;
            userEditionObject.userName = userNameValue;
            // userEditionObject.userPhone = userPhoneValue;
            userEditionObject.userImageId = userImageIdValue;
            userEditionObject.userPassword = userPasswordValue;
            userEditionObject.userRepeatPassword = userRepeatPasswordValue;
            userEditionObject.userEmail = userEMailValue;
            userEditionObject.userEMailWasValidated = eMailWasValidated;
            // userEditionObject.userPhoneWasValidated = phoneWasValidated;
            globalStateDispatch({
                type: globalStateContextActions.setUserEditionObject,
                payload: userEditionObject,
            });
            appNavigate(global.dialogEMailValidationPath, {
                state: {
                    userIndex: userIndex,
                    userName: userNameValue,
                    userEMail: userEMailValue,
                },
            });
        } else {
            toastInfo(global.eMailAlreadyValidated);
        }
    }

    // function validatePhoneFctn() {
    //     // If it is validated it won't take this path
    //     if (!phoneWasValidated) {
    //         let userEditionObject = {};
    //         userEditionObject.userIndex = userIndex;
    //         userEditionObject.userName = userNameValue;
    //         userEditionObject.userPhone = userPhoneValue;
    //         userEditionObject.userImageId = userImageIdValue;
    //         userEditionObject.userPassword = userPasswordValue;
    //         userEditionObject.userEmail = userEMailValue;
    //         userEditionObject.userEMailWasValidated = eMailWasValidated;
    //         userEditionObject.userPhoneWasValidated = phoneWasValidated;
    //         globalStateDispatch({
    //             type: globalStateContextActions.setUserEditionObject,
    //             payload: userEditionObject,
    //         });
    //         appNavigate(global.dialogPhoneValidationPath, {
    //             state: {
    //                 userIndex: userIndex,
    //                 userName: userNameValue,
    //                 userPhone: userPhoneValue,
    //             },
    //         });
    //     } else {
    //         toastInfo(global.phoneAlreadyValidated);
    //     }
    // }

    function handleCancel() {
        globalStateDispatch({
            type: globalStateContextActions.clearEMailWasValidated,
        });
        handleGoBack();
    }

    return (
        <ContentContainer>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogBox>
                    <Paper
                        sx={{
                            padding: "5px",
                            width: "290px",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                            }}
                        >
                            <Typography
                                align="center"
                                sx={{fontWeight: "bold", margin: "8px"}}
                            >
                                {global.editingUser}
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
                                    marginLeft: "30px",
                                }}
                            >
                                <FontAwesomeIcon icon={faQuestion} />
                            </Button>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                }}
                            >
                                <div onClick={handleImageClick}>
                                    {ShowImage(
                                        true,
                                        userNameValue || "",
                                        userImageIdValue || -1,
                                        menu,
                                        false,
                                        200,
                                        100,
                                        ""
                                    )}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleImageClick}
                                        style={{
                                            width: "50px",
                                            height: "30px",
                                            marginLeft: "5px",
                                        }}
                                    >
                                        <ImageSearchIcon />
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleDeleteImage}
                                        style={{
                                            width: "50px",
                                            height: "30px",
                                            marginLeft: "5px",
                                            marginTop: "10px",
                                        }}
                                    >
                                        <ImageNotSupportedIcon />
                                    </Button>
                                </div>
                            </div>
                            <TextField
                                label={global.userNameText}
                                fullWidth
                                variant="filled"
                                value={userNameValue || ""} //  || "" ensures that the label get minimized
                                inputProps={{
                                    autoComplete: "off",
                                    maxLength:
                                        global.maxDialogRestaurantUserNameLength,
                                }}
                                {...register("userName", {
                                    required: global.userNameRequired,
                                    pattern: {
                                        value: /^(?!.*[<>&\\"'/]).*$/,
                                        message:
                                            global.pleaseAvoidSomeSpecialChars,
                                    },
                                })}
                                type="text"
                                error={!!errors.userName}
                                inputRef={nameRef}
                                helperText={
                                    <span
                                        style={{
                                            whiteSpace: "normal",
                                            wordWrap: "break-word",
                                        }}
                                    >
                                        {errors.userName?.message}
                                    </span>
                                }
                                sx={{
                                    width: "90%",
                                    padding: "10px",
                                    "& .MuiFormHelperText-root": {
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        width: "300px",
                                        maxWidth: "100%", // Ensure the helper text does not exceed TextField width
                                    },
                                }}
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "99%",
                                }}
                            >
                                <TextField
                                    label={global.userPasswordText}
                                    fullWidth
                                    variant="filled"
                                    value={userPasswordValue || ""}
                                    {...register("userPassword", {
                                        required: global.userPasswordRequired,
                                        pattern: {
                                            value: new RegExp(
                                                `^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*[<>&"'/\\\\]).{${global.minDialogRestaurantUserPasswordLength},}$`
                                            ),
                                            message: global.userPasswordRules,
                                        },
                                        // The minimumlength is already in the regex
                                        maxLength: {
                                            value: global.maxDialogRestaurantUserPasswordLength,
                                            message:
                                                global.userPasswordMaxLength,
                                        },
                                    })}
                                    inputProps={{autoComplete: "off"}}
                                    type={showPassword ? "text" : "password"}
                                    error={!!errors.userPassword}
                                    helperText={
                                        <span
                                            style={{
                                                whiteSpace: "normal",
                                                wordWrap: "break-word",
                                            }}
                                        >
                                            {errors.userPassword?.message}
                                        </span>
                                    }
                                    sx={{
                                        width: "90%",
                                        padding: "10px",
                                        "& .MuiFormHelperText-root": {
                                            whiteSpace: "normal",
                                            wordWrap: "break-word",
                                            width: "300px",
                                            maxWidth: "100%", // Ensure the helper text does not exceed TextField width
                                        },
                                    }}
                                />
                                <Box onClick={togglePaswordVisibility}>
                                    {showPassword ? (
                                        <VisibilityOffIcon />
                                    ) : (
                                        <VisibilityIcon />
                                    )}
                                </Box>
                            </Box>
                            {userIndex === -1 && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "99%",
                                    }}
                                >
                                    <TextField
                                        label={global.userRepeatPasswordText}
                                        fullWidth
                                        variant="filled"
                                        value={userRepeatPasswordValue || ""}
                                        {...register("userRepeatPassword", {
                                            required:
                                                global.userRepeatPasswordRequired,
                                            pattern: {
                                                value: new RegExp(
                                                    `^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*[<>&"'/\\\\]).{${global.minDialogRestaurantUserPasswordLength},}$`
                                                ),
                                                message:
                                                    global.userPasswordRules,
                                            },
                                            // The minimumlength is already in the regex
                                            maxLength: {
                                                value: global.maxDialogRestaurantUserPasswordLength,
                                                message:
                                                    global.userPasswordMaxLength,
                                            },
                                        })}
                                        inputProps={{autoComplete: "off"}}
                                        type={
                                            showRepeatPassword
                                                ? "text"
                                                : "password"
                                        }
                                        error={!!errors.userRepeatPassword}
                                        helperText={
                                            <span
                                                style={{
                                                    whiteSpace: "normal",
                                                    wordWrap: "break-word",
                                                }}
                                            >
                                                {
                                                    errors.userRepeatPassword
                                                        ?.message
                                                }
                                            </span>
                                        }
                                        sx={{
                                            width: "90%",
                                            padding: "10px",
                                            "& .MuiFormHelperText-root": {
                                                whiteSpace: "normal",
                                                wordWrap: "break-word",
                                                width: "300px",
                                                maxWidth: "100%", // Ensure the helper text does not exceed TextField width
                                            },
                                        }}
                                    />
                                    <Box
                                        onClick={toggleRepeatPaswordVisibility}
                                    >
                                        {showRepeatPassword ? (
                                            <VisibilityOffIcon />
                                        ) : (
                                            <VisibilityIcon />
                                        )}
                                    </Box>
                                </Box>
                            )}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "99%",
                                }}
                            >
                                <TextField
                                    label={global.userEMailText}
                                    fullWidth
                                    variant="filled"
                                    value={userEMailValue || ""}
                                    inputProps={{
                                        autoComplete: "off",
                                        maxLength:
                                            global.maxDialogRestaurantUserEMailLength,
                                    }}
                                    {...register("userEmail", {
                                        // required: global.userEMailRequired,
                                        pattern: {
                                            value: /^[^<>&"'\\/]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message:
                                                global.pleaseUseAValidEMailAddress,
                                        },
                                    })}
                                    type="text"
                                    error={!!errors.userEmail}
                                    helperText={
                                        <span
                                            style={{
                                                whiteSpace: "normal",
                                                wordWrap: "break-word",
                                            }}
                                        >
                                            {errors.userEmail?.message}
                                        </span>
                                    }
                                    onChange={handleUserEMailInput}
                                    sx={{
                                        width: "90%",
                                        padding: "10px",
                                        "& .MuiFormHelperText-root": {
                                            whiteSpace: "normal",
                                            wordWrap: "break-word",
                                            width: "300px",
                                            maxWidth: "100%", // Ensure the helper text does not exceed TextField width
                                        },
                                    }}
                                />
                                <Box onClick={validateEMailFctn}>
                                    {eMailWasValidated ? (
                                        <Box
                                            sx={{
                                                display: "inline-block",
                                            }}
                                        >
                                            <ThumbUpIcon
                                                sx={{color: "green"}}
                                            />
                                        </Box>
                                    ) : (
                                        <Box>
                                            <StrikeThrough>
                                                <ThumbUpIcon
                                                    sx={{color: "green"}}
                                                />
                                            </StrikeThrough>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
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
                                color="secondary"
                            >
                                <DoneOutlineIcon />
                            </Button>

                            <Button
                                onClick={handleReset}
                                variant={"outlined"}
                                color="secondary"
                            >
                                <RestartAltIcon />
                            </Button>

                            <Button
                                onClick={handleCancel}
                                variant={"outlined"}
                                color="secondary"
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

export default DialogRestaurantUser;
