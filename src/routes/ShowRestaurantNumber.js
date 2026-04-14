import React, {useEffect, useContext} from "react";

import styled from "styled-components";

import {getRestaurantMenu} from "../slices/restaurantMenuSlice";
import {useSelector} from "react-redux";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";

import * as global from "../globalDefinitions/globalConstants";

const ElementsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 25px;
    height: calc(100vh - 100px);
`;

const SurroundingSquare = styled.div`
    display: flex;
    justify-content: center;
    margin-left: 65px;
    align-items: center;
    width: 250px;
    height: 150px;
    background-color: #1d1f3c;
    border: 2px solid gray;
    padding: 5px;
    color: white;
    font-size: 70px;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    line-height: 1;
`;

// good

function ShowRestarurantNumber() {
    const menu = useSelector(getRestaurantMenu);
    const {globalStateDispatch} = useContext(GlobalStateContext);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.showRestaurantNumberPath,
        });
    });

    return (
        <div style={{userSelect: "none"}}>
            <div style={{marginTop: "100px", marginLeft: "65px"}}>
                {global.showingRestaurantNumber}
            </div>

            <ElementsContainer>
                <SurroundingSquare>
                    <div>{menu.restaurant.todays_random_number}</div>
                </SurroundingSquare>
            </ElementsContainer>
        </div>
    );
}

export default ShowRestarurantNumber;
