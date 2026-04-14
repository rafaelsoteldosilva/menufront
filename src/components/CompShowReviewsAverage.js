import React from "react";

import styled from "styled-components";

import ReactStars from "react-rating-stars-component";
import {useSelector} from "react-redux";

import {getRestaurantMenu} from "../slices/restaurantMenuSlice";
import * as global from "../globalDefinitions/globalConstants";
import PropTypes from "prop-types";

const RatingInfoContainer = styled.div`
    user-select: none;
    cursor: auto;
    &:hover {
        cursor: auto;
    }
`;

const AverageRatingContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-width: 100px;
`;

const NumberOfReviewsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-width: 100px;
`;

const RatingComponent = styled.div``;

const RatingTag = styled.div`
    font-size: ${({isDish}) => (isDish ? "16px" : "none")};
`;

const NumberOfReviewsTag = styled.div`
    font-size: ${({isDish}) => (isDish ? "16px" : "none")};
`;

const NumberOfReviewsValue = styled.div`
    font-size: ${({isDish}) => (isDish ? "12px" : "none")};
`;

export default function CompShowReviewsAverage({
    isDish,
    isRestaurant,
    isDishes,
    categoryIndex,
    dishIndex,
}) {
    const menu = useSelector(getRestaurantMenu);

    function reactStarsValue(menu) {
        let value = 0;
        if (menu) {
            if (!isRestaurant) {
                value =
                    menu.categories[categoryIndex].dishes[dishIndex]
                        .dish_reviews_average;
            } else {
                value = menu.restaurant_reviews.reviews_average;
            }
        }
        return value;
    }

    function numberOfReviews(menu) {
        let value = 0;
        if (menu) {
            if (!isRestaurant) {
                value =
                    menu.categories[categoryIndex].dishes[dishIndex]
                        .dish_number_of_reviews;
            } else {
                value = menu.restaurant_reviews.number_of_reviews;
            }
        }
        return value;
    }

    const reactStarsValues = {
        size: 18,
        value: reactStarsValue(menu),
        edit: false,
    };

    return (
        <RatingInfoContainer>
            {((isRestaurant &&
                menu.restaurant.public_show_restaurant_reviews) ||
                (isDish && menu.restaurant.public_show_dishes_reviews) ||
                (isDishes && menu.restaurant.public_show_dishes_reviews)) && (
                <div>
                    <NumberOfReviewsContainer>
                        <NumberOfReviewsTag isDish={isDish}>
                            {global.numberOfReviews}
                        </NumberOfReviewsTag>
                        <NumberOfReviewsValue isDish={isDish}>
                            {numberOfReviews(menu).toLocaleString()}
                        </NumberOfReviewsValue>
                    </NumberOfReviewsContainer>
                    <AverageRatingContainer>
                        <RatingTag isDish={isDish}>
                            {global.ratingAverage}
                        </RatingTag>
                        <RatingComponent>
                            <ReactStars {...reactStarsValues} />
                        </RatingComponent>
                    </AverageRatingContainer>
                </div>
            )}
        </RatingInfoContainer>
    );
}

CompShowReviewsAverage.propTypes = {
    isDish: PropTypes.bool.isRequired, // isDish should be a boolean and is required
    isRestaurant: PropTypes.bool.isRequired, // isRestaurant should be a boolean and is required
    isDishes: PropTypes.bool.isRequired, // isDishes should be a boolean and is required
    categoryIndex: PropTypes.number.isRequired, // categoryIndex should be a number and is required
    dishIndex: PropTypes.number.isRequired, // dishIndex should be a number and is required
};
