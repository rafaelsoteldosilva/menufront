import React, {useEffect, useContext, useState} from "react";

import * as global from "../globalDefinitions/globalConstants";
import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";
import {
    EnvironmentOptionItemsContext,
    environmentOptionItemsContextActions,
} from "../contexts/environmentOptionItemsContext";
import {getRestaurantMenu} from "../slices/restaurantMenuSlice";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {monthsAppart} from "../utils/severalFunctions";

const GlobalContainer = styled.div``;

// good

function ShowManagement() {
    const {globalStateDispatch} = useContext(GlobalStateContext);
    const {environmentOptionItemsStateDispatch} = useContext(
        EnvironmentOptionItemsContext
    );
    const menu = useSelector(getRestaurantMenu);

    const [versionType, setVersionType] = useState("");
    const [hasToPay, setHasToPay] = useState(false);

    useEffect(() => {
        if (
            monthsAppart(
                menu.restaurant.last_payment_date,
                menu.restaurant.restaurant_current_date
            ) === 0
        ) {
            environmentOptionItemsStateDispatch({
                type: environmentOptionItemsContextActions.resetMenuItemColor,
                payload: {
                    itemOriginalTitle: global.paymentStateTitle,
                },
            });
            setHasToPay(false);
        } else {
            if (
                monthsAppart(
                    menu.restaurant.last_payment_date,
                    menu.restaurant.restaurant_current_date
                ) -
                    menu.restaurant.number_of_pending_free_months >
                0
            ) {
                environmentOptionItemsStateDispatch({
                    type: environmentOptionItemsContextActions.setMenuItemColor,
                    payload: {
                        itemOriginalTitle: global.paymentStateTitle,
                        color: "#57FCF2",
                    },
                });
                setHasToPay(true);
            }
        }
    }, [environmentOptionItemsStateDispatch, menu]);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.sendDrawerOpenSignal,
            payload: true,
        });
        globalStateDispatch({
            type: globalStateContextActions.setCurrentlyWatching,
            payload: global.management,
        });
        globalStateDispatch({
            type: globalStateContextActions.setCurrentMenuOption,
            payload: global.menuOptions.private.management,
        });
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.managementPath,
        });
    }, [globalStateDispatch]);

    useEffect(() => {
        if (menu !== undefined && menu !== null) {
            if (menu.restaurant.price_type === global.fullPrice) {
                setVersionType(global.completeVersion);
            } else setVersionType(global.minimumVersion);
        }
    }, [menu]);

    return (
        <GlobalContainer>
            <div
                style={{
                    marginTop: "200px",
                    padding: "5px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    marginLeft: "80px",
                    userSelect: "none",
                    cursor: "auto",
                }}
            >
                {global.inManagementAreaMessage}
            </div>
            <div
                style={{
                    marginTop: "20px",
                    padding: "5px",
                    display: "flex",
                    flexDirection: "row",
                    fontWeight: "bold",
                    justifyContent: "center",
                    marginLeft: "80px",
                    userSelect: "none",
                    cursor: "auto",
                }}
            >
                {global.enjoyingVersion}
                {versionType}
            </div>
            {hasToPay && (
                <div
                    style={{
                        marginTop: "20px",
                        padding: "5px",
                        display: "flex",
                        flexDirection: "row",
                        fontWeight: "bold",
                        justifyContent: "center",
                        marginLeft: "80px",
                        userSelect: "none",
                        cursor: "auto",
                        color: "#57FCF2",
                    }}
                >
                    {global.gracePaymentPeriodIsActive}
                </div>
            )}
        </GlobalContainer>
    );
}

export default ShowManagement;
