import React, {useContext, useState} from "react";
import {useNavigation} from "../contexts/navigationContext";

import {Button} from "../globalDefinitions/globalStyles";

import {
    getRestaurantUsers,
    fetchRestaurantUsers,
    changeRestaurantUserMarkedForDeletion,
} from "../slices/restaurantUsersSlice";

import {getRestaurantMenu} from "../slices/restaurantMenuSlice";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";

import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";

import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

import * as global from "../globalDefinitions/globalConstants";

import {restaurantUserSwitchMarkForDeletionApi} from "../axiosCalls/axiosAPICalls";

import {ShowImage} from "../utils/ImageFunctions";

import {useEffect} from "react";
import {toastError, toastInfo, toastWarning} from "../utils/toastMessages";

const ScreenContent = styled.div`
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
`;

const ImageOnly = styled.div`
    margin-left: 57px;
`;

const UserContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 80%;
    margin-left: 65px;
`;

const UserContent = styled.div`
    width: 230px;
    border: 1px solid gray;

    user-select: none;
    cursor: auto;
    &:hover {
        cursor: auto;
    }
    background-color: ${({markedForDeletion, currentlyLoggedIn}) =>
        markedForDeletion ? "#6C2828" : currentlyLoggedIn ? "#357D2E" : "none"};
`;

const WholeItem = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    &:hover {
        filter: brightness(70%);
    }
    &:active {
        transform: translateY(4px);
    }
`;

const OtherUserContent = styled.div`
    color: ${({highlight}) => (highlight ? "yellow" : "none")};
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
`;

const SingleLine = styled.div`
    width: 243px;
    margin-left: 5px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const ScreenName = styled.div`
    width: 100%;
    margin-bottom: 10px;
    margin-top: 70px;
    margin-left: 5px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    user-select: none;
    cursor: auto;
    &:hover {
        cursor: auto;
    }
`;

const SeparatorLine = styled.div`
    margin-top: 10px;
    margin-bottom: 20px;
    border-top: 1px solid yellow;
    width: 150px;
`;

const AddButton = styled(Button)`
    margin-top: 5px;
    width: 60px;
    height: 30px;
    margin-left: 5px;
`;

const EditButtons = styled.div`
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

const DeleteLegend = styled.div`
    user-select: none;
    cursor: auto;
    margin-top: 5px;
    color: yellow;
    &:hover {
        cursor: auto;
    }
`;

// good

function ShowUsers() {
    const {appNavigate} = useNavigation();
    const reduxStateDispatch = useDispatch();

    const restaurantUsers = useSelector(getRestaurantUsers);
    const menu = useSelector(getRestaurantMenu);

    const [proceed, setProceed] = useState(false);

    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);

    useEffect(() => {
        reduxStateDispatch(fetchRestaurantUsers(menu.restaurant.id));
    }, [menu.restaurant.id, reduxStateDispatch]);

    useEffect(() => {
        if (restaurantUsers.length > 0) {
            setProceed(true);
        }
    }, [restaurantUsers]);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.showRestaurantUsersPath,
        });
        globalStateDispatch({
            type: globalStateContextActions.setCurrentlyWatching,
            payload: global.users,
        });
    }, [globalStateDispatch]);

    function CheckIfItIsTheMainUser() {
        // remember that there are only two users and only one is the main user
        let element = restaurantUsers.find(
            (value) =>
                value.restaurant_user.id === menu.restaurant.currently_logged_in
        );
        // if it is not found then it is Atonn
        if (element) {
            if (element.restaurant_user.main_user) {
                return true;
            } else return false;
        } else return true;
    }

    function handleEditClick(index) {
        const currentUserIndex = restaurantUsers.findIndex(
            (user) =>
                user.restaurant_user.id === menu.restaurant.currently_logged_in
        );
        if (currentUserIndex !== global.noValue) {
            if (
                restaurantUsers[currentUserIndex].restaurant_user.id ===
                    restaurantUsers[index].restaurant_user.id ||
                restaurantUsers[currentUserIndex].restaurant_user.main_user
            ) {
                appNavigate(global.DialogRestaurantUserPath, {
                    state: {userIndex: index},
                });
            } else toastInfo(global.youCanOnlyEditYourOwnData);
        } else toastError("could not find current user");
    }

    async function handleDeleteClick(index) {
        if (!CheckIfItIsTheMainUser()) {
            toastWarning(global.onlyMainUserCanDeleteUsers);
        } else {
            if (restaurantUsers[index].restaurant_user.main_user) {
                toastWarning(global.userNotDeletable);
                return;
            }
            if (restaurantUsers[index].restaurant_user.logged_in) {
                toastWarning(global.cannotDeleteCurrentUser);
                return;
            }
            let actualStateForDeletion =
                restaurantUsers[index].restaurant_user.marked_for_deletion;

            try {
                await restaurantUserSwitchMarkForDeletionApi(
                    menu.restaurant.id,
                    restaurantUsers[index].restaurant_user.id,
                    restaurantUsers[index].restaurant_user.marked_for_deletion,
                    restaurantUsers.currently_logged_in,
                    restaurantUsers.logged_in_user_random_number
                );
                reduxStateDispatch(
                    changeRestaurantUserMarkedForDeletion({
                        userId: restaurantUsers[index].restaurant_user.id,
                        markedForDeletion: !actualStateForDeletion,
                    })
                );
                globalStateDispatch({
                    type: globalStateContextActions.setNotifyOfAChangeMade,
                });
            } catch (error) {
                toastError(global.connectionErrorOrUserCanNotPerformOperations);
            }
        }
    }

    async function AddRestaurantUser() {
        const userIndex = global.noValue;
        if (restaurantUsers.length > 1) {
            toastWarning(global.numberOfUsersIsMaximumAlready);
        } else
            appNavigate(global.DialogRestaurantUserPath, {
                state: {userIndex},
            });
    }

    if (!proceed)
        return (
            <div style={{marginTop: "100px", marginLeft: "65px"}}>
                Waiting...
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
                }}
            >
                <div
                    style={{
                        marginLeft: "65px",
                        marginBottom: "15px",
                        borderLeft: "2px solid #4C867D",
                        borderBottom: "2px solid #4C867D",
                    }}
                >
                    <ScreenName>
                        <div>
                            {globalState.notifyOfAChangeMade ? (
                                <div>
                                    <div style={{color: "yellow"}}>
                                        {global.thisInfoHasNotBeenPublished}
                                    </div>
                                    <div>{global.showingUsers}</div>
                                </div>
                            ) : (
                                <div>{global.showingUsers}</div>
                            )}
                        </div>
                    </ScreenName>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                        }}
                    >
                        <AddButton onClick={AddRestaurantUser}>
                            <LibraryAddIcon />
                        </AddButton>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                userSelect: "none",
                            }}
                        >
                            {global.addRestaurantUserText}
                        </div>
                    </div>
                </div>
                <ScreenContent>
                    {restaurantUsers.map((user, index) => {
                        return (
                            <UserContainer key={index}>
                                <WholeItem
                                    onClick={() => handleEditClick(index)}
                                >
                                    <UserContent
                                        markedForDeletion={
                                            user.restaurant_user
                                                .marked_for_deletion
                                        }
                                        currentlyLoggedIn={
                                            user.restaurant_user.logged_in
                                        }
                                    >
                                        <ImageOnly>
                                            {ShowImage(
                                                true,
                                                user.restaurant_user
                                                    .private_name,
                                                user.restaurant_user
                                                    .private_image_id,
                                                menu,
                                                false,
                                                100,
                                                100,
                                                "",
                                                false,
                                                false,
                                                30
                                            )}
                                        </ImageOnly>
                                        <OtherUserContent
                                            highlight={
                                                user.restaurant_user
                                                    .recently_created ||
                                                user.restaurant_user
                                                    .has_been_modified
                                            }
                                        >
                                            <SingleLine style={{width: "100%"}}>
                                                {
                                                    user.restaurant_user
                                                        .private_name
                                                }
                                            </SingleLine>

                                            <SingleLine style={{width: "100%"}}>
                                                {
                                                    user.restaurant_user
                                                        .private_email
                                                }
                                            </SingleLine>
                                            {user.restaurant_user
                                                .private_email_validated && (
                                                <SingleLine
                                                    style={{
                                                        width: "100%",
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    {global.eMailValidated}
                                                </SingleLine>
                                            )}
                                            {/* {!user.restaurant_user
                                                .private_phone_validated && (
                                                <SingleLine
                                                    style={{
                                                        width: "100%",
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    {global.phoneNotValidated}
                                                </SingleLine>
                                            )}
                                            {user.restaurant_user
                                                .private_phone_validated && (
                                                <SingleLine
                                                    style={{
                                                        width: "100%",
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    {global.phoneValidated}
                                                </SingleLine>
                                            )} */}
                                            {!user.restaurant_user
                                                .private_email_validated && (
                                                <SingleLine
                                                    style={{
                                                        width: "100%",
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    {global.eMailNotValidated}
                                                </SingleLine>
                                            )}
                                            <SingleLine
                                                style={{
                                                    width: "100%",
                                                    color: "magenta",
                                                }}
                                            >
                                                {user.restaurant_user.main_user
                                                    ? global.mainUserText
                                                    : ""}
                                            </SingleLine>
                                        </OtherUserContent>
                                    </UserContent>
                                    <TouchAppIcon />
                                </WholeItem>
                                <DeleteLegend>
                                    {user.restaurant_user
                                        .marked_for_deletion && (
                                        <div>{global.markedForDeletion}</div>
                                    )}
                                </DeleteLegend>
                                <EditButtons
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                    }}
                                >
                                    <EditButton
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleEditClick(index)}
                                        style={{
                                            marginLeft: "5px",
                                        }}
                                    >
                                        <EditIcon />
                                    </EditButton>
                                    <DeleteButton
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDeleteClick(index)}
                                        style={{
                                            marginLeft: "5px",
                                        }}
                                    >
                                        {!user.restaurant_user
                                            .marked_for_deletion ? (
                                            <DeleteIcon />
                                        ) : (
                                            <RestoreFromTrashIcon />
                                        )}
                                    </DeleteButton>
                                </EditButtons>

                                <SeparatorLine />
                            </UserContainer>
                        );
                    })}
                </ScreenContent>
            </div>
        );
}

export default ShowUsers;
