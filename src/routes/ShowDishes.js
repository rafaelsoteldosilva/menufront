import React, {useContext, useState} from "react";
import styled from "styled-components";
import {useNavigation} from "../contexts/navigationContext";

import {CompShowDishInList} from "../components/CompShowDishInList";

import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";

import * as global from "../globalDefinitions/globalConstants";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

import {Button} from "../globalDefinitions/globalStyles";

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
    clearAllPrivateViewOrders,
    resetStateChange,
} from "../slices/restaurantMenuSlice";
import {useEffect} from "react";
import {
    AnsweredNoButton,
    AnsweredYesButton,
    GlobalModal,
} from "../globalDefinitions/globalModal";
import {clearAllPrivateViewOrdersApi} from "../axiosCalls/axiosAPICalls";
import {checkResponseStatus} from "../utils/checkResponseStatus";
import {toastError} from "../utils/toastMessages";

const DishesContainer = styled.div`
    display: flex;
    width: 90%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
`;

const EachDish = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 260px;
    margin-left: 40px;
`;

const SeparatorLine = styled.div`
    margin-top: 10px;
    margin-bottom: 20px;
    border-top: 1px solid yellow;
    width: 30%;
    margin-left: 105px;
`;

const ScreenName = styled.div`
    margin-top: ${({privateEnvironment}) =>
        privateEnvironment ? "165px" : "85px"};
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    user-select: none;
    margin-left: 5px;
`;

const AddButton = styled(Button)`
    width: 60px;
    height: 30px;
    margin-left: 5px;
`;

// good

export default function ShowDishes() {
    const reduxStateDispatch = useDispatch();

    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);
    const {appNavigate} = useNavigation();
    const [showModal, setShowModal] = useState(false);

    const menu = useSelector(getRestaurantMenu);
    const {categoryIndex} = useParams();

    const {environmentOptionItemsState, environmentOptionItemsStateDispatch} =
        useContext(EnvironmentOptionItemsContext);

    const [myMenu, setMyMenu] = useState([]);

    useEffect(() => {
        if (
            environmentOptionItemsState.environmentOptionItems ===
            environmentOptionItems.sortMenuPrivateEnvironment
        )
            if (globalState.doYouWantToDeleteAllSortings) {
                setShowModal(true);
            } else setShowModal(false);
    }, [
        environmentOptionItemsState.environmentOptionItems,
        globalState.doYouWantToDeleteAllSortings,
    ]);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setLastSignificantPathVisited,
            payload: global.dishesPath,
        });
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
        globalStateDispatch,
        menu.restaurant.currently_logged_in,
    ]);

    useEffect(() => {
        setMyMenu(menu);
    }, [menu]);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.dishesPath,
        });
    });

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentCategoryIndex,
            payload: categoryIndex,
        });
    }, [categoryIndex, globalStateDispatch]);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentlyWatching,
            payload: global.dishes,
        });
    }, [globalStateDispatch]);

    useEffect(() => {
        if (
            environmentOptionItemsState.environmentOptionItems ===
            environmentOptionItems.sortMenuPrivateEnvironment
        ) {
            environmentOptionItemsStateDispatch({
                type: environmentOptionItemsContextActions.changeMenuItemName,
                payload: {
                    itemOriginalTitle: global.clearTheseSortingsOptionTitle,
                    newName: global.clearTheseDishesSortingOptionTitle,
                },
            });
        }
    }, [
        environmentOptionItemsState.environmentOptionItems,
        environmentOptionItemsStateDispatch,
    ]);

    function showThisDish(itIsPublic, dishRecentlyCreated) {
        if (itIsPublic) {
            if (dishRecentlyCreated) {
                return false;
            } else return true;
        } else {
            return true;
        }
    }

    async function AddDish() {
        const dishIndex = global.noValue;
        appNavigate(global.DialogDishPath, {
            state: {categoryIndex, dishIndex},
        });
    }

    async function handleYesResponse() {
        setShowModal(false);
        globalStateDispatch({
            type: globalStateContextActions.clearDoYouWantToDeleteAllSortings,
        });
        try {
            let result = {
                status: 300,
                error: "",
                message: "Bienvenido",
            };
            if (global.accessBackend) {
                result = await clearAllPrivateViewOrdersApi(
                    menu.restaurant.id,
                    menu.restaurant.currently_logged_in,
                    menu.restaurant.logged_in_user_random_number
                );
            }
            if (checkResponseStatus(result.status)) {
                reduxStateDispatch(clearAllPrivateViewOrders());
                reduxStateDispatch(resetStateChange());
                globalStateDispatch({
                    type: globalStateContextActions.setNotifyOfAChangeMade,
                });
            } else
                toastError(global.connectionErrorOrUserCanNotPerformOperations);
        } catch (error) {
            toastError(global.connectionErrorOrUserCanNotPerformOperations);
        }
    }

    function handleNoResponse() {
        setShowModal(false);
        globalStateDispatch({
            type: globalStateContextActions.clearDoYouWantToDeleteAllSortings,
        });
    }

    if (
        categoryIndex === undefined ||
        categoryIndex === null ||
        myMenu === undefined ||
        myMenu === null ||
        myMenu.length === 0 ||
        myMenu.categories[categoryIndex].dishes === undefined ||
        myMenu.categories[categoryIndex].dishes === null
    ) {
        return (
            <div
                style={{
                    marginTop: "200px",
                    marginLeft: "60px",
                    fontSize: "32px",
                    userSelect: "none",
                }}
            >
                {global.noDishesToShow}
            </div>
        );
    } else {
        if (
            environmentOptionItemsState.environmentOptionItems ===
                environmentOptionItems.publicEnvironment &&
            myMenu.categories[categoryIndex].dishes.length === 0
        ) {
            return (
                <div
                    style={{
                        marginTop: "200px",
                        marginLeft: "80px",
                        fontSize: "32px",
                        userSelect: "none",
                    }}
                >
                    {global.noDishesToShow}
                </div>
            );
        } else {
            return (
                <div>
                    <GlobalModal show={showModal}>
                        <div style={{fontWeight: "bold", color: "black"}}>
                            {globalState.doYouWantToDeleteAllSortings
                                ? global.areYouSuretoDeleteAllSortings
                                : null}
                        </div>
                        <AnsweredYesButton
                            onClick={() => {
                                handleYesResponse();
                            }}
                        >
                            <div style={{fontWeight: "bold"}}>{global.yes}</div>
                        </AnsweredYesButton>
                        <AnsweredNoButton
                            onClick={() => {
                                handleNoResponse();
                            }}
                        >
                            <div style={{fontWeight: "bold"}}>{global.no}</div>
                        </AnsweredNoButton>
                    </GlobalModal>
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                        }}
                    >
                        <div
                            style={{
                                width: "80%",
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
                                    <div>
                                        {environmentOptionItemsState.environmentOptionItems ===
                                        environmentOptionItems.sortMenuPrivateEnvironment
                                            ? global.sortingMenu
                                            : null}
                                    </div>
                                    <div>
                                        {environmentOptionItemsState.environmentOptionItems ===
                                        environmentOptionItems.menuPrivateEnvironment
                                            ? global.editingMenu
                                            : null}
                                    </div>
                                    <div>{global.showingDishes}</div>
                                    <div>
                                        {
                                            menu.categories[categoryIndex]
                                                .category.public_name
                                        }
                                    </div>
                                </div>
                                <div style={{width: "100%", color: "yellow"}}>
                                    {globalState.notifyOfAChangeMade && (
                                        <div>
                                            {global.thisInfoHasNotBeenPublished}
                                        </div>
                                    )}
                                </div>
                            </ScreenName>
                            {environmentOptionItemsState.environmentOptionItems ===
                                environmentOptionItems.menuPrivateEnvironment && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                    }}
                                >
                                    <AddButton onClick={AddDish}>
                                        <LibraryAddIcon />
                                    </AddButton>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            userSelect: "none",
                                        }}
                                    >
                                        {global.newDishInCategoryText}{" "}
                                        {
                                            myMenu.categories[categoryIndex]
                                                .category.private_name
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                        <DishesContainer>
                            {myMenu.categories[categoryIndex].dishes.length !==
                                0 &&
                                myMenu.categories[categoryIndex].dishes.map(
                                    (dish, index) => {
                                        if (
                                            showThisDish(
                                                environmentOptionItemsState.environmentOptionItems ===
                                                    environmentOptionItems.publicEnvironment,
                                                dish.dish.recently_created
                                            )
                                        )
                                            return (
                                                <EachDish key={index}>
                                                    <CompShowDishInList
                                                        key={index}
                                                        restaurantId={
                                                            menu.restaurant.id
                                                        }
                                                        categoryIndex={
                                                            categoryIndex
                                                        }
                                                        dishIndex={index}
                                                    />
                                                    <SeparatorLine />
                                                </EachDish>
                                            );
                                        else return null;
                                    }
                                )}
                        </DishesContainer>
                    </div>
                </div>
            );
        }
    }
}
