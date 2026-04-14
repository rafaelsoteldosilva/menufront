import React, {useContext, useEffect, useRef} from "react";
import {useForm} from "react-hook-form";
import {Box, Button, Paper, TextField, Typography} from "@mui/material";

import CancelIcon from "@mui/icons-material/Cancel";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import {faQuestion} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {toastError, toastInfo, toastSuccess} from "../utils/toastMessages";

import * as global from "../globalDefinitions/globalConstants";

import {
    EnvironmentOptionItemsContext,
    environmentOptionItems,
} from "../contexts/environmentOptionItemsContext";

import {
    getRestaurantMenu,
    resetStateChange,
    changeImageData,
} from "../slices/restaurantMenuSlice";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";

import {useDispatch, useSelector} from "react-redux";

import {useLocation} from "react-router-dom";
import {useNavigation} from "../contexts/navigationContext";

import {updateImageNameApi} from "../axiosCalls/axiosAPICalls";
import {checkResponseStatus} from "../utils/checkResponseStatus";
import {ShowImage} from "../utils/ImageFunctions";

import styled from "styled-components";
import {
    sanitizeStr,
    truncateLongWordsInAString,
} from "../utils/severalFunctions";

const ContentContainer = styled.div`
    display: flex;
    justify-content: start;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 100;
`;

const DialogBox = styled.div`
    margin: 10px;
    width: 100%;
    margin-top: 100px;
`;

function DialogImageName() {
    const {state} = useLocation();
    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);
    const {environmentOptionItemsState} = useContext(
        EnvironmentOptionItemsContext
    );

    const reduxStateDispatch = useDispatch();
    const {appNavigate} = useNavigation();

    const menu = useSelector(getRestaurantMenu);

    const imageIndex = state !== null ? state.imageIndex : global.noValue;

    const imageNameRef = useRef(null);

    let initialValues =
        imageIndex === global.noValue
            ? {
                  defaults: {
                      imageName: "",
                  },
              }
            : {
                  defaults: {
                      imageName:
                          menu.images[imageIndex].image.image_name ===
                          global.provisionalValue
                              ? ""
                              : menu.images[imageIndex].image.image_name,
                  },
              };

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        watch,
        reset,
    } = useForm({
        mode: "onChange",
        defaultValues: initialValues.defaults,
        criteriaMode: "all",
    });

    const imageNameValue = watch("imageName");

    useEffect(() => {
        if (imageIndex !== global.noValue) {
            globalStateDispatch({
                type: globalStateContextActions.setCurrentImageIndex,
                payload: imageIndex,
            });
        }
    }, [imageIndex, globalStateDispatch]);

    useEffect(() => {
        initialValues.defaults.image =
            imageIndex === global.noValue
                ? ""
                : menu.images[imageIndex].image.image_name ===
                    global.provisionalValue
                  ? ""
                  : menu.images[imageIndex].image.image_name;

        imageNameRef.current.focus();
        // eslint-disable-next-line
    }, []);

    function handleGoBack() {
        appNavigate(global.showImageCollectionPath);
    }

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.DialogImageNamePath,
        });
    }, [globalStateDispatch]);

    const onSubmit = async (data) => {
        let updatedData = {};
        let newNameStr = "";

        try {
            updatedData["restaurant_id"] = menu.restaurant.id;
            updatedData["user_id"] = menu.restaurant.currently_logged_in;
            updatedData["user_random"] =
                menu.restaurant.logged_in_user_random_number;

            newNameStr = truncateLongWordsInAString(data.imageName);
            if (newNameStr !== data.imageName) {
                toastInfo(
                    `${global.someWordsHaveBeenTruncated} ${global.maxWordLength}`,
                    3000
                );
            }

            newNameStr = sanitizeStr(newNameStr);

            updatedData["image_name"] = newNameStr;

            const result = await updateImageNameApi(
                menu.images[imageIndex].image.id,
                updatedData
            );

            if (checkResponseStatus(result.status)) {
                reduxStateDispatch(
                    changeImageData({
                        imageId: menu.images[imageIndex].image.id,
                        newName: updatedData["image_name"],
                    })
                );
                reduxStateDispatch(resetStateChange());

                toastSuccess(result.message);
                globalStateDispatch({
                    type: globalStateContextActions.setDoNotOpenLeftDrawer,
                });

                handleGoBack();
            } else {
                toastError(global.connectionErrorOrUserCanNotPerformOperations);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log("error:: ", error);
            toastError(global.connectionErrorOrUserCanNotPerformOperations);
        }
    };

    const handleReset = () => {
        toastSuccess(global.resetWasPerformed);
        reset(initialValues.defaults);
    };

    useEffect(() => {
        if (
            globalState.editionObject !== null &&
            globalState.featuresOfTheEditionObject.objectType ===
                global.DialogImageName
        ) {
            setValue("imageName", globalState.editionObject.imageName);

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

    function handleHelp() {
        if (Object.keys(errors).length !== 0) {
            toastInfo(global.errorsInDialog);
            return;
        }
        let imageNameEditionObject = {};
        imageNameEditionObject.imageIndex = imageIndex;
        imageNameEditionObject.imageName = imageNameValue;

        globalStateDispatch({
            type: globalStateContextActions.setImageNameEditionObject,
            payload: imageNameEditionObject,
        });

        appNavigate(global.helpPath, {
            state: {
                videoName: "private_dialog_image_name",
            },
        });
    }

    async function handleCancel() {
        handleGoBack();
    }

    useEffect(() => {
        if (
            environmentOptionItemsState.environmentOptionItems ===
            environmentOptionItems.notAllowedEnvironment
        ) {
            appNavigate(global.notAllowedPath);
        }
    }, [appNavigate, environmentOptionItemsState.environmentOptionItems]);

    return (
        <ContentContainer>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogBox>
                    <Paper
                        sx={{
                            padding: "5px",
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
                                component="div"
                            >
                                <Box>
                                    {global.editingImageText}
                                    {menu.images[imageIndex].image
                                        .image_name === global.provisionalValue
                                        ? menu.images[imageIndex].image
                                              .image_original_name
                                        : menu.images[imageIndex].image
                                              .image_name}
                                </Box>
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
                                }}
                            >
                                <div>
                                    {ShowImage(
                                        true,
                                        menu.images[imageIndex].image
                                            .image_original_name,
                                        menu.images[imageIndex].image.id,
                                        menu,
                                        false,
                                        250,
                                        110,
                                        "",
                                        false,
                                        false,
                                        20,
                                        false
                                    )}
                                </div>
                            </div>

                            <TextField
                                label={global.imageNameText}
                                fullWidth
                                variant="filled"
                                value={imageNameValue}
                                inputProps={{
                                    autoComplete: "off",
                                    maxLength: global.maxDialogImageNameLength,
                                }}
                                {...register("imageName", {
                                    required: global.imageNameRequired,
                                    pattern: {
                                        value: /^(?!.*[<>&\\"'/]).*$/,
                                        message:
                                            global.pleaseAvoidSomeSpecialChars,
                                    },
                                })}
                                type="text"
                                error={!!errors.imageName}
                                inputRef={imageNameRef}
                                helperText={
                                    <span
                                        style={{
                                            whiteSpace: "normal",
                                            wordWrap: "break-word",
                                        }}
                                    >
                                        {errors.imageName?.message}
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
                            >
                                <DoneOutlineIcon />
                            </Button>

                            <Button
                                onClick={handleReset}
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

export default DialogImageName;
