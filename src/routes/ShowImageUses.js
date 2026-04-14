import React, {useContext, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

import {getRestaurantMenu} from "../slices/restaurantMenuSlice";
import {useSelector} from "react-redux";
import * as global from "../globalDefinitions/globalConstants";
import styled from "styled-components";
import {ShowImage} from "../utils/ImageFunctions";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";

const WholeImage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
`;

// good

function ShowImageUses() {
    const menu = useSelector(getRestaurantMenu);
    const {globalStateDispatch} = useContext(GlobalStateContext);

    const {state} = useLocation();

    const {image} = state;
    const [imageUses, setImageUses] = useState([]);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.showImageUsesPath,
        });
    }, [globalStateDispatch]);

    useEffect(() => {
        let localImageUses = [];
        let useCounter = 0;

        if (menu.restaurant.public_facade_image_id === image.id) {
            localImageUses.push(`${global.preferences}: ${global.facade}`);
            useCounter++;
        }
        if (useCounter < image.use_count) {
            if (menu.restaurant.public_logo_image_id === image.id) {
                localImageUses.push(`${global.preferences}: ${global.logo}`);
                useCounter++;
            }
            if (useCounter < image.use_count) {
                menu.restaurant_user_images_and_names.forEach(
                    (userImage, itemNumber) => {
                        if (userImage.user.public_image_id === image.id) {
                            localImageUses.push(
                                `${global.usersText}: ${menu.restaurant_user_images_and_names[itemNumber].user.public_name}`
                            );
                            useCounter++;
                        }
                    }
                );
            }
            if (useCounter < image.use_count) {
                menu.categories.forEach((category, itemNumber) => {
                    if (
                        menu.categories[itemNumber].category.public_image_id ===
                        image.id
                    ) {
                        localImageUses.push(
                            `${global.categories}: ${menu.categories[itemNumber].category.public_name}`
                        );
                        useCounter++;
                    }
                    if (useCounter < image.use_count) {
                        menu.categories[itemNumber].dishes.forEach((dish) => {
                            if (dish.dish.public_image_id === image.id) {
                                localImageUses.push(
                                    `${menu.categories[itemNumber].category.public_name}: ${dish.dish.public_name}`
                                );
                                useCounter++;
                            }
                        });
                    }
                });
            }
        }
        setImageUses(localImageUses);
    }, [
        image.id,
        image.use_count,
        menu.categories,
        menu.restaurant.public_facade_image_id,
        menu.restaurant.public_logo_image_id,
        menu.restaurant_user_images_and_names,
    ]);

    if (imageUses.length === 0) {
        return <div>{global.waiting}</div>;
    } else {
        return (
            <div
                style={{
                    marginTop: "100px",
                    marginLeft: "60px",
                    userSelect: "none",
                }}
            >
                <div>
                    <WholeImage>
                        {ShowImage(
                            true,
                            image.image_name,
                            image.image_public_id,
                            menu,
                            false,
                            220,
                            130,
                            "",
                            true
                        )}
                        <div style={{marginLeft: "5px"}}>
                            {image.image_name}
                        </div>
                    </WholeImage>

                    <div
                        style={{
                            marginLeft: "5px",
                            marginTop: "10px",
                            width: "135%",
                        }}
                    >
                        {global.imageUses}
                    </div>
                    <div
                        style={{
                            marginLeft: "5px",
                            marginTop: "10px",
                            border: "2px solid #4C867D",
                        }}
                    >
                        <div>
                            {imageUses.map((use, index) => (
                                <div key={index} style={{marginTop: "5px"}}>
                                    <div>👉 {use}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ShowImageUses;
