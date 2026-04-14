import React, {useContext, useEffect, useState} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import * as global from "../globalDefinitions/globalConstants";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";

const DeliveryContainer = styled.div`
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

function CompShowDeliveryInList({deliveryCompany, dimmed, handleGoBack}) {
    const {globalStateDispatch} = useContext(GlobalStateContext);

    function clickedOnDelivery(deliveryCompany) {
        globalStateDispatch({
            type: globalStateContextActions.setDeliverySelected,
            payload: {
                deliveryCompany: deliveryCompany.delivery_company,
            },
        });
        handleGoBack();
    }

    return (
        //
        <DeliveryContainer
            onClick={() => clickedOnDelivery(deliveryCompany)}
            dimmed={dimmed}
        >
            <img
                src={deliveryCompany.delivery_company.company_image_url}
                alt={deliveryCompany.delivery_company.name}
                width="50"
                height="50"
            ></img>
            <div style={{marginLeft: "5px", alignSelf: "center"}}>
                {deliveryCompany.delivery_company.name}
            </div>
            <div style={{alignSelf: "center"}}>
                {dimmed && (
                    <div style={{marginLeft: "5px"}}>({global.taken})</div>
                )}
            </div>
        </DeliveryContainer>
    );
}

export default CompShowDeliveryInList;

CompShowDeliveryInList.propTypes = {
    deliveryCompany: PropTypes.object, // deliveryCompany should be a string and is required
    dimmed: PropTypes.bool.isRequired, // dimmed should be a boolean and is required
    handleGoBack: PropTypes.func.isRequired, // handleGoBack should be a function and is required
};
