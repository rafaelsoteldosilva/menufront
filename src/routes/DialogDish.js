import React, {useEffect, useRef, useState, useContext} from "react";
import {useForm} from "react-hook-form";
import {Box, Button, Paper, TextField, Typography} from "@mui/material";

import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
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
    changeDishData,
    getRestaurantMenu,
    resetStateChange,
    addANewDish,
} from "../slices/restaurantMenuSlice";

import {useSelector, useDispatch} from "react-redux";
import {useLocation} from "react-router-dom";
import {useNavigation} from "../contexts/navigationContext";

import {
    updateDishPrivatelyApi,
    createANewDishApi,
} from "../axiosCalls/axiosAPICalls";
import {checkResponseStatus} from "../utils/checkResponseStatus";
import {ShowImage} from "../utils/ImageFunctions";
import {useCallback} from "react";

import styled from "styled-components";
import {
    sanitizeStr,
    truncateLongWordsInObject,
} from "../utils/severalFunctions";

const ContentContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 100;
`;

const DialogBox = styled.div`
    width: 100%;
    max-width: 390px;
    margin-top: 80px;
`;

function DialogDish() {
    const {state} = useLocation();
    const {appNavigate} = useNavigation();

    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);
    const menu = useSelector(getRestaurantMenu);
    const reduxStateDispatch = useDispatch();
    const {categoryIndex, dishIndex} = state;

    const maxDescriptionLength = global.maxDialogDishDescriptionLength;
    const [maxDescriptionChars] = useState(maxDescriptionLength);

    const nameRef = useRef(null);

    let initialValues =
        dishIndex === global.noValue
            ? {
                  defaults: {
                      dishName: "",
                      dishDescription: "",
                      dishImageId: global.noValue,
                      dishPrice: "",
                  },
              }
            : {
                  defaults: {
                      dishName:
                          menu.categories[categoryIndex].dishes[dishIndex].dish
                              .private_name,
                      dishDescription:
                          menu.categories[categoryIndex].dishes[dishIndex].dish
                              .private_description,
                      dishImageId:
                          menu.categories[categoryIndex].dishes[dishIndex].dish
                              .private_image_id,
                      dishPrice:
                          menu.categories[categoryIndex].dishes[dishIndex].dish
                              .private_price,
                  },
              };

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
        defaultValues: initialValues.defaults,
        criteriaMode: "all",
    });
    const dishNameValue = watch("dishName");
    const dishDescriptionValue = watch("dishDescription");
    const remainingDescriptionChars =
        maxDescriptionChars - dishDescriptionValue.length;
    const dishImageIdValue = watch("dishImageId");
    const dishPriceValue = watch("dishPrice");

    useEffect(() => {
        initialValues.defaults.dishName =
            dishIndex === global.noValue
                ? ""
                : menu.categories[categoryIndex].dishes[dishIndex].dish
                      .private_name;
        initialValues.defaults.dishDescription =
            dishIndex === global.noValue
                ? ""
                : menu.categories[categoryIndex].dishes[dishIndex].dish
                      .private_description;
        initialValues.defaults.dishImageId =
            dishIndex === global.noValue
                ? global.noValue
                : menu.categories[categoryIndex].dishes[dishIndex].dish
                      .private_private_dish_id;
        initialValues.defaults.dishPrice =
            dishIndex === global.noValue
                ? ""
                : menu.categories[categoryIndex].dishes[dishIndex].dish
                      .private_price;

        nameRef.current.focus();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.DialogDishPath,
        });
    }, [globalStateDispatch]);

    const handleGoBack = useCallback(() => {
        switch (globalState.currentlyWatching) {
            case global.dishes: {
                appNavigate(
                    `${global.dishesPath}/${menu.restaurant.id}/${categoryIndex}`
                );

                break;
            }

            case global.dish: {
                appNavigate(
                    `${global.dishPath}/${menu.restaurant.id}/${categoryIndex}/${dishIndex}`
                );
                break;
            }

            default: {
                break;
            }
        }
    }, [
        appNavigate,
        categoryIndex,
        dishIndex,
        globalState.currentlyWatching,
        menu.restaurant.id,
    ]);

    useEffect(() => {
        if (
            globalState.editionObject !== null &&
            globalState.featuresOfTheEditionObject.objectType === global.dishes
        ) {
            setValue("dishImageId", globalState.editionObject.dishImageId);
            setValue("dishName", globalState.editionObject.dishName);
            setValue("dishPrice", globalState.editionObject.dishPrice);
            setValue(
                "dishDescription",
                globalState.editionObject.dishDescription
            );
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

    const validateField = (fieldName) => (value) => {
        let trimmedValue = "";
        switch (fieldName) {
            case "dishName": {
                trimmedValue = value.trim();

                if (trimmedValue === "") {
                    return global.dishNameRequired;
                }
                break;
            }

            case "dishDescription": {
                trimmedValue = value.trim();

                if (trimmedValue === "") {
                    return global.dishDescriptionRequired;
                }
                break;
            }

            case "dishPrice": {
                // const regex = /^[+-]?(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?)$/; for 12,334.54
                const regex =
                    /^[+-]?(\d{1,3}(?:\.\d{3})*(?:,\d+)?|\d+(?:,\d+)?)$/; // for 12.334,54 characters

                if (!menu.restaurant.public_show_prices || regex.test(value)) {
                    return true;
                }

                return global.enterValidNumericValue;
            }

            default: {
                break;
            }
        }

        return undefined;
    };

    const onSubmit = async (data) => {
        let updatedData = {};
        const newValues = getValues();
        let nameError = false;
        let newName = dishNameValue.trim();
        menu.categories[categoryIndex].dishes.forEach((dishObj, index) => {
            // dishIndex is a string
            if (Number(dishIndex) !== index)
                if (
                    newName.toLowerCase() ===
                    dishObj.dish.private_name.toLowerCase()
                )
                    nameError = true;
        });
        if (!nameError) {
            for (const fieldName in newValues) {
                if (
                    initialValues.defaults[fieldName] !== newValues[fieldName]
                ) {
                    let updatedFieldName;
                    switch (fieldName) {
                        case "dishName": {
                            updatedFieldName = "private_name";
                            break;
                        }
                        case "dishPrice": {
                            updatedFieldName = "private_price";
                            data.dishPrice = data.dishPrice
                                .replace(/\./g, "") //  For 12.345,86
                                .replace(/,/g, ".");
                            break;
                        }
                        case "dishDescription": {
                            updatedFieldName = "private_description";
                            break;
                        }
                        case "dishImageId": {
                            updatedFieldName = "private_image_id";
                            break;
                        }
                        default: {
                            updatedFieldName = fieldName;
                        }
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
                let result = {status: 300, error: ""};
                let noModificationWereMade = true;
                if (Object.keys(updatedData).length > 0)
                    noModificationWereMade = false;
                if (global.accessBackend) {
                    if (dishIndex === global.noValue) {
                        globalStateDispatch({
                            type: globalStateContextActions.setNewChangeMade,
                            payload: `${global.createdTheDish}: ${updatedData.private_name}`,
                        });
                        updatedData = truncateLongWordsInObject(updatedData);
                        if (updatedData["wordsHaveBeenTruncated"]) {
                            toastInfo(
                                `${global.someWordsHaveBeenTruncated} ${global.maxWordLength}`,
                                3000
                            );
                        }
                        result = await createANewDishApi(
                            menu.restaurant.id,
                            menu.categories[categoryIndex].category.id,
                            updatedData,
                            menu.restaurant.currently_logged_in,
                            menu.restaurant.logged_in_user_random_number
                        );
                    } else {
                        if (!noModificationWereMade) {
                            globalStateDispatch({
                                type: globalStateContextActions.setNewChangeMade,
                                payload: `${global.modifiedTheDish}: ${menu.categories[categoryIndex].dishes[dishIndex].dish.private_name}`,
                            });
                            updatedData =
                                truncateLongWordsInObject(updatedData);
                            if (updatedData[global.wordsHaveBeenTruncated]) {
                                toastInfo(
                                    `${global.someWordsHaveBeenTruncated} ${global.maxWordLength}`,
                                    3000
                                );
                            }
                            delete updatedData[
                                `${global.wordsHaveBeenTruncated}`
                            ];
                            result = await updateDishPrivatelyApi(
                                menu.restaurant.id,
                                menu.categories[categoryIndex].category.id,
                                menu.categories[categoryIndex].dishes[dishIndex]
                                    .dish.id,
                                updatedData,
                                menu.restaurant.currently_logged_in,
                                menu.restaurant.logged_in_user_random_number
                            );
                        }
                    }
                }
                if (checkResponseStatus(result.status)) {
                    if (dishIndex === global.noValue) {
                        reduxStateDispatch(
                            addANewDish({
                                categoryIndex: categoryIndex,
                                dishId: result.id,
                                updatedData: updatedData,
                            })
                        );
                    } else {
                        if (!noModificationWereMade) {
                            reduxStateDispatch(
                                changeDishData({
                                    categoryId:
                                        menu.categories[categoryIndex].category
                                            .id,
                                    dishId: menu.categories[categoryIndex]
                                        .dishes[dishIndex].dish.id,
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
                } else
                    toastError(
                        global.connectionErrorOrUserCanNotPerformOperations
                    );
            } catch (error) {
                toastError(global.connectionErrorOrUserCanNotPerformOperations);
            }
        } else toastError(global.dishNameIsTaken);
    };

    const handleReset = () => {
        reset(initialValues.defaults);
        toastSuccess(global.resetWasPerformed);
    };

    function handleDeleteImage() {
        setValue("dishImageId", global.noValue);
    }

    function handleImageSearchClick() {
        if (Object.keys(errors).length !== 0) {
            toastInfo(global.errorsInDialog);
            return;
        }
        let dishEditionObject = {};
        dishEditionObject.dishCategoryIndex = categoryIndex;
        dishEditionObject.dishIndex = dishIndex;
        dishEditionObject.dishName = dishNameValue;
        dishEditionObject.dishPrice = dishPriceValue;
        dishEditionObject.dishDescription = dishDescriptionValue;
        dishEditionObject.dishImageId = dishImageIdValue;

        globalStateDispatch({
            type: globalStateContextActions.setDishEditionObject,
            payload: dishEditionObject,
        });
        globalStateDispatch({
            type: globalStateContextActions.setNameOfTheItemSelectingAnImage,
            payload: dishNameValue,
        });

        appNavigate(global.showImageCollectionPath);
    }

    function handleHelp() {
        if (Object.keys(errors).length !== 0) {
            toastInfo(global.errorsInDialog);
            return;
        }
        let dishEditionObject = {};
        dishEditionObject.dishCategoryIndex = categoryIndex;
        dishEditionObject.dishIndex = dishIndex;
        dishEditionObject.dishName = dishNameValue;
        dishEditionObject.dishPrice = dishPriceValue;
        dishEditionObject.dishDescription = dishDescriptionValue;
        dishEditionObject.dishImageId = dishImageIdValue;

        globalStateDispatch({
            type: globalStateContextActions.setDishEditionObject,
            payload: dishEditionObject,
        });
        appNavigate(global.helpPath, {
            state: {
                videoName: "private_dialog_dish",
                isAuthorized: true,
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
                            width: "95%",
                            marginLeft: "15px",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: "bold",
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                }}
                                component="div"
                            >
                                {dishIndex !== global.noValue && (
                                    <div>
                                        <div>{global.editingItemText}</div>
                                        <div>
                                            {
                                                menu.categories[categoryIndex]
                                                    .dishes[dishIndex]?.dish
                                                    .private_name
                                            }
                                        </div>
                                    </div>
                                )}
                                {dishIndex === global.noValue && (
                                    <div style={{marginBottom: "15px"}}>
                                        {global.newDishInCategoryText}{" "}
                                        {
                                            menu.categories[categoryIndex]
                                                .category.private_name
                                        }
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
                                // width: "50%",
                                maxWidth: "300px", // Adjust max-width as needed
                                margin: "0 auto", // Center the dialog
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                }}
                            >
                                <div onClick={handleImageSearchClick}>
                                    {ShowImage(
                                        true,
                                        dishNameValue,
                                        dishImageIdValue,
                                        menu,
                                        false,
                                        200,
                                        110,
                                        "",
                                        false,
                                        false,
                                        20
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
                                        onClick={handleImageSearchClick}
                                        disabled={!global.accessBackend}
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
                                        disabled={!global.accessBackend}
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
                                label={global.dishNameText}
                                fullWidth
                                variant="filled"
                                value={dishNameValue}
                                inputProps={{
                                    autoComplete: "off",
                                    maxLength: global.maxDialogDishNameLength,
                                }}
                                {...register("dishName", {
                                    required: global.dishNameRequired,
                                    pattern: {
                                        value: /^(?!.*[<>&\\"'/]).*$/,
                                        message:
                                            global.pleaseAvoidSomeSpecialChars,
                                    },
                                })}
                                type="text"
                                error={!!errors.dishName}
                                inputRef={nameRef}
                                helperText={
                                    <span
                                        style={{
                                            whiteSpace: "normal",
                                            wordWrap: "break-word",
                                        }}
                                    >
                                        {errors.dishName?.message}
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
                            {menu.restaurant.public_show_prices && (
                                <TextField
                                    label={global.dishPriceText}
                                    fullWidth
                                    variant="filled"
                                    value={dishPriceValue}
                                    {...register("dishPrice", {
                                        validate: validateField("dishPrice"),
                                    })}
                                    inputProps={{
                                        autoComplete: "off",
                                        maxLength:
                                            global.maxDialogDishPriceLength,
                                    }}
                                    type="text"
                                    error={!!errors.dishPrice}
                                    helperText={errors.dishPrice?.message}
                                    style={{width: "90%", padding: "10px"}}
                                />
                            )}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "100%",
                                    marginBottom: 0,
                                }}
                            >
                                <TextField
                                    label={global.dishDescriptionText}
                                    value={dishDescriptionValue}
                                    fullWidth
                                    variant="filled"
                                    inputProps={{
                                        autoComplete: "off",
                                        maxLength: maxDescriptionLength,
                                        style: {
                                            maxHeight: "110px", // sets the maximum height to the height of 4 rows
                                        },
                                    }}
                                    multiline
                                    rows={4} // set the number of visible rows to 4
                                    {...register("dishDescription", {
                                        required:
                                            global.dishDescriptionRequired,
                                        validate: (value) => {
                                            const forbiddenChars = /[<>&\\"'/]/;
                                            return (
                                                !forbiddenChars.test(value) ||
                                                global.pleaseAvoidSomeSpecialChars
                                            );
                                        },
                                    })}
                                    type="text"
                                    error={Boolean(errors.dishDescription)}
                                    helperText={errors.dishDescription?.message}
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
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "flex-end",
                                        alignItems: "flex-start",
                                        width: "83%",
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
                            </div>
                        </Box>
                        <div style={{marginTop: "10px"}}></div>
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

export default DialogDish;
