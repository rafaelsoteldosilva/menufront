import React, {useContext, useEffect, useRef, useState} from "react";

import {useForm} from "react-hook-form";

import CancelIcon from "@mui/icons-material/Cancel";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";
import * as global from "../globalDefinitions/globalConstants";
import {faQuestion} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {getRestaurantMenu} from "../slices/restaurantMenuSlice";

import {useSelector} from "react-redux";
import {useNavigation} from "../contexts/navigationContext";

import {Box, Button, Paper, TextField, Typography} from "@mui/material";
import {toastInfo, toastSuccess} from "../utils/toastMessages";
import {sanitizeStr} from "../utils/severalFunctions";

function DialogWhatsappShare() {
    let initialValues = {
        defaults: {
            message: "",
        },
    };
    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);

    const menu = useSelector(getRestaurantMenu);
    const {appNavigate} = useNavigation();

    const [maxMessageChars] = useState(
        global.maxDialogWhatsappShareMessageLength
    );

    const messageRef = useRef(null);

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

    const messageValue = watch("message");
    const remainingMessageChars = maxMessageChars - messageValue.length;

    function whatsBeingShared() {
        let result = "";
        if (
            globalState.lastSignificantPathVisited ===
            global.pathsThatConcernReviewingAndSharing.home
        ) {
            result =
                global.restaurantFirstLetterUppercaseText +
                menu.restaurant.public_name;
        } else {
            if (
                globalState.lastSignificantPathVisited ===
                global.pathsThatConcernReviewingAndSharing.dish
            ) {
                result =
                    global.itemFirstLetterUppercaseText +
                    menu.categories[globalState.currentCategoryIndex].dishes[
                        globalState.currentDishIndex
                    ].dish.public_name;
            }
        }
        return result;
    }

    useEffect(() => {
        initialValues.defaults.message = "";
        messageRef.current.focus();
    }, [initialValues.defaults]);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.DialogWhatsappSharePath,
        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (
            globalState.editionObject !== null &&
            globalState.featuresOfTheEditionObject.objectType ===
                global.whatsappShare
        ) {
            setValue("message", globalState.editionObject.message);
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

    function handleGoBack() {
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
    }

    const onSubmit = () => {
        const message = sanitizeStr(messageValue.trim());
        let menuWeb = "";
        let completeMessage = "";

        switch (globalState.lastSignificantPathVisited) {
            case global.homePath: {
                menuWeb = `https://atonna-frontend.vercel.app?restaurant=${menu.restaurant.id}`;

                completeMessage =
                    message +
                    global.whatsappShareRestaurantUppercaseText +
                    menu.restaurant.public_name +
                    global.whatsappShareAddressUppercaseText +
                    menu.restaurant.public_address +
                    // global.whatsappShareWebPageText +
                    // menu.restaurant.public_website_url +
                    global.whatsappShareWatchMenuHereText +
                    menuWeb;
                break;
            }

            case global.dishPath: {
                menuWeb = `https://atonna-frontend.vercel.app/item/${menu.restaurant.id}/${globalState.currentCategoryIndex}/${globalState.currentDishIndex}/`;
                let item =
                    menu.categories[globalState.currentCategoryIndex].dishes[
                        globalState.currentDishIndex
                    ].dish.public_name;
                completeMessage =
                    message +
                    global.whatsappShareRestaurantUppercaseText +
                    menu.restaurant.public_name +
                    global.whatsappShareAddressUppercaseText +
                    menu.restaurant.public_address +
                    // global.whatsappShareWebPageText +
                    // menu.restaurant.public_website_url +
                    global.whatsappShareIRecommendText +
                    "[[ * " +
                    item +
                    " * ]]" +
                    global.whatsappShareWatchMenuHereText +
                    menuWeb;
                break;
            }

            default: {
                break;
            }
        }
        const shareUrl = `https://wa.me/?text=${completeMessage}`;
        // Open the WhatsApp share dialog
        window.open(shareUrl, "_blank");
        handleGoBack();
    };

    const handleReset = () => {
        reset(initialValues.defaults);
        toastSuccess(global.resetWasPerformed);
    };

    function handleHelp() {
        if (Object.keys(errors).length !== 0) {
            toastInfo(global.errorsInDialog);
            return;
        }
        let whatsappShareEditionObject = {};
        whatsappShareEditionObject.message = messageValue;
        globalStateDispatch({
            type: globalStateContextActions.setWhatsappShareEditionObject,
            payload: whatsappShareEditionObject,
        });
        if (
            globalState.lastSignificantPathVisited ===
            global.pathsThatConcernReviewingAndSharing.home
        ) {
            appNavigate(global.helpPath, {
                state: {
                    // put the correct video help name here
                    videoName: "public_dialog_whatsapp_share_home",
                },
            });
        } else {
            // it is a dish
            appNavigate(global.helpPath, {
                state: {
                    // put the correct video help name here
                    videoName: "public_dialog_whatsapp_share_dish",
                },
            });
        }
    }

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "flex-start",
                paddingLeft: "20px",
                width: "100%",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                zIndex: 100,
                userSelect: "none",
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Paper
                    sx={{
                        width: "280px",
                        padding: "10px",
                        marginTop: "80px",
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
                            component="div"
                            align="center"
                            sx={{fontWeight: "bold"}}
                        >
                            <Box>
                                {global.whatsappShareMessageOfText}
                                {whatsBeingShared()}
                            </Box>
                            <Box>{global.inYourMessageNameYourselfToo}</Box>
                        </Typography>
                        <Button
                            onClick={handleHelp}
                            variant="contained"
                            color="warning"
                            style={{
                                minWidth: "10px",
                                width: "25px",
                                maxHeight: "25px",
                                marginTop: "-3px",
                                marginRight: "10px",
                                marginLeft: "5px",
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
                            maxWidth: "100%", // Adjust max-width as needed
                            margin: "0 auto", // Center the dialog
                        }}
                    >
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
                                label={global.messageText}
                                fullWidth
                                variant="filled"
                                value={messageValue}
                                {...register("message", {
                                    required:
                                        global.whatsappShareMessageRequired,
                                    pattern: {
                                        value: /^(?!.*[<>&\\"'/]).*$/,
                                        message:
                                            global.pleaseAvoidSomeSpecialChars,
                                    },
                                })}
                                inputProps={{
                                    autoComplete: "off",
                                    maxLength: maxMessageChars,
                                    style: {
                                        maxHeight: "100px", // set the maximum height to the height of 3 rows
                                    },
                                }}
                                multiline
                                rows={3} // set the number of visible rows to 4
                                type="text"
                                error={!!errors.message}
                                inputRef={messageRef}
                                helperText={
                                    <span
                                        style={{
                                            whiteSpace: "normal",
                                            wordWrap: "break-word",
                                        }}
                                    >
                                        {errors.message?.message}
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
                                        fontFamily: "Roboto",
                                    }}
                                >
                                    {remainingMessageChars}
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
                            color="primary"
                        >
                            <DoneOutlineIcon />
                        </Button>

                        <Button onClick={handleReset} variant={"outlined"}>
                            <RestartAltIcon />
                        </Button>

                        <Button onClick={handleGoBack} variant={"outlined"}>
                            <CancelIcon />
                        </Button>
                    </Box>
                </Paper>
            </form>
        </div>
    );
}

export default DialogWhatsappShare;
