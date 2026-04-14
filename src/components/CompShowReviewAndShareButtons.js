import React from "react";

import styled from "styled-components";
import {Button} from "../globalDefinitions/globalStyles";

import recommend from "../assets/Recommend.jpg";
import watchComments from "../assets/WatchComments.jpg";
import orderDelivery from "../assets/OrderDelivery.jpg";
import evaluate from "../assets/Evaluate.jpg";
import PropTypes from "prop-types";

import * as global from "../globalDefinitions/globalConstants";
import {getRestaurantMenu} from "../slices/restaurantMenuSlice";

import {useNavigation} from "../contexts/navigationContext";

import {useSelector} from "react-redux";

const ComponentContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-start;
    width: 100%;
`;

const ReviewAnShareButtons = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    margin-bottom: 20px;
`;

const ReviewButtons = styled.div`
    display: flex;
    flex-direction: row;
`;

const ReviewsButton = styled(Button)`
    width: 75px;
    height: 75px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: row;
    &:hover {
        filter: brightness(70%);
    }
`;

const DeliveryButton = styled(Button)`
    width: 75px;
    height: 75px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: row;
    &:hover {
        filter: brightness(70%);
    }
`;

const RecommendButton = styled(Button)`
    width: 75px;
    height: 75px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: row;
    &:hover {
        filter: brightness(70%);
    }
`;

const AddReviewButton = styled(Button)`
    width: 75px;
    height: 75px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: row;
    &:hover {
        filter: brightness(70%);
    }
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    pointer-events: none;
`;

export function CompShowReviewAndShareButtons({
    isRestaurant,
    isDish,
    categoryIndex,
    dishIndex,
}) {
    const {appNavigate} = useNavigation();
    const menu = useSelector(getRestaurantMenu);

    function handleAddReviewClick() {
        appNavigate(global.DialogAddNewReviewPath);
    }

    function handleShowReviewsClick() {
        appNavigate(global.showReviewsPath, {
            state: {
                isDish,
                categoryIndex,
                dishIndex,
            },
        });
    }

    function handleWhatsappShareClick() {
        appNavigate(global.DialogWhatsappSharePath, {
            state: {
                isDish,
                categoryIndex,
                dishIndex,
            },
        });
    }

    function handleDeliveryClick() {
        appNavigate(global.SelectPublicRestaurantDeliveriesPath);
    }

    return (
        <ComponentContainer>
            <ReviewAnShareButtons>
                {menu.restaurant.price_type === global.fullPrice && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                            }}
                        >
                            <RecommendButton onClick={handleWhatsappShareClick}>
                                <Image src={recommend} alt="Recommend" />
                            </RecommendButton>
                            <div
                                style={{
                                    marginTop: "-5px",
                                    marginBottom: "10px",
                                }}
                            >
                                {global.recommendButtonText}
                            </div>
                        </div>
                        {menu.restaurant.public_show_ask_button && (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                <DeliveryButton onClick={handleDeliveryClick}>
                                    <Image
                                        src={orderDelivery}
                                        alt="Order Delivery"
                                    />
                                </DeliveryButton>
                                <div
                                    style={{
                                        marginTop: "-5px",
                                        paddingLeft: "25px",
                                        marginBottom: "10px",
                                    }}
                                >
                                    {global.deliveryButtonText}
                                </div>
                            </div>
                        )}

                        {((isRestaurant &&
                            menu.restaurant.public_show_restaurant_reviews) ||
                            (isDish &&
                                menu.restaurant
                                    .public_show_dishes_reviews)) && (
                            <div
                                style={{display: "flex", flexDirection: "row"}}
                            >
                                <ReviewButtons>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <AddReviewButton
                                            onClick={handleAddReviewClick}
                                        >
                                            <Image
                                                src={evaluate}
                                                alt="Add Review"
                                            />
                                        </AddReviewButton>
                                        <div
                                            style={{
                                                marginLeft: "15px",
                                                marginTop: "-5px",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            {global.addReviewButtonText}
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <ReviewsButton
                                            onClick={handleShowReviewsClick}
                                        >
                                            <Image
                                                src={watchComments}
                                                alt="Watch Reviews"
                                            />
                                        </ReviewsButton>
                                        <div
                                            style={{
                                                marginTop: "-5px",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            {global.showReviewsButtonText}
                                        </div>
                                    </div>
                                </ReviewButtons>
                            </div>
                        )}
                    </div>
                )}
            </ReviewAnShareButtons>
            <div style={{marginBottom: "100px"}}>
                <div>&nbsp;</div>
            </div>
        </ComponentContainer>
    );
}

CompShowReviewAndShareButtons.propTypes = {
    isRestaurant: PropTypes.bool.isRequired, // isRestaurant should be a boolean and is required
    isDish: PropTypes.bool.isRequired, // isDish should be a boolean and is required
    categoryIndex: PropTypes.number.isRequired, // categoryIndex should be a number and is required
    dishIndex: PropTypes.number.isRequired, // dishIndex should be a number and is required
};
