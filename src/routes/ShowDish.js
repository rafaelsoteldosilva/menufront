import React, {useEffect, useState, useContext} from "react";

import styled from "styled-components";
import {useParams} from "react-router-dom";
import {useNavigation} from "../contexts/navigationContext";

import {useDispatch, useSelector} from "react-redux";
import * as global from "../globalDefinitions/globalConstants";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";
import {
    EnvironmentOptionItemsContext,
    environmentOptionItemsContextActions,
    environmentOptionItems,
} from "../contexts/environmentOptionItemsContext";

import {
    getRestaurantMenu,
    resetStateChange,
    changeDishMarkedForDeletion,
} from "../slices/restaurantMenuSlice";

import {CompShowReviewAndShareButtons} from "../components/CompShowReviewAndShareButtons";
import CompShowReviewsAverage from "../components/CompShowReviewsAverage";
import {Button, globalThemePublic} from "../globalDefinitions/globalStyles";

import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import {toastError, toastModalInfo} from "../utils/toastMessages";
import {ShowImage} from "../utils/ImageFunctions";

import {CurrencyFormatter} from "../utils/severalFunctions";
import {
    checkForDishRevisionsApi,
    dishSwitchMarkForDeletionApi,
} from "../axiosCalls/axiosAPICalls";
import {checkResponseStatus} from "../utils/checkResponseStatus";

const DishContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 120%;
    margin-left: 55px;
    user-select: none;
`;

const WholeItem = styled.div`
    background-color: ${({markedForDeletion}) =>
        markedForDeletion ? "#6C2828" : "none"};
    width: 90%;
`;

const DishName = styled.div`
    color: ${({highlight}) => (highlight ? "yellow" : "none")};
    margin: 0.5em;
    user-select: none;
    font-size: 22px;
`;

const ParagraphText = styled.div`
    color: ${({highlight}) => (highlight ? "yellow" : "none")};
    margin-top: 10px;
    margin-bottom: 0;
`;

const DishPrice = styled.div`
    color: ${({highlight}) => (highlight ? "yellow" : "none")};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    user-select: none;
`;

const ReviewComponent = styled.div`
    color: ${({highlight}) => (highlight ? "yellow" : "none")};
    // filter: blur(5px);
`;

const PriceTag = styled.div``;

const CurrentPrice = styled.div``;

const DishBottomComponent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 100%;
`;

const EditionButtonsComponent = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const EditButton = styled(Button)`
    width: 60px;
    height: 30px;
`;

const DeleteButton = styled(Button)`
    width: 60px;
    height: 30px;
`;

const DeviderComponent = styled.div`
    height: 1px;
    margin-top: 15px;
    margin-bottom: 15px;
    background-color: gray;
`;

const ScreenName = styled.div`
    margin-top: ${({privateEnvironment}) =>
        privateEnvironment ? "160px" : "80px"};
    user-select: none;
    margin-bottom: 5px;
`;

// good

export default function ShowDish() {
    const {appNavigate} = useNavigation();

    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);
    const {environmentOptionItemsState, environmentOptionItemsStateDispatch} =
        useContext(EnvironmentOptionItemsContext);
    const menu = useSelector(getRestaurantMenu);
    const reduxStateDispatch = useDispatch();

    const {categoryIndex, dishIndex} = useParams();

    const [data, setData] = useState({
        currentValue: "",
        name: "",
        imageId: global.noValue,
        description: "",
        price: "",
    });
    const [proceed, setProceed] = useState(false);

    useEffect(() => {
        if (
            environmentOptionItemsState.environmentOptionItems !==
                environmentOptionItems.publicEnvironment &&
            menu.restaurant.currently_logged_in === global.noValue
        ) {
            appNavigate(global.notAllowedPath);
        }
    }, [
        appNavigate,
        environmentOptionItemsState.environmentOptionItems,
        menu.restaurant.currently_logged_in,
    ]);

    function handleEditButtonClick() {
        appNavigate(global.DialogDishPath, {
            state: {categoryIndex, dishIndex},
        });
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
            if (result.hasRevisions) {
                toastModalInfo(global.dishDeletionWarning);
            }
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
            reduxStateDispatch(
                changeDishMarkedForDeletion({
                    categoryId: menu.categories[categoryIndex].category.id,
                    dishId: menu.categories[categoryIndex].dishes[dishIndex]
                        .dish.id,
                    markedForDeletion: !actualStateForDeletion,
                })
            );
            reduxStateDispatch(resetStateChange());
        } catch (error) {
            toastError(global.connectionErrorOrUserCanNotPerformOperations);
        }
    }

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setLastSignificantPathVisited,
            payload: global.dishPath,
        });
        globalStateDispatch({
            type: globalStateContextActions.setCurrentCategoryIndex,
            payload: categoryIndex,
        });
        globalStateDispatch({
            type: globalStateContextActions.setCurrentDishIndex,
            payload: dishIndex,
        });
    }, [categoryIndex, dishIndex, globalStateDispatch]);

    useEffect(() => {
        if (
            environmentOptionItemsState.environmentOptionItems ===
            environmentOptionItems.publicEnvironment
        ) {
            setData({
                currentValue: global.hasSomething,
                name: menu.categories[categoryIndex].dishes[dishIndex].dish
                    .public_name,
                imageId:
                    menu.categories[categoryIndex].dishes[dishIndex].dish
                        .public_image_id,
                description:
                    menu.categories[categoryIndex].dishes[dishIndex].dish
                        .public_description,
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
                currentValue: global.hasSomething,
                name: menu.categories[categoryIndex].dishes[dishIndex].dish
                    .private_name,
                imageId:
                    menu.categories[categoryIndex].dishes[dishIndex].dish
                        .private_image_id,
                description:
                    menu.categories[categoryIndex].dishes[dishIndex].dish
                        .private_description,
                price: menu.categories[categoryIndex].dishes[dishIndex].dish
                    .private_price,
                markedForDeletion:
                    menu.categories[categoryIndex].dishes[dishIndex].dish
                        .marked_for_deletion,
                markedForDeletionByParent:
                    menu.categories[categoryIndex].dishes[dishIndex].dish
                        .marked_for_deletion_by_parent,
                showImages: menu.restaurant.public_show_images,
                showPrices: menu.restaurant.private_show_prices,
                currencySymbol: menu.restaurant.public_country.currency_symbol,
            });
            // marked_for_deletion_by_parent has to also affect its appearance
        }
    }, [environmentOptionItemsState, menu, categoryIndex, dishIndex]);

    useEffect(() => {
        if (data.currentValue.length !== 0) {
            setProceed(true);
        }
    }, [data]);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentlyWatching,
            payload: global.dish,
        });
    }, [globalStateDispatch]);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.dishPath,
        });
    });

    useEffect(() => {
        if (
            environmentOptionItemsState.environmentOptionItems ===
            environmentOptionItems.menuPrivateEnvironment
        ) {
            environmentOptionItemsStateDispatch({
                type: environmentOptionItemsContextActions.changeMenuItemName,
                payload: {
                    itemOriginalTitle: global.createOptionTitle,
                    newName: global.createDishItem,
                },
            });
        }
    }, [
        environmentOptionItemsState.environmentOptionItems,
        environmentOptionItemsStateDispatch,
    ]);

    if (!proceed) {
        return <p>{global.waiting}</p>;
    } else
        return (
            <DishContainer>
                <div
                    style={{
                        width: "68%",
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
                        <div
                            style={{
                                padding: "5px",
                            }}
                        >
                            <div>
                                {global.showingDish}{" "}
                                {
                                    menu.categories[categoryIndex].dishes[
                                        dishIndex
                                    ].dish.public_name
                                }
                            </div>
                            <div>
                                {
                                    menu.categories[categoryIndex].category
                                        .public_name
                                }
                            </div>
                            {globalState.notifyOfAChangeMade &&
                            environmentOptionItemsState.environmentOptionItems !==
                                environmentOptionItems.publicEnvironment ? (
                                <div
                                    style={{
                                        width: "100%",
                                        color: "yellow",
                                    }}
                                >
                                    {global.thisInfoHasNotBeenPublished}
                                </div>
                            ) : null}
                        </div>
                    </ScreenName>
                </div>
                <WholeItem
                    markedForDeletion={
                        data.markedForDeletion || data.markedForDeletionByParent
                    }
                >
                    {data.showImages && (
                        <DishName
                            highlight={
                                menu.categories[categoryIndex].dishes[dishIndex]
                                    .dish.recently_created ||
                                menu.categories[categoryIndex].dishes[dishIndex]
                                    .dish.has_been_modified
                            }
                        >
                            {data.name}
                        </DishName>
                    )}
                    <div
                        style={{
                            pointerEvents: "none",
                            marginTop: "15px",
                            marginLeft: "-2px",
                        }}
                    >
                        {ShowImage(
                            data.showImages,
                            data.name,
                            data.imageId,
                            menu,
                            false,
                            240,
                            135,
                            global.newDishName
                        )}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            userSelect: "none",
                            width: "90%",
                        }}
                    >
                        {data.description
                            .split("\n")
                            .map((paragraph, index) => (
                                <ParagraphText
                                    key={index}
                                    highlight={
                                        menu.categories[categoryIndex].dishes[
                                            dishIndex
                                        ].dish.recently_created ||
                                        menu.categories[categoryIndex].dishes[
                                            dishIndex
                                        ].dish.has_been_modified
                                    }
                                >
                                    {paragraph}
                                </ParagraphText>
                            ))}
                    </div>
                    <DeviderComponent />
                    <DishBottomComponent>
                        {data.showPrices && (
                            <DishPrice
                                highlight={
                                    menu.categories[categoryIndex].dishes[
                                        dishIndex
                                    ].dish.recently_created ||
                                    menu.categories[categoryIndex].dishes[
                                        dishIndex
                                    ].dish.has_been_modified
                                }
                            >
                                <PriceTag>{global.price}</PriceTag>
                                <CurrentPrice>
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
                                </CurrentPrice>
                            </DishPrice>
                        )}
                        <ReviewComponent
                            highlight={
                                menu.categories[categoryIndex].dishes[dishIndex]
                                    .dish.recently_created ||
                                menu.categories[categoryIndex].dishes[dishIndex]
                                    .dish.has_been_modified
                            }
                        >
                            {menu.restaurant.price_type ===
                                global.fullPrice && (
                                <CompShowReviewsAverage
                                    isDish={true}
                                    isRestaurant={false}
                                    isDishes={false}
                                    categoryIndex={categoryIndex}
                                    dishIndex={dishIndex}
                                />
                            )}
                        </ReviewComponent>
                        <div
                            style={{
                                marginTop: "30px",
                                fontSize: "14px",
                            }}
                        >
                            {environmentOptionItemsState.environmentOptionItems ===
                                environmentOptionItems.publicEnvironment && (
                                <CompShowReviewAndShareButtons
                                    isRestaurant={false}
                                    isDish={true}
                                    categoryIndex={categoryIndex}
                                    dishIndex={dishIndex}
                                />
                            )}
                        </div>
                        <div style={{marginTop: "15px"}}>
                            {environmentOptionItemsState.environmentOptionItems !==
                                environmentOptionItems.publicEnvironment && (
                                <div>
                                    <EditionButtonsComponent>
                                        <EditButton
                                            onClick={handleEditButtonClick}
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
                        </div>
                    </DishBottomComponent>
                </WholeItem>
                <div style={{marginTop: "10px"}}>
                    {data.markedForDeletionByParent && (
                        <div
                            style={{
                                width: "70%",
                                marginBottom: "30px",
                                marginTop: "-5px",
                                marginLeft: "23px",
                            }}
                        >
                            {global.markedForDeletionByParent}
                        </div>
                    )}
                    {data.markedForDeletion &&
                        !data.markedForDeletionByParent && (
                            <div
                                style={{
                                    width: "70%",
                                    marginBottom: "30px",
                                    marginTop: "-5px",
                                    marginLeft: "23px",
                                }}
                            >
                                {global.markedForDeletion}
                            </div>
                        )}
                </div>
            </DishContainer>
        );
}
