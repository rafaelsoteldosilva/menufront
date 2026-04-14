import React, {useContext} from "react";
import * as global from "../globalDefinitions/globalConstants";
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {useNavigation} from "../contexts/navigationContext";
import PropTypes from "prop-types";

import {Button} from "../globalDefinitions/globalStyles";

import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import {toastError} from "../utils/toastMessages";
import TouchAppIcon from "@mui/icons-material/TouchApp";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";
import {deleteRestaurantDeliveryCompanyApi} from "../axiosCalls/axiosAPICalls";

import {
    getRestaurantMenu,
    resetStateChange,
    restaurantDeliveryCompanySwitchMarkForDeletion,
} from "../slices/restaurantMenuSlice";

const RestaurantDeliveryDataComponent = styled.div`
    width: ${({isPropio}) => (isPropio ? "260px" : "150px")};
    padding: 3px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border: 2px solid gray;
    &:hover {
        filter: brightness(70%);
    }
    &:active {
        transform: translateY(4px);
    }
    background-color: ${({deleted}) => (deleted ? "#6C2828" : "#1d1f3c")};
`;

const RestaurantDeliveryName = styled.div`
    margin-left: 3px;
    margin-right: 3px;
    width: 90px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-right: 1px solid gray;
    user-select: none;
    cursor: auto;
    color: ${({highlight}) => (highlight ? "yellow" : "none")};
`;

const RestaurantDeliveryToken = styled.div`
    margin-left: 3px;
    margin-right: 15px;
    width: 70px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    user-select: none;
    cursor: auto;
    color: ${({highlight}) => (highlight ? "yellow" : "none")};
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
`;

const EditButtons = styled.div`
    margin-left: 60px;
`;

const DeleteButton = styled(Button)`
    margin-top: 5px;
    width: 60px;
    height: 30px;
    margin-right: auto;
`;

const DeletionLegend = styled.div`
    margin-left: 40px;
    user-select: none;
    color: yellow;
    cursor: auto;
`;

const SeparatorLine = styled.div`
    margin-top: 5px;
    margin-left: 90px;
    border-top: 1px solid yellow;
    width: 30%;
    margin-bottom: 10px;
`;

function CompShowRestaurantDeliveryInList({
    restaurantDelivery,
    restaurantDeliveryIndex,
}) {
    const reduxStateDispatch = useDispatch();
    const {appNavigate} = useNavigation();

    const menu = useSelector(getRestaurantMenu);
    const {globalStateDispatch} = useContext(GlobalStateContext);

    function handleEditButtonClick(restaurantDeliveryIndex) {
        if (
            menu.restaurant_delivery_companies[restaurantDeliveryIndex]
                .restaurant_delivery_company.delivery_company_details.name ===
            global.propioDeliveryName
        ) {
            appNavigate(global.DialogRestaurantDeliveryTokenPath, {
                state: {
                    restaurantDeliveryCompanyBeingEditedIndex:
                        restaurantDeliveryIndex,
                    deliverySelected: {},
                },
            });
        }
    }

    async function handleDeleteButtonClick(
        restaurantDelivery,
        restaurantDeliveryIndex
    ) {
        try {
            await deleteRestaurantDeliveryCompanyApi(
                menu.restaurant.id,
                menu.restaurant_delivery_companies[restaurantDeliveryIndex]
                    .restaurant_delivery_company.id,
                menu.restaurant_delivery_companies[restaurantDeliveryIndex]
                    .restaurant_delivery_company.marked_for_deletion,
                menu.restaurant.currently_logged_in,
                menu.restaurant.logged_in_user_random_number
            );
            reduxStateDispatch(
                restaurantDeliveryCompanySwitchMarkForDeletion({
                    restaurantDeliveryCompanyToSwitchMarkForDeletionId:
                        menu.restaurant_delivery_companies[
                            restaurantDeliveryIndex
                        ].restaurant_delivery_company.id,
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

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyItems: "flex-start",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <RestaurantDeliveryDataComponent
                    deleted={
                        menu.restaurant_delivery_companies[
                            restaurantDeliveryIndex
                        ].restaurant_delivery_company.marked_for_deletion
                    }
                    isPropio={
                        menu.restaurant_delivery_companies[
                            restaurantDeliveryIndex
                        ].restaurant_delivery_company.delivery_company_details
                            .name === global.propioDeliveryName
                    }
                    onClick={() =>
                        handleEditButtonClick(restaurantDeliveryIndex)
                    }
                >
                    <img
                        src={
                            restaurantDelivery.restaurant_delivery_company
                                .delivery_company_details.company_image_url
                        }
                        width={45}
                        height={45}
                        alt={
                            restaurantDelivery.restaurant_delivery_company
                                .delivery_company_details.name
                        }
                        style={{
                            marginLeft: "3px",
                            marginRight: "3px",
                            width: "45px",
                        }}
                    ></img>
                    <RestaurantDeliveryName
                        highlight={
                            menu.restaurant_delivery_companies[
                                restaurantDeliveryIndex
                            ].restaurant_delivery_company.has_been_modified
                        }
                    >
                        {
                            restaurantDelivery.restaurant_delivery_company
                                .delivery_company_details.name
                        }
                    </RestaurantDeliveryName>
                    {menu.restaurant_delivery_companies[restaurantDeliveryIndex]
                        .restaurant_delivery_company.delivery_company_details
                        .name === global.propioDeliveryName && (
                        <RestaurantDeliveryToken
                            highlight={
                                menu.restaurant_delivery_companies[
                                    restaurantDeliveryIndex
                                ].restaurant_delivery_company.has_been_modified
                            }
                        >
                            {
                                restaurantDelivery.restaurant_delivery_company
                                    .private_token
                            }
                        </RestaurantDeliveryToken>
                    )}
                    {menu.restaurant_delivery_companies[restaurantDeliveryIndex]
                        .restaurant_delivery_company.delivery_company_details
                        .name === global.propioDeliveryName && <TouchAppIcon />}
                </RestaurantDeliveryDataComponent>
            </div>
            <EditButtons>
                <EditionButtonsComponent>
                    {menu.restaurant_delivery_companies[restaurantDeliveryIndex]
                        .restaurant_delivery_company.delivery_company_details
                        .name === global.propioDeliveryName && (
                        <EditButton
                            onClick={() =>
                                handleEditButtonClick(restaurantDeliveryIndex)
                            }
                        >
                            <EditIcon />
                        </EditButton>
                    )}
                    <DeleteButton
                        onClick={() =>
                            handleDeleteButtonClick(
                                restaurantDelivery,
                                restaurantDeliveryIndex
                            )
                        }
                    >
                        {!menu.restaurant_delivery_companies[
                            restaurantDeliveryIndex
                        ].restaurant_delivery_company.marked_for_deletion ? (
                            <DeleteIcon />
                        ) : (
                            <RestoreFromTrashIcon />
                        )}
                    </DeleteButton>
                </EditionButtonsComponent>
            </EditButtons>
            <DeletionLegend>
                {menu.restaurant_delivery_companies[restaurantDeliveryIndex]
                    .restaurant_delivery_company.marked_for_deletion && (
                    <div>{global.markedForDeletion}</div>
                )}
            </DeletionLegend>
            <SeparatorLine />
        </div>
    );
}

export default CompShowRestaurantDeliveryInList;

CompShowRestaurantDeliveryInList.propTypes = {
    restaurantDelivery: PropTypes.object.isRequired, // restaurantDelivery should be an object and is required
    restaurantDeliveryIndex: PropTypes.number.isRequired, // restaurantDeliveryIndex should be a number and is required
};
