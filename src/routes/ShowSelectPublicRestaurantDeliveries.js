import React, {useEffect, useContext} from "react";
import styled from "styled-components";
import {useLocation} from "react-router-dom";
import {useNavigation} from "../contexts/navigationContext";

import {useSelector} from "react-redux";
import {getRestaurantMenu} from "../slices/restaurantMenuSlice";
import {Box, Button, Typography, Paper} from "@mui/material";
import {faQuestion} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import CancelIcon from "@mui/icons-material/Cancel";

import * as global from "../globalDefinitions/globalConstants";

import CompShowSelectRestaurantDeliveryInList from "../components/CompShowSelectRestaurantDeliveryInList";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";

const RestaurantDeliveriesContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    padding-top: 250px;
    min-height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 100;
`;

const EachRestaurantDelivery = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: ${({itemWidth}) => itemWidth + "px"};
`;

function ShowSelectPublicRestaurantDeliveries() {
    const {appNavigate} = useNavigation();
    const location = useLocation();

    const menu = useSelector(getRestaurantMenu);
    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);

    // image height is the actual image height plus the margin (5px)
    const imageHeight = global.selectPublicRestaurantDeliveryImageHeight;
    const totalHeight =
        menu.restaurant_delivery_companies.length * imageHeight === imageHeight
            ? 150
            : menu.restaurant_delivery_companies.length * imageHeight;

    const itemWidth = "330px";

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.SelectPublicRestaurantDeliveriesPath,
        });
    }, [globalStateDispatch]);

    function handleHelp() {
        appNavigate(global.helpPath, {
            state: {
                videoName: "public_dialog_select_public_restaurant_delivery",
            },
        });
    }

    function handleGoBack() {
        switch (globalState.lastSignificantPathVisited) {
            case global.dishPath: {
                appNavigate(
                    `${global.dishPath}/${menu.restaurant.id}/${globalState.currentCategoryIndex}/${globalState.currentDishIndex}`
                );
                break;
            }

            case global.homePath: {
                appNavigate(`${global.homePath}/${menu.restaurant.id}`);
                break;
            }

            default: {
                break;
            }
        }
    }

    if (menu.restaurant_delivery_companies.length === 0) {
        return (
            <div
                style={{
                    marginTop: "200px",
                    marginLeft: "80px",
                    fontSize: "32px",
                }}
            >
                {global.noRestaurantDeliveriesToShow}
            </div>
        );
    } else
        return (
            <RestaurantDeliveriesContainer
                style={{
                    height: totalHeight + "px",
                    width: "90vw",
                    userSelect: "none",
                }}
            >
                <Paper
                    sx={{
                        padding: "5px",
                        marginTop: totalHeight - 300 + "px",
                        marginLeft: "20px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                        }}
                    >
                        <Typography
                            align="center"
                            sx={{fontWeight: "bold", margin: "8px"}}
                        >
                            {global.selectADeliveryCompany}
                        </Typography>
                        <Button
                            onClick={handleHelp}
                            variant="contained"
                            color="warning"
                            style={{
                                minWidth: "10px",
                                width: "25px",
                                maxHeight: "25px",
                                marginTop: "5px",
                            }}
                        >
                            <FontAwesomeIcon icon={faQuestion} />
                        </Button>
                    </Box>
                    {menu.restaurant_delivery_companies.map(
                        (deliveryCompany, index) => (
                            <EachRestaurantDelivery key={index}>
                                <CompShowSelectRestaurantDeliveryInList
                                    deliveryCompany={deliveryCompany}
                                    itemWidth={itemWidth}
                                />
                            </EachRestaurantDelivery>
                        )
                    )}
                    <Box
                        sx={{
                            margin: "10px",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                        }}
                    >
                        <Button
                            onClick={handleGoBack}
                            variant={"outlined"}
                            color="primary"
                        >
                            <CancelIcon />
                        </Button>
                    </Box>
                </Paper>
            </RestaurantDeliveriesContainer>
        );
}

export default ShowSelectPublicRestaurantDeliveries;
