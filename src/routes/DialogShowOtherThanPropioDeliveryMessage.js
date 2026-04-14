import React, {useContext, useEffect, useState} from "react";
import styled from "styled-components";
import {useNavigation} from "../contexts/navigationContext";

import {useSelector} from "react-redux";
import {getRestaurantMenu} from "../slices/restaurantMenuSlice";
import {Box, Button, Paper, Typography} from "@mui/material";

import CancelIcon from "@mui/icons-material/Cancel";

import * as global from "../globalDefinitions/globalConstants";

import {GlobalStateContext} from "../contexts/globalStateContext";
import {useLocation} from "react-router-dom";

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

function DialogShowOtherThanPropioDeliveryMessage() {
    const {state} = useLocation();
    const {deliveryName, restaurantName} = state;

    const {appNavigate} = useNavigation();

    const menu = useSelector(getRestaurantMenu);
    const {globalState} = useContext(GlobalStateContext);
    const [messageToShow, setMessageToShow] = useState("");

    useEffect(() => {
        setMessageToShow(
            global.openCorrespondingDeliveryApp
                .replace("***--***", deliveryName)
                .replace("***++***", restaurantName)
        );
    }, [deliveryName, restaurantName]);

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

    return (
        <RestaurantDeliveriesContainer
            style={{
                display: "flex",
                justifyContent: "center",
                width: "90vw",
                userSelect: "none",
            }}
        >
            <Paper
                sx={{
                    marginLeft: "20px",
                    padding: "5px",
                }}
            >
                <Typography
                    align="center"
                    sx={{fontWeight: "bold", margin: "8px"}}
                >
                    {messageToShow}
                </Typography>
                <Box
                    sx={{
                        margin: "10px",
                        display: "flex",
                        flexDirection: "column",
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

export default DialogShowOtherThanPropioDeliveryMessage;
