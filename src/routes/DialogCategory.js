import React, {
    useEffect,
    useRef,
    useState,
    useContext,
    useCallback,
} from "react";
import {useForm} from "react-hook-form";
import {Box, Button, Paper, TextField, Typography} from "@mui/material";

import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestion} from "@fortawesome/free-solid-svg-icons";

import {toastSuccess, toastError, toastInfo} from "../utils/toastMessages";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";

import * as global from "../globalDefinitions/globalConstants";

import {
    getRestaurantMenu,
    resetStateChange,
} from "../slices/restaurantMenuSlice";

import {useDispatch, useSelector} from "react-redux";

import {useLocation} from "react-router-dom";
import {useNavigation} from "../contexts/navigationContext";

import {
    createANewCategoryApi,
    updateCategoryPrivatelyApi,
} from "../axiosCalls/axiosAPICalls";
import {
    changeCategoryData,
    addANewCategory,
} from "../slices/restaurantMenuSlice";
import {checkResponseStatus} from "../utils/checkResponseStatus";
import {ShowImage} from "../utils/ImageFunctions";

import styled from "styled-components";
import {
    truncateLongWordsInObject,
    sanitizeStr,
} from "../utils/severalFunctions";

const ContentContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100vw;
    height: 100vh;
    padding-left: 2px;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 100;
`;

const DialogBox = styled.div`
    margin: 10px;
    width: 100%;
    margin-top: 100px;
`;

function DialogCategory() {
    const {state} = useLocation();
    const reduxStateDispatch = useDispatch();
    const {appNavigate} = useNavigation();
    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);

    const menu = useSelector(getRestaurantMenu);

    const {categoryIndex} = state;

    const MaxDescriptionLength = global.maxDialogCategoryDescriptionLength;

    const [maxDescriptionChars] = useState(MaxDescriptionLength);

    const nameRef = useRef(null);

    let initialValues =
        categoryIndex === global.noValue
            ? {
                  defaults: {
                      categoryName: "",
                      categoryDescription: "",
                      categoryImageId: global.noValue,
                  },
              }
            : {
                  defaults: {
                      categoryName:
                          menu.categories[categoryIndex].category.private_name,
                      categoryDescription:
                          menu.categories[categoryIndex].category
                              .private_description,
                      categoryImageId:
                          menu.categories[categoryIndex].category
                              .private_image_id,
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

    const categoryNameValue = watch("categoryName") || "";
    const categoryDescriptionValue = watch("categoryDescription") || "";
    const remainingDescriptionChars =
        maxDescriptionChars - categoryDescriptionValue.length;
    const categoryImageIdValue = watch("categoryImageId");

    useEffect(() => {
        if (categoryIndex !== global.noValue) {
            initialValues.defaults.categoryName =
                menu.categories[categoryIndex].category.private_name;
            initialValues.defaults.categoryDescription =
                menu.categories[categoryIndex].category.private_description;
            initialValues.defaults.categoryImageId =
                menu.categories[categoryIndex].category.private_image_id;
        } else {
            initialValues.defaults.categoryName = "";
            initialValues.defaults.categoryDescription = "";
            initialValues.defaults.categoryImageId = global.noValue;
        }

        nameRef.current.focus();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.DialogCategoryPath,
        });
    }, [globalStateDispatch]);

    const handleGoBack = useCallback(() => {
        appNavigate(`${global.categoriesPath}/${menu.restaurant.id}`);
    }, [appNavigate, menu.restaurant.id]);

    useEffect(() => {
        if (
            globalState.editionObject !== null &&
            globalState.featuresOfTheEditionObject.objectType ===
                global.categories
        ) {
            setValue(
                "categoryImageId",
                globalState.editionObject.categoryImageId
            );
            setValue("categoryName", globalState.editionObject.categoryName);
            setValue(
                "categoryDescription",
                globalState.editionObject.categoryDescription
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

    const onSubmit = async () => {
        let updatedData = {};
        const newValues = getValues();
        let nameError = false;
        let newName = categoryNameValue.trim();
        menu.categories.map((categoryObj, index) => {
            if (categoryIndex !== index)
                if (
                    newName.toLowerCase() ===
                    categoryObj.category.private_name.toLowerCase()
                )
                    nameError = true;
            return categoryObj;
        });
        if (!nameError) {
            for (const fieldName in newValues) {
                if (
                    initialValues.defaults[fieldName] !== newValues[fieldName]
                ) {
                    let updatedFieldName;
                    switch (fieldName) {
                        case "categoryName": {
                            updatedFieldName = "private_name";
                            break;
                        }
                        case "categoryDescription": {
                            updatedFieldName = "private_description";
                            break;
                        }
                        case "categoryImageId": {
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
                if (global.accessBackend && categoryIndex === global.noValue) {
                    globalStateDispatch({
                        type: globalStateContextActions.setNewChangeMade,
                        payload: `${global.createdTheCategory}: ${updatedData.private_name}`,
                    });
                    updatedData = truncateLongWordsInObject(updatedData);

                    if (updatedData["wordsHaveBeenTruncated"]) {
                        toastInfo(
                            `${global.someWordsHaveBeenTruncated} ${global.maxWordLength}`,
                            2000
                        );
                    }
                    result = await createANewCategoryApi(
                        menu.restaurant.id,
                        updatedData,
                        menu.restaurant.currently_logged_in,
                        menu.restaurant.logged_in_user_random_number
                    );
                }
                if (global.accessBackend && categoryIndex !== global.noValue) {
                    if (!noModificationWereMade) {
                        globalStateDispatch({
                            type: globalStateContextActions.setNewChangeMade,
                            payload: `${global.modifiedTheCategory}: ${menu.categories[categoryIndex].category.private_name}`,
                        });
                        updatedData = truncateLongWordsInObject(updatedData);
                        if (updatedData[global.wordsHaveBeenTruncated]) {
                            toastInfo(
                                `${global.someWordsHaveBeenTruncated} ${global.maxWordLength}`,
                                3000
                            );
                        }
                        delete updatedData[`${global.wordsHaveBeenTruncated}`];
                        result = await updateCategoryPrivatelyApi(
                            menu.restaurant.id,
                            menu.categories[categoryIndex].category.id,
                            updatedData,
                            menu.restaurant.currently_logged_in,
                            menu.restaurant.logged_in_user_random_number
                        );
                    }
                }

                if (checkResponseStatus(result.status)) {
                    if (categoryIndex === global.noValue) {
                        reduxStateDispatch(
                            addANewCategory({
                                categoryId: result.id,
                                updatedData: updatedData,
                            })
                        );
                    } else {
                        if (!noModificationWereMade) {
                            reduxStateDispatch(
                                changeCategoryData({
                                    categoryId:
                                        menu.categories[categoryIndex].category
                                            .id,
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
        } else toastError(global.categoryNameIsTaken);
    };

    const handleReset = () => {
        reset(initialValues.defaults);
        toastSuccess(global.resetWasPerformed);
    };

    function handleDeleteImage() {
        setValue("categoryImageId", global.noValue);
    }

    function handleHelp() {
        if (Object.keys(errors).length !== 0) {
            toastInfo(global.errorsInDialog);
            return;
        }
        let categoryEditionObject = {};
        categoryEditionObject.categoryIndex = categoryIndex;
        categoryEditionObject.categoryName = categoryNameValue;
        categoryEditionObject.categoryDescription = categoryDescriptionValue;
        categoryEditionObject.categoryImageId = categoryImageIdValue;

        globalStateDispatch({
            type: globalStateContextActions.setCategoryEditionObject,
            payload: categoryEditionObject,
        });
        appNavigate(global.helpPath, {
            state: {
                videoName: "private_dialog_category",
            },
        });
    }

    function handleImageSearchClick() {
        if (Object.keys(errors).length !== 0) {
            toastInfo(global.errorsInDialog);
            return;
        }
        let categoryEditionObject = {};
        categoryEditionObject.categoryIndex = categoryIndex;
        categoryEditionObject.categoryName = categoryNameValue;
        categoryEditionObject.categoryDescription = categoryDescriptionValue;
        categoryEditionObject.categoryImageId = categoryImageIdValue;

        globalStateDispatch({
            type: globalStateContextActions.setCategoryEditionObject,
            payload: categoryEditionObject,
        });
        // appNavigate(global.showImageCollectionPath);

        globalStateDispatch({
            type: globalStateContextActions.setNameOfTheItemSelectingAnImage,
            payload: categoryNameValue,
        });

        appNavigate(global.showImageCollectionPath);
    }

    function handleCancel() {
        handleGoBack();
    }

    return (
        <ContentContainer>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogBox>
                    <Paper sx={{padding: "5px"}}>
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
                                    marginLeft: "15px",
                                    marginRight: "15px",
                                }}
                                component="div"
                            >
                                {categoryIndex !== global.noValue && (
                                    <div>
                                        <div>{global.editingCategoryText}</div>
                                        <div>
                                            {
                                                menu.categories[categoryIndex]
                                                    .category.private_name
                                            }
                                        </div>
                                    </div>
                                )}
                                {categoryIndex === global.noValue && (
                                    <div style={{marginBottom: "15px"}}>
                                        {global.newCategoryText}
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
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                // width: "50%",
                                maxWidth: "280px", // Adjust max-width as needed
                                margin: "0 auto", // Center the dialog
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    width: "90%",
                                }}
                            >
                                <div onClick={handleImageSearchClick}>
                                    {ShowImage(
                                        true,
                                        categoryNameValue,
                                        categoryImageIdValue,
                                        menu,
                                        false,
                                        190,
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
                                label={global.categoryNameText}
                                fullWidth
                                variant="filled"
                                value={categoryNameValue}
                                inputProps={{
                                    autoComplete: "off",
                                    maxLength:
                                        global.maxDialogCategoryNameLength,
                                }}
                                {...register("categoryName", {
                                    required: global.categoryNameRequired,
                                    pattern: {
                                        value: /^(?!.*[<>&\\"'/]).*$/,
                                        message:
                                            global.pleaseAvoidSomeSpecialChars,
                                    },
                                })}
                                type="text"
                                error={!!errors.categoryName}
                                helperText={
                                    <span
                                        style={{
                                            whiteSpace: "normal",
                                            wordWrap: "break-word",
                                        }}
                                    >
                                        {errors.categoryName?.message}
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
                                inputRef={nameRef}
                            />
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
                                    label={global.categoryDescriptionText}
                                    fullWidth
                                    variant="filled"
                                    value={categoryDescriptionValue}
                                    inputProps={{
                                        autoComplete: "off",
                                        maxLength: MaxDescriptionLength,
                                        style: {
                                            maxHeight: "110px", // sets the maximum height to the height of 4 rows
                                        },
                                    }}
                                    multiline
                                    rows={4} // set the number of visible rows to 4
                                    {...register("categoryDescription", {
                                        required:
                                            global.categoryDescriptionRequired,
                                        validate: (value) => {
                                            const forbiddenChars = /[<>&\\"'/]/;
                                            return (
                                                !forbiddenChars.test(value) ||
                                                global.pleaseAvoidSomeSpecialChars
                                            );
                                        },
                                    })}
                                    type="text"
                                    error={Boolean(errors.categoryDescription)}
                                    helperText={
                                        <span
                                            style={{
                                                whiteSpace: "normal",
                                                wordWrap: "break-word",
                                            }}
                                        >
                                            {
                                                errors.categoryDescription
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

export default DialogCategory;
