import React, {useContext, useEffect, useRef, useState} from "react";
import {useForm, Controller} from "react-hook-form";

import {Box, Button, TextField, Paper, Typography} from "@mui/material";

import CancelIcon from "@mui/icons-material/Cancel";

import RestartAltIcon from "@mui/icons-material/RestartAlt";

import DoneOutlineIcon from "@mui/icons-material/DoneOutline";

import {faQuestion} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import styled from "styled-components";
import {QuillEditor, SetQuillEditorContent} from "../utils/quillEditor";
import {useLocation} from "react-router-dom";
import {useNavigation} from "../contexts/navigationContext";

import {checkResponseStatus} from "../utils/checkResponseStatus";

import {
    getRestaurantMenu,
    changePromotionData,
    resetStateChange,
    addANewPromotion,
} from "../slices/restaurantMenuSlice";
import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";
import {useDispatch, useSelector} from "react-redux";

import * as global from "../globalDefinitions/globalConstants";
import {
    updatePromotionPrivatelyApi,
    createANewPromotionApi,
} from "../axiosCalls/axiosAPICalls";

import {toastError, toastInfo, toastSuccess} from "../utils/toastMessages";
import {sanitizeStr} from "../utils/severalFunctions";

const ContentContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-left: -40px;
    margin-top: 10px;
    height: 100%;
    width: 120%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 100;
    user-select: none;
`;

const DialogBox = styled.div`
    width: 100%;
    margin-top: 50px;
    margin-left: 10px;
    padding: 5px;
`;

export default function DialogPromotion() {
    const [setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const {state} = useLocation();
    const {promotionIndex = global.noValue} = state;
    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);
    const menu = useSelector(getRestaurantMenu);
    const reduxStateDispatch = useDispatch();
    const {appNavigate} = useNavigation();

    const initialValues =
        promotionIndex === global.noValue
            ? {
                  defaults: {
                      promotionName: "",
                      promotionAttractor: "",
                      quillEditor: "",
                  },
              }
            : {
                  defaults: {
                      promotionName:
                          menu.promotions[promotionIndex]?.promotion
                              .private_name,
                      promotionAttractor:
                          menu.promotions[promotionIndex]?.promotion
                              .private_attractor_text,
                      quillEditor:
                          menu.promotions[promotionIndex]?.promotion
                              .private_promotion_text,
                  },
              };

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.DialogPromotionPrivatePath,
        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (promotionIndex !== global.noValue) {
            handleReset();
        }
        // eslint-disable-next-line
    }, [menu, promotionIndex]);

    const {
        register,
        unregister,
        control,
        handleSubmit,
        formState: {errors},
        setValue,
        getValues,
        watch,
        clearErrors,
    } = useForm({
        mode: "onChange",
        defaultValues: initialValues.defaults,
        criteriaMode: "all",
    });

    useEffect(() => {
        // Register the "quillEditor" field with validation
        register("quillEditor", {
            validate: validateField("quillEditor"),
        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const quillEditorContent =
            menu.promotions[promotionIndex]?.promotion.public_promotion_text ||
            "";
        setValue("quillEditor", quillEditorContent);
    }, [menu, promotionIndex, setValue]);

    const quillEditorRef = useRef();
    const [doNotSubmit, setDoNotSubmit] = useState(true);
    const [doNotValidate, setDoNotValidate] = useState(true);

    const promotionNameValue = watch("promotionName");
    const promotionAttractorValue = watch("promotionAttractor");

    useEffect(() => {
        if (
            globalState.editionObject !== null &&
            globalState.featuresOfTheEditionObject.objectType ===
                global.promotions
        ) {
            setValue("promotionName", globalState.editionObject.promotionName);
            setValue(
                "promotionAttractor",
                globalState.editionObject.promotionAttractor
            );
            let content = globalState.editionObject.editorText;
            if (quillEditorRef.current) {
                SetQuillEditorContent(quillEditorRef, content);
            }
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
        if (!doNotValidate) {
            let trimmedValue = "";

            switch (fieldName) {
                case "promotionName":
                    trimmedValue = value.trim();

                    if (trimmedValue === "") {
                        return "Promotion Name is required";
                    }
                    break;

                case "promotionAttractor":
                    trimmedValue = value.trim();

                    if (trimmedValue === "") {
                        return "Key phrase is required";
                    }
                    break;

                case "quillEditor":
                    trimmedValue = quillEditorRef.current.root.innerText.trim();
                    if (trimmedValue === "" || trimmedValue === "\n") {
                        return "Promotion Text is required";
                    }
                    break;

                default:
                    break;
            }
        }

        return undefined;
    };

    function handleGoBack() {
        appNavigate(global.showPrivatePromotionsPath);
    }

    // Return a cleanup function to unregister the field when the component is unmounted
    useEffect(() => {
        return () => unregister("quillEditor");
        // eslint-disable-next-line
    }, []);

    // eslint-disable-next-line no-unused-vars
    const onSubmit = async (data) => {
        if (!doNotSubmit) {
            const updatedData = {};
            const newValues = getValues();

            for (const fieldName in newValues) {
                if (
                    initialValues.defaults[fieldName].trim() !==
                    newValues[fieldName].trim()
                ) {
                    let updatedFieldName;
                    switch (fieldName) {
                        case "promotionName":
                            updatedFieldName = "private_name";
                            break;
                        case "promotionAttractor":
                            updatedFieldName = "private_attractor_text";
                            break;
                        case "quillEditor":
                            updatedFieldName = "private_promotion_text";
                            break;

                        default:
                            updatedFieldName = fieldName;
                    }
                    if (typeof newValues[fieldName] === "string") {
                        updatedData[updatedFieldName] = sanitizeStr(
                            newValues[fieldName].trim()
                        );
                    } else {
                        updatedData[updatedFieldName] = newValues[fieldName];
                    }
                }
            }

            try {
                let result = {status: 300, error: ""};
                let noModificationWereMade = true;
                if (Object.keys(updatedData).length > 0)
                    noModificationWereMade = false;
                if (global.accessBackend && promotionIndex === global.noValue) {
                    // it is creating a new promotion
                    result = await createANewPromotionApi(
                        menu.restaurant.id,
                        updatedData,
                        menu.restaurant.currently_logged_in,
                        menu.restaurant.logged_in_user_random_number
                    );
                }
                if (global.accessBackend && promotionIndex !== global.noValue) {
                    if (!noModificationWereMade) {
                        result = await updatePromotionPrivatelyApi(
                            menu.restaurant.id,
                            menu.promotions[promotionIndex].promotion.id,
                            updatedData,
                            menu.restaurant.currently_logged_in,
                            menu.restaurant.logged_in_user_random_number
                        );
                    }
                }

                if (checkResponseStatus(result.status)) {
                    if (promotionIndex === global.noValue)
                        reduxStateDispatch(
                            addANewPromotion({
                                promotionId: result.id,
                                updatedData: updatedData,
                            })
                        );
                    if (promotionIndex !== global.noValue)
                        if (!noModificationWereMade) {
                            reduxStateDispatch(
                                changePromotionData({
                                    promotionId:
                                        menu.promotions[promotionIndex]
                                            .promotion.id,
                                    updatedData: updatedData,
                                })
                            );
                        }
                    reduxStateDispatch(resetStateChange());

                    if (!noModificationWereMade) {
                        globalStateDispatch({
                            type: globalStateContextActions.setNotifyOfAChangeMade,
                        });
                    } else toastInfo(global.noChangesWereMade);

                    handleGoBack();
                } else
                    toastError(
                        global.connectionErrorOrUserCanNotPerformOperations
                    );
            } catch (error) {
                toastError(global.connectionErrorOrUserCanNotPerformOperations);
            }
        }
    };

    function handleResetButton() {
        toastSuccess(global.resetWasPerformed);
        handleReset();
    }

    function handleReset() {
        // Reset text field
        setValue("promotionName", initialValues.defaults.promotionName);
        setValue(
            "promotionAttractor",
            initialValues.defaults.promotionAttractor
        );

        // Reset Quill editor
        const quillEditorContent = initialValues.defaults.quillEditor; // Set your initial content here
        setValue("quillEditor", quillEditorContent);
        clearErrors();

        if (quillEditorRef.current) {
            SetQuillEditorContent(
                quillEditorRef,
                initialValues.defaults.quillEditor
            );
        }
    }

    function handleCancel() {
        handleReset();
        handleGoBack();
    }

    function handleHelp() {
        if (Object.keys(errors).length !== 0) {
            toastInfo(global.errorsInDialog);
            return;
        }
        let promotionEditionObject = {};
        promotionEditionObject.promotionName = promotionNameValue;
        promotionEditionObject.promotionAttractor = promotionAttractorValue;
        promotionEditionObject.promotionIndex = promotionIndex;
        promotionEditionObject.editorText =
            quillEditorRef.current.root.innerHTML;

        globalStateDispatch({
            type: globalStateContextActions.setPromotionEditionObject,
            payload: promotionEditionObject,
        });
        appNavigate(global.helpPath, {
            state: {
                videoName: "private_dialog_promotion",
            },
        });
    }

    return (
        <ContentContainer>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogBox>
                    <Paper
                        sx={{
                            padding: "1px",
                            marginLeft: "40px",
                            width: "90%",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-around",
                            }}
                        >
                            <Typography
                                align="center"
                                sx={{fontWeight: "bold", margin: "8px"}}
                            >
                                {global.editingPromotionText}
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
                                }}
                            >
                                <FontAwesomeIcon icon={faQuestion} />
                            </Button>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginLeft: "4%",
                                width: "100%",
                                // width: "50%",
                                maxWidth: "300px", // Adjust max-width as needed
                                margin: "0 auto", // Center the dialog
                            }}
                        >
                            <TextField
                                label={global.promotionNameText}
                                fullWidth
                                variant="filled"
                                value={promotionNameValue}
                                inputProps={{
                                    autoComplete: "off",
                                    maxLength:
                                        global.maxDialogPromotionNameLength,
                                }}
                                {...register("promotionName", {
                                    required: global.promotionNameRequired,
                                    pattern: {
                                        value: /^(?!.*[<>&\\"'/]).*$/,
                                        message:
                                            global.pleaseAvoidSomeSpecialChars,
                                    },
                                })}
                                type="text"
                                error={!!errors.promotionName}
                                helperText={
                                    <span
                                        style={{
                                            whiteSpace: "normal",
                                            wordWrap: "break-word",
                                        }}
                                    >
                                        {errors.promotionName?.message}
                                    </span>
                                }
                                sx={{
                                    width: "95%",
                                    padding: "10px",
                                    "& .MuiFormHelperText-root": {
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        width: "300px",
                                        maxWidth: "100%", // Ensure the helper text does not exceed TextField width
                                    },
                                }}
                            />

                            <TextField
                                label={global.promotionAttractorText}
                                fullWidth
                                variant="filled"
                                value={promotionAttractorValue}
                                inputProps={{
                                    autoComplete: "off",
                                    maxLength:
                                        global.maxDialogPromotionAttractorLength,
                                }}
                                {...register("promotionAttractor", {
                                    // required: global.promotionAttractorRequired,
                                    pattern: {
                                        value: /^(?!.*[<>&\\"'/]).*$/,
                                        message:
                                            global.pleaseAvoidSomeSpecialChars,
                                    },
                                })}
                                type="text"
                                error={!!errors.promotionAttractor}
                                helperText={errors.promotionAttractor?.message}
                                sx={{width: "92%", marginTop: "10px"}}
                            />

                            <div style={{marginTop: "10px"}}>
                                <Controller
                                    name="quillEditor"
                                    control={control}
                                    render={({field}) => (
                                        <QuillEditor
                                            {...field}
                                            reference={quillEditorRef}
                                            initialContent={
                                                initialValues.defaults
                                                    .quillEditor
                                            }
                                            setValue={setValue}
                                            setDoNotSubmit={setDoNotSubmit}
                                            setDoNotValidate={setDoNotValidate}
                                            unregister={unregister} // Add this line
                                            characterLimit={1000} // Pass the character limit here
                                            quillEditorWidthLimit="310px"
                                            error={
                                                errors.quillEditor &&
                                                errors.quillEditor.message
                                            }
                                        />
                                    )}
                                />
                            </div>
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
                                onClick={() => {
                                    setDoNotSubmit(false);
                                    setDoNotValidate(false);
                                }}
                            >
                                <DoneOutlineIcon />
                            </Button>

                            <Button
                                onClick={handleResetButton}
                                variant={"outlined"}
                                color="primary"
                            >
                                <RestartAltIcon />
                            </Button>

                            <Button
                                onClick={handleCancel}
                                variant={"outlined"}
                                color="primary"
                            >
                                <CancelIcon />
                            </Button>
                        </Box>
                    </Paper>
                </DialogBox>
            </form>
        </ContentContainer>
    );
}
