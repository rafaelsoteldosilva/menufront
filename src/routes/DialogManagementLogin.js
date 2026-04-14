// Convertir a login

import React, {useEffect, useRef, useState, useContext} from "react";
import {useForm} from "react-hook-form";
import {Box, Button, Paper, TextField, Typography} from "@mui/material";
import {toastSuccess, toastError, toastInfo} from "../utils/toastMessages";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import {
    GlobalModal,
    AnsweredYesButton,
    AnsweredNoButton,
} from "../globalDefinitions/globalModal";

import {
    EnvironmentOptionItemsContext,
    environmentOptionItemsContextActions,
} from "../contexts/environmentOptionItemsContext";

import {faQuestion} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";

import {
    fetchMenu,
    getRestaurantMenu,
    resetStateChange,
} from "../slices/restaurantMenuSlice";

import * as global from "../globalDefinitions/globalConstants";

import {useNavigation} from "../contexts/navigationContext";
import {useDispatch, useSelector} from "react-redux";
import {
    tryTologinIntoTheAdminAreaApi,
    loginNoFurtherActionsApi,
    loginNormallyApi,
    logoutFromAdminAreaApi,
} from "../axiosCalls/axiosAPICalls";
import {checkResponseStatus} from "../utils/checkResponseStatus";
import styled, {keyframes} from "styled-components";
import {sanitizeStr} from "../utils/severalFunctions";

const spin = keyframes`
    to {
        transform: rotate(360deg);
    }
`;

const Spinner = styled.div`
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #7983ff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: ${spin} 1s linear infinite;
`;

const Curtain = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
`;

function DialogManagementLogin() {
    const {appNavigate} = useNavigation();
    const menu = useSelector(getRestaurantMenu);
    const reduxStateDispatch = useDispatch();

    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);
    const {environmentOptionItemsStateDispatch} = useContext(
        EnvironmentOptionItemsContext
    );

    const nameRef = useRef(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showCurtain, setShowCurtain] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [newUser, setNewUser] = useState("");

    let initialValues = {
        defaults: {
            userName: "",
            userPassword: "",
        },
    };

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        watch,
        reset,
    } = useForm({
        mode: "onChange",
        defaultValues: initialValues.defaults,
        criteriaMode: "all",
    });

    const userNameValue = watch("userName");
    const userPasswordValue = watch("userPassword");

    async function handleYesResponse() {
        let result = {status: 300, error: ""};
        result = await logoutFromAdminAreaApi(menu.restaurant.id);
        if (checkResponseStatus(result.status)) {
            toastSuccess(result.message);
        }
        result = await loginNoFurtherActionsApi(menu.restaurant.id, newUser);
        if (checkResponseStatus(result.status)) {
            setShowCurtain(false);

            reduxStateDispatch(fetchMenu(menu.restaurant.id));
            reduxStateDispatch(resetStateChange());

            toastSuccess(
                global.greetUserHi + userNameValue + global.greetUserWelcome
            );
            toastInfo(global.rememberToLogout);
            globalStateDispatch({
                type: globalStateContextActions.setDontPerformAnyFurtherActionsTrue,
            });
            environmentOptionItemsStateDispatch({
                type: environmentOptionItemsContextActions.setPrivateEnvironment,
            });

            appNavigate(global.managementPath);
        }
    }

    function handleNoResponse() {
        setShowModal(false);
    }

    useEffect(() => {
        initialValues.defaults.userName = "";
        initialValues.defaults.userPassword = "";
        nameRef.current.focus();
        // If I take eslint-disable-next-line out, then when there occurs an error in password, name gets the
        // focus automatically, disrupting the smooth edition
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.managementLoginPath,
        });
    }, [globalStateDispatch]);

    useEffect(() => {
        if (
            globalState.editionObject !== null &&
            globalState.featuresOfTheEditionObject.objectType ===
                global.managementLogin
        ) {
            setValue("userName", globalState.editionObject?.userName || "");
            setValue(
                "userPassword",
                globalState.editionObject?.userPassword || ""
            );

            globalStateDispatch({
                type: globalStateContextActions.clearEditionObject,
            });
        }
    }, [
        globalState.editionObject,
        globalState.featuresOfTheEditionObject,
        globalStateDispatch,
        setValue,
    ]);

    const validateField = (fieldName) => (value) => {
        let trimmedValue = "";
        switch (fieldName) {
            case "userName": {
                trimmedValue = value.trim();

                if (trimmedValue === "") {
                    return global.userNameRequired;
                }
                break;
            }

            case "userPassword": {
                trimmedValue = value.trim();
                if (trimmedValue === "") {
                    return global.userPasswordRequired;
                }
                if (
                    trimmedValue.length <
                    global.minDialogRestaurantUserPasswordLength
                ) {
                    return global.userPasswordMinEightCharsLong;
                }
                if (
                    trimmedValue.length >
                    global.maxDialogRestaurantUserPasswordLength
                ) {
                    return global.userPasswordMaxLength;
                }
                const regex =
                    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

                if (!value || regex.test(value)) {
                    return true;
                }

                return global.userPasswordRules;
            }

            default: {
                break;
            }
        }

        return undefined;
    };

    const onSubmit = async () => {
        let result = {};
        setShowCurtain(true);
        let trimmedUserNameValue = sanitizeStr(userNameValue.trim());
        let trimmedUserPasswordValue = sanitizeStr(userPasswordValue.trim());
        result = {status: 300, error: ""};

        if (global.accessBackend) {
            result = await tryTologinIntoTheAdminAreaApi(
                menu.restaurant.id,
                trimmedUserNameValue,
                trimmedUserPasswordValue
            );
        }
        if (checkResponseStatus(result.status)) {
            if (!result.somebodyIn) {
                result = await loginNormallyApi(
                    menu.restaurant.id,
                    result.newUserId
                );
                setShowCurtain(false);

                reduxStateDispatch(fetchMenu(menu.restaurant.id));
                reduxStateDispatch(resetStateChange());

                toastSuccess(
                    global.greetUserHi + userNameValue + global.greetUserWelcome
                );

                environmentOptionItemsStateDispatch({
                    type: environmentOptionItemsContextActions.setPrivateEnvironment,
                });

                appNavigate(global.managementPath);
            } else {
                if (result.newUserId === menu.restaurant.currently_logged_in) {
                    result = await loginNoFurtherActionsApi(
                        menu.restaurant.id,
                        result.newUserId
                    );
                    setShowCurtain(false);

                    reduxStateDispatch(fetchMenu(menu.restaurant.id));
                    reduxStateDispatch(resetStateChange());

                    toastSuccess(
                        global.greetUserHi +
                            userNameValue +
                            global.greetUserWelcome
                    );
                    toastError(global.userCannotPerformFurtherActions);
                    globalStateDispatch({
                        type: globalStateContextActions.setDontPerformAnyFurtherActionsTrue,
                    });
                    environmentOptionItemsStateDispatch({
                        type: environmentOptionItemsContextActions.setPrivateEnvironment,
                    });

                    appNavigate(global.managementPath);
                } else if (result.newUserIsMain || result.newUserIsSuper) {
                    if (result.currentUserName !== "Atonn") {
                        setShowModal(true);
                        setNewUser(result.newUserId);
                    } else {
                        toastError("El super usuario Atonn está editando");
                    }
                } else {
                    let myMessage = `El usuario ${result.currentUserName} está editando`;
                    toastError(myMessage);
                }
                setShowCurtain(false);
            }
        } else {
            toastError("Datos no coinciden, nombre del usuario o contraseña");
            setShowCurtain(false);
        }
    };

    const handleReset = () => {
        reset(initialValues.defaults);
        toastSuccess(global.resetWasPerformed);
    };

    function handleGoBack() {
        switch (globalState.currentFunction) {
            case global.homePath: {
                appNavigate(
                    `${global.homePath}/${globalState.currentRestaurant}`
                );
                break;
            }

            case global.categoriesPath: {
                appNavigate(
                    `${global.categoriesPath}/${globalState.currentRestaurant}`
                );
                break;
            }

            case global.dishesPath: {
                appNavigate(
                    `${global.dishesPath}/${globalState.currentRestaurant}/${globalState.currentCategoryIndex}`
                );
                break;
            }

            case global.dishPath: {
                appNavigate(
                    `${global.dishPath}/${globalState.currentRestaurant}/${globalState.currentCategoryIndex}/${globalState.currentDishIndex}`
                );
                break;
            }

            default: {
                appNavigate(
                    `${global.categoriesPath}/${globalState.currentRestaurant}`
                );
                break;
            }
        }
    }

    function handleHelp() {
        if (Object.keys(errors).length !== 0) {
            toastInfo(global.errorsInDialog);
            return;
        }
        let managementLoginObject = {};
        managementLoginObject.userName = userNameValue;
        managementLoginObject.userPassword = userPasswordValue;

        globalStateDispatch({
            type: globalStateContextActions.setManagementLoginObject,
            payload: managementLoginObject,
        });
        appNavigate(global.helpPath, {
            state: {
                videoName: "public_dialog_management_login",
            },
        });
    }

    function togglePaswordVisibility() {
        setShowPassword(!showPassword);
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                paddingLeft: "20px",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                zIndex: 100,
            }}
        >
            {showCurtain && (
                <Curtain>
                    <Spinner />
                </Curtain>
            )}
            <GlobalModal show={showModal}>
                <div style={{fontWeight: "bold", color: "black"}}>
                    {global.doYouWantToCloseCurrentUser}
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Paper
                        sx={{
                            width: "280px",
                            margin: "auto",
                            marginTop: "100px",
                            padding: "10px",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                            }}
                        >
                            <Typography
                                align="center"
                                sx={{fontWeight: "bold"}}
                            >
                                {global.typeYourCredentials}
                            </Typography>
                            <Button
                                onClick={handleHelp}
                                variant="contained"
                                color="warning"
                                style={{
                                    minWidth: "10px",
                                    width: "25px",
                                    maxHeight: "25px",
                                    marginLeft: "30px",
                                    marginTop: "-3px",
                                }}
                            >
                                <FontAwesomeIcon icon={faQuestion} />
                            </Button>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                width: "100%",
                            }}
                        >
                            <TextField
                                label={global.managerNameText}
                                fullWidth
                                variant="filled"
                                value={userNameValue}
                                {...register("userName", {
                                    validate: validateField("userName"),
                                })}
                                inputProps={{
                                    autoComplete: "off",
                                    maxLength:
                                        global.maxManagementLoginNameLength,
                                }}
                                type="text"
                                error={!!errors.userName}
                                helperText={errors.userName?.message}
                                style={{width: "90%", padding: "10px"}}
                                inputRef={nameRef}
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "99%",
                                }}
                            >
                                <TextField
                                    label={global.managerPasswordText}
                                    fullWidth
                                    variant="filled"
                                    value={userPasswordValue}
                                    {...register("userPassword", {
                                        validate: validateField("userPassword"),
                                    })}
                                    inputProps={{autoComplete: "off"}}
                                    type={showPassword ? "text" : "password"}
                                    error={!!errors.userPassword}
                                    helperText={errors.userPassword?.message}
                                    style={{
                                        width: "86%",
                                        padding: "10px",
                                    }}
                                />
                                <Box onClick={togglePaswordVisibility}>
                                    {showPassword ? (
                                        <VisibilityOffIcon />
                                    ) : (
                                        <VisibilityIcon />
                                    )}
                                </Box>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                margin: "10px",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-around",
                            }}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                <DoneOutlineIcon />
                            </Button>

                            <Button onClick={handleReset} variant={"outlined"}>
                                <RestartAltIcon />
                            </Button>

                            <Button onClick={handleGoBack} variant={"outlined"}>
                                <CancelIcon />
                            </Button>
                        </Box>
                    </Paper>
                </form>
            )}
        </div>
    );
}

export default DialogManagementLogin;
