import React, {useEffect, useState, useRef, useContext} from "react";
import {useForm} from "react-hook-form";
import {Box, Button, Paper, TextField, Typography} from "@mui/material";
import * as global from "../globalDefinitions/globalConstants";
import {toastInfo} from "../utils/toastMessages";

import {
    GlobalModal,
    AnsweredYesButton,
    AnsweredNoButton,
} from "../globalDefinitions/globalModal";

import {useLocation} from "react-router-dom";
import {useNavigation} from "../contexts/navigationContext";
import {faQuestion} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";

import {sendConfirmationKeyToEMailApi} from "../axiosCalls/axiosAPICalls";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";

import {getRestaurantMenu} from "../slices/restaurantMenuSlice";

import styled from "styled-components";
import {useSelector} from "react-redux";
import {checkResponseStatus} from "../utils/checkResponseStatus";

const ContentContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    padding-left: 10px;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 100;
    user-select: none;
`;

const DialogBox = styled.div`
    max-width: 390px;
    margin-top: 80px;
`;

function DialogEMailValidation() {
    const {state} = useLocation();
    const {userIndex, userName, userEMail} = state;
    const {globalStateDispatch} = useContext(GlobalStateContext);
    const [showModal, setShowModal] = useState(false);

    const menu = useSelector(getRestaurantMenu);

    const [fourDigitsKey, setFourDigitsKey] = useState("0");

    const sentKeyRef = useRef(null);

    const {appNavigate} = useNavigation();

    let initialValues = {
        defaults: {
            sentKey: "",
        },
    };

    function generateRandom4DigitString() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    useEffect(() => {
        async function sendEMailkey() {
            const result = await sendConfirmationKeyToEMailApi(
                userEMail,
                fourDigitsKey,
                menu.restaurant.id,
                menu.restaurant.currently_logged_in,
                menu.restaurant.logged_in_user_random_number
            );
            if (checkResponseStatus(result.status)) return true;
            else return false;
        }
        if (fourDigitsKey !== "0") {
            sendEMailkey();
            toastInfo(global.keyWasSentToEMailAddress);
        }
    }, [
        fourDigitsKey,
        menu.restaurant.currently_logged_in,
        menu.restaurant.id,
        menu.restaurant.logged_in_user_random_number,
        userEMail,
    ]);

    useEffect(() => {
        setFourDigitsKey(generateRandom4DigitString());
    }, []);

    useEffect(() => {
        sentKeyRef.current.focus();
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.dialogEMailValidationPath,
        });
        globalStateDispatch({
            type: globalStateContextActions.clearEMailWasValidated,
        });
        // eslint-disable-next-line
    }, []);

    const {
        register,
        handleSubmit,
        formState: {errors},
        // eslint-disable-next-line no-unused-vars
        setValue,
        // eslint-disable-next-line no-unused-vars
        getValues,
        watch,
        reset,
    } = useForm({
        mode: "onChange",
        defaultValues: initialValues.defaults,
        criteriaMode: "all",
    });

    const sentKeyValue = watch("sentKey");

    function handleHelp() {
        appNavigate(global.helpPath, {
            state: {
                videoName: "private_dialog_email_validation",
            },
        });
    }

    function handleGoBack() {
        appNavigate(global.DialogRestaurantUserPath, {
            state: {userIndex},
        });
    }

    const onSubmit = async (data) => {
        if (data.sentKey === fourDigitsKey) {
            globalStateDispatch({
                type: globalStateContextActions.setEMailWasValidated,
                payload: true,
            });
            handleGoBack();
        } else setShowModal(true);
    };

    const handleReset = () => {
        reset(initialValues.defaults);
    };

    function handleCancel() {
        handleGoBack();
    }

    async function sendANewKey() {
        setFourDigitsKey(generateRandom4DigitString());
        // when fourDigitsKey changes, it fires a useEffect above
    }

    function handleYesResponse() {
        setShowModal(false);
    }

    function handleNoResponse() {
        handleGoBack();
    }

    return (
        <ContentContainer>
            <GlobalModal show={showModal}>
                <div style={{fontWeight: "bold", color: "black"}}>
                    {global.keyDoesNotMatchWantToContinue}
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
                    <DialogBox>
                        <Paper
                            sx={{
                                padding: "5px",
                                width: "290px",
                                display: "flex",
                                flexDirection: "column",
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
                                    sx={{fontWeight: "bold", margin: "8px"}}
                                >
                                    {global.validatingEMail}
                                </Typography>
                                <Button
                                    onClick={handleHelp}
                                    variant="contained"
                                    color="warning"
                                    style={{
                                        minWidth: "10px",
                                        width: "25px",
                                        maxHeight: "25px",
                                        marginTop: "5px",
                                        marginLeft: "30px",
                                    }}
                                >
                                    <FontAwesomeIcon icon={faQuestion} />
                                </Button>
                            </Box>
                            <div
                                style={{
                                    marginTop: "10px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {global.userNameText}:
                                <Typography
                                    align="center"
                                    sx={{
                                        fontWeight: "bold",
                                        userSelect: "none",
                                    }}
                                >
                                    {userName}
                                </Typography>
                            </div>
                            <div
                                style={{
                                    marginTop: "10px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {global.userEMailText}
                                <Typography
                                    align="center"
                                    sx={{
                                        fontWeight: "bold",
                                        userSelect: "none",
                                    }}
                                >
                                    {userEMail}
                                </Typography>
                            </div>
                            <div
                                style={{
                                    marginTop: "10px",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Button
                                    onClick={sendANewKey}
                                    variant="contained"
                                    color="secondary"
                                >
                                    <MarkEmailUnreadIcon />
                                </Button>
                                &nbsp;
                                {global.sendANewKey}
                            </div>
                            <TextField
                                label={global.sentKeyText}
                                fullWidth
                                variant="filled"
                                value={sentKeyValue}
                                inputProps={{
                                    autoComplete: "off",
                                    maxLength: global.maxSentKeyLength,
                                }}
                                {...register("sentKey", {
                                    required: global.sentKeyRequired,
                                    pattern: {
                                        value: /^\d{4}$/,
                                        message: global.fourDigitsOnly,
                                    },
                                })}
                                type="text"
                                error={!!errors.sentKey}
                                inputRef={sentKeyRef}
                                helperText={
                                    <span
                                        style={{
                                            whiteSpace: "normal",
                                            wordWrap: "break-word",
                                        }}
                                    >
                                        {errors.sentKey?.message}
                                    </span>
                                }
                                sx={{
                                    width: "100%",
                                    marginTop: "10px",
                                    padding: "10px",
                                    "& .MuiFormHelperText-root": {
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        width: "300px",
                                        maxWidth: "100%",
                                    },
                                }}
                            />
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
                                    color="secondary"
                                >
                                    <DoneOutlineIcon />
                                </Button>

                                <Button
                                    onClick={handleReset}
                                    variant={"outlined"}
                                    color="secondary"
                                >
                                    <RestartAltIcon />
                                </Button>

                                <Button
                                    onClick={handleCancel}
                                    variant={"outlined"}
                                    color="secondary"
                                >
                                    <CancelIcon />
                                </Button>
                            </Box>
                        </Paper>
                    </DialogBox>
                </form>
            )}
        </ContentContainer>
    );
}

export default DialogEMailValidation;
