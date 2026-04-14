import React, {useContext, useEffect, useState} from "react";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import {GlobalStateContext} from "../contexts/globalStateContext";
import {
    EnvironmentOptionItemsContext,
    environmentOptionItems,
} from "../contexts/environmentOptionItemsContext";
import * as global from "../globalDefinitions/globalConstants";

import {getRestaurantMenu} from "../slices/restaurantMenuSlice";

import {useSelector} from "react-redux";
import {useLocation} from "react-router-dom";
import {useNavigation} from "../contexts/navigationContext";

import {Button} from "@mui/material";

function ShowAllRejectionReasons() {
    const {globalState} = useContext(GlobalStateContext);
    const menu = useSelector(getRestaurantMenu);
    const {state} = useLocation();
    const [reviewObj] = useState(state);
    const {environmentOptionItemsState} = useContext(
        EnvironmentOptionItemsContext
    );
    const {appNavigate} = useNavigation();

    const [myDisclaimers, setMyDisclaimers] = useState([]);

    useEffect(() => {
        let myDisclaimersArray = [];
        myDisclaimersArray.push(global.consideration1);
        myDisclaimersArray.push(global.consideration2);
        myDisclaimersArray.push(global.consideration3);
        myDisclaimersArray.push(global.consideration4);

        setMyDisclaimers(myDisclaimersArray);
    }, []);

    function handleGoBack() {
        if (
            environmentOptionItemsState.environmentOptionItems ===
            environmentOptionItems.publicEnvironment
        ) {
            appNavigate(global.DialogAddNewReviewPath);
        } else {
            switch (globalState.currentFunction) {
                case global.showReviewsPath: {
                    appNavigate(global.showReviewsPath);
                    break;
                }

                case global.showReviewPath: // there are 2 levels of reviewObj, we are adding one with { reviewObj: ...}
                // so there are 3 levels, we substract 2 and it results in just one
                {
                    appNavigate(global.showReviewPath, {
                        state: {reviewObj: reviewObj.reviewObj.reviewObj},
                    });
                    break;
                }

                default: {
                    break;
                }
            }
        }
    }

    return (
        <div
            style={{
                position: "relative",
                width: "95vw",
                minHeight: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                padding: "20px",
                fontFamily: "Roboto",
                userSelect: "none",
            }}
        >
            <Button
                onClick={handleGoBack}
                variant={"outlined"}
                style={{backgroundColor: "white", marginTop: "60px"}}
            >
                <KeyboardBackspaceIcon />
            </Button>
            <div
                style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    marginTop: "10px",
                }}
            >
                {global.reasonsOfRejection}
            </div>
            {menu.rejection_reasons.map((reason, index) => {
                return (
                    <div
                        key={index}
                        style={{
                            marginTop: "10px",
                            color: "white",
                            fontSize: "16px",
                        }}
                    >
                        <div style={{fontWeight: "bold"}}>
                            {reason.rejection_reason.reason}
                        </div>
                        <div>{reason.rejection_reason.explanation}</div>
                    </div>
                );
            })}
            <div
                style={{
                    marginTop: "20px",
                    fontWeight: "bold",
                    textAlign: "center",
                }}
            >
                {global.otherConsiderations}
            </div>
            {myDisclaimers.map((reason, index) => {
                return (
                    <div
                        key={index}
                        style={{
                            marginTop: "10px",
                            color: "white",
                            fontSize: "16px",
                        }}
                    >
                        <div>{reason}</div>
                    </div>
                );
            })}
            <Button
                onClick={handleGoBack}
                variant={"outlined"}
                style={{backgroundColor: "white", marginTop: "10px"}}
            >
                <KeyboardBackspaceIcon />
            </Button>
        </div>
    );
}

export default ShowAllRejectionReasons;
