import React, {useEffect, useState, useContext} from "react";
import styled from "styled-components";
import QRCode from "react-qr-code";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";
import {
    EnvironmentOptionItemsContext,
    environmentOptionItemsContextActions,
} from "../contexts/environmentOptionItemsContext";

import {toastSuccess} from "../utils/toastMessages";

import {
    GlobalModal,
    AnsweredYesButton,
    AnsweredNoButton,
} from "../globalDefinitions/globalModal";

import {getRestaurantMenu} from "../slices/restaurantMenuSlice";

import * as global from "../globalDefinitions/globalConstants";

import {useNavigation} from "../contexts/navigationContext";
import {sendQRCodeToEMailApi} from "../axiosCalls/axiosAPICalls";
import {useSelector} from "react-redux";

const ElementsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 100px);
`;

// good

function ShowQR() {
    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);
    const {environmentOptionItemsStateDispatch} = useContext(
        EnvironmentOptionItemsContext
    );
    const {appNavigate} = useNavigation();

    const [showModal, setShowModal] = useState(false);

    const menu = useSelector(getRestaurantMenu);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.showQRPath,
        });
    });

    useEffect(() => {
        if (globalState.sendEMail) {
            setShowModal(true);
            globalStateDispatch({
                type: globalStateContextActions.clearSendEMail,
            });
        }
    }, [globalState, globalStateDispatch]);

    function handleYesResponse() {
        environmentOptionItemsStateDispatch({
            type: environmentOptionItemsContextActions.setPrivateEnvironment,
        });
        appNavigate(global.managementPath);
    }

    function handleNoResponse() {
        setShowModal(false);
        const userIndex = menu.restaurant_user_images_and_names.findIndex(
            (user) => user.user.main_user === true
        );
        const ToEMailAddress =
            menu.restaurant_user_images_and_names[userIndex].user.public_email;

        const encodedBaseURL = encodeURIComponent(
            process.env.REACT_APP_BASE_URL
        );
        const encodedCategoriesPath = encodeURIComponent(
            `${global.categoriesPath}`
        );

        sendQRCodeToEMailApi(
            menu.restaurant.id,
            encodedBaseURL,
            encodedCategoriesPath,
            ToEMailAddress,
            menu.restaurant.currently_logged_in,
            menu.restaurant.logged_in_user_random_number
        );

        toastSuccess(global.qrEMailSent);
    }

    return (
        <>
            <div style={{marginTop: "100px", marginLeft: "65px"}}>
                {global.showingQR}
            </div>
            <GlobalModal show={showModal}>
                <div style={{fontWeight: "bold", color: "black"}}>
                    {global.sendToMainUser}
                </div>
                <AnsweredYesButton
                    onClick={() => {
                        handleYesResponse();
                    }}
                >
                    <div style={{fontWeight: "bold"}}>{global.yes}</div>
                </AnsweredYesButton>
                <AnsweredNoButton
                    onClick={() => {
                        handleNoResponse();
                    }}
                >
                    <div style={{fontWeight: "bold"}}>{global.no}</div>
                </AnsweredNoButton>
            </GlobalModal>
            {!showModal && (
                <ElementsContainer>
                    <QRCode
                        size={300}
                        style={{maxWidth: "60%", width: "60%"}}
                        value={`${process.env.REACT_APP_BASE_URL}/${global.categoriesPath.replace("/", "", 1)}/${menu.restaurant.id}`}
                    />
                </ElementsContainer>
            )}
        </>
    );
}

export default ShowQR;
