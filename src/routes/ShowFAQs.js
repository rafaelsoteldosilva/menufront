import React, {useContext, useEffect} from "react";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";

import * as global from "../globalDefinitions/globalConstants";

import {useNavigation} from "../contexts/navigationContext";

import {Button} from "@mui/material";

// good

function FAQsComponent() {
    const {globalStateDispatch} = useContext(GlobalStateContext);

    const {appNavigate} = useNavigation();

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.frequentlyAskedQuestionsPath,
        });
    }, [globalStateDispatch]);

    function handleGoBack() {
        appNavigate(global.managementPath);
    }

    return (
        <div
            style={{
                position: "relative",
                width: "95vw",
                minHeight: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.9)",
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
                    fontSize: "18px",
                }}
            >
                {global.frequentlyAskedQuestions}
            </div>
            {global.FAQs.map((question, index) => {
                return (
                    <div
                        key={index}
                        style={{
                            marginTop: "10px",
                            color: "white",
                            fontSize: "16px",
                        }}
                    >
                        <div style={{fontWeight: "bold", fontSize: "18px"}}>
                            {question.question}
                        </div>
                        <div>{question.answer}</div>
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

export default FAQsComponent;
