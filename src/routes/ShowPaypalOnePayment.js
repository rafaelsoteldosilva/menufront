import React, {useEffect, useState} from "react";

import styled from "styled-components";

import * as global from "../globalDefinitions/globalConstants";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";
import {useContext} from "react";
import {fetchMenu} from "../slices/restaurantMenuSlice";

import {loadScript} from "@paypal/paypal-js";
import {
    createPaypalOrderAtonnaApi,
    capturePaypalOrderAtonnaApi,
} from "../axiosCalls/axiosAPICalls";
import {getRestaurantMenu} from "../slices/restaurantMenuSlice";
import {useDispatch, useSelector} from "react-redux";
import {useNavigation} from "../contexts/navigationContext";
import {toastWarning} from "../utils/toastMessages";

const ElementsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 100px;
    margin-left: 65px;
    height: calc(100vh - 100px);
`;

function resultMessage(message) {
    const container = document.querySelector("#result-message");
    container.innerHTML = message;
}

function ShowPaypalOnePayment() {
    const {appNavigate} = useNavigation();
    const reduxStateDispatch = useDispatch();

    const {globalStateDispatch} = useContext(GlobalStateContext);

    const menu = useSelector(getRestaurantMenu);

    const [transOK, setTransOK] = useState(null);
    const [transCancelled, setTransCancelled] = useState(null);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.payPalOnePaymentPath,
        });
    });

    useEffect(() => {
        let paypal;
        async function InitializePaypal() {
            try {
                paypal = await loadScript({
                    clientId: "test",
                    components: "buttons",
                    intent: "capture",
                });
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("failed to load the PayPal JS SDK script", error);
            }

            if (paypal) {
                try {
                    await paypal
                        .Buttons({
                            async createOrder() {
                                try {
                                    setTransOK(null);
                                    setTransCancelled(null);
                                    const response =
                                        await createPaypalOrderAtonnaApi(
                                            menu.restaurant.id,
                                            global.payingNormalFee
                                        );
                                    const orderData = response;

                                    if (orderData?.id) {
                                        return orderData.id;
                                    } else {
                                        const errorDetail =
                                            orderData?.details?.[0];
                                        const errorMessage = errorDetail
                                            ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                                            : JSON.stringify(orderData);

                                        throw new Error(errorMessage);
                                    }
                                } catch (error) {
                                    // eslint-disable-next-line no-console
                                    console.error("createOrder:: ", error);
                                }
                            },
                            // eslint-disable-next-line no-unused-vars
                            async onApprove(data, actions) {
                                try {
                                    toastWarning(
                                        global.approvingTakesTime,
                                        5000
                                    );
                                    const response =
                                        await capturePaypalOrderAtonnaApi(
                                            menu.restaurant.id,
                                            data.orderID,
                                            menu.restaurant.currently_logged_in
                                        );

                                    if (response.status === "COMPLETED") {
                                        const orderData = response;

                                        if (orderData?.status === "COMPLETED") {
                                            setTransCancelled(false);
                                            setTransOK(true);
                                            // capture_paypal_order already saves the payment (backend)
                                            reduxStateDispatch(
                                                fetchMenu(menu.restaurant.id)
                                            );
                                            globalStateDispatch({
                                                type: globalStateContextActions.setGeneralMessage,
                                                payload:
                                                    global.confirmationInfo,
                                            });
                                            appNavigate(
                                                global.paymentStatePath
                                            );
                                        }
                                    }
                                } catch (error) {
                                    resultMessage(
                                        `Sorry, your transaction could not be processed`
                                    );
                                }
                            },
                            // eslint-disable-next-line no-unused-vars
                            onCancel(data) {
                                setTransCancelled(true);
                            },
                            onError(err) {
                                // eslint-disable-next-line no-console
                                console.error("onError:: ", err);
                                setTransCancelled(true);
                            },
                        })
                        .render("#paypal-div");
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error("failed to render the PayPal Buttons", error);
                }
            }
        }

        InitializePaypal();
    }, [
        appNavigate,
        globalStateDispatch,
        menu.restaurant.currently_logged_in,
        menu.restaurant.id,
        reduxStateDispatch,
    ]);

    return (
        <ElementsContainer>
            <div style={{marginBottom: "10px"}}>{global.payWithPaypal}</div>
            {!transOK && <div id="paypal-div" style={{marginBottom: "10px"}} />}
            {transCancelled && (
                <div style={{marginTop: "10px"}}>{global.transCancelled}</div>
            )}
        </ElementsContainer>
    );
}

export default ShowPaypalOnePayment;
