import React, {useContext, useEffect, useRef, useState} from "react";
import styled, {keyframes} from "styled-components";
import {useForm} from "react-hook-form";
import {
    Box,
    Button,
    FormControl,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import {addNewImageApi} from "../axiosCalls/axiosAPICalls";
import {toastError, toastInfo, toastSuccess} from "../utils/toastMessages";
import * as global from "../globalDefinitions/globalConstants";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {faQuestion} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";
import {
    getRestaurantMenu,
    resetStateChange,
    addNewImageData,
} from "../slices/restaurantMenuSlice";
import {useNavigation} from "../contexts/navigationContext";
import {useDispatch, useSelector} from "react-redux";
import {sanitizeStr, uploadFileToCloudinary} from "../utils/severalFunctions";

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

const DialogBox = styled.div`
    max-width: 390px;
    margin-top: 80px;
    margin-left: 10px;
    height: 500px;
`;

function DialogSelectLocalImageFile() {
    const reduxStateDispatch = useDispatch();
    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);
    const menu = useSelector(getRestaurantMenu);
    const {appNavigate} = useNavigation();

    const [fileInput, setFileInput] = useState(null);
    const [mediaUrl, setMediaUrl] = useState(null);
    const [showCurtain, setShowCurtain] = useState(false);

    const nameRef = useRef(null);

    const initialValues = {
        defaults: {
            name: "",
            file: null, // Add file to default values
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

    const nameValue = watch("name");

    // Handle file input change and update form state manually
    function handleFileInputChange(event) {
        const file = event.target.files[0];
        if (file !== undefined) {
            setFileInput(file);
            setMediaUrl(URL.createObjectURL(file));
            setValue("file", file); // Update React Hook Form state with the selected file
            toastInfo(global.youCanLookForAnotherFile);
        }
    }

    useEffect(() => {
        toastInfo(global.imageDimensionsAreKept);

        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.DialogSelectLocalImagePath,
        });
        if (nameRef) nameRef.current.focus();

        // If fileInput is already set, update React Hook Form state
        if (fileInput) {
            setValue("file", fileInput); // Set file in form state
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (
            globalState.selectLocalImageFileEditionObject !== null &&
            globalState.featuresOfTheSelectLocalImageFileEditionObject
                .objectType === global.selectLocalImageFile
        ) {
            setValue(
                "name",
                globalState.selectLocalImageFileEditionObject.name
            );
            setMediaUrl(globalState.selectLocalImageFileEditionObject.mediaUrl);
            setFileInput(
                globalState.selectLocalImageFileEditionObject.fileInput
            );
            globalStateDispatch({
                type: globalStateContextActions.clearSelectLocalImageFileEditionObject,
            });
        }
    }, [
        globalState.selectLocalImageFileEditionObject,
        globalState.featuresOfTheSelectLocalImageFileEditionObject,
        globalStateDispatch,
        setValue,
    ]);

    function handleHelp() {
        let imageEditionObject = {};
        imageEditionObject.name = nameValue;
        imageEditionObject.mediaUrl = mediaUrl;
        imageEditionObject.fileInput = fileInput;

        globalStateDispatch({
            type: globalStateContextActions.setSelectLocalImageFileEditionObject,
            payload: imageEditionObject,
        });

        appNavigate(global.helpPath, {
            state: {
                videoName: "private_dialog_select_local_image_file",
            },
        });
    }

    function handleGoBack() {
        // globalStateDispatch({
        //     type: globalStateContextActions.clearCurrentMinorFunction,
        // });
        appNavigate(global.DialogSelectFileSourcePath);
    }

    function handleCancel() {
        handleGoBack();
    }

    const handleReset = () => {
        reset();
        setFileInput(null);
        setMediaUrl(null);
        toastSuccess(global.resetWasPerformed);
    };

    const validateField = (fieldName) => (value) => {
        let trimmedValue = "";
        switch (fieldName) {
            case "name": {
                trimmedValue = value.trim();

                if (trimmedValue === "") {
                    return global.nameRequired;
                }
                break;
            }

            default: {
                break;
            }
        }

        return undefined;
    };

    const onSubmit = async () => {
        let nameError = false;
        let newName = nameValue.trim();
        try {
            setShowCurtain(true);
            menu.images.forEach((imageObj) => {
                if (
                    newName.toLowerCase() ===
                    imageObj.image.image_name.toLowerCase()
                ) {
                    nameError = true;
                }
            });
            if (!nameError) {
                let result = {status: 300, error: ""};
                if (global.accessBackend) {
                    uploadFileToCloudinary(
                        fileInput,
                        `Restaurant_${menu.restaurant.id}`,
                        true
                    )
                        .then(async (responseData) => {
                            let imageData = {
                                image_name: sanitizeStr(newName),
                                image_original_name: sanitizeStr(
                                    responseData.original_filename
                                ),
                                image_public_id: responseData.public_id,
                                image_resource_type: responseData.resource_type,
                                image_url: responseData.secure_url,
                                user_id: menu.restaurant.currently_logged_in,
                                user_random:
                                    menu.restaurant
                                        .logged_in_user_random_number,
                            };
                            result = await addNewImageApi(
                                menu.restaurant.id,
                                imageData
                            );
                            reduxStateDispatch(
                                addNewImageData({
                                    imageId: result.id,
                                    imageData: imageData,
                                })
                            );
                            reduxStateDispatch(resetStateChange());
                            // globalStateDispatch({
                            //     type: globalStateContextActions.clearCurrentMinorFunction,
                            // });
                            setShowCurtain(false);
                            appNavigate(global.showImageCollectionPath);
                        })
                        .catch(() => {
                            setShowCurtain(false);
                            toastError(
                                global.connectionErrorOrUserCanNotPerformOperations
                            );
                        });
                }
            } else {
                toastError(global.imageNameIsTaken);
                setShowCurtain(false);
            }
        } catch (error) {
            setShowCurtain(false);
            toastError(global.connectionErrorOrUserCanNotPerformOperations);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                paddingLeft: "10px",
                width: "100%",
                zIndex: 100,
                userSelect: "none",
            }}
        >
            {showCurtain && (
                <Curtain>
                    <Spinner />
                </Curtain>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogBox>
                    <Paper
                        sx={{
                            padding: "5px",
                            width: "240px",
                        }}
                    >
                        <FormControl
                            component="fieldset"
                            style={{color: "black", marginLeft: "5px"}}
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
                                    sx={{
                                        fontWeight: "bold",
                                        margin: "8px",
                                    }}
                                    component="div"
                                >
                                    <Box>
                                        <div>{global.selectLocalImageFile}</div>
                                        <div style={{marginTop: "10px"}}>
                                            {
                                                globalState.nameOfTheItemSelectingAnImage
                                            }
                                        </div>
                                    </Box>
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
                            <Button variant="contained" component="label">
                                {global.lookForAnImage}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileInputChange}
                                    hidden
                                />
                            </Button>
                            {errors.file && !fileInput && (
                                <Typography
                                    variant="body2"
                                    color="error"
                                    sx={{
                                        marginLeft: "10px",
                                        fontSize: "12px",
                                    }}
                                >
                                    {errors.file.message}
                                </Typography>
                            )}

                            <TextField
                                label={global.nameText}
                                fullWidth
                                variant="filled"
                                value={nameValue}
                                inputProps={{
                                    autoComplete: "off",
                                    maxLength:
                                        global.maxSelectLocalFileNameLength,
                                }}
                                {...register("name", {
                                    validate: validateField("name"),
                                })}
                                type="text"
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                style={{width: "100%", marginTop: "10px"}}
                                inputRef={nameRef}
                            />
                        </FormControl>
                        {mediaUrl && (
                            <div
                                style={{
                                    marginTop: "10px",
                                    marginLeft: "5px",
                                }}
                            >
                                {fileInput.name && (
                                    <div>
                                        <Typography
                                            align="left"
                                            fontWeight="bold"
                                        >
                                            {global.fileName}
                                        </Typography>
                                        <Typography align="left">
                                            {fileInput.name}
                                        </Typography>
                                    </div>
                                )}
                                <img
                                    src={mediaUrl}
                                    alt="Selected"
                                    style={{
                                        width: "280px",
                                    }}
                                />
                            </div>
                        )}
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
                                <CloudUploadIcon />
                            </Button>
                            <Button
                                onClick={handleReset}
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
        </div>
    );
}

export default DialogSelectLocalImageFile;
