import React, {useContext, useEffect, useState} from "react";

import {useNavigation} from "../contexts/navigationContext";

import * as global from "../globalDefinitions/globalConstants";

import {getRestaurantMenu} from "../slices/restaurantMenuSlice";

import styled from "styled-components";

import {Button} from "../globalDefinitions/globalStyles";
import {useDispatch, useSelector} from "react-redux";
import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";

import {
    getRestaurantUsers,
    fetchRestaurantUsers,
} from "../slices/restaurantUsersSlice";

import {
    GlobalModal,
    AnsweredYesButton,
    AnsweredNoButton,
} from "../globalDefinitions/globalModal";

import {
    EnvironmentOptionItemsContext,
    environmentOptionItemsContextActions,
} from "../contexts/environmentOptionItemsContext";

import {CurrencyFormatter, monthsAppart} from "../utils/severalFunctions";
import {getAmountToBePaidApi} from "../axiosCalls/axiosAPICalls";

import {checkResponseStatus} from "../utils/checkResponseStatus";
import {toastError} from "../utils/toastMessages";

const PayButton = styled(Button)`
    margin-top: 10px;
    margin-left: 65px;
    width: 200px;
    height: 100px;
    font-size: 22px;
    font-weight: bold;
`;

// good

export default function ShowPaymentState() {
    const {appNavigate} = useNavigation();
    const reduxStateDispatch = useDispatch();

    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);
    const {environmentOptionItemsStateDispatch} = useContext(
        EnvironmentOptionItemsContext,
    );
    const menu = useSelector(getRestaurantMenu);
    const restaurantUsers = useSelector(getRestaurantUsers);

    const [amountToBePaid, setAmountToBePaid] = useState(0);
    const [priceType, setPriceType] = useState("");

    const [confirmationInfo, setConfirmationInfo] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [hasToPay, setHasToPay] = useState(null);

    useEffect(() => {
        async function localGetAmountToBePaidApi() {
            let result = await getAmountToBePaidApi(
                menu.restaurant.id,
                menu.restaurant.currently_logged_in,
                menu.restaurant.logged_in_user_random_number,
            );
            if (checkResponseStatus(result.status)) {
                setAmountToBePaid(result.value);
                setPriceType(result.priceType);
            } else {
                toastError(global.connectionErrorOrUserCanNotPerformOperations);
            }
        }

        reduxStateDispatch(fetchRestaurantUsers(menu.restaurant.id));
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.paymentStatePath,
        });
        localGetAmountToBePaidApi();
    }, [
        globalStateDispatch,
        menu.restaurant.currently_logged_in,
        menu.restaurant.id,
        menu.restaurant.logged_in_user_random_number,
        reduxStateDispatch,
    ]);

    useEffect(() => {
        if (
            monthsAppart(
                menu.restaurant.last_payment_date,
                menu.restaurant.restaurant_current_date,
            ) === 0
        ) {
            setHasToPay(false);
        } else {
            if (
                monthsAppart(
                    menu.restaurant.last_payment_date,
                    menu.restaurant.restaurant_current_date,
                ) -
                    menu.restaurant.number_of_pending_free_months >
                0
            ) {
                setHasToPay(true);
            }
        }
    }, [menu]);

    function ShowMonthName(date) {
        const theDate = new Date(date); // Parse the input date
        const year = theDate.getFullYear(); // Extract the year
        const monthName = theDate.toLocaleString(
            menu.restaurant.public_country.locale,
            {month: "long"},
        ); // Get the month name in Spanish
        return `${year} ${monthName}`; // Combine year and month name
    }

    useEffect(() => {
        if (globalState.generalMessage.length > 0) {
            setConfirmationInfo(globalState.generalMessage);
            globalStateDispatch({
                type: globalStateContextActions.clearGeneralMessage,
            });
        }
    }, [globalState.generalMessage, globalStateDispatch]);

    function PayButtonClicked() {
        // if it is here then it is not up to date, the button wouldn't appear
        if (hasToPay === null) {
            setHasToPay(false);
        }
        const userIndex = restaurantUsers.findIndex(
            (user) =>
                user.restaurant_user.id === menu.restaurant.currently_logged_in,
        );

        if (userIndex !== global.noValue) {
            if (
                !restaurantUsers[userIndex].restaurant_user
                    .public_email_validated
            ) {
                setShowModal(true);
            } else appNavigate(global.selectPaymentOptionPath);
        }
    }

    function handleYesResponse() {
        // darle salir al paymentState, setear el environmentState
        environmentOptionItemsStateDispatch({
            type: environmentOptionItemsContextActions.setPrivateEnvironment,
        });

        appNavigate(global.managementPath);
    }

    function handleNoResponse() {
        setShowModal(false);
        appNavigate(global.selectPaymentOptionPath);
    }

    return (
        <div>
            <GlobalModal show={showModal}>
                <div style={{fontWeight: "bold", color: "black"}}>
                    {global.doYouWantToValidateEMailFirst}
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
                <div>
                    <div
                        style={{
                            marginTop: "100px",
                            marginLeft: "65px",
                            fontSize: "22px",
                            color: "white",
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                        }}
                    >
                        {global.paymentStateTitle}
                    </div>
                    <div
                        style={{
                            marginTop: "20px",
                            marginLeft: "65px",
                            fontSize: "22px",
                            color: "white",
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                        }}
                    >
                        {global.currentServiceMonth}
                        {ShowMonthName(menu.restaurant.restaurant_current_date)}
                    </div>
                    {!menu.restaurant.restaurant_recently_created && (
                        <div
                            style={{
                                marginLeft: "65px",
                                fontSize: "22px",
                                fontWeight: "bold",
                                color: "white",
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                            }}
                        >
                            {global.lastPaymentMonth}
                            {ShowMonthName(menu.restaurant.last_payment_date)}
                        </div>
                    )}

                    <div
                        style={{
                            marginLeft: "65px",
                            fontSize: "22px",
                            color: "white",
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                        }}
                    >
                        {menu.restaurant.price_type === global.fullPrice
                            ? global.completeVersion
                            : global.minimumVersion}
                    </div>
                    {!hasToPay && (
                        <div>
                            <div
                                style={{
                                    marginTop: "20px",
                                    marginLeft: "65px",
                                    fontSize: "32px",
                                    color: "white",
                                    backgroundColor: "green",
                                    width: "350px",
                                    height: "200px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {global.accountIsUpToDate}
                            </div>
                        </div>
                    )}
                    {confirmationInfo && (
                        <div
                            style={{
                                marginTop: "10px",
                                marginLeft: "65px",
                                color: "white",
                            }}
                        >
                            {/* the payment was sent by email */}
                            {confirmationInfo}
                        </div>
                    )}
                    {hasToPay && (
                        <div>
                            <div
                                style={{
                                    marginLeft: "65px",
                                    fontSize: "22px",
                                    color: "white",
                                    display: "flex",
                                    // flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "flex-start",
                                }}
                            >
                                <div>{global.amountToBePaid}</div>
                                <div>
                                    <CurrencyFormatter
                                        value={amountToBePaid}
                                        style={{
                                            marginTop: "2px",
                                            fontSize: "20px", // Additional styling if needed
                                        }}
                                        currencySymbol={
                                            menu.restaurant.public_country
                                                .currency_symbol
                                        }
                                        locale={
                                            menu.restaurant.public_country
                                                .locale
                                        }
                                        minFrac={
                                            menu.restaurant.public_country
                                                .minimum_fraction_digits
                                        }
                                        maxFrac={
                                            menu.restaurant.public_country
                                                .maximum_fraction_digits
                                        }
                                    />
                                </div>
                            </div>
                            <div
                                style={{
                                    marginLeft: "65px",
                                    fontSize: "16px",
                                    color: "yellow",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "flex-start",
                                }}
                            >
                                {global.whichCorrespondsTo}
                                {priceType}
                            </div>
                            <div
                                style={{
                                    marginLeft: "65px",
                                    fontSize: "16px",
                                    color: "yellow",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "flex-start",
                                }}
                            >
                                {menu.restaurant.price_type ===
                                    global.minimumPrice && (
                                    <div>{global.minimumVersionLacksOf}</div>
                                )}
                            </div>
                            <PayButton onClick={PayButtonClicked}>
                                {global.selectPaymentMethod}
                            </PayButton>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
