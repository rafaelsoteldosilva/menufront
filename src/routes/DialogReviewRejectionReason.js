import React, {useContext, useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {Box, Button, Paper, Typography, Select, MenuItem} from "@mui/material";
import cloneDeep from "lodash/cloneDeep";

import CancelIcon from "@mui/icons-material/Cancel";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import {faQuestion} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {toastError, toastSuccess} from "../utils/toastMessages";

import * as global from "../globalDefinitions/globalConstants";

import {
    EnvironmentOptionItemsContext,
    environmentOptionItems,
} from "../contexts/environmentOptionItemsContext";

import {fetchAllReviews} from "../slices/allReviewsSlice";

import {
    getRestaurantMenu,
    resetStateChange,
} from "../slices/restaurantMenuSlice";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";

import {useDispatch, useSelector} from "react-redux";

import {useNavigation} from "../contexts/navigationContext";

import {switchReviewForRejectionApi} from "../axiosCalls/axiosAPICalls";
import {checkResponseStatus} from "../utils/checkResponseStatus";

import styled from "styled-components";

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

function DialogReviewRejectionReason() {
    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);
    const {environmentOptionItemsState} = useContext(
        EnvironmentOptionItemsContext
    );

    const reduxStateDispatch = useDispatch();
    const {appNavigate} = useNavigation();

    const menu = useSelector(getRestaurantMenu);

    const [reasonsArr, setReasonsArr] = useState([]);

    const [reasonIndex, setReasonIndex] = useState(-1);

    const cancelling = useRef(false);

    let initialValues = {
        defaults: {
            rejectionReasonIndex: -1,
        },
    };

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        reset,
        clearErrors,
    } = useForm({
        mode: "onChange",
        defaultValues: initialValues.defaults,
        criteriaMode: "all",
    });

    function handleGoBack() {
        switch (globalState.lastSignificantPathVisited) {
            case global.showReviewsPath: {
                appNavigate(global.showReviewsPath);
                break;
            }

            case global.showReviewPath: {
                if (cancelling.current) {
                    appNavigate(global.showReviewPath, {
                        state: {
                            reviewObj:
                                globalState.waitingForAnAnswerFeatures
                                    .reviewObj,
                        },
                    });
                }
                break;
            }

            default: {
                break;
            }
        }
        globalStateDispatch({
            type: globalStateContextActions.clearShowReviewsWaitingForRejectionReason,
        });
        globalStateDispatch({
            type: globalStateContextActions.clearShowReviewWaitingForRejectionReason,
        });
    }

    useEffect(() => {
        if (globalState.answerReadyFeatures.reviewObj !== null) {
            if (
                globalState.lastSignificantPathVisited === global.showReviewPath
            ) {
                appNavigate(global.showReviewPath, {
                    state: {
                        reviewObj: globalState.answerReadyFeatures.reviewObj,
                    },
                });
            } else {
                appNavigate(global.showReviewsPath);
            }
        }
    }, [
        appNavigate,
        globalState.answerReadyFeatures.reviewObj,
        globalState.lastSignificantPathVisited,
    ]);

    useEffect(() => {
        let localReasonsArr = [];
        menu.rejection_reasons.forEach((rejectionReason) => {
            if (rejectionReason.rejection_reason.reason !== global.specialNote)
                localReasonsArr.push(rejectionReason);
        });
        setReasonsArr(localReasonsArr);
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.DialogReviewRejectionReasonPath,
        });
    }, [globalStateDispatch, menu.rejection_reasons]);

    useEffect(() => {
        if (
            globalState.editionObject !== null &&
            globalState.featuresOfTheEditionObject.objectType ===
                global.selectRejectionReason
        ) {
            setValue(
                "rejectionReasonIndex",
                globalState.editionObject.rejectionReasonIndex
            );
            setReasonIndex(globalState.editionObject.rejectionReasonIndex);
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
        switch (fieldName) {
            case "rejectionReasonIndex": {
                if (value === -1) {
                    return global.rejectionReasonRequired;
                }
                break;
            }

            default: {
                break;
            }
        }

        return undefined;
    };

    const onSubmit = async () => {
        try {
            let result = {status: 300, error: ""};
            result = await switchReviewForRejectionApi(
                menu.restaurant.id,
                // there's globalState.waitingForAnAnswerFeatures.reviewObj.review and
                // globalState.waitingForAnAnswerFeatures.review_rejections, remember that I used to allow
                // several reasons for rejection
                globalState.waitingForAnAnswerFeatures.reviewObj.review.id,
                menu.rejection_reasons[reasonIndex].rejection_reason.id,
                menu.restaurant.currently_logged_in,
                menu.restaurant.logged_in_user_random_number
            );
            if (checkResponseStatus(result.status)) {
                reduxStateDispatch(fetchAllReviews(menu.restaurant.id));
                reduxStateDispatch(resetStateChange());
                let reviewObj = cloneDeep(
                    globalState.waitingForAnAnswerFeatures.reviewObj
                );
                reviewObj.review.private_rejected = true;
                reviewObj.review_rejection.rejection_reason =
                    menu.rejection_reasons[reasonIndex].rejection_reason;
                reviewObj.review.rejection_status_just_changed = true;
                globalStateDispatch({
                    type: globalStateContextActions.setEditReviewRejectionReasonAnsweringObject,
                    payload: {
                        reviewObj: reviewObj,
                        answerObject: reasonIndex,
                    },
                });
                globalStateDispatch({
                    type: globalStateContextActions.setNotifyOfAChangeMade,
                });
                handleGoBack();
            } else
                toastError(global.connectionErrorOrUserCanNotPerformOperations);
        } catch (error) {
            toastError(`error ${error}`);
        }
    };

    const handleReset = () => {
        reset();
        setReasonIndex(-1);
        toastSuccess(global.resetWasPerformed);
    };

    function handleHelp() {
        let rejectionReasonEditionObject = {};
        rejectionReasonEditionObject.rejectionReasonIndex = reasonIndex;

        globalStateDispatch({
            type: globalStateContextActions.setRejectionReasonEditionObject,
            payload: rejectionReasonEditionObject,
        });
        appNavigate(global.helpPath, {
            state: {
                videoName: "private_dialog_rejection_reason",
            },
        });
    }

    async function handleCancel() {
        globalStateDispatch({
            type: globalStateContextActions.clearShowReviewsWaitingForRejectionReason,
        });
        globalStateDispatch({
            type: globalStateContextActions.clearShowReviewWaitingForRejectionReason,
        });
        globalStateDispatch({
            type: globalStateContextActions.clearNotifyOfAChangeMade,
        });
        cancelling.current = true;
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

    if (reasonsArr.length === 0) {
        return <div>waiting...</div>;
    } else {
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
                                >
                                    {global.selectingRejectionReasonText}
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
                            <Select
                                {...register("rejectionReasonIndex", {
                                    validate: validateField(
                                        "rejectionReasonIndex"
                                    ),
                                })}
                                style={{marginLeft: "20px"}}
                                value={reasonIndex}
                                onChange={(event) => {
                                    const selectedValue = event.target.value;
                                    setReasonIndex(selectedValue);
                                    // Clear error message when a valid option is selected
                                    if (selectedValue !== -1) {
                                        setValue(
                                            "rejectionReasonIndex",
                                            selectedValue
                                        );
                                        clearErrors("rejectionReasonIndex"); // Clear the error message
                                    }
                                }}
                            >
                                <MenuItem value={-1}>
                                    {global.selectAnOption}
                                </MenuItem>
                                {reasonsArr.map((rejectionReason, index) => {
                                    return (
                                        <MenuItem key={index} value={index}>
                                            {
                                                rejectionReason.rejection_reason
                                                    .reason
                                            }
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                            {errors.rejectionReasonIndex && (
                                <Typography
                                    variant="body2"
                                    color="error"
                                    sx={{
                                        marginLeft: "20px",
                                        fontSize: "12px",
                                    }}
                                >
                                    {errors.rejectionReasonIndex.message}
                                </Typography>
                            )}
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
}

export default DialogReviewRejectionReason;
