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

import {globalThemePublic} from "../globalDefinitions/globalStyles";

import {
    checkForDishRevisionsApi,
    dishSwitchMarkForDeletionApi,
    setDishPrivateViewOrderValueApi,
} from "../axiosCalls/axiosAPICalls";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";
import {
    EnvironmentOptionItemsContext,
    environmentOptionItems,
} from "../contexts/environmentOptionItemsContext";
import {
    getRestaurantMenu,
    resetStateChange,
    changeDishMarkedForDeletion,
    changeDishPrivateViewOrderValue,
} from "../slices/restaurantMenuSlice";
import * as global from "../globalDefinitions/globalConstants";
import {useState} from "react";

import {toastError, toastModalInfo} from "../utils/toastMessages";

import {checkResponseStatus} from "../utils/checkResponseStatus";
import {ShowImage} from "../utils/ImageFunctions";
import CompShowReviewsAverage from "./CompShowReviewsAverage";

import {CurrencyFormatter} from "../utils/severalFunctions";

const DishElementsContainer = styled.div`
    width: 100%;
    margin-bottom: 0.7em;
    user-select: none;
`;

const DishContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    & > div:hover {
        filter: brightness(70%);
    }
    & > div:active {
        transform: ${({isSort}) => (isSort ? null : "translateY(4px)")};
    }
`;

const ImageAndButtons = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

const OnlyImage = styled.div`
    user-select: none;
    pointer-events: none;
`;

const ImageAndContent = styled.div`
    margin-left: 15px;
    border: 2px solid gray;
    width: 265px;
    background-color: ${({markedForDeletion}) =>
        markedForDeletion ? "#6C2828" : "none"};
`;

const SortButtonAndChar = styled.div`
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;

const SortViewOrder = styled.p`
    color: ${({highlight}) => (highlight ? "yellow" : "none")};
    font-size: 35px;
    font-weight: bold;
`;

const TextComponent = styled.div`
    width: 90%;
    margin-left: 10px;
    margin-top: 3px;
`;

const ReviewComponent = styled.div`
    color: ${({highlight}) => (highlight ? "yellow" : "none")};
    // filter: blur(5px);
`;

const DishNameComponent = styled.div`
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

const DishDescriptionComponent = styled.div`
    color: ${({highlight}) => (highlight ? "yellow" : "none")};
    width: 100%;
    pointer-events: none;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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

const EditButtons = styled.div``;

const EditButton = styled(Button)`
    margin-top: 5px;
    margin-left: 80px;
    width: 60px;
    height: 30px;
`;

const DeleteButton = styled(Button)`
    margin-top: 5px;
    margin-right: auto;
    width: 60px;
    height: 30px;
`;

const SortButton = styled(Button)`
    margin-top: 5px;
    margin-right: auto;
    width: 60px;
    height: 30px;
`;

const DeletionLegend = styled.div`
    width: 100%;
    margin-top: 5px;
    margin-left: 20px;
    user-select: none;
`;

export function CompShowDishInList({restaurantId, categoryIndex, dishIndex}) {
    const menu = useSelector(getRestaurantMenu);
    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);
    const {appNavigate} = useNavigation();
    const reduxStateDispatch = useDispatch();

    const [data, setData] = useState({
        currentValue: "",
        name: "",
        description: "",
        image: global.noValue,
        price: "",
        markedForDeletion: false,
        markedForDeletionByParent: false,
        showImages: false,
    });
    const {environmentOptionItemsState} = useContext(
        EnvironmentOptionItemsContext
    );
    const [proceed, setProceed] = useState(false);

    function clickedDish(restaurantId, categoryIndex, dishIndex) {
        let proceed = true;

        if (
            environmentOptionItemsState.environmentOptionItems ===
            environmentOptionItems.sortMenuPrivateEnvironment
        ) {
            proceed = false;
        }
        if (proceed)
            appNavigate(
                `${global.dishPath}/${restaurantId}/${categoryIndex}/${dishIndex}`
            );
    }

    function handleEditButtonClick(categoryIndex, dishIndex) {
        appNavigate(global.DialogDishPath, {
            state: {categoryIndex, dishIndex},
        });
    }

    async function handleSortButtonClick(categoryIndex, dishIndex) {
        let currentSortList = globalState.sortElementsListHead;

        let newDishViewOrderValue =
            currentSortList.getTheGreatestDishViewOrderValueFromACategory(
                menu.categories[categoryIndex].category.id
            );

        newDishViewOrderValue =
            newDishViewOrderValue === global.noValue
                ? 1
                : newDishViewOrderValue + 1;

        try {
            const result = await setDishPrivateViewOrderValueApi(
                menu.restaurant.id,
                menu.categories[categoryIndex].category.id,
                menu.categories[categoryIndex].dishes[dishIndex].dish.id,
                newDishViewOrderValue,
                menu.restaurant.currently_logged_in,
                menu.restaurant.logged_in_user_random_number
            );
            if (checkResponseStatus(result.status)) {
                currentSortList.setDishOrderValue(
                    menu.categories[categoryIndex].category.id,
                    menu.categories[categoryIndex].dishes[dishIndex].dish.id,
                    newDishViewOrderValue
                );
            }

            reduxStateDispatch(
                changeDishPrivateViewOrderValue({
                    categoryId: menu.categories[categoryIndex].category.id,
                    dishId: menu.categories[categoryIndex].dishes[dishIndex]
                        .dish.id,
                    viewOrder: newDishViewOrderValue,
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

    async function handleDeleteButtonClick(categoryIndex, dishIndex) {
        let result = {status: 300, hasRevisions: false};
        let actualStateForDeletion =
            menu.categories[categoryIndex].dishes[dishIndex].dish
                .marked_for_deletion;

        if (!actualStateForDeletion) {
            result = await checkForDishRevisionsApi(
                menu.categories[categoryIndex].dishes[dishIndex].dish.id
            );
        }
        if (checkResponseStatus(result.status)) {
            if (result.hasRevisions) toastModalInfo(global.dishDeletionWarning);
        }

        try {
            if (global.accessBackend) {
                await dishSwitchMarkForDeletionApi(
                    menu.restaurant.id,
                    menu.categories[categoryIndex].category.id,
                    menu.categories[categoryIndex].dishes[dishIndex].dish.id,
                    actualStateForDeletion,
                    menu.restaurant.currently_logged_in,
                    menu.restaurant.logged_in_user_random_number
                );
            }
            if (actualStateForDeletion) {
                globalStateDispatch({
                    type: globalStateContextActions.setNewChangeMade,
                    payload: `${global.unmarkedTheDishAsDeleted}: ${menu.categories[categoryIndex].dishes[dishIndex].dish.private_name}`,
                });
            } else {
                globalStateDispatch({
                    type: globalStateContextActions.setNewChangeMade,
                    payload: `${global.markedTheDishAsDeleted}: ${menu.categories[categoryIndex].dishes[dishIndex].dish.private_name}`,
                });
            }
            reduxStateDispatch(
                changeDishMarkedForDeletion({
                    categoryId: menu.categories[categoryIndex].category.id,
                    dishId: menu.categories[categoryIndex].dishes[dishIndex]
                        .dish.id,
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
                // environment === 'public'
                currentValue: global.notEmpty,
                name: menu.categories[categoryIndex].dishes[dishIndex].dish
                    .public_name,
                description:
                    menu.categories[categoryIndex].dishes[dishIndex].dish
                        .public_description,
                image: menu.categories[categoryIndex].dishes[dishIndex].dish
                    .public_image_id,
                price: menu.categories[categoryIndex].dishes[dishIndex].dish
                    .public_price,
                markedForDeletion: false,
                markedForDeletionByParent: false,
                showImages: menu.restaurant.public_show_images,
                showPrices: menu.restaurant.public_show_prices,
                currencySymbol: menu.restaurant.public_country.currency_symbol,
            });
        } else {
            setData({
                // environment === 'private'
                currentValue: global.notEmpty,
                name: menu.categories[categoryIndex].dishes[dishIndex].dish
                    .private_name,
                description:
                    menu.categories[categoryIndex].dishes[dishIndex].dish
                        .private_description,
                image: menu.categories[categoryIndex].dishes[dishIndex].dish
                    .private_image_id,
                price: menu.categories[categoryIndex].dishes[dishIndex].dish
                    .private_price,
                markedForDeletion:
                    menu.categories[categoryIndex].dishes[dishIndex].dish
                        .marked_for_deletion,
                markedForDeletionByParent:
                    menu.categories[categoryIndex].dishes[dishIndex].dish
                        .marked_for_deletion_by_parent,
                showImages: menu.restaurant.public_show_images,
                showPrices: menu.restaurant.public_show_prices,
                currencySymbol: menu.restaurant.public_country.currency_symbol,
            });
        }
    }, [environmentOptionItemsState, menu, categoryIndex, dishIndex]);

    useEffect(() => {
        if (data.currentValue.length !== 0) {
            setProceed(true);
        }
    }, [data]);

    if (!proceed) {
        return <p>{global.waiting}</p>;
    } else
        return (
            <DishElementsContainer>
                <DishContainer
                    isSort={
                        environmentOptionItemsState.environmentOptionItems ===
                        environmentOptionItems.sortMenuPrivateEnvironment
                    }
                >
                    <ImageAndContent
                        markedForDeletion={
                            data.markedForDeletion ||
                            data.markedForDeletionByParent
                        }
                        onClick={() => {
                            clickedDish(restaurantId, categoryIndex, dishIndex);
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
                                    205,
                                    120,
                                    global.newDishName,
                                    false,
                                    false,
                                    30,
                                    environmentOptionItemsState.environmentOptionItems ===
                                        environmentOptionItems.sortMenuPrivateEnvironment
                                )}
                            </OnlyImage>

                            <SortButtonAndChar>
                                {environmentOptionItemsState.environmentOptionItems ===
                                    environmentOptionItems.sortMenuPrivateEnvironment && (
                                    <SortButtonAndChar>
                                        <SortButton
                                            onClick={() => {
                                                handleSortButtonClick(
                                                    categoryIndex,
                                                    dishIndex
                                                );
                                            }}
                                        >
                                            <SortByAlphaIcon />
                                        </SortButton>
                                        <SortViewOrder
                                            highlight={
                                                menu.categories[categoryIndex]
                                                    .dishes[dishIndex].dish
                                                    .recently_created ||
                                                menu.categories[categoryIndex]
                                                    .dishes[dishIndex].dish
                                                    .has_been_modified
                                            }
                                        >
                                            {menu.categories[categoryIndex]
                                                .dishes[dishIndex].dish
                                                .private_view_order === null
                                                ? "__"
                                                : menu.categories[categoryIndex]
                                                      .dishes[dishIndex].dish
                                                      .private_view_order}
                                        </SortViewOrder>
                                    </SortButtonAndChar>
                                )}
                            </SortButtonAndChar>
                            {environmentOptionItemsState.environmentOptionItems !==
                                environmentOptionItems.sortMenuPrivateEnvironment && (
                                <TouchAppIcon
                                    onClick={() => {
                                        clickedDish(
                                            restaurantId,
                                            categoryIndex,
                                            dishIndex
                                        );
                                    }}
                                />
                            )}
                        </ImageAndButtons>

                        <TextComponent>
                            <DishNameComponent
                                majorFunction={
                                    environmentOptionItemsState.environmentOptionItems
                                }
                                highlight={
                                    menu.categories[categoryIndex].dishes[
                                        dishIndex
                                    ].dish.recently_created ||
                                    menu.categories[categoryIndex].dishes[
                                        dishIndex
                                    ].dish.has_been_modified
                                }
                            >
                                {data.showImages && data.name && data.name}
                            </DishNameComponent>
                            {menu.restaurant.price_type ===
                                global.fullPrice && (
                                <ReviewComponent
                                    highlight={
                                        menu.categories[categoryIndex].dishes[
                                            dishIndex
                                        ].dish.recently_created ||
                                        menu.categories[categoryIndex].dishes[
                                            dishIndex
                                        ].dish.has_been_modified
                                    }
                                >
                                    {menu.restaurant
                                        .public_show_dishes_reviews && (
                                        <div>
                                            <CompShowReviewsAverage
                                                isDish={false}
                                                isRestaurant={false}
                                                isDishes={true}
                                                categoryIndex={categoryIndex}
                                                dishIndex={dishIndex}
                                            />
                                        </div>
                                    )}
                                </ReviewComponent>
                            )}
                            <DishDescriptionComponent
                                majorFunction={
                                    environmentOptionItemsState.environmentOptionItems
                                }
                                highlight={
                                    menu.categories[categoryIndex].dishes[
                                        dishIndex
                                    ].dish.recently_created ||
                                    menu.categories[categoryIndex].dishes[
                                        dishIndex
                                    ].dish.has_been_modified
                                }
                            >
                                {data.description && data.description}
                            </DishDescriptionComponent>
                            <DishDescriptionComponent
                                majorFunction={
                                    environmentOptionItemsState.environmentOptionItems
                                }
                                highlight={
                                    menu.categories[categoryIndex].dishes[
                                        dishIndex
                                    ].dish.recently_created ||
                                    menu.categories[categoryIndex].dishes[
                                        dishIndex
                                    ].dish.has_been_modified
                                }
                            >
                                {!data.description &&
                                    global.dishDescriptionEnclosed}
                            </DishDescriptionComponent>
                            <div style={{userSelect: "none", cursor: "auto"}}>
                                {data.showPrices && (
                                    <CurrencyFormatter
                                        value={data.price}
                                        style={{
                                            fontFamily: "Arial, 'Sans Serif'",
                                            color: globalThemePublic.priceColor,
                                            fontWeight: "bold",
                                        }}
                                        currencySymbol={
                                            menu.restaurant.public_country
                                                .currency_symbol
                                        }
                                        locale={
                                            menu.restaurant.public_country
                                                .locale
                                        }
                                        minFrac={
                                            menu.restaurant.public_country
                                                .minimum_fraction_digits
                                        }
                                        maxFrac={
                                            menu.restaurant.public_country
                                                .maximum_fraction_digits
                                        }
                                    />
                                )}
                            </div>
                        </TextComponent>
                    </ImageAndContent>
                    <EditButtons>
                        {environmentOptionItemsState.environmentOptionItems ===
                            environmentOptionItems.menuPrivateEnvironment && (
                            <div>
                                <div>
                                    {data.markedForDeletionByParent && (
                                        <DeletionLegend>
                                            <div style={{color: "yellow"}}>
                                                {
                                                    global.markedForDeletionByParent
                                                }
                                            </div>
                                        </DeletionLegend>
                                    )}
                                    {data.markedForDeletion &&
                                        !data.markedForDeletionByParent && (
                                            <DeletionLegend>
                                                <div style={{color: "yellow"}}>
                                                    {global.markedForDeletion}
                                                </div>
                                            </DeletionLegend>
                                        )}
                                </div>
                                <EditionButtonsComponent>
                                    <EditButton
                                        onClick={() =>
                                            handleEditButtonClick(
                                                categoryIndex,
                                                dishIndex
                                            )
                                        }
                                    >
                                        <EditIcon />
                                    </EditButton>
                                    <DeleteButton
                                        disabled={
                                            data.markedForDeletionByParent
                                        }
                                        onClick={() =>
                                            handleDeleteButtonClick(
                                                categoryIndex,
                                                dishIndex
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
                            </div>
                        )}
                    </EditButtons>
                </DishContainer>
            </DishElementsContainer>
        );
}

CompShowDishInList.propTypes = {
    restaurantId: PropTypes.string.isRequired, // restaurantId should be a string and is required
    categoryIndex: PropTypes.number.isRequired, // categoryIndex should be a number and is required
    dishIndex: PropTypes.number.isRequired, // dishIndex should be a number and is required
};
