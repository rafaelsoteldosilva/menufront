import React, {useEffect, useContext, useState} from "react";
import styled from "styled-components";
import {useNavigation} from "../contexts/navigationContext";

import {useSelector} from "react-redux";
import {getRestaurantMenu} from "../slices/restaurantMenuSlice";
import {Box, Button, Typography, Paper} from "@mui/material";
import {faQuestion} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import CancelIcon from "@mui/icons-material/Cancel";

import * as global from "../globalDefinitions/globalConstants";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";

import {getDeliveryCompanies} from "../slices/deliveryCompaniesSlice";
import CompShowDeliveryInList from "../components/CompShowDeliveryInList";

const DeliveriesContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    min-height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 100;
    user-select: none;
`;

const EachDelivery = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
`;
// good

function SelectDeliveryForAddingANewRestaurantDelivery() {
    const {appNavigate} = useNavigation();

    const menu = useSelector(getRestaurantMenu);
    const {globalStateDispatch} = useContext(GlobalStateContext);

    const deliveryCompanies = useSelector(getDeliveryCompanies);

    const [goBack, setGoBack] = useState(false);

    // image height is the actual image height plus the margin (5px)
    const imageHeight = 75;
    const totalHeight = deliveryCompanies.length * imageHeight;

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.selectDeliveryForAddingANewRestaurantDeliveryPath,
        });
    }, [globalStateDispatch]);

    function handleHelp() {
        appNavigate(global.helpPath, {
            state: {
                videoName:
                    "private_dialog_select_delivery_for_adding_a_new_restaurant_delivery",
            },
        });
    }

    function handleGoBack() {
        setGoBack(true);
    }

    function AddADelivery() {}

    useEffect(() => {
        if (goBack) {
            appNavigate(global.ShowPrivateRestaurantDeliveriesPath);
        }
    }, [goBack, globalStateDispatch, appNavigate]);

    if (!deliveryCompanies)
        return <div style={{marginTop: "100px"}}>No deliveries</div>;
    else
        return (
            <DeliveriesContainer
                style={{
                    height: totalHeight + "px",
                    width: "95vw",
                }}
            >
                <Paper
                    sx={{
                        padding: "5px",
                        marginTop: totalHeight - 200 + "px",
                        marginLeft: "10px",
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
                    {deliveryCompanies.map((deliveryCompany, index) => (
                        <div
                            key={index}
                            style={{
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "flex-start",
                                marginLeft: "5px",
                            }}
                        >
                            <EachDelivery>
                                <button
                                    onClick={AddADelivery}
                                    style={{
                                        border: "none",
                                        background: "none",
                                        padding: "0",
                                        margin: "5px",
                                        width: "250px",
                                    }}
                                >
                                    <CompShowDeliveryInList
                                        deliveryCompany={deliveryCompany}
                                        handleGoBack={handleGoBack}
                                        dimmed={
                                            menu.restaurant_delivery_companies.findIndex(
                                                (restaurantDeliveryCompany) =>
                                                    restaurantDeliveryCompany
                                                        .restaurant_delivery_company
                                                        .delivery_company_details
                                                        .id ===
                                                    deliveryCompany
                                                        .delivery_company.id
                                            ) !== global.noValue
                                        }
                                    />
                                </button>
                            </EachDelivery>
                        </div>
                    ))}
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
            </DeliveriesContainer>
        );
}

export default SelectDeliveryForAddingANewRestaurantDelivery;
