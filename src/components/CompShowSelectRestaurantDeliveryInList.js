import React, {useContext} from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {useNavigation} from "../contexts/navigationContext";
import PropTypes from "prop-types";
import {getRestaurantMenu} from "../slices/restaurantMenuSlice";
import {GlobalStateContext} from "../contexts/globalStateContext";

import * as global from "../globalDefinitions/globalConstants";

const ContentContainer = styled.div`
    margin: 5px;
    width: 95%;
    & > div:hover {
        filter: brightness(70%);
    }
    & > div:active {
        transform: translateY(4px);
    }
`;

const DeliveryContainer = styled.div`
    display: flex;
    flex-direction: row;
    background-color: rgba(0, 0, 0, 0.1);
`;

function CompShowSelectRestaurantDeliveryInList({deliveryCompany}) {
    const {appNavigate} = useNavigation();
    const menu = useSelector(getRestaurantMenu);
    const {globalState} = useContext(GlobalStateContext);

    function handleGoBack() {
        switch (globalState.lastSignificantPathVisited) {
            case global.dishPath:
                appNavigate(
                    `${global.dishPath}/${menu.restaurant.id}/${globalState.currentCategoryIndex}/${globalState.currentDishIndex}`
                );
                break;

            case global.homePath:
                appNavigate(`${global.homePath}/${menu.restaurant.id}`);
                break;

            default:
                break;
        }
    }

    function clickedDelivery(deliveryCompany) {
        if (
            deliveryCompany.restaurant_delivery_company.delivery_company_details
                .name === global.propioDeliveryName
        ) {
            let deliveryTemplate =
                deliveryCompany.restaurant_delivery_company
                    .delivery_company_details.url_template;
            let deliveryUrl = deliveryTemplate.replace(
                global.tokenString,
                deliveryCompany.restaurant_delivery_company.public_token
            );
            window.open(deliveryUrl, "_blank");
            handleGoBack();
        } else {
            appNavigate(global.dialogShowOtherThanPropioDeliveryMessagePath, {
                state: {
                    deliveryName:
                        deliveryCompany.restaurant_delivery_company
                            .delivery_company_details.name,
                    restaurantName: menu.restaurant.public_name,
                },
            });
        }
    }

    return (
        <ContentContainer>
            <DeliveryContainer
                onClick={(event) => {
                    event.stopPropagation(); // Stop event propagation
                    clickedDelivery(deliveryCompany);
                }}
            >
                <img
                    src={
                        deliveryCompany.restaurant_delivery_company
                            .delivery_company_details.company_image_url
                    }
                    width="60px"
                    height="60px"
                    alt="Company"
                />
                <p
                    style={{
                        margin: "5px",
                        marginRight: "10px",
                        alignSelf: "center",
                    }}
                >
                    {
                        deliveryCompany.restaurant_delivery_company
                            .delivery_company_details.name
                    }
                </p>
            </DeliveryContainer>
        </ContentContainer>
    );
}

export default CompShowSelectRestaurantDeliveryInList;

CompShowSelectRestaurantDeliveryInList.propTypes = {
    deliveryCompany: PropTypes.object.isRequired, // deliveryCompany should be an object and is required
};
