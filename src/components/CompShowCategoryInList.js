import React, {useEffect, useContext} from "react";
import styled from "styled-components";
import {useNavigation} from "../contexts/navigationContext";
import PropTypes from "prop-types";

import {useDispatch, useSelector} from "react-redux";

import {Button} from "../globalDefinitions/globalStyles";

import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import TouchAppIcon from "@mui/icons-material/TouchApp";

import {
    setCategoryPrivateViewOrderValueApi,
    categorySwitchMarkForDeletionApi,
    checkForCategoryDishesRevisionsApi,
} from "../axiosCalls/axiosAPICalls";

import {
    EnvironmentOptionItemsContext,
    environmentOptionItems,
} from "../contexts/environmentOptionItemsContext";
import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";

import {
    getRestaurantMenu,
    resetStateChange,
    changeCategoryMarkedForDeletion,
    changeCategoryPrivateViewOrderValue,
} from "../slices/restaurantMenuSlice";
import * as global from "../globalDefinitions/globalConstants";
import {useState} from "react";

import {toastError, toastModalInfo} from "../utils/toastMessages";

import {checkResponseStatus} from "../utils/checkResponseStatus";
import {ShowImage} from "../utils/ImageFunctions";

const CategoryElementsContainer = styled.div`
    width: 90%;
    user-select: none;
`;

const CategoryContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 10px;

    & > div:hover {
        filter: brightness(70%);
    }
    & > div:active {
        transform: translateY(4px);
    }
`;

const ImageAndButtons = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: -2px;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

const SortButtonAndChar = styled.div`
    // margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;

const OnlyImage = styled.div`
    user-select: none;
    pointer-events: none;
`;

const OnlySortButtonAndChar = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: -10px;
`;

const SortViewOrder = styled.p`
    color: ${({highlight}) => (highlight ? "yellow" : "none")};
    font-size: 35px;
    font-weight: bold;
    user-select: none;
    cursor: auto;
`;

const ImageAndContent = styled.div`
    margin-left: 15px;
    padding-left: 8px;
    border: 2px solid gray;
    width: 245px;
    background-color: ${({markedForDeletion}) =>
        markedForDeletion ? "#6C2828" : "none"};
`;

const TextComponent = styled.div`
    width: 77%;
    margin-left: 5px;
`;

const CategoryNameComponent = styled.div`
    color: ${({highlight}) => (highlight ? "yellow" : "none")};
    pointer-events: none;
    font-size: 16px;
    font-weight: bold;
    user-select: none;
    cursor: auto;
    &:hover {
        cursor: auto;
    }
`;

const CategoryDescriptionComponent = styled.div`
    color: ${({highlight}) => (highlight ? "yellow" : "none")};
    pointer-events: none;
    font-size: 16px;
    width: 120%;
    user-select: none;
    cursor: auto;
    &:hover {
        cursor: auto;
    }
`;

const EditionButtonsComponent = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
`;

const EditButton = styled(Button)`
    margin-top: 5px;
    width: 60px;
    height: 30px;
    margin-left: 80px;
`;

const DeleteButton = styled(Button)`
    margin-top: 5px;
    width: 60px;
    height: 30px;
    margin-right: auto;
`;

const SortButton = styled(Button)`
    margin-top: 5px;
    width: 50px;
    height: 30px;
    margin-right: 7px;
`;

const DeletionLegend = styled.div`
    width: 100%;
    margin-top: 5px;
    margin-left: 20px;
    user-select: none;
`;

const ParagraphText = styled.div``;

const EditButtons = styled.div``;

export function CompShowCategoryInList({categoryIndex}) {
    const menu = useSelector(getRestaurantMenu);
    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);

    const {appNavigate} = useNavigation();
    const reduxStateDispatch = useDispatch();

    const [data, setData] = useState({
        currentValue: "",
        name: "",
        description: "",
        image: global.noValue,
        markedForDeletion: false,
        hasBeenModified: false,
        showImages: false,
    });
    const {environmentOptionItemsState} = useContext(
        EnvironmentOptionItemsContext
    );
    const [proceed, setProceed] = useState(false);

    function clickedCategory(categoryIndex) {
        appNavigate(
            `${global.dishesPath}/${menu.restaurant.id}/${categoryIndex}`
        );
    }

    function handleEditButtonClick(categoryIndex) {
        appNavigate(global.DialogCategoryPath, {
            state: {categoryIndex},
        });
    }

    async function handleSortButtonClick(categoryIndex) {
        let currentSortList = globalState.sortElementsListHead;

        let newCategoryViewOrderValue =
            currentSortList.getTheGreatestCategoryViewOrderValue() ===
            global.noValue
                ? 1
                : currentSortList.getTheGreatestCategoryViewOrderValue() + 1;
        try {
            const result = await setCategoryPrivateViewOrderValueApi(
                menu.restaurant.id,
                menu.categories[categoryIndex].category.id,
                newCategoryViewOrderValue,
                menu.restaurant.currently_logged_in,
                menu.restaurant.logged_in_user_random_number
            );
            if (checkResponseStatus(result.status)) {
                currentSortList.setCategoryOrderValue(
                    menu.categories[categoryIndex].category.id,
                    newCategoryViewOrderValue
                );
                globalStateDispatch({
                    type: globalStateContextActions.setNotifyOfAChangeMade,
                });
            }

            reduxStateDispatch(
                changeCategoryPrivateViewOrderValue({
                    categoryId: menu.categories[categoryIndex].category.id,
                    viewOrder: newCategoryViewOrderValue,
                })
            );
            reduxStateDispatch(resetStateChange());
        } catch (error) {
            toastError(global.connectionErrorOrUserCanNotPerformOperations);
        }
    }

    async function handleDeleteButtonClick(categoryIndex) {
        let result = {status: 300, hasRevisions: false};
        let actualStateForDeletion =
            menu.categories[categoryIndex].category.marked_for_deletion;

        if (!actualStateForDeletion) {
            result = await checkForCategoryDishesRevisionsApi(
                menu.categories[categoryIndex].category.id
            );
        }
        if (checkResponseStatus(result.status)) {
            if (result.hasRevisions)
                toastModalInfo(global.categoryDeletionWarning);
        }
        try {
            if (global.accessBackend) {
                await categorySwitchMarkForDeletionApi(
                    menu.restaurant.id,
                    menu.categories[categoryIndex].category.id,
                    actualStateForDeletion,
                    menu.restaurant.currently_logged_in,
                    menu.restaurant.logged_in_user_random_number
                );
            }
            if (actualStateForDeletion) {
                globalStateDispatch({
                    type: globalStateContextActions.setNewChangeMade,
                    payload: `${global.unmarkedTheCategoryAsDeleted}: ${menu.categories[categoryIndex].category.private_name}`,
                });
            } else {
                globalStateDispatch({
                    type: globalStateContextActions.setNewChangeMade,
                    payload: `${global.markedTheCategoryAsDeleted}: ${menu.categories[categoryIndex].category.private_name}`,
                });
            }
            reduxStateDispatch(
                changeCategoryMarkedForDeletion({
                    categoryId: menu.categories[categoryIndex].category.id,
                    markedForDeletion: !actualStateForDeletion,
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

    useEffect(() => {
        if (
            environmentOptionItemsState.environmentOptionItems ===
            environmentOptionItems.publicEnvironment
        ) {
            setData({
                currentValue: global.notEmpty,
                name: menu.categories[categoryIndex].category.public_name,
                description:
                    menu.categories[categoryIndex].category.public_description,
                image: menu.categories[categoryIndex].category.public_image_id,
                markedForDeletion: false,
                hasBeenModified: false,
                showImages: menu.restaurant.public_show_images,
            });
        } else {
            // environment === 'private'
            setData({
                currentValue: global.notEmpty,
                name: menu.categories[categoryIndex].category.private_name,
                description:
                    menu.categories[categoryIndex].category.private_description,
                image: menu.categories[categoryIndex].category.private_image_id,
                markedForDeletion:
                    menu.categories[categoryIndex].category.marked_for_deletion,
                hasBeenModified:
                    menu.categories[categoryIndex].category.hasBeenModified,
                showImages: menu.restaurant.public_show_images,
            });
        }
    }, [environmentOptionItemsState, menu, categoryIndex]);

    useEffect(() => {
        if (data.currentvalue !== "") {
            setProceed(true);
        }
    }, [data]);

    if (!proceed) {
        return <p>{global.waiting}</p>;
    } else
        return (
            <CategoryElementsContainer>
                <CategoryContainer>
                    <ImageAndContent
                        markedForDeletion={data.markedForDeletion}
                        onClick={() => {
                            clickedCategory(categoryIndex);
                        }}
                    >
                        <ImageAndButtons>
                            <OnlyImage>
                                {ShowImage(
                                    data.showImages,
                                    data.name,
                                    data.image,
                                    menu,
                                    false,
                                    200,
                                    120,
                                    global.newCategoryName,
                                    false,
                                    false,
                                    30,
                                    environmentOptionItemsState.environmentOptionItems ===
                                        environmentOptionItems.sortMenuPrivateEnvironment
                                )}
                            </OnlyImage>
                            <OnlySortButtonAndChar>
                                <div
                                    onClick={() => {
                                        clickedCategory(categoryIndex);
                                    }}
                                    style={{marginLeft: "5px"}}
                                >
                                    <TouchAppIcon />
                                </div>
                                {environmentOptionItemsState.environmentOptionItems ===
                                    environmentOptionItems.sortMenuPrivateEnvironment && (
                                    <SortButtonAndChar>
                                        <SortButton
                                            onClick={(event) => {
                                                event.stopPropagation(); // Stop event propagation
                                                handleSortButtonClick(
                                                    categoryIndex
                                                );
                                            }}
                                        >
                                            <SortByAlphaIcon />
                                        </SortButton>
                                        <SortViewOrder
                                            highlight={
                                                menu.categories[categoryIndex]
                                                    .category
                                                    .recently_created ||
                                                menu.categories[categoryIndex]
                                                    .category.has_been_modified
                                            }
                                        >
                                            {menu.categories[categoryIndex]
                                                .category.private_view_order ===
                                            null
                                                ? "__"
                                                : menu.categories[categoryIndex]
                                                      .category
                                                      .private_view_order}
                                        </SortViewOrder>
                                    </SortButtonAndChar>
                                )}
                            </OnlySortButtonAndChar>
                        </ImageAndButtons>
                        <TextComponent
                            isSort={
                                environmentOptionItemsState.environmentOptionItems ===
                                environmentOptionItems.sortMenuPrivateEnvironment
                            }
                        >
                            {data.showImages && data.name && (
                                <div>
                                    <CategoryNameComponent
                                        highlight={
                                            menu.categories[categoryIndex]
                                                .category.recently_created ||
                                            menu.categories[categoryIndex]
                                                .category.has_been_modified
                                        }
                                    >
                                        {data.name}
                                    </CategoryNameComponent>
                                </div>
                            )}
                            {data.description && (
                                <CategoryDescriptionComponent
                                    highlight={
                                        menu.categories[categoryIndex].category
                                            .recently_created ||
                                        menu.categories[categoryIndex].category
                                            .has_been_modified
                                    }
                                >
                                    {data.description
                                        .split("\n")
                                        .map((paragraph, index) => (
                                            <ParagraphText key={index}>
                                                {paragraph}
                                            </ParagraphText>
                                        ))}
                                </CategoryDescriptionComponent>
                            )}
                            {!data.description && (
                                <CategoryDescriptionComponent
                                    highlight={
                                        menu.categories[categoryIndex].category
                                            .recently_created ||
                                        menu.categories[categoryIndex].category
                                            .has_been_modified
                                    }
                                >
                                    {global.categoryDescriptionEnclosed}
                                </CategoryDescriptionComponent>
                            )}
                        </TextComponent>
                    </ImageAndContent>
                    <EditButtons>
                        {environmentOptionItemsState.environmentOptionItems ===
                            environmentOptionItems.menuPrivateEnvironment && (
                            <>
                                {data.markedForDeletion && (
                                    <DeletionLegend style={{color: "yellow"}}>
                                        <div>{global.markedForDeletion}</div>
                                    </DeletionLegend>
                                )}
                                <EditionButtonsComponent>
                                    <EditButton
                                        onClick={() =>
                                            handleEditButtonClick(categoryIndex)
                                        }
                                    >
                                        <EditIcon />
                                    </EditButton>
                                    <DeleteButton
                                        onClick={() =>
                                            handleDeleteButtonClick(
                                                categoryIndex
                                            )
                                        }
                                    >
                                        {!data.markedForDeletion ? (
                                            <DeleteIcon />
                                        ) : (
                                            <RestoreFromTrashIcon />
                                        )}
                                    </DeleteButton>
                                </EditionButtonsComponent>
                            </>
                        )}
                    </EditButtons>
                </CategoryContainer>
            </CategoryElementsContainer>
        );
}

CompShowCategoryInList.propTypes = {
    categoryIndex: PropTypes.number.isRequired, // categoryIndex should be a number and is required
};
