import React, {useContext, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "./contexts/globalStateContext";
import {
    EnvironmentOptionItemsContext,
    environmentOptionItemsContextActions,
    environmentOptionItems,
} from "./contexts/environmentOptionItemsContext";

import * as global from "./globalDefinitions/globalConstants";

import digitalMenuLogo from "./assets/DigitalMenuLogo.jpg";

import {
    globalThemePublic,
    globalThemePrivate,
} from "./globalDefinitions/globalStyles";

import {ThemeProvider} from "styled-components";

import {CSSReset} from "./globalDefinitions/globalStyles";

import Main from "./Main";
import {useRef} from "react";
import {
    fetchMenu,
    resetMenuState,
    getRestaurantMenuStatus,
} from "./slices/restaurantMenuSlice";

import {
    checkRestaurantExistenceApi,
    SaveDeviceDescriptionApi,
} from "./axiosCalls/axiosAPICalls";

import styled from "styled-components";
import axios from "axios";

import {EncryptForAuthorizations} from "./utils/severalFunctions";

import {
    // isMobile,
    // isTablet,
    // isDesktop,
    // browserName,
    deviceDetect,
    mobileModel,
    // osName,
} from "react-device-detect";

const ComponentContainer = styled.div``;

const SplashScreen = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
    background-color: black;
`;

const MenuLogo = styled.div`
    width: 200px;
    height: 200px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: row;
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    pointer-events: none;
`;

function App() {
    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);
    const {environmentOptionItemsState, environmentOptionItemsStateDispatch} =
        useContext(EnvironmentOptionItemsContext);

    const restaurantNumber = useRef(0);
    const wrongRestaurant = useRef(false);
    const exitApp = useRef(false);

    const [proceed, setProceed] = useState(false);
    const [firstExcecution, setFirstExcecution] = useState(false);
    const reduxStateDispatch = useDispatch();
    const menuStatus = useSelector(getRestaurantMenuStatus);

    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        async function getFirstToken() {
            const appName = process.env.REACT_APP_USER_NAME;
            const secretKey = process.env.REACT_APP_SECRET_KEY;
            try {
                const response = await axios.patch(
                    `http://localhost:8000/api/v1/get_first_token/`,
                    {
                        appName: appName,
                        secretKey: secretKey,
                    },
                );
                if (response.data.token) {
                    localStorage.setItem(
                        "authToken",
                        EncryptForAuthorizations(
                            response.data.token,
                            secretKey,
                        ),
                    );
                } else {
                    localStorage.setItem("authToken", "basura");
                }
                setFirstExcecution(true);
            } catch (error) {
                return error.message;
            }
        }

        getFirstToken();
    }, []);

    async function detectDeviceInfo() {
        const {deviceType, model, os, browser} = deviceDetect();
        const userAgent = navigator.userAgent;
        let deviceBrand = "";
        let deviceDescription = "";
        let wholeDeviceDescription = "";

        deviceDescription =
            deviceType !== undefined
                ? deviceType
                : "" + model !== undefined
                  ? model
                  : "" + os !== undefined
                    ? os
                    : "" + browser !== undefined
                      ? browser
                      : "" + mobileModel !== undefined
                        ? mobileModel
                        : "";

        const models = {
            iPhone: /\b(iPhone\s\d{1,2})\b/i,
            iPad: /\b(iPad.*)\b/i,
            Samsung: /\b(SM-[\w\d]+)\b/i,
            Pixel: /\b(Pixel\s[\d]+)/i,
            Huawei: /\b(Huawei[\w\d]+)\b/i,
            Windows: /\b(Windows NT [\d.]+)\b/i, // Detect Windows OS version
        };

        for (const [brand, pattern] of Object.entries(models)) {
            const match = userAgent.match(pattern);
            if (match) {
                deviceBrand = `${brand} ${match[1]}`;
            }
        }

        deviceDescription =
            deviceDescription === undefined ? "" : deviceDescription;

        wholeDeviceDescription =
            "device:: " + deviceDescription + ", brand:: " + deviceBrand;

        await SaveDeviceDescriptionApi(wholeDeviceDescription);
    }

    const parseUserAgent = () => {
        const userAgent = navigator.userAgent;

        // Patterns to detect various models, including Windows
        const models = {
            iPhone: /\b(iPhone\s\d{1,2})\b/i,
            iPad: /\b(iPad.*)\b/i,
            Samsung: /\b(SM-[\w\d]+)\b/i,
            Pixel: /\b(Pixel\s[\d]+)/i,
            Huawei: /\b(Huawei[\w\d]+)\b/i,
            Windows: /\b(Windows NT [\d.]+)\b/i, // Detect Windows OS version
        };

        for (const [brand, pattern] of Object.entries(models)) {
            const match = userAgent.match(pattern);
            if (match) {
                return `${brand} ${match[1]}`;
            }
        }

        return "Unknown Device";
    };

    useEffect(() => {
        let restaurantValue = global.noValue;
        const fetchData = async () => {
            let result = 0;
            const urlPattern =
                /\/\?restaurant=(\d+)|\/item\/(\d+)\/\d+\/\d+|\/categories\/(\d+)|\/home\/(\d+)|^\/$/;
            const currentURL = window.location.href;
            const match = currentURL.match(urlPattern);

            if (match) {
                // Check if a restaurant value is captured
                if (match[1]) {
                    restaurantValue = match[1]; // Use the captured value
                } else if (match[2]) {
                    restaurantValue = match[2]; // Use the captured value
                } else if (match[3]) {
                    restaurantValue = match[3]; // Use the captured value
                } else if (match[4]) {
                    restaurantValue = match[4]; // Use the captured value
                }
            }
            // restaurant is not in the query string
            if (restaurantValue === global.noValue) restaurantValue = 1;
            if (restaurantValue !== global.noValue) {
                restaurantValue = Number(restaurantValue);

                restaurantNumber.current = restaurantValue;
                try {
                    result = await checkRestaurantExistenceApi(
                        restaurantNumber.current,
                    );
                    if (result !== 1 || result === undefined) {
                        wrongRestaurant.current = true;
                        exitApp.current = true;
                    }
                } catch (error) {
                    alert(global.connectionErrorOrUserCanNotPerformOperations);
                    exitApp.current = true;
                }

                if (
                    wrongRestaurant.current === false &&
                    exitApp.current === false
                ) {
                    globalStateDispatch({
                        type: globalStateContextActions.setCurrentRestaurant,
                        payload: restaurantNumber.current,
                    });
                    globalStateDispatch({
                        type: globalStateContextActions.setCurrentFunction,
                        payload: global.categoriesPath,
                    });
                    globalStateDispatch({
                        type: globalStateContextActions.sendDrawerOpenSignal,
                        payload: true,
                    });
                    environmentOptionItemsStateDispatch({
                        type: environmentOptionItemsContextActions.setPublicEnvironment,
                    });

                    reduxStateDispatch(resetMenuState());
                    reduxStateDispatch(fetchMenu(restaurantNumber.current));
                }
            }
        };

        if (firstExcecution) {
            detectDeviceInfo();
            parseUserAgent();
            fetchData();
        }
    }, [
        firstExcecution,
        reduxStateDispatch,
        environmentOptionItemsStateDispatch,
        globalStateDispatch,
        exitApp,
    ]);

    useEffect(() => {
        if (menuStatus === global.backendReadingSucceeded) {
            if (
                environmentOptionItemsState.environmentOptionItems ===
                environmentOptionItems.publicEnvironment
            ) {
                globalStateDispatch({
                    type: globalStateContextActions.setSelectedTheme,
                    payload: global.publicTheme,
                });
                globalStateDispatch({
                    type: globalStateContextActions.setCurrentMenuOption,
                    payload: global.menuOptions.public.menu,
                });
            } else {
                // environmentOptionItemsState.environment === global.privateTheme
                globalStateDispatch({
                    type: globalStateContextActions.setSelectedTheme,
                    payload: global.privateTheme,
                });
            }
            setProceed(true);
            globalStateDispatch({
                type: globalStateContextActions.clearDoNotOpenDrawer,
            });
        }
    }, [menuStatus, environmentOptionItemsState, globalStateDispatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 1500);

        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, []);

    if (showSplash) {
        return (
            <SplashScreen>
                <MenuLogo>
                    <Image src={digitalMenuLogo} alt="Menu Logo" />
                </MenuLogo>
            </SplashScreen>
        );
    }

    if (!proceed) {
        return <p>{global.waiting}</p>;
    } else
        return (
            <ComponentContainer>
                <ThemeProvider
                    theme={
                        globalState.selectedTheme === global.publicTheme
                            ? globalThemePublic
                            : globalState.selectedTheme === global.privateTheme
                              ? globalThemePrivate
                              : globalThemePublic
                    }
                >
                    <CSSReset />
                    <Main />
                </ThemeProvider>
            </ComponentContainer>
        );
}

export default App;
