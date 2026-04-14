import React, {useContext, useEffect} from "react";
import * as global from "../globalDefinitions/globalConstants";
import styled from "styled-components";
import {getRestaurantMenu} from "../slices/restaurantMenuSlice";
import CompShowPublicPromotionInList from "../components/CompShowPublicPromotionInList";

import TouchAppIcon from "@mui/icons-material/TouchApp";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";

import {
    EnvironmentOptionItemsContext,
    environmentOptionItems,
} from "../contexts/environmentOptionItemsContext";
import {useSelector} from "react-redux";
import {useNavigation} from "../contexts/navigationContext";

const PromotionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    margin-left: 45px;
`;

const EachPromotion = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 50px;
    background-color: #1d1f3c;
    align-items: center;
    border: 2px solid #81818c;
    padding: 5px;
    margin: 10px;
    transition: filter 0.3s ease;
    &:hover {
        filter: brightness(70%);
    }
    &:active {
        transform: translateY(4px);
    }
`;

const SeparatorLine = styled.div`
    margin-top: 10px;
    margin-left: 70px;
    border-top: 1px solid yellow;
    width: 30%;
`;

const ScreenName = styled.div`
    margin-top: ${({privateEnvironment}) =>
        privateEnvironment ? "160px" : "80px"};
    margin-bottom: 5px;
    margin-left: 5px;
    user-select: none;
`;

const TouchIcon = styled.div`
    &:hover {
        filter: brightness(70%);
    }
    &:active {
        transform: translateY(4px);
    }
`;

// good

function ShowPublicPromotions() {
    const {environmentOptionItemsState} = useContext(
        EnvironmentOptionItemsContext
    );
    const {globalStateDispatch} = useContext(GlobalStateContext);

    const menu = useSelector(getRestaurantMenu);
    const {appNavigate} = useNavigation();

    function clickedOnPromotion(promotion) {
        const myPromotion = promotion.promotion;
        appNavigate(global.showPublicPromotionPath, {
            state: {myPromotion},
        });
    }

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.showPublicPromotionsPath,
        });
    }, [globalStateDispatch]);

    if (menu.promotions.length === 0) {
        return (
            <div
                style={{
                    marginTop: "200px",
                    marginLeft: "80px",
                    fontSize: "32px",
                }}
            >
                {global.noPromotionsToShow}
            </div>
        );
    } else
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                }}
            >
                <div
                    style={{
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
                        <div>{global.showingPublicPromotionsScreenTitle}</div>
                    </ScreenName>
                </div>

                <PromotionsContainer>
                    {menu.promotions.map((promotion, index) => {
                        return (
                            <div key={index}>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        flexWrap: "wrap",
                                        justifyContent: "flex-start",
                                        alignItems: "flex-start",
                                    }}
                                >
                                    <EachPromotion
                                        onClick={() =>
                                            clickedOnPromotion(promotion)
                                        }
                                    >
                                        <CompShowPublicPromotionInList
                                            key={index}
                                            promotion={promotion.promotion}
                                        />
                                        <TouchIcon
                                            onClick={() =>
                                                clickedOnPromotion(promotion)
                                            }
                                        >
                                            <TouchAppIcon />
                                        </TouchIcon>
                                    </EachPromotion>
                                </div>

                                <SeparatorLine />
                            </div>
                        );
                    })}
                </PromotionsContainer>
            </div>
        );
}

export default ShowPublicPromotions;
