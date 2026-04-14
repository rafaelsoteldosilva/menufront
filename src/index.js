import React from "react";
import App from "./App";
import ReactDOM from "react-dom";

import {Provider} from "react-redux";
import reducers from "./appReducers/reducers";

import {GlobalStateContextProvider} from "./contexts/globalStateContext";
import {EnvironmentOptionItemsContextProvider} from "./contexts/environmentOptionItemsContext";

ReactDOM.render(
    <React.StrictMode>
        <GlobalStateContextProvider>
            <EnvironmentOptionItemsContextProvider>
                <Provider store={reducers}>
                    <App />
                </Provider>
            </EnvironmentOptionItemsContextProvider>
        </GlobalStateContextProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

// good
