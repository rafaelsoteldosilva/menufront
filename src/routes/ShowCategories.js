import React, {useEffect, useContext, useState} from "react";
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
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {
    getRestaurantMenu,
    clearAllPrivateViewOrders,
    resetStateChange,
} from "../slices/restaurantMenuSlice";
import {CompShowCategoryInList} from "../components/CompShowCategoryInList";

import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

import {useNavigation} from "../contexts/navigationContext";

import {Button} from "../globalDefinitions/globalStyles";
import {
    AnsweredNoButton,
    AnsweredYesButton,
    GlobalModal,
} from "../globalDefinitions/globalModal";
import {clearAllPrivateViewOrdersApi} from "../axiosCalls/axiosAPICalls";
import {checkResponseStatus} from "../utils/checkResponseStatus";
import {toastError} from "../utils/toastMessages";

const CategoriesContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`;

const EachCategory = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 250px;
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
        privateEnvironment ? "160px" : "80px"};
    margin-bottom: 19px;
    display: flex;
    flex-direction: column;
    user-select: none;
`;

const AddButton = styled(Button)`
    width: 60px;
    height: 30px;
    margin-left: 5px;
`;

// good

export default function ShowCategories() {
    const reduxStateDispatch = useDispatch();

    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);
    const {environmentOptionItemsState, environmentOptionItemsStateDispatch} =
        useContext(EnvironmentOptionItemsContext);
    const {appNavigate} = useNavigation();

    const menu = useSelector(getRestaurantMenu);

    const [showModal, setShowModal] = useState(false);

    const [proceed, setProceed] = useState(false);

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
            payload: global.categoriesPath,
        });
    }, [globalStateDispatch]);

    useEffect(() => {
        if (menu !== undefined && menu !== null) {
            setProceed(true);
        }
    }, [menu]);

    function showThisCategory(itIsPublic, categoryRecentlyCreated) {
        if (itIsPublic) {
            if (categoryRecentlyCreated) {
                return false;
            } else return true;
        } else {
            return true;
        }
    }

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentlyWatching,
            payload: global.categories,
        });
    }, [globalStateDispatch]);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.categoriesPath,
        });
    });

    useEffect(() => {
        if (
            environmentOptionItemsState.environmentOptionItems ===
            environmentOptionItems.sortMenuPrivateEnvironment
        ) {
            environmentOptionItemsStateDispatch({
                type: environmentOptionItemsContextActions.changeMenuItemName,
                payload: {
                    itemOriginalTitle: global.clearTheseSortingsOptionTitle,
                    newName: global.clearCategoriesSortingOptionTitle,
                },
            });
        }
    }, [
        environmentOptionItemsState.environmentOptionItems,
        environmentOptionItemsStateDispatch,
    ]);

    async function AddCategory() {
        const categoryIndex = global.noValue;
        appNavigate(global.DialogCategoryPath, {
            state: {categoryIndex},
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

    if (!proceed) {
        return (
            <div
                style={{
                    marginTop: "200px",
                    marginLeft: "80px",
                    fontSize: "32px",
                    userSelect: "none",
                }}
            >
                {global.noData}
            </div>
        );
    } else {
        if (
            environmentOptionItemsState.environmentOptionItems ===
                environmentOptionItems.publicEnvironment &&
            menu.categories.length === 0
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
                    {global.noCategoriesToShow}
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
                                width: "90%",
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
                                <div style={{padding: "5px"}}>
                                    {environmentOptionItemsState.environmentOptionItems ===
                                    environmentOptionItems.sortMenuPrivateEnvironment
                                        ? global.sortingMenu
                                        : null}
                                </div>
                                <div style={{padding: "5px"}}>
                                    {environmentOptionItemsState.environmentOptionItems ===
                                    environmentOptionItems.menuPrivateEnvironment
                                        ? global.editingMenu
                                        : null}
                                </div>
                                <div style={{padding: "5px"}}>
                                    <div>{global.showingCategories}</div>
                                </div>
                                <div style={{padding: "5px"}}>
                                    {globalState.notifyOfAChangeMade && (
                                        <div
                                            style={{
                                                width: "150%",
                                                color: "yellow",
                                            }}
                                        >
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
                                    <AddButton onClick={AddCategory}>
                                        <LibraryAddIcon />
                                    </AddButton>
                                    <div
                                        style={{
                                            userSelect: "none",
                                            marginTop: "-3px",
                                        }}
                                    >
                                        {global.newCategoryText}
                                    </div>
                                </div>
                            )}
                        </div>
                        <CategoriesContainer>
                            {menu.categories.length !== 0 &&
                                menu.categories.map((category, index) => {
                                    if (
                                        showThisCategory(
                                            environmentOptionItemsState.environmentOptionItems ===
                                                environmentOptionItems.publicEnvironment,
                                            category.category.recently_created
                                        )
                                    ) {
                                        return (
                                            <EachCategory key={index}>
                                                <CompShowCategoryInList
                                                    key={index}
                                                    categoryIndex={index}
                                                />
                                                <SeparatorLine />
                                            </EachCategory>
                                        );
                                    } else return null;
                                })}
                        </CategoriesContainer>
                    </div>
                </div>
            );
        }
    }
}
