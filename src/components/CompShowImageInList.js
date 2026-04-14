import React, {useContext, useEffect} from "react";
import styled from "styled-components";

import DeleteIcon from "@mui/icons-material/Delete";
import ResetTvIcon from "@mui/icons-material/ResetTv";
import EditIcon from "@mui/icons-material/Edit";

import cloneDeep from "lodash/cloneDeep";

import {Button} from "../globalDefinitions/globalStyles";

import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import {deleteCloudinaryResourceAndImageApi} from "../axiosCalls/axiosAPICalls";
import {checkResponseStatus} from "../utils/checkResponseStatus";
import {
    fetchMenu,
    getRestaurantMenu,
    resetStateChange,
} from "../slices/restaurantMenuSlice";
import {toastError, toastSuccess} from "../utils/toastMessages";
import {useDispatch, useSelector} from "react-redux";

import {
    EnvironmentOptionItemsContext,
    environmentOptionItems,
} from "../contexts/environmentOptionItemsContext";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";

import * as global from "../globalDefinitions/globalConstants";
import {useNavigation} from "../contexts/navigationContext";

import {useState} from "react";
import {ShowImage} from "../utils/ImageFunctions";
import {GlobalModal} from "../globalDefinitions/globalModal";

const WholeImage = styled.div`
    display: flex;
    flex-direction: column;
    filter: ${({deleting}) => (deleting ? "blur(5px)" : "none")};
    &:active {
        transform: ${({handleImagesOptionItemsEnvironment}) =>
            handleImagesOptionItemsEnvironment ? "none" : "translateY(4px)"};
    }
`;

const ElementContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
`;

const ShowOrDeleteButton = styled(Button)`
    width: 60px;
    height: 30px;
`;

const SelectButton = styled(Button)`
    margin-top: 5px;
    width: 60px;
    height: 30px;
`;

const EditButton = styled(Button)`
    margin-top: 5px;
    width: 60px;
    height: 30px;
`;

const AnsweredYesButton = styled(Button)`
    margin-top: 5px;
    width: 60px;
    height: 30px;
`;

const AnsweredNoButton = styled(Button)`
    margin-top: 5px;
    width: 60px;
    height: 30px;
`;

function CompShowImageInList(imageObj) {
    const menu = useSelector(getRestaurantMenu);
    const {appNavigate} = useNavigation();
    const reduxStateDispatch = useDispatch();
    const {environmentOptionItemsState} = useContext(
        EnvironmentOptionItemsContext
    );
    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);
    const [objectBeingEdited, setObjectBeingEdited] = useState(null);
    const [localObjectType, setLocalObjectType] = useState("");
    const [categoryIndex, setCategoryIndex] = useState(global.noValue);
    const [dishIndex, setDishIndex] = useState(global.noValue);
    const [userIndex, setUserIndex] = useState(global.noValue);
    const [deleting, setDeleting] = useState(false);
    const [proceedDeleting, setProceedDeleting] = useState(false);
    const [showModal, setShowModal] = useState(null);

    useEffect(() => {
        if (
            globalState.featuresOfTheEditionObject &&
            globalState.featuresOfTheEditionObject.objectAdded
        ) {
            switch (globalState.featuresOfTheEditionObject.objectType) {
                case global.categories: {
                    setObjectBeingEdited(globalState.editionObject);
                    setCategoryIndex(globalState.editionObject.categoryIndex);
                    setLocalObjectType(global.categories);
                    break;
                }

                case global.dishes: {
                    setObjectBeingEdited(globalState.editionObject);
                    setCategoryIndex(
                        globalState.editionObject.dishCategoryIndex
                    );
                    setDishIndex(globalState.editionObject.dishIndex);
                    setLocalObjectType(global.dishes);
                    break;
                }

                case global.preferences: {
                    setObjectBeingEdited(globalState.editionObject);
                    setLocalObjectType(global.preferences);
                    break;
                }

                case global.dialogRestaurantUser: {
                    setObjectBeingEdited(globalState.editionObject);
                    setUserIndex(globalState.editionObject.userIndex);
                    setLocalObjectType(global.users);
                    break;
                }

                default: {
                    break;
                }
            }
        }
    }, [globalState.editionObject, globalState.featuresOfTheEditionObject]);

    useEffect(() => {
        let timer;

        if (deleting) {
            timer = setTimeout(() => {
                setDeleting(false);
            }, 2000);
        }

        return () => clearTimeout(timer);
    }, [deleting]);

    useEffect(() => {
        //
        const handleDeleteButtonClick = async (imageObj) => {
            try {
                let result = {status: 400, error: ""};
                const foundImage = menu.images.find(
                    (item) =>
                        item.image.image_public_id ===
                        imageObj.image.image_public_id
                );
                if (foundImage) {
                    result = await deleteCloudinaryResourceAndImageApi(
                        menu.restaurant.id,
                        imageObj.image.image_public_id,
                        foundImage.image.id,
                        menu.restaurant.currently_logged_in,
                        menu.restaurant.logged_in_user_random_number
                    );
                }
                if (checkResponseStatus(result.status)) {
                    let restaurantId = menu.restaurant.id;
                    setDeleting(true);
                    reduxStateDispatch(fetchMenu(restaurantId));
                    reduxStateDispatch(resetStateChange());
                    toastSuccess(result.message);
                } else {
                    toastError(
                        global.CompShowImageInListConnectionErrorOrNotImageFound
                    );
                }
            } catch (error) {
                toastError(global.connectionErrorOrUserCanNotPerformOperations);
            }
        };
        if (proceedDeleting) handleDeleteButtonClick(imageObj);
        else setShowModal(false);
    }, [
        proceedDeleting,
        imageObj,
        menu.images,
        menu.restaurant.currently_logged_in,
        menu.restaurant.id,
        menu.restaurant.logged_in_user_random_number,
        reduxStateDispatch,
    ]);

    function handleSelectClick(imageObj) {
        if (localObjectType.length > 0) {
            if (imageObj.image.image_name !== global.provisionalValue) {
                switch (localObjectType) {
                    case global.categories: {
                        globalStateDispatch({
                            type: globalStateContextActions.setCategoryEditionObject,
                            payload: {
                                ...objectBeingEdited,
                                categoryImageId: imageObj.image.id,
                                categoryIndex: categoryIndex,
                            },
                        });
                        setObjectBeingEdited(null);
                        globalStateDispatch({
                            type: globalStateContextActions.setEditionObjectChangeWasDone,
                        });
                        appNavigate(global.DialogCategoryPath, {
                            state: {categoryIndex},
                        });
                        break;
                    }

                    case global.dishes: {
                        globalStateDispatch({
                            type: globalStateContextActions.setDishEditionObject,
                            payload: {
                                ...objectBeingEdited,
                                dishImageId: imageObj.image.id,
                                dishCategoryIndex: categoryIndex,
                                dishIndex: dishIndex,
                            },
                        });
                        setObjectBeingEdited(null);
                        globalStateDispatch({
                            type: globalStateContextActions.setEditionObjectChangeWasDone,
                        });
                        appNavigate(global.DialogDishPath, {
                            state: {
                                categoryIndex,
                                dishIndex,
                            },
                        });
                        break;
                    }

                    case global.preferences: {
                        let objectBeingEditedLocal =
                            cloneDeep(objectBeingEdited);
                        switch (objectBeingEdited.WhatIsItLookingFor) {
                            case global.facade: {
                                objectBeingEditedLocal.restaurantFacadeImageId =
                                    imageObj.image.id;
                                break;
                            }

                            case global.logo: {
                                objectBeingEditedLocal.restaurantLogoImageId =
                                    imageObj.image.id;
                                break;
                            }

                            default: {
                                break;
                            }
                        }
                        globalStateDispatch({
                            type: globalStateContextActions.setPreferencesEditionObject,
                            payload: objectBeingEditedLocal,
                        });
                        setObjectBeingEdited(null);
                        globalStateDispatch({
                            type: globalStateContextActions.setEditionObjectChangeWasDone,
                        });
                        setLocalObjectType("");
                        appNavigate(global.DialogPreferencesPath);
                        break;
                    }

                    case global.users: {
                        globalStateDispatch({
                            type: globalStateContextActions.setUserEditionObject,
                            payload: {
                                ...objectBeingEdited,
                                userImageId: imageObj.image.id,
                                userIndex: userIndex,
                            },
                        });
                        setObjectBeingEdited(null);
                        globalStateDispatch({
                            type: globalStateContextActions.setEditionObjectChangeWasDone,
                        });
                        appNavigate(global.DialogRestaurantUserPath, {
                            state: {userIndex},
                        });
                        break;
                    }

                    default: {
                        break;
                    }
                }
            } else {
                toastError(global.setImageNameFirst);
            }
        }
    }

    function handleEdit(imageObj) {
        const imageIndex = menu.images.findIndex(
            (image) => image.image.id === imageObj.image.id
        );
        appNavigate(global.DialogImageNamePath, {
            state: {imageIndex},
        });
    }

    function handleYesResponse() {
        setProceedDeleting(true);
    }

    function handleNoResponse() {
        setShowModal(false);
    }

    function ShowOrDelete(imageObj) {
        if (imageObj.image.use_count === 0) {
            setShowModal(true);
        } else {
            appNavigate(global.showImageUsesPath, {
                state: imageObj,
            });
        }
    }

    return (
        <ElementContainer>
            <GlobalModal show={showModal}>
                <div style={{fontWeight: "bold", color: "black"}}>
                    {global.areYouSuretoDeleteImage}&nbsp;
                    {imageObj.image.image_name}?
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
            <WholeImage
                deleting={deleting}
                handleImagesOptionItemsEnvironment={
                    environmentOptionItemsState.environmentOptionItems ===
                    environmentOptionItems.handleImagesPrivateEnvironment
                }
                onClick={() => {
                    handleSelectClick(imageObj);
                }}
            >
                {ShowImage(
                    true,
                    imageObj.image.image_name,
                    imageObj.image.image_public_id,
                    menu,
                    false,
                    170,
                    80,
                    "",
                    true
                )}
                <div style={{marginLeft: "5px"}}>
                    {imageObj.image.image_name}
                </div>
            </WholeImage>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "5px",
                    marginTop: "-10px",
                }}
            >
                {environmentOptionItemsState.environmentOptionItems ===
                    environmentOptionItems.handleImagesPrivateEnvironment && (
                    <ShowOrDeleteButton
                        onClick={() => {
                            ShowOrDelete(imageObj);
                        }}
                    >
                        {imageObj.image.use_count === 0 && <DeleteIcon />}
                        {imageObj.image.use_count > 0 && (
                            <FormatListNumberedIcon />
                        )}
                    </ShowOrDeleteButton>
                )}
                {(environmentOptionItemsState.environmentOptionItems ===
                    environmentOptionItems.menuPrivateEnvironment ||
                    environmentOptionItemsState.environmentOptionItems ===
                        environmentOptionItems.preferencesPrivateEnvironment ||
                    environmentOptionItemsState.environmentOptionItems ===
                        environmentOptionItems.usersPrivateEnvironment) && (
                    <SelectButton
                        onClick={() => {
                            handleSelectClick(imageObj);
                        }}
                    >
                        <ResetTvIcon />
                    </SelectButton>
                )}
                {environmentOptionItemsState.environmentOptionItems ===
                    environmentOptionItems.handleImagesPrivateEnvironment && (
                    //
                    <EditButton
                        onClick={() => {
                            handleEdit(imageObj);
                        }}
                    >
                        <EditIcon />
                    </EditButton>
                )}
            </div>
        </ElementContainer>
    );
}

export default CompShowImageInList;
