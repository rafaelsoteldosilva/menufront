import React, {useContext, useRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useLocation} from "react-router-dom";
import {useNavigation} from "../contexts/navigationContext";

import * as global from "../globalDefinitions/globalConstants";
// import moment from "moment";
import ReactStars from "react-rating-stars-component";
import styled from "styled-components";
import {Button} from "../globalDefinitions/globalStyles";
// import "moment/locale/es";

import TouchAppIcon from "@mui/icons-material/TouchApp";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";

import {
    EnvironmentOptionItemsContext,
    environmentOptionItems,
} from "../contexts/environmentOptionItemsContext";

import {getAllReviews, fetchAllReviews} from "../slices/allReviewsSlice";

import {getRestaurantMenu} from "../slices/restaurantMenuSlice";
import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";

import {switchReviewForRejectionApi} from "../axiosCalls/axiosAPICalls";
import {checkResponseStatus} from "../utils/checkResponseStatus";
import {toastError} from "../utils/toastMessages";
import {useEffect} from "react";
import {useState} from "react";

// moment.locale("es");

const ContentContainer = styled.div``;

const ReviewContainer = styled(Button)`
    width: 200px;
    margin: 5px;
    padding: 5px;
    border-radius: 5px;
    color: ${({theme}) => theme.textColor};
    background-color: ${({markedForRejection}) =>
        markedForRejection ? "#6C2828" : "#1d1f3c"};
    border: 1px solid ${({theme}) => theme.textColor};
    &:hover {
        filter: brightness(70%);
    }
    &:active {
        transform: translateY(4px);
    }
`;

const WholeReview = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    &:active {
        transform: translateY(4px);
    }
`;

const ReviewStars = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const EditionButtonsComponent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 13px;
`;

const RejectionButton = styled(Button)`
    margin-top: 5px;
    width: 110px;
    height: 30px;
    align-self: center;
`;

const ScreenName = styled.div`
    margin-top: ${({privateEnvironment}) =>
        privateEnvironment ? "90px" : "155px"};
    margin-left: 5px;
`;

const SeparatorButtonLine = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
    border-top: 1px dotted yellow;
    width: 30%;
    margin-left: 75px;
`;

const SeparatorLine = styled.div`
    margin-top: ${({marginTop}) => (marginTop ? "30px" : "none")};
    margin-bottom: 10px;
    border-top: 1px solid yellow;
    width: 60%;
    margin-left: 40px;
`;

const RejectionReason = styled.div`
    color: ${({just_rejected}) => (just_rejected ? "yellow" : "white")};
    margin-left: 9px;
`;

const OkText = styled.div`
    color: ${({just_rejected}) => (just_rejected ? "yellow" : "white")};
    margin-left: 9px;
`;

const AllRejectionsButton = styled(Button)`
    display: ${({show}) => (show ? "block" : "none")};
    margin-top: 15px;
`;

// good

export default function ShowReviews() {
    const {environmentOptionItemsState} = useContext(
        EnvironmentOptionItemsContext
    );
    const {state} = useLocation();
    const {appNavigate} = useNavigation();
    const reduxStateDispatch = useDispatch();

    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);
    const menu = useSelector(getRestaurantMenu);
    const allReviews = useSelector(getAllReviews);

    const [revisionsArray, setRevisionsArray] = useState([]);

    const breakingDate = useRef(new Date());

    const {
        isDish = false,
        categoryIndex = global.noValue,
        dishIndex = global.noValue,
    } = state || {};

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.showReviewsPath,
        });
        globalStateDispatch({
            type: globalStateContextActions.setLastSignificantPathVisited,
            payload: global.showReviewsPath,
        });
    });

    useEffect(() => {
        if (
            environmentOptionItemsState.environmentOptionItems ===
            environmentOptionItems.publicEnvironment
        ) {
            let reviews = [];
            if (isDish) {
                reviews = [
                    ...menu.categories[categoryIndex].dishes[dishIndex].reviews,
                ];
            } else {
                reviews = [...menu.restaurant_reviews.reviews];
            }
            setRevisionsArray(reviews);
        } else {
            reduxStateDispatch(fetchAllReviews(menu.restaurant.id));
        }
    }, [
        categoryIndex,
        dishIndex,
        environmentOptionItemsState.environmentOptionItems,
        isDish,
        menu.categories,
        menu.restaurant.id,
        menu.restaurant_reviews.reviews,
        reduxStateDispatch,
    ]);

    useEffect(() => {
        if (
            environmentOptionItemsState.environmentOptionItems !==
                environmentOptionItems.publicEnvironment &&
            allReviews
        ) {
            setRevisionsArray(allReviews.reviews);
        }
    }, [allReviews, environmentOptionItemsState.environmentOptionItems]);

    useEffect(() => {
        if (globalState.answerReady) {
            globalStateDispatch({
                type: globalStateContextActions.clearEditReviewRejectionReasonAnsweringObject,
            });
            globalStateDispatch({
                type: globalStateContextActions.clearShowReviewsWaitingForRejectionReason,
            });
        }
    }, [
        globalState.answerReady,
        globalState.answerReadyFeatures,
        globalStateDispatch,
    ]);

    async function switchRejectionInBackend(reviewObj) {
        // if it is here, then it is approving
        try {
            const result = await switchReviewForRejectionApi(
                menu.restaurant.id,
                reviewObj.review.id,
                global.noValue, // rejectionReasonId is noValue because I know that it is approving
                menu.restaurant.currently_logged_in,
                menu.restaurant.logged_in_user_random_number
            );
            if (checkResponseStatus(result.status)) {
                reduxStateDispatch(fetchAllReviews(menu.restaurant.id));
            } else
                toastError(global.connectionErrorOrUserCanNotPerformOperations);
        } catch (error) {
            toastError(global.connectionErrorOrUserCanNotPerformOperations);
        }
    }

    async function handleRejectionButtonClick(reviewObj) {
        // review.private_rejected
        if (reviewObj.review.private_rejected) {
            // Approving
            switchRejectionInBackend(reviewObj);
            globalStateDispatch({
                type: globalStateContextActions.setNotifyOfAChangeMade,
            });
        } else {
            // Rejecting
            globalStateDispatch({
                type: globalStateContextActions.setShowReviewsWaitingForRejectionReason,
                payload: {reviewObj: reviewObj},
            });
            globalStateDispatch({
                type: globalStateContextActions.setNotifyOfAChangeMade,
            });
            appNavigate(global.DialogReviewRejectionReasonPath);
        }
    }

    function reactStarsValue(value) {
        let starObj = {
            size: 30,
            value: value,
            edit: false,
        };
        return starObj;
    }

    function handleClickOnReview(reviewObj) {
        appNavigate(global.showReviewPath, {
            state: {reviewObj: reviewObj, isAuthorized: true},
        });
    }

    function getItemReviewedName() {
        return isDish
            ? global.revisionsOfItem +
                  menu.categories[categoryIndex].dishes[dishIndex].dish
                      .public_name
            : global.revisionsOfRestaurant + menu.restaurant.public_name;
    }

    function getBreakingDate(reviewDate, itemNumber) {
        if (itemNumber === 0) {
            breakingDate.current = reviewDate;
            return breakingDate.current;
        }
        if (
            new Date(breakingDate.current).getDay() !==
                new Date(reviewDate).getDay() ||
            new Date(breakingDate.current).getMonth() !==
                new Date(reviewDate).getMonth() ||
            new Date(breakingDate.current).getFullYear() !==
                new Date(reviewDate).getFullYear()
        ) {
            breakingDate.current = reviewDate;
            return breakingDate.current;
        }
        return null;
    }

    function getDate(reviewDate) {
        return new Date(reviewDate);
    }

    function getParentName(reviewObj) {
        let result =
            environmentOptionItemsState.environmentOptionItems ===
            environmentOptionItems.inappropriateRevisionsPrivateEnvironment
                ? reviewObj.review.parent_type === global.restaurant
                    ? global.restaurantFirstLetterUppercaseText +
                      reviewObj.review.parent_name
                    : global.itemFirstLetterUppercaseText +
                      reviewObj.review.parent_name
                : null;
        return result;
    }

    function handleShowRejectionReasons() {
        appNavigate(global.showAllReviewRejectionReasonsPath);
    }

    if (revisionsArray === undefined || revisionsArray.length === 0)
        // In the case of allReviews it is undefined at the begining,
        // in this case revisionsArray.length fails
        return (
            <div
                style={{
                    textAlign: "center",
                    margin: "100px",
                    fontSize: "40px",
                    marginTop: "150px",
                    userSelect: "none",
                }}
            >
                {global.thereAreNoRevisions}
            </div>
        );
    else
        return (
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    marginLeft: "55px",
                    userSelect: "none",
                }}
            >
                <div
                    style={{
                        width: "60%",
                        borderLeft: "2px solid #4C867D",
                        borderBottom: "2px solid #4C867D",
                    }}
                >
                    <ScreenName
                        privateEnvironment={
                            environmentOptionItemsState.environmentOptionItems !==
                            environmentOptionItems.publicEnvironment
                        }
                    >
                        <div style={{fontSize: "16px"}}>
                            {globalState.notifyOfAChangeMade &&
                            environmentOptionItemsState.environmentOptionItems !==
                                environmentOptionItems.publicEnvironment ? (
                                <div style={{color: "yellow"}}>
                                    {global.thisInfoHasNotBeenPublished}
                                </div>
                            ) : null}
                        </div>
                        <div style={{color: "white"}}>
                            {environmentOptionItemsState.environmentOptionItems ===
                            environmentOptionItems.publicEnvironment ? (
                                <div style={{color: "white"}}>
                                    {getItemReviewedName()}
                                </div>
                            ) : null}
                        </div>
                        <div style={{color: "white"}}>
                            {environmentOptionItemsState.environmentOptionItems !==
                            environmentOptionItems.publicEnvironment ? (
                                <div style={{color: "white"}}>
                                    {global.showingRevisions}
                                </div>
                            ) : null}
                        </div>
                    </ScreenName>
                </div>
                <ContentContainer>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            flexWrap: "wrap",
                            width: "100%",
                        }}
                    >
                        <AllRejectionsButton
                            onClick={handleShowRejectionReasons}
                            show={
                                environmentOptionItemsState.environmentOptionItems !==
                                environmentOptionItems.publicEnvironment
                            }
                            variant={"outlined"}
                            sx={{height: "25px"}}
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
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                                flexWrap: "wrap",
                                width: "100%",
                            }}
                        >
                            {revisionsArray.map((reviewObj, index) => {
                                let titleDate = new Date();
                                titleDate = getBreakingDate(
                                    reviewObj.review.creation_date,
                                    index
                                );

                                return (
                                    <div key={index}>
                                        {titleDate !== null && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    color: "white",
                                                    margin: "10px",
                                                }}
                                            >
                                                {`${
                                                    global.daysOfTheWeek[
                                                        new Date(
                                                            breakingDate.current
                                                        ).getDay()
                                                    ]
                                                } ${getDate(
                                                    titleDate
                                                ).getDate()} de ${getDate(
                                                    titleDate
                                                ).toLocaleString("default", {
                                                    month: "long",
                                                })} de ${getDate(
                                                    titleDate
                                                ).getFullYear()}`}
                                            </div>
                                        )}
                                        <div
                                            key={index}
                                            style={{
                                                marginTop: "5px",
                                            }}
                                        >
                                            <WholeReview
                                                onClick={() =>
                                                    handleClickOnReview(
                                                        reviewObj
                                                    )
                                                }
                                            >
                                                <ReviewContainer
                                                    markedForRejection={
                                                        environmentOptionItemsState.environmentOptionItems !==
                                                        environmentOptionItems.publicEnvironment
                                                            ? reviewObj.review
                                                                  .private_rejected
                                                            : false
                                                    }
                                                >
                                                    <div
                                                        style={{
                                                            textAlign: "right",
                                                        }}
                                                    >
                                                        {`${getDate(
                                                            reviewObj.review
                                                                .creation_date
                                                        )
                                                            .getHours()
                                                            .toString()
                                                            .padStart(
                                                                2,
                                                                "0"
                                                            )}:${getDate(
                                                            reviewObj.review
                                                                .creation_date
                                                        )
                                                            .getMinutes()
                                                            .toString()
                                                            .padStart(2, "0")}`}
                                                    </div>
                                                    {getParentName(reviewObj)}
                                                    <p>
                                                        {
                                                            reviewObj.review
                                                                .diner_name
                                                        }
                                                    </p>
                                                    <ReviewStars>
                                                        <ReactStars
                                                            {...reactStarsValue(
                                                                reviewObj.review
                                                                    .number_of_stars
                                                            )}
                                                        />
                                                    </ReviewStars>
                                                    <div>
                                                        {reviewObj.review
                                                            .review_comment &&
                                                            reviewObj.review.review_comment.slice(
                                                                0,
                                                                40
                                                            )}
                                                        ...
                                                    </div>
                                                </ReviewContainer>
                                                <TouchAppIcon />
                                            </WholeReview>
                                            <div
                                                style={{
                                                    marginTop: "-15px",
                                                    marginBottom: "5px",
                                                }}
                                            >
                                                {environmentOptionItemsState.environmentOptionItems ===
                                                    environmentOptionItems.inappropriateRevisionsPrivateEnvironment && (
                                                    <div>
                                                        <EditionButtonsComponent>
                                                            {reviewObj.review
                                                                .private_rejected && (
                                                                <RejectionReason
                                                                    just_rejected={
                                                                        reviewObj
                                                                            .review
                                                                            .rejection_status_just_changed
                                                                    }
                                                                >
                                                                    {
                                                                        reviewObj
                                                                            .review_rejection
                                                                            .rejection_reason
                                                                            .reason
                                                                    }
                                                                </RejectionReason>
                                                            )}
                                                            {!reviewObj.review
                                                                .private_rejected && (
                                                                <OkText
                                                                    just_rejected={
                                                                        reviewObj
                                                                            .review
                                                                            .rejection_status_just_changed
                                                                    }
                                                                >
                                                                    <div>
                                                                        {
                                                                            global.okText
                                                                        }
                                                                    </div>
                                                                </OkText>
                                                            )}
                                                            {reviewObj.review
                                                                .rejection_status_just_changed && (
                                                                <div
                                                                    style={{
                                                                        width: "100%",
                                                                        marginLeft:
                                                                            "10px",
                                                                        color: "yellow",
                                                                    }}
                                                                >
                                                                    <div>
                                                                        {
                                                                            reviewObj
                                                                                .review
                                                                                .private_rejected
                                                                        }
                                                                    </div>
                                                                    {reviewObj
                                                                        .review
                                                                        .private_rejected
                                                                        ? global.markedForRejection
                                                                        : global.markedForApproval}
                                                                </div>
                                                            )}
                                                            <SeparatorButtonLine />
                                                            <RejectionButton
                                                                onClick={() =>
                                                                    handleRejectionButtonClick(
                                                                        reviewObj
                                                                    )
                                                                }
                                                                disabled={
                                                                    !global.accessBackend
                                                                }
                                                                sx={{
                                                                    width: "100px",
                                                                }}
                                                            >
                                                                {reviewObj
                                                                    .review
                                                                    .private_rejected && (
                                                                    <div
                                                                        style={{
                                                                            fontWeight:
                                                                                "bold",
                                                                        }}
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                marginTop:
                                                                                    "-5px",
                                                                            }}
                                                                        >
                                                                            <ThumbUpOffAltIcon
                                                                                sx={{
                                                                                    marginBottom:
                                                                                        "-7px",
                                                                                    marginRight:
                                                                                        "5px",
                                                                                }}
                                                                            />
                                                                            {
                                                                                global.approveText
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {!reviewObj
                                                                    .review
                                                                    .private_rejected && (
                                                                    <div
                                                                        style={{
                                                                            fontWeight:
                                                                                "bold",
                                                                        }}
                                                                    >
                                                                        <div>
                                                                            <ThumbDownOffAltIcon
                                                                                sx={{
                                                                                    marginBottom:
                                                                                        "-7px",
                                                                                    marginRight:
                                                                                        "5px",
                                                                                }}
                                                                            />
                                                                            {
                                                                                global.rejectText
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </RejectionButton>
                                                        </EditionButtonsComponent>
                                                    </div>
                                                )}
                                            </div>
                                            <SeparatorLine
                                                marginTop={
                                                    environmentOptionItemsState.environmentOptionItems ===
                                                    environmentOptionItems.publicEnvironment
                                                }
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </ContentContainer>
            </div>
        );
}
