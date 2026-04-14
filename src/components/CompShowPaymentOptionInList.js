import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import * as global from "../globalDefinitions/globalConstants";

import {useNavigation} from "../contexts/navigationContext";
import {toastInfo} from "../utils/toastMessages";

const PaymentOptionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #d6d1d1;
    padding: 5px;
    filter: ${({dimmed}) => (dimmed ? "brightness(50%)" : "brightness(100%)")};
    pointer-events: ${({dimmed}) => (dimmed ? "none" : "auto")};
    transition:
        filter 0.3s,
        transform 0.1s;

    &:hover {
        filter: brightness(70%);
    }

    &:active {
        transform: translateY(4px);
    }
`;

// eslint-disable-next-line no-unused-vars
function CompShowPaymentOptionInList({paymentOption, handleGoBack}) {
    const {appNavigate} = useNavigation();

    function clickedOnPaymentOption(paymentOption) {
        switch (paymentOption.payment_option.name) {
            case "PayPal": {
                toastInfo("PayPal no está activo todavía.");
                // appNavigate(global.payPalOnePaymentPath);
                break;
            }

            case "WebPay": {
                appNavigate(global.webPayPlusPaymentPath);
                break;
            }

            default: {
                break;
            }
        }
    }
    return (
        //
        <PaymentOptionsContainer
            onClick={() => clickedOnPaymentOption(paymentOption)}
        >
            <img
                src={paymentOption.payment_option.payment_option_image_url}
                alt={paymentOption.payment_option.name}
                width="50"
                height="50"
            ></img>
            <div style={{marginLeft: "5px", alignSelf: "center"}}>
                {paymentOption.payment_option.name}
            </div>
        </PaymentOptionsContainer>
    );
}

export default CompShowPaymentOptionInList;

CompShowPaymentOptionInList.propTypes = {
    paymentOption: PropTypes.object.isRequired, // paymentOption should be a string and is required
    handleGoBack: PropTypes.func.isRequired, // handleGoBack should be a function and is required
};
