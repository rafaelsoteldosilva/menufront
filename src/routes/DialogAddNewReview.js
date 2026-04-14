//
import React, {useEffect, useRef, useState, useContext} from "react";
import {useForm} from "react-hook-form";
import {
    Box,
    Button,
    FormControl,
    Paper,
    Rating,
    TextField,
    Typography,
} from "@mui/material";
import {faQuestion, faThumbsUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import StarBorderIcon from "@mui/icons-material/StarBorder";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import MessageIcon from "@mui/icons-material/Message";

import {toastSuccess, toastError, toastInfo} from "../utils/toastMessages";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";
import * as global from "../globalDefinitions/globalConstants";

import {useNavigation} from "../contexts/navigationContext";

import {
    fetchMenu,
    getRestaurantMenu,
    resetStateChange,
} from "../slices/restaurantMenuSlice";

import {useDispatch, useSelector} from "react-redux";
import {
    createDishReviewApi,
    createRestaurantReviewApi,
} from "../axiosCalls/axiosAPICalls";
import {checkResponseStatus} from "../utils/checkResponseStatus";

import styled from "styled-components";
import {
    sanitizeStr,
    truncateLongWordsInObject,
} from "../utils/severalFunctions";

const ContentContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    width: 90vw;
    height: 70vh;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 100;
    padding-left: 25px;
    user-select: none;
`;

const DialogBox = styled.div`
    margin: auto;
    margin-top: 100px;
    width: 325px;
`;

function DialogAddNewReview() {
    let initialValues = {
        defaults: {
            rating: 0,
            dinerName: "",
            restaurantNumber: "",
            message: "",
        },
        starsSize: "3rem",
    };
    let whatsBeingReviewed = useRef("nothing");
    const {appNavigate} = useNavigation();

    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);

    const menu = useSelector(getRestaurantMenu);
    const reduxStateDispatch = useDispatch();

    const [maxMessageChars] = useState(500);

    const nameRef = useRef(null);

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

    const [ratingValue, setRatingValue] = useState(0);
    const dinerNameValue = watch("dinerName");
    const [restaurantNumberValue, setRestaurantNumberValue] = useState("");
    const messageValue = watch("message");
    const remainingMessageChars = maxMessageChars - messageValue.length;

    useEffect(() => {
        if (
            globalState.lastSignificantPathVisited ===
            global.pathsThatConcernReviewingAndSharing.home
        ) {
            whatsBeingReviewed.current =
                "Restaurant " + menu.restaurant.public_name;
        } else {
            if (
                globalState.lastSignificantPathVisited ===
                global.pathsThatConcernReviewingAndSharing.dish
            ) {
                whatsBeingReviewed.current =
                    // "Item " +
                    menu.categories[globalState.currentCategoryIndex].dishes[
                        globalState.currentDishIndex
                    ].dish.public_name;
            }
        }
    }, [
        globalState.currentCategoryIndex,
        globalState.currentDishIndex,
        globalState.lastSignificantPathVisited,
        menu.categories,
        menu.restaurant.public_name,
    ]);

    useEffect(() => {
        initialValues.defaults.rating = 0;
        initialValues.defaults.dinerName = "";
        initialValues.defaults.restaurantNumber = "";
        initialValues.defaults.message = "";
        nameRef.current.focus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.DialogAddNewReviewPath,
        });
    }, [globalStateDispatch]);

    useEffect(() => {
        if (
            globalState.editionObject !== null &&
            globalState.featuresOfTheEditionObject.objectType ===
                global.addReview
        ) {
            setRatingValue(globalState.editionObject.rating);
            setValue("dinerName", globalState.editionObject.dinerName);

            setValue(
                "restaurantNumber",
                globalState.editionObject.restaurantNumber
            );
            setRestaurantNumberValue(
                globalState.editionObject.restaurantNumber
            );
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

    const validateField = (fieldName) => (value) => {
        let trimmedValue = "";
        switch (fieldName) {
            case "restaurantNumber": {
                trimmedValue = value.trim();

                if (trimmedValue === "") {
                    return global.restaurantNumberRequired;
                }
                if (
                    Number(trimmedValue) !==
                    menu.restaurant.todays_random_number
                ) {
                    return global.suppliedValueDifferentToRestaurantNumber;
                }
                break;
            }

            default: {
                break;
            }
        }

        return undefined;
    };

    const onSubmit = async (data) => {
        let newData = {};
        if (ratingValue === 0) {
            toastError(global.selectRaitingFirst);
        } else {
            if (
                globalState.lastSignificantPathVisited ===
                global.pathsThatConcernReviewingAndSharing.home
            ) {
                newData = {
                    diner_name: sanitizeStr(data.dinerName.trim()),
                    number_of_stars: ratingValue,
                    review_comment: sanitizeStr(data.message.trim()),
                    parent_type: global.restaurant,
                    parent_name: menu.restaurant.public_name,
                };
                try {
                    const result = await createRestaurantReviewApi(
                        menu.restaurant.id,
                        newData
                    );
                    if (checkResponseStatus(result.status)) {
                        reduxStateDispatch(fetchMenu(menu.restaurant.id));
                        reduxStateDispatch(resetStateChange());

                        toastSuccess(global.reviewSavedSuccesfully);

                        handleGoBack();
                    } else
                        toastError(
                            global.connectionErrorOrUserCanNotPerformOperations
                        );
                } catch (error) {
                    toastError(
                        global.connectionErrorOrUserCanNotPerformOperations
                    );
                }
            } else {
                if (
                    globalState.lastSignificantPathVisited ===
                    global.pathsThatConcernReviewingAndSharing.dish
                ) {
                    newData = {
                        diner_name: data.dinerName.trim(),
                        number_of_stars: ratingValue,
                        review_comment: data.message.trim(),
                        parent_type: global.dish,
                        parent_name:
                            menu.categories[globalState.currentCategoryIndex]
                                .dishes[globalState.currentDishIndex].dish
                                .public_name,
                    };
                    try {
                        newData = truncateLongWordsInObject(newData);
                        if (newData[global.wordsHaveBeenTruncated]) {
                            toastInfo(
                                `${global.someWordsHaveBeenTruncated} ${global.maxWordLength}${global.pleaseHeadToRevisions}`,
                                4000
                            );
                        }
                        delete newData[`${global.wordsHaveBeenTruncated}`];

                        const result = await createDishReviewApi(
                            menu.restaurant.id,
                            menu.categories[globalState.currentCategoryIndex]
                                .dishes[globalState.currentDishIndex].dish.id,
                            newData
                        );
                        if (checkResponseStatus(result.status)) {
                            reduxStateDispatch(fetchMenu(menu.restaurant.id));
                            reduxStateDispatch(resetStateChange());

                            toastSuccess(global.reviewSavedSuccesfully);
                            // globalStateDispatch({
                            //     type: globalStateContextActions.clearCurrentMinorFunction,
                            // });
                            handleGoBack();
                        } else
                            toastError(
                                global.connectionErrorOrUserCanNotPerformOperations
                            );
                    } catch (error) {
                        toastError(
                            global.connectionErrorOrUserCanNotPerformOperations
                        );
                    }
                }
            }
        }
    };

    const handleReset = () => {
        reset(initialValues.defaults);
        setRatingValue(0);
        toastSuccess(global.resetWasPerformed);
    };

    const handleHelp = () => {
        if (Object.keys(errors).length !== 0) {
            toastInfo(global.errorsInDialog);
            return;
        }
        let addReviewEditionObject = {};
        addReviewEditionObject.rating = ratingValue;
        addReviewEditionObject.dinerName = dinerNameValue;
        addReviewEditionObject.restaurantNumber = restaurantNumberValue;
        addReviewEditionObject.message = messageValue;

        globalStateDispatch({
            type: globalStateContextActions.setAddReviewEditionObject,
            payload: addReviewEditionObject,
        });
        if (
            globalState.lastSignificantPathVisited ===
            global.pathsThatConcernReviewingAndSharing.home
        ) {
            appNavigate(global.helpPath, {
                state: {
                    // put the correct video help name here
                    videoName: "public_dialog_add_new_review_home",
                },
            });
        } else {
            // it is a dish
            appNavigate(global.helpPath, {
                state: {
                    // put the correct video help name here
                    videoName: "public_dialog_add_new_review_dish",
                },
            });
        }
    };

    function handleShowRejectionReasons() {
        if (Object.keys(errors).length !== 0) {
            toastInfo(global.errorsInDialog);
            return;
        }
        let addReviewEditionObject = {};
        addReviewEditionObject.rating = ratingValue;
        addReviewEditionObject.dinerName = dinerNameValue;
        addReviewEditionObject.restaurantNumber = restaurantNumberValue;
        addReviewEditionObject.message = messageValue;

        globalStateDispatch({
            type: globalStateContextActions.setAddReviewEditionObject,
            payload: addReviewEditionObject,
        });
        appNavigate(global.showAllReviewRejectionReasonsPath);
    }

    function handleGoBack() {
        if (
            globalState.lastSignificantPathVisited ===
            global.pathsThatConcernReviewingAndSharing.dish
        )
            appNavigate(
                `${global.dishPath}/${menu.restaurant.id}/${globalState.currentCategoryIndex}/${globalState.currentDishIndex}`
            );
        else appNavigate(`${global.homePath}/${menu.restaurant.id}`);
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
                            paddingLeft: "0px",
                            paddingRight: "0px",
                            width: "280px",
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
                                sx={{
                                    fontWeight: "bold",
                                    minWidth: "20px",
                                    marginLeft: "10px",
                                }}
                            >
                                <Box>
                                    {global.evaluating}{" "}
                                    {whatsBeingReviewed.current}
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
                                    marginTop: "-3px",
                                    marginRight: "10px",
                                }}
                            >
                                <FontAwesomeIcon icon={faQuestion} />
                            </Button>
                        </Box>
                        <Typography sx={{textAlign: "center"}}>
                            {global.selectEvaluation}
                        </Typography>
                        <Box
                            sx={{
                                width: "10%",
                                margin: "auto",
                            }}
                        >
                            <FormControl
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                fullWidth
                            >
                                <Rating
                                    name="rating"
                                    precision={1}
                                    size="large"
                                    emptyIcon={
                                        <StarBorderIcon fontSize="inherit" />
                                    }
                                    value={ratingValue}
                                    onChange={(event, newValue) => {
                                        setRatingValue(newValue); // Update the state when the user changes the rating
                                    }}
                                    sx={{
                                        fontSize: initialValues.starsSize, // set the font size to make the stars larger
                                        "& .MuiRating-icon": {
                                            width: initialValues.starsSize, // set the width of the star icon to make it larger
                                            height: initialValues.starsSize, // set the height of the star icon to make it larger
                                        },
                                    }}
                                />
                                {ratingValue === 5 && (
                                    <FontAwesomeIcon icon={faThumbsUp} />
                                )}
                            </FormControl>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                width: "100%",
                            }}
                        >
                            <TextField
                                label={global.dinerNameText}
                                fullWidth
                                variant="filled"
                                value={dinerNameValue}
                                {...register("dinerName", {
                                    required: global.dinerNameRequired,
                                    pattern: {
                                        value: /^(?!.*[<>&\\"'/]).*$/,
                                        message:
                                            global.pleaseAvoidSomeSpecialChars,
                                    },
                                })}
                                inputProps={{
                                    autoComplete: "off",
                                    maxLength:
                                        global.maxNewReviewDinnerNameLength,
                                }}
                                type="text"
                                error={!!errors.dinerName}
                                helperText={errors.dinerName?.message}
                                style={{width: "90%", padding: "10px"}}
                                inputRef={nameRef}
                            />
                            <TextField
                                label={global.restaurantNumberText}
                                fullWidth
                                variant="filled"
                                {...register("restaurantNumber", {
                                    required: global.restaurantNumberRequired,
                                    validate: validateField("restaurantNumber"),
                                    pattern: {
                                        value: /^\d{2}$/,
                                        message: global.twoDigitsRequired,
                                    },
                                })}
                                inputProps={{autoComplete: "off"}}
                                type="text"
                                error={!!errors.restaurantNumber}
                                helperText={errors.restaurantNumber?.message}
                                style={{width: "90%", padding: "10px"}}
                                value={restaurantNumberValue}
                                onChange={(e) =>
                                    setRestaurantNumberValue(e.target.value)
                                }
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
                                    label={global.messageText}
                                    fullWidth
                                    variant="filled"
                                    multiline
                                    rows={3}
                                    {...register("message", {
                                        pattern: {
                                            value: /^(?!.*[<>&\\"'/]).*$/,
                                            message:
                                                global.pleaseAvoidSomeSpecialChars,
                                        },
                                    })}
                                    inputProps={{
                                        autoComplete: "off",
                                        maxLength:
                                            global.maxNewReviewMessageLength,
                                        style: {
                                            maxHeight: "100px",
                                        },
                                    }}
                                    type="text"
                                    error={!!errors.message}
                                    helperText={errors.message?.message}
                                    style={{width: "90%", padding: "10px"}}
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
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Button
                                    onClick={handleShowRejectionReasons}
                                    variant={"outlined"}
                                    sx={{height: "25px"}}
                                >
                                    <MessageIcon />
                                    <Typography
                                        sx={{
                                            textAlign: "center",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            marginLeft: "5px",
                                        }}
                                    >
                                        {global.reviewsRejectionReasons}
                                    </Typography>
                                </Button>
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
                                disabled={!global.accessBackend}
                            >
                                <DoneOutlineIcon />
                            </Button>

                            <Button onClick={handleReset} variant={"outlined"}>
                                <RestartAltIcon />
                            </Button>

                            <Button onClick={handleCancel} variant={"outlined"}>
                                <CancelIcon />
                            </Button>
                        </Box>
                    </Paper>
                </DialogBox>
            </form>
        </ContentContainer>
    );
}

export default DialogAddNewReview;
