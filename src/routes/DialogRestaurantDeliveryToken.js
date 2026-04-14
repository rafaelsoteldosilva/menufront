import React, {useEffect, useRef, useContext} from "react";
import {useForm} from "react-hook-form";
import {Box, Button, Paper, TextField, Typography} from "@mui/material";

import CancelIcon from "@mui/icons-material/Cancel";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

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
    changeRestaurantDelivery,
    addRestaurantDelivery,
} from "../slices/restaurantMenuSlice";

import {useSelector, useDispatch} from "react-redux";
import {useLocation} from "react-router-dom";
import {useNavigation} from "../contexts/navigationContext";

import {
    updateRestaurantDeliveryCompanyPrivatelyApi,
    createANewRestaurantDeliveryApi,
} from "../axiosCalls/axiosAPICalls";
import {checkResponseStatus} from "../utils/checkResponseStatus";
import {useCallback} from "react";

import styled from "styled-components";
import {sanitizeStr} from "../utils/severalFunctions";

const ContentContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100vw;
    height: 100vh;
    padding-left: 5px;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 100;
    user-select: none;
`;

const DialogBox = styled.div`
    width: 120%;
    margin-top: 100px;
`;

function DialogRestaurantDeliveryToken() {
    const {state} = useLocation();
    const {appNavigate} = useNavigation();

    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);
    const menu = useSelector(getRestaurantMenu);
    const reduxStateDispatch = useDispatch();
    const {restaurantDeliveryCompanyBeingEditedIndex, deliverySelected} = state;
    // if it is creating a RestaurantDelivery, then restaurantDeliveryCompanyBeingEditedIndex
    // equals global.noValue

    // deliverySelected has values when adding

    const tokenRef = useRef(null);

    function initialValues() {
        if (restaurantDeliveryCompanyBeingEditedIndex === global.noValue) {
            return {
                defaults: {
                    token: "",
                },
            };
        } else {
            if (
                menu.restaurant_delivery_companies[
                    restaurantDeliveryCompanyBeingEditedIndex
                ].restaurant_delivery_company.delivery_company_details.name ===
                global.propioDeliveryName
            ) {
                return {
                    defaults: {
                        token: menu.restaurant_delivery_companies[
                            restaurantDeliveryCompanyBeingEditedIndex
                        ].restaurant_delivery_company.private_token,
                    },
                };
            } else {
                return {
                    defaults: {
                        token: menu.restaurant_delivery_companies[
                            restaurantDeliveryCompanyBeingEditedIndex
                        ].restaurant_delivery_company.delivery_company_details
                            .name,
                    },
                };
            }
        }
    }

    const {
        register,
        // eslint-disable-next-line
        control,
        handleSubmit,
        formState: {errors},
        setValue,
        getValues,
        watch,
        reset,
    } = useForm({
        mode: "onChange",
        defaultValues: initialValues().defaults,
        criteriaMode: "all",
    });

    const tokenValue = watch("token");

    useEffect(() => {
            tokenRef.current?.focus();
    }, []);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.DialogRestaurantDeliveryTokenPath,
        });
    }, [globalStateDispatch]);

    const handleGoBack = useCallback(() => {
        globalStateDispatch({
            type: globalStateContextActions.resetDeliverySelected,
        });
        appNavigate(global.ShowPrivateRestaurantDeliveriesPath);
    }, [appNavigate, globalStateDispatch]);

    useEffect(() => {
        if (
            globalState.editionObject !== null &&
            globalState.featuresOfTheEditionObject.objectType ===
                global.DialogRestaurantDeliveryToken
        ) {
            setValue("token", globalState.editionObject.token);
            globalStateDispatch({
                type: globalStateContextActions.clearEditionObject,
            });
        }
    }, [
        globalState.editionObject,
        globalState.featuresOfTheEditionObject,
        globalStateDispatch,
        setValue,
    ]);

    const onSubmit = async () => {
        const updatedData = {};
        const newValues = getValues();
        let theStringIsURL = false;

        if (restaurantDeliveryCompanyBeingEditedIndex === -1) {
            if (deliverySelected.name === global.propioDeliveryName)
                theStringIsURL = true;
        } else if (
            menu.restaurant_delivery_companies[
                restaurantDeliveryCompanyBeingEditedIndex
            ].restaurant_delivery_company.delivery_company_details.name ===
            global.propioDeliveryName
        )
            theStringIsURL = true;

        for (const fieldName in newValues) {
            if (initialValues().defaults[fieldName] !== newValues[fieldName]) {
                let updatedFieldName;
                switch (fieldName) {
                    case "token": {
                        updatedFieldName = "private_token";
                        break;
                    }

                    default: {
                        updatedFieldName = fieldName;
                        break;
                    }
                }
                if (typeof newValues[fieldName] === "string") {
                    let theStr = newValues[fieldName].trim();
                    updatedData[updatedFieldName] = sanitizeStr(
                        newValues[fieldName].trim(),
                        theStringIsURL ? true : false
                    );
                    if (theStr !== newValues[fieldName]) {
                        alert("sanitizing changed the string");
                    }
                } else {
                    updatedData[updatedFieldName] = newValues[fieldName];
                }
            }
        }

        try {
            let result = {status: 300, error: ""};
            let noModificationWereMade = true;
            if (Object.keys(updatedData).length > 0)
                noModificationWereMade = false;
            if (
                global.accessBackend &&
                restaurantDeliveryCompanyBeingEditedIndex !== global.noValue
            ) {
                if (!noModificationWereMade) {
                    updatedData["user_id"] =
                        menu.restaurant.currently_logged_in;
                    updatedData["user_random"] =
                        menu.restaurant.logged_in_user_random_number;
                    // it is updating an existing category
                    result = await updateRestaurantDeliveryCompanyPrivatelyApi(
                        menu.restaurant.id,
                        menu.restaurant_delivery_companies[
                            restaurantDeliveryCompanyBeingEditedIndex
                        ].restaurant_delivery_company.id,
                        updatedData
                    );
                }
            }
            if (
                global.accessBackend &&
                restaurantDeliveryCompanyBeingEditedIndex === global.noValue
            ) {
                // it is creating a new category
                result = await createANewRestaurantDeliveryApi(
                    menu.restaurant.id,
                    deliverySelected.id,
                    updatedData,
                    menu.restaurant.currently_logged_in,
                    menu.restaurant.logged_in_user_random_number
                );
            }
            if (checkResponseStatus(result.status)) {
                if (
                    restaurantDeliveryCompanyBeingEditedIndex !== global.noValue
                ) {
                    if (!noModificationWereMade) {
                        reduxStateDispatch(
                            changeRestaurantDelivery({
                                restaurantDeliveryCompanyId:
                                    menu.restaurant_delivery_companies[
                                        restaurantDeliveryCompanyBeingEditedIndex
                                    ].restaurant_delivery_company.id,
                                updatedData: updatedData,
                            })
                        );
                    }
                } else {
                    reduxStateDispatch(
                        addRestaurantDelivery({
                            newRestaurantDeliveryId: result.id,
                            deliverySelected: deliverySelected,
                            updatedData: updatedData,
                        })
                    );
                }

                reduxStateDispatch(resetStateChange());

                // globalStateDispatch({
                //     type: globalStateContextActions.clearCurrentMinorFunction,
                // });
                if (!noModificationWereMade) {
                    globalStateDispatch({
                        type: globalStateContextActions.setNotifyOfAChangeMade,
                    });
                } else toastInfo(global.noChangesWereMade);
                handleGoBack();
            } else
                toastError(global.connectionErrorOrUserCanNotPerformOperations);
        } catch (error) {
            toastError(global.connectionErrorOrUserCanNotPerformOperations);
        }
    };

    const handleReset = () => {
        reset(initialValues().defaults);
        toastSuccess(global.resetWasPerformed);
    };

    function handleHelp() {
        if (Object.keys(errors).length !== 0) {
            toastInfo(global.errorsInDialog);
            return;
        }
        let restaurantDeliveryTokenEditionObject = {};
        restaurantDeliveryTokenEditionObject.token = tokenValue;
        restaurantDeliveryTokenEditionObject.restaurantDeliveryBeingEditedIndex =
            restaurantDeliveryCompanyBeingEditedIndex;
        restaurantDeliveryTokenEditionObject.deliverySelected =
            deliverySelected;

        globalStateDispatch({
            type: globalStateContextActions.setDeliveryObjectEditionObject,
            payload: restaurantDeliveryTokenEditionObject,
        });
        appNavigate(global.helpPath, {
            state: {
                videoName: "private_dialog_restaurant_delivery",
            },
        });
    }

    function handleCancel() {
        handleGoBack();
    }

    return (
        <ContentContainer>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogBox>
                    <Paper
                        sx={{
                            padding: "5px",
                            width: "100%",
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
                                sx={{
                                    fontWeight: "bold",
                                    marginLeft: "15px",
                                    marginRight: "15px",
                                }}
                                component="div"
                            >
                                {restaurantDeliveryCompanyBeingEditedIndex ===
                                    global.noValue && (
                                    <div>
                                        {deliverySelected.name !==
                                            global.propioDeliveryName && (
                                            <div>
                                                {
                                                    global.editingDeliveryTokenText
                                                }
                                            </div>
                                        )}
                                        {deliverySelected.name ===
                                            global.propioDeliveryName && (
                                            <div>
                                                {
                                                    global.creatingDeliveryPropioURLText
                                                }
                                            </div>
                                        )}
                                        <div>{deliverySelected.name}</div>
                                    </div>
                                )}
                                {restaurantDeliveryCompanyBeingEditedIndex !==
                                    global.noValue && (
                                    <div>
                                        {menu.restaurant_delivery_companies[
                                            restaurantDeliveryCompanyBeingEditedIndex
                                        ].restaurant_delivery_company
                                            .delivery_company_details.name !==
                                            global.propioDeliveryName && (
                                            <div>
                                                <div>
                                                    {
                                                        global.editingDeliveryTokenText
                                                    }
                                                </div>
                                                <div>
                                                    {
                                                        menu
                                                            .restaurant_delivery_companies[
                                                            restaurantDeliveryCompanyBeingEditedIndex
                                                        ]
                                                            .restaurant_delivery_company
                                                            .delivery_company_details
                                                            .name
                                                    }
                                                </div>
                                            </div>
                                        )}
                                        {menu.restaurant_delivery_companies[
                                            restaurantDeliveryCompanyBeingEditedIndex
                                        ].restaurant_delivery_company
                                            .delivery_company_details.name ===
                                            global.propioDeliveryName && (
                                            <div>
                                                {
                                                    global.editingDeliveryPropioURLText
                                                }
                                            </div>
                                        )}
                                    </div>
                                )}
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
                                    marginRight: "10px",
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
                            <TextField
                                label={global.propioDeliveryURLText}
                                fullWidth
                                variant="filled"
                                value={tokenValue}
                                inputProps={{
                                    autoComplete: "off",
                                    // maxLength:
                                    //     global.maxDialogRestaurantDeliveryTokenLength,
                                }}
                                {...register("token", {
                                    pattern: {
                                        value: /^www\.([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                                        message:
                                            global.enterAnAddressLikeGoogle,
                                    },
                                    validate: () => {
                                        // Additional custom validations, if needed
                                        return true;
                                    },
                                })}
                                type="text"
                                error={!!errors.token}
                                helperText={errors.token?.message}
                                style={{width: "100%", padding: "10px"}}
                                inputRef={tokenRef}
                            />
                            {/* {restaurantDeliveryCompanyBeingEditedIndex !==
                                global.noValue &&
                                menu.restaurant_delivery_companies[
                                    restaurantDeliveryCompanyBeingEditedIndex
                                ].restaurant_delivery_company
                                    .delivery_company_details.name !==
                                    global.propioDeliveryName && (
                                    <TextField
                                        label={global.tokenText}
                                        fullWidth
                                        variant="filled"
                                        value={tokenValue}
                                        inputProps={{
                                            autoComplete: "off",
                                            maxLength:
                                                global.maxDialogRestaurantDeliveryTokenLength,
                                        }}
                                        {...register("token", {
                                            validate: validateField("token"),
                                        })}
                                        type="text"
                                        error={!!errors.token}
                                        helperText={errors.token?.message}
                                        style={{width: "100%", padding: "10px"}}
                                        inputRef={tokenRef}
                                    />
                                )}
                            {restaurantDeliveryCompanyBeingEditedIndex !==
                                global.noValue &&
                                menu.restaurant_delivery_companies[
                                    restaurantDeliveryCompanyBeingEditedIndex
                                ].restaurant_delivery_company
                                    .delivery_company_details.name ===
                                    global.propioDeliveryName && (
                                    <TextField
                                        label={global.propioDeliveryURLText}
                                        fullWidth
                                        variant="filled"
                                        value={tokenValue}
                                        inputProps={{
                                            autoComplete: "off",
                                            // maxLength:
                                            //     global.maxDialogRestaurantDeliveryTokenLength,
                                        }}
                                        {...register("token", {
                                            pattern: {
                                                value: /^www\.([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                                                message:
                                                    global.enterAnAddressLikeGoogle,
                                            },
                                            validate: () => {
                                                // Additional custom validations, if needed
                                                return true;
                                            },
                                        })}
                                        type="text"
                                        error={!!errors.token}
                                        helperText={errors.token?.message}
                                        style={{width: "100%", padding: "10px"}}
                                        inputRef={tokenRef}
                                    />
                                )} */}
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
                                disabled={!global.accessBackend}
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

export default DialogRestaurantDeliveryToken;
