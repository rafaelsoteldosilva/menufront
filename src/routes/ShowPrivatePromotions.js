import React, {useContext, useEffect} from "react";
import * as global from "../globalDefinitions/globalConstants";
import styled from "styled-components";
import {Button} from "../globalDefinitions/globalStyles";

import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import TouchAppIcon from "@mui/icons-material/TouchApp";

import {promotionSwitchMarkForDeletionApi} from "../axiosCalls/axiosAPICalls";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";
import {
    getRestaurantMenu,
    resetStateChange,
    changePromotionMarkedForDeletion,
} from "../slices/restaurantMenuSlice";

import {useDispatch, useSelector} from "react-redux";

import {toastError} from "../utils/toastMessages";
import {useNavigation} from "../contexts/navigationContext";

const PromotionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    margin-left: 55px;
`;

const EachPromotion = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 2px solid #81818c;
    padding: 5px;
    margin: 10px;
    transition: filter 0.3s ease;
    width: 200px;
    height: 80px;
    background-color: ${({markedForDeletion}) =>
        markedForDeletion ? "#6C2828" : "#1d1f3c"};
    &:hover {
        filter: brightness(70%);
    }
    &:active {
        transform: translateY(4px);
    }
`;

const SeparatorLine = styled.div`
    margin-top: 5px;
    margin-left: 80px;
    border-top: 1px solid yellow;
    width: 80px;
    margin-bottom: 10px;
`;

const ScreenName = styled.div`
    margin-top: 100px;
    margin-bottom: 10px;
    margin-left: 5px;
    pointer-events: none;
    user-select: none;
    cursor: auto;
    &:hover {
        cursor: auto;
    }
`;

const PromotionName = styled.div`
    color: ${({highlight}) => (highlight ? "yellow" : "none")};
    user-select: none;
    cursor: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
        cursor: auto;
    }
`;

const PromotionAttractor = styled.div`
    color: ${({highlight}) => (highlight ? "yellow" : "none")};
    user-select: none;
    cursor: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
        cursor: auto;
    }
`;

const AddButton = styled(Button)`
    margin-top: 5px;
    width: 60px;
    height: 30px;
    margin-left: 5px;
`;

const EditionButtonsComponent = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 5px;
`;

const EditButton = styled(Button)`
    margin-top: 5px;
    width: 60px;
    height: 30px;
    margin-left: 50px;
`;

const EditButtons = styled.div``;

const DeleteButton = styled(Button)`
    margin-top: 5px;
    width: 60px;
    height: 30px;
    margin-right: auto;
`;

const DeletionLegend = styled.div`
    width: 100%;
    margin-left: 10px;
    margin-top: -5px;
    user-select: none;
    cursor: auto;
    color: yellow;
    &:hover {
        cursor: auto;
    }
`;

// good

function ShowPrivatePromotions() {
    const {appNavigate} = useNavigation();

    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);
    const reduxStateDispatch = useDispatch();
    const menu = useSelector(getRestaurantMenu);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentlyWatching,
            payload: global.promotions,
        });
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.showPrivatePromotionsPath,
        });
    }, [globalStateDispatch]);

    async function handleDeleteButtonClick(index) {
        let actualState = menu.promotions[index].promotion.marked_for_deletion;
        try {
            if (global.accessBackend) {
                await promotionSwitchMarkForDeletionApi(
                    menu.restaurant.id,
                    menu.promotions[index].promotion.id,
                    actualState,
                    menu.restaurant.currently_logged_in,
                    menu.restaurant.logged_in_user_random_number
                );
            }

            reduxStateDispatch(
                changePromotionMarkedForDeletion({
                    promotionId: menu.promotions[index].promotion.id,
                    markedForDeletion: !actualState,
                })
            );
            reduxStateDispatch(resetStateChange());

            globalStateDispatch({
                type: globalStateContextActions.setNotifyOfAChangeMade,
            });
        } catch (error) {
            toastError(global.connectionErrorOrUserCanNotPerformOperations);
        }
    }

    async function AddPromotion() {
        const promotionIndex = global.noValue;
        appNavigate(global.DialogPromotionPrivatePath, {
            state: {promotionIndex},
        });
    }

    function handleEditButtonClick(promotionIndex) {
        // private_promotion_text
        appNavigate(global.DialogPromotionPrivatePath, {
            state: {promotionIndex},
        });
    }

    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
            }}
        >
            <div
                style={{
                    marginLeft: "65px",
                    marginBottom: "15px",
                    width: "80%",
                    borderLeft: "2px solid #4C867D",
                    borderBottom: "2px solid #4C867D",
                }}
            >
                <ScreenName>
                    <div>
                        {
                            <div>
                                {global.showingPrivatePromotionsScreenTitle}
                            </div>
                        }
                        <div>
                            {globalState.notifyOfAChangeMade && (
                                <div style={{color: "yellow"}}>
                                    {global.thisInfoHasNotBeenPublished}
                                </div>
                            )}
                        </div>
                    </div>
                </ScreenName>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    <AddButton onClick={AddPromotion}>
                        <LibraryAddIcon />
                    </AddButton>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            userSelect: "none",
                        }}
                    >
                        {global.addPromotionText}
                    </div>
                </div>
            </div>
            <PromotionsContainer>
                {menu.promotions.map((promotion, index) => {
                    return (
                        <div key={index}>
                            <EachPromotion
                                markedForDeletion={
                                    menu.promotions[index].promotion
                                        .marked_for_deletion
                                }
                                onClick={() => handleEditButtonClick(index)}
                            >
                                <PromotionName
                                    highlight={
                                        menu.promotions[index].promotion
                                            .recently_created ||
                                        menu.promotions[index].promotion
                                            .has_been_modified
                                    }
                                    style={{width: "100%"}}
                                >
                                    {promotion.promotion.private_name}
                                </PromotionName>
                                <PromotionAttractor
                                    highlight={
                                        menu.promotions[index].promotion
                                            .recently_created ||
                                        menu.promotions[index].promotion
                                            .has_been_modified
                                    }
                                    style={{width: "100%"}}
                                >
                                    {promotion.promotion.private_attractor_text}
                                </PromotionAttractor>
                                <TouchAppIcon />
                            </EachPromotion>
                            <DeletionLegend>
                                {menu.promotions[index].promotion
                                    .marked_for_deletion && (
                                    <div>{global.markedForDeletion}</div>
                                )}
                            </DeletionLegend>
                            <EditButtons>
                                <EditionButtonsComponent>
                                    <EditButton
                                        onClick={() =>
                                            handleEditButtonClick(index)
                                        }
                                    >
                                        <EditIcon />
                                    </EditButton>

                                    <DeleteButton
                                        onClick={() =>
                                            handleDeleteButtonClick(index)
                                        }
                                    >
                                        {!menu.promotions[index].promotion
                                            .marked_for_deletion ? (
                                            <DeleteIcon />
                                        ) : (
                                            <RestoreFromTrashIcon />
                                        )}
                                    </DeleteButton>
                                </EditionButtonsComponent>
                            </EditButtons>
                            <SeparatorLine />
                        </div>
                    );
                })}
            </PromotionsContainer>
        </div>
    );
}

export default ShowPrivatePromotions;
