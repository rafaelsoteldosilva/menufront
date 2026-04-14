import React, {useEffect, useContext, useState} from "react";
import styled from "styled-components";
import * as global from "../globalDefinitions/globalConstants";

import {GlobalStateContext} from "../contexts/globalStateContext";

import {
    EnvironmentOptionItemsContext,
    environmentOptionItems,
} from "../contexts/environmentOptionItemsContext";

const ScreenName = styled.div`
    margin-top: 80px;
    margin-bottom: 19px;
    display: flex;
    flex-direction: column;
    user-select: none;
`;

// good

export function ShowChangesMade() {
    const {globalState} = useContext(GlobalStateContext);
    const {environmentOptionItemsState} = useContext(
        EnvironmentOptionItemsContext
    );
    const [proceed, setProceed] = useState(false);

    useEffect(() => {
        if (globalState.listOfChangesMade.length > 0) {
            setProceed(true);
        }
    }, [globalState.listOfChangesMade.length]);

    if (!proceed) {
        return (
            <div>
                <div
                    style={{
                        width: "80%",
                        marginLeft: "55px",
                        marginBottom: "15px",
                        borderLeft: "2px solid #4C867D",
                        borderBottom: "2px solid #4C867D",
                    }}
                >
                    <ScreenName>
                        <div style={{padding: "5px"}}>
                            {environmentOptionItemsState.environmentOptionItems ===
                            environmentOptionItems.menuPrivateEnvironment
                                ? global.editingMenu
                                : null}
                        </div>
                        <div style={{marginLeft: "5px"}}>
                            {global.showChangesMadeTitle}
                        </div>
                    </ScreenName>
                </div>
                <div style={{marginLeft: "65px", marginTop: "10px"}}>
                    {global.noChangesWereMadeYet}
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <div
                    style={{
                        width: "80%",
                        marginLeft: "55px",
                        marginBottom: "15px",
                        borderLeft: "2px solid #4C867D",
                        borderBottom: "2px solid #4C867D",
                    }}
                >
                    <ScreenName>
                        <div style={{padding: "5px"}}>
                            {environmentOptionItemsState.environmentOptionItems ===
                            environmentOptionItems.menuPrivateEnvironment
                                ? global.editingMenu
                                : null}
                        </div>
                        <div style={{marginLeft: "5px"}}>
                            {global.showChangesMadeTitle}
                        </div>
                    </ScreenName>
                </div>
                <div style={{marginTop: "20px", marginLeft: "60px"}}>
                    {globalState.listOfChangesMade.map((change, index) => (
                        <div
                            key={index}
                            style={{
                                marginLeft: "5px",
                                marginTop: "10px",
                                border: "2px solid #4C867D",
                            }}
                        >
                            <div>👉 {change}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
