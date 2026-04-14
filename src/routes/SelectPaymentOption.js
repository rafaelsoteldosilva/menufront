import React, {useEffect, useContext, useState} from "react";
import styled from "styled-components";
import {useNavigation} from "../contexts/navigationContext";

import {useDispatch, useSelector} from "react-redux";
import {Box, Button, Typography, Paper} from "@mui/material";
import {faQuestion} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import CancelIcon from "@mui/icons-material/Cancel";

import * as global from "../globalDefinitions/globalConstants";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";

import {getRestaurantMenu} from "../slices/restaurantMenuSlice";

import {
    fetchPaymentOptions,
    getPaymentOptions,
} from "../slices/paymentOptionsSlice";

import CompShowPaymentOptionInList from "../components/CompShowPaymentOptionInList";

const PaymentOptionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    padding-top: 80px;
    min-height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 100;
    user-select: none;
`;

const EachPaymentOption = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
`;

// good

function SelectPaymentOption() {
    const reduxStateDispatch = useDispatch();
    const {appNavigate} = useNavigation();

    const {globalStateDispatch} = useContext(GlobalStateContext);
    const menu = useSelector(getRestaurantMenu);

    const paymentOptions = useSelector(getPaymentOptions);

    const [goBack, setGoBack] = useState(false);

    // image height is the actual image height plus the margin (5px)
    const imageHeight = 75;
    const totalHeight = paymentOptions.length * imageHeight;

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.selectPaymentOptionPath,
        });
        reduxStateDispatch(
            fetchPaymentOptions(menu.restaurant.public_country.id)
        );
    }, [globalStateDispatch, menu, reduxStateDispatch]);

    function handleHelp() {
        appNavigate(global.helpPath, {
            state: {
                videoName: "private_dialog_select_payment_option",
            },
        });
    }

    function handleGoBack() {
        setGoBack(true);
    }

    useEffect(() => {
        if (goBack) {
            appNavigate(global.paymentStatePath);
        }
    }, [goBack, globalStateDispatch, appNavigate]);

    if (paymentOptions.length === 0)
        return (
            <div style={{marginTop: "100px", marginLeft: "65px"}}>
                No payment options
            </div>
        );
    else
        return (
            <PaymentOptionsContainer
                style={{
                    height: totalHeight + "px",
                    width: "95vw",
                }}
            >
                <Paper
                    sx={{
                        padding: "5px",
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
                            {global.selectAPaymentOption}
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
                    {paymentOptions.map((paymentOption, index) => (
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
                            <EachPaymentOption>
                                <button
                                    style={{
                                        border: "none",
                                        background: "none",
                                        padding: "0",
                                        margin: "5px",
                                        width: "250px",
                                    }}
                                >
                                    <CompShowPaymentOptionInList
                                        paymentOption={paymentOption}
                                        handleGoBack={handleGoBack}
                                    />
                                </button>
                            </EachPaymentOption>
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
            </PaymentOptionsContainer>
        );
}

export default SelectPaymentOption;
