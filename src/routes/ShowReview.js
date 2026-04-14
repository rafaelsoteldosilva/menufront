import React, {useContext, useState} from "react";
import styled from "styled-components";
import ReactStars from "react-rating-stars-component";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {useLocation} from "react-router-dom";
import {useNavigation} from "../contexts/navigationContext";
import _ from "lodash";

import {Button} from "../globalDefinitions/globalStyles";

import * as global from "../globalDefinitions/globalConstants";

import {
    EnvironmentOptionItemsContext,
    environmentOptionItems,
} from "../contexts/environmentOptionItemsContext";
import {
    getAllReviews,
    fetchAllReviews,
    AllReviewsChangeReviewMarkedForRejection,
} from "../slices/allReviewsSlice";
import {getRestaurantMenu} from "../slices/restaurantMenuSlice";
import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";

import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";

import {switchReviewForRejectionApi} from "../axiosCalls/axiosAPICalls";
import {checkResponseStatus} from "../utils/checkResponseStatus";
import {toastError} from "../utils/toastMessages";
import {useEffect} from "react";

const ReviewContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-left: 65px;
    user-select: none;
    background-color: ${({markedForRejection}) =>
        markedForRejection ? "#6C2828" : "none"};
`;

const ReviewStars = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
`;

const ReviewContent = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 10px;
`;

const ReviewContentName = styled.div`
    width: 100%;
    margin-bottom: 20px;
    margin-left: -5px;
`;

const ReviewContentDate = styled.div`
    width: 100%;
    margin-left: 5px;
`;

const ReviewContentObservations = styled.div`
    width: 100%;
    margin-left: -5px;
`;

const EditionButtonsComponent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 5px;
`;

const RejectionButton = styled(Button)`
    margin-top: 5px;
    width: 110px;
    height: 30px;
    margin-left: 65px;
`;

const ScreenName = styled.div`
    margin-top: ${({privateEnvironment}) =>
        privateEnvironment ? "160px" : "80px"};
    margin-left: 5px;
    user-select: none;
`;

const RejectionReason = styled.div`
    color: ${({just_rejected}) => (just_rejected ? "yellow" : "white")};
    margin-left: 65px;
`;

const AllRejectionsButton = styled(Button)`
    display: ${({show}) => (show ? "block" : "none")};
    margin-left: 62px;
`;

const SeparatorButtonLine = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
    border-top: 1px dotted yellow;
    width: 30%;
    margin-left: 65px;
`;

// good

export default function ShowReview() {
    const reduxStateDispatch = useDispatch();
    const {appNavigate} = useNavigation();

    const {state} = useLocation();

    const menu = useSelector(getRestaurantMenu);
    const allReviews = useSelector(getAllReviews);

    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);

    const [myReviewObj, setMyReviewObj] = useState(state);

    const [approving, setApproving] = useState({
        reviewObj: null,
        approving: false,
    });

    useEffect(() => {
        if (myReviewObj !== null) {
            // we include isAuthorized to unify the added object, it comes this way from AppNavigate
            globalStateDispatch({
                type: globalStateContextActions.setCurrentReviewObject,
                payload: myReviewObj.reviewObj,
            });
        }
    }, [globalStateDispatch, myReviewObj]);

    const {environmentOptionItemsState} = useContext(
        EnvironmentOptionItemsContext
    );

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.showReviewPath,
        });
        globalStateDispatch({
            type: globalStateContextActions.setLastSignificantPathVisited,
            payload: global.showReviewPath,
        });
    });

    function reactStarsValue(value) {
        let starObj = {
            size: 40,
            value: value,
            edit: false,
        };
        return starObj;
    }

    async function switchRejectionInBackend(reviewObj) {
        // if it is here, then it is approving
        try {
            const result = await switchReviewForRejectionApi(
                menu.restaurant.id,
                reviewObj.review.id,
                -1, // because I know that it is approving
                menu.restaurant.currently_logged_in,
                menu.restaurant.logged_in_user_random_number
            );
            if (checkResponseStatus(result.status)) {
                reduxStateDispatch(fetchAllReviews(menu.restaurant.id));
                let localReviewObj = _.cloneDeep(reviewObj);
                localReviewObj.review.private_rejected = false;
                setApproving({reviewObj: localReviewObj, approving: true});
                // remember, adding isAuthorized is for unification purposes only
                setMyReviewObj({reviewObj: reviewObj, isAuthorized: true});
            } else
                toastError(global.connectionErrorOrUserCanNotPerformOperations);
        } catch (error) {
            toastError(`error ${error}`);
        }
    }

    useEffect(() => {
        if (allReviews && approving.approving) {
            reduxStateDispatch(
                // it will approve the review in allReviews, but not in the local variable myReviewObj
                AllReviewsChangeReviewMarkedForRejection({
                    reviewId: approving.reviewObj.review.id,
                    markedForRejection: false,
                })
            );
            // now approving it in the local variable myReviewObj
            let reviewObj = _.cloneDeep(approving); // create a shallow copy
            reviewObj.reviewObj.review.private_rejected = false;
            reviewObj.reviewObj.review.rejection_status_just_changed = true;
            // then update the state if needed
            setApproving(reviewObj);

            setMyReviewObj({reviewObj: approving.reviewObj});
            // myReviewObj was like variable.reviewObj.review and variable.reviewObj.review_rejection
        }
    }, [allReviews, approving, reduxStateDispatch]);

    function handleShowRejectionReasons() {
        appNavigate(global.showAllReviewRejectionReasonsPath, {
            state: {reviewObj: myReviewObj},
        });
    }

    async function handleRejectionButtonClick(reviewObj) {
        if (reviewObj.review.private_rejected) {
            // Approving
            switchRejectionInBackend(reviewObj);
            globalStateDispatch({
                type: globalStateContextActions.clearEditReviewRejectionReasonAnsweringObject,
            });
            globalStateDispatch({
                type: globalStateContextActions.setNotifyOfAChangeMade,
            });
        } else {
            // Rejecting
            globalStateDispatch({
                // Note that it is Show Review Waiting, not Show Reviews Waiting
                type: globalStateContextActions.setShowReviewWaitingForRejectionReason,
                payload: {reviewObj: reviewObj},
            });
            globalStateDispatch({
                type: globalStateContextActions.setNotifyOfAChangeMade,
            });
            appNavigate(global.DialogReviewRejectionReasonPath);
        }
    }

    function getParentName(reviewObj) {
        let result = "";
        if (
            environmentOptionItemsState.environmentOptionItems !==
            environmentOptionItems.menuPrivateEnvironment
        ) {
            if (reviewObj.reviewObj.review.parent_type === global.restaurant) {
                result =
                    global.restaurantFirstLetterUppercaseText +
                    reviewObj.reviewObj.review.parent_name;
            } else {
                result =
                    global.itemFirstLetterUppercaseText +
                    reviewObj.reviewObj.review.parent_name;
            }
        }
        if (
            environmentOptionItemsState.environmentOptionItems ===
            environmentOptionItems.menuPrivateEnvironment
        ) {
            if (reviewObj.reviewObj.review.parent_type === global.restaurant) {
                result =
                    global.restaurantFirstLetterUppercaseText +
                    reviewObj.reviewObj.review.parent_name;
            } else {
                result =
                    global.itemFirstLetterUppercaseText +
                    reviewObj.reviewObj.review.parent_name;
            }
        }

        return <div>{result}</div>;
    }

    if (myReviewObj === undefined || myReviewObj === null) {
        return (
            <div style={{marginTop: "200px", marginLeft: "100px"}}>
                waiting...
            </div>
        );
    } else {
        return (
            //
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    userSelect: "none",
                }}
            >
                <div
                    style={{
                        marginLeft: "55px",
                        marginBottom: "15px",
                        borderLeft: "2px solid #4C867D",
                        borderBottom: "2px solid #4C867D",
                    }}
                >
                    <ScreenName
                        privateEnvironment={
                            environmentOptionItemsState.environmentOptionItems ===
                            environmentOptionItems.publicEnvironment
                        }
                    >
                        <div>
                            {globalState.notifyOfAChangeMade &&
                            environmentOptionItemsState.environmentOptionItems !==
                                environmentOptionItems.publicEnvironment ? (
                                <div>
                                    <div style={{color: "yellow"}}>
                                        {global.thisInfoHasNotBeenPublished}
                                    </div>
                                </div>
                            ) : (
                                <div>{global.showingRevision}</div>
                            )}
                        </div>
                    </ScreenName>
                    <div style={{marginLeft: "5px"}}>
                        {getParentName(myReviewObj)}
                    </div>
                </div>
                <AllRejectionsButton
                    onClick={handleShowRejectionReasons}
                    show={
                        environmentOptionItemsState.environmentOptionItems !==
                        environmentOptionItems.publicEnvironment
                    }
                    sx={{height: "25"}}
                >
                    <div
                        style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                        }}
                    >
                        {global.rejectionReasons}
                    </div>
                </AllRejectionsButton>
                <ReviewContainer
                    environment={
                        environmentOptionItemsState.environmentOptionItems
                    }
                    markedForRejection={
                        environmentOptionItemsState.environmentOptionItems !==
                        environmentOptionItems.publicEnvironment
                            ? myReviewObj.reviewObj.review.private_rejected
                            : false
                    }
                >
                    <ReviewContentDate>
                        {moment(
                            new Date(myReviewObj.reviewObj.review.creation_date)
                        ).format("MMMM Do YYYY, h:mm:ss a")}
                    </ReviewContentDate>
                    <ReviewStars>
                        <ReactStars
                            {...reactStarsValue(
                                myReviewObj.reviewObj.review.number_of_stars
                            )}
                        />
                    </ReviewStars>
                    <ReviewContent>
                        <ReviewContentName>
                            {myReviewObj.reviewObj.review.diner_name}
                        </ReviewContentName>

                        <ReviewContentObservations>
                            {myReviewObj.reviewObj.review.review_comment}
                        </ReviewContentObservations>
                    </ReviewContent>
                </ReviewContainer>
                {environmentOptionItemsState.environmentOptionItems ===
                    environmentOptionItems.inappropriateRevisionsPrivateEnvironment && (
                    <>
                        <EditionButtonsComponent>
                            {myReviewObj.reviewObj.review.private_rejected && (
                                <RejectionReason
                                    just_rejected={
                                        myReviewObj.reviewObj.review
                                            .rejection_status_just_changed
                                    }
                                >
                                    {
                                        myReviewObj.reviewObj.review_rejection
                                            .rejection_reason.reason
                                    }
                                </RejectionReason>
                            )}
                            {myReviewObj.reviewObj.review
                                .rejection_status_just_changed && (
                                <div
                                    style={{
                                        marginLeft: "65px",
                                        color: "yellow",
                                    }}
                                >
                                    {myReviewObj.reviewObj.review
                                        .private_rejected
                                        ? global.markedForRejection
                                        : global.markedForApproval}
                                </div>
                            )}
                            <SeparatorButtonLine />
                            <RejectionButton
                                onClick={() =>
                                    handleRejectionButtonClick(
                                        myReviewObj.reviewObj
                                    )
                                }
                                disabled={!global.accessBackend}
                            >
                                <div>
                                    {myReviewObj.reviewObj.review
                                        .private_rejected && (
                                        <div
                                            style={{
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <ThumbUpOffAltIcon
                                                sx={{
                                                    marginBottom: "-7px",
                                                    marginRight: "5px",
                                                }}
                                            />
                                            {global.approveText}
                                        </div>
                                    )}
                                    {!myReviewObj.reviewObj.review
                                        .private_rejected && (
                                        <div
                                            style={{
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <ThumbDownOffAltIcon
                                                sx={{
                                                    marginBottom: "-7px",
                                                    marginRight: "5px",
                                                }}
                                            />
                                            {global.rejectText}
                                        </div>
                                    )}
                                </div>
                            </RejectionButton>
                        </EditionButtonsComponent>
                    </>
                )}
            </div>
        );
    }
}
