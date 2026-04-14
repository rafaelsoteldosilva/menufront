import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import axios from "axios";
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

import cameraClickSound from "../assets/photo_click.mp3";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

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
import {uploadFileToCloudinary} from "../utils/severalFunctions";

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
    max-width: 400px;
    margin-top: 80px;
    margin-left: 10px;
`;

const Video = styled.video``;

const VideoContainer = styled.div`
    display: ${(props) => (props.show ? "block" : "none")};
    width: 96%;
    height: auto; /* Allows the image to maintain its aspect ratio */
    margin-left: 5px;
    margin-top: 10px;
`;

const StyledImage = styled.img`
    display: ${(props) => (props.show ? "block" : "none")};
    width: 96%;
    height: auto; /* Allows the image to maintain its aspect ratio */
    margin-left: 5px;
    margin-top: 10px;
`;

function DialogSelectLocalImageFile() {
    const reduxStateDispatch = useDispatch();

    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);
    const menu = useSelector(getRestaurantMenu);
    const {appNavigate} = useNavigation();

    const [capturedImage, setCapturedImage] = useState(null);
    const videoRef = useRef(null);
    const [showCamera, setShowCamera] = useState(true);
    const mediaStream = useRef(null);
    const [clickedTakePhoto, setDisableTakePhoto] = useState(false);
    const [showCurtain, setShowCurtain] = useState(false);

    const nameRef = useRef(null);

    const initialValues = {
        defaults: {
            name: "",
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

    const startCamera = async () => {
        setShowCamera(true);
        setShowCurtain(true);
        try {
            if (globalState.mediaStream) {
                stopCamera(globalState.mediaStream);
                globalStateDispatch({
                    type: globalStateContextActions.clearMediaStream,
                });
            }
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            mediaStream.current = stream;
            globalStateDispatch({
                type: globalStateContextActions.setMediaStream,
                payload: stream,
            });
            setCapturedImage(null);
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setShowCurtain(false);
        } catch (err) {
            if (err.name === "NotAllowedError") {
                // eslint-disable-next-line no-console
                console.error("User denied camera access");
                // Handle denied permission (e.g., display a message to the user)
            } else if (
                err.name === "NotFoundError" ||
                err.name === "NotReadableError"
            ) {
                // eslint-disable-next-line no-console
                console.error("No camera found or could not access camera");
                // Handle camera not found or not accessible
            } else {
                // eslint-disable-next-line no-console
                console.error("Error accessing camera:", err);
            }
        }
    };

    const stopCamera = useCallback(
        async (mediaStream) => {
            try {
                if (mediaStream !== null && mediaStream !== undefined) {
                    const tracks = mediaStream.getTracks();
                    if (tracks.length > 0) {
                        await Promise.all(tracks.map((track) => track.stop()));

                        globalStateDispatch({
                            type: globalStateContextActions.clearMediaStream,
                        });
                    }
                } else {
                    // eslint-disable-next-line no-console
                    console.log("error: Media stream not available.");
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Error stopping camera:", error);
            }
        },
        [globalStateDispatch]
    );

    useEffect(() => {
        toastInfo(global.imageDimensionsAreKept);
        startCamera();
        // If I take disable-next-line out and follow instructions, an error occurrs when using the app
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (capturedImage !== null) {
            stopCamera(mediaStream.current); // Stop the camera after capturing the image
            setShowCamera(false);
        }
    }, [capturedImage, stopCamera]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            stopCamera(); // Stop the camera if the window becomes hidden
            setDisableTakePhoto(true);
        };
        const cleanup = () => {
            stopCamera(mediaStream.current); // Stop the camera when the component unmounts
        };

        window.addEventListener("beforeunload", cleanup); // Stop the camera when the user navigates away
        document.addEventListener("visibilitychange", handleVisibilityChange); // Stop the camera when the window visibility changes

        return () => {
            window.removeEventListener("beforeunload", cleanup);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [stopCamera]);

    const takePhoto = () => {
        if (!videoRef.current || !mediaStream.current) return;
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
        const imageUrl = canvas.toDataURL("image/png");
        setCapturedImage(imageUrl);
        stopCamera(mediaStream.current);
        setDisableTakePhoto(true);
        const cameraSound = document.getElementById("cameraSound");
        if (cameraSound) {
            cameraSound
                .play()
                .then(() => {
                    // eslint-disable-next-line no-console
                    console.log("Sound played successfully.");
                })
                .catch((err) => {
                    // eslint-disable-next-line no-console
                    console.error("Error playing sound:", err);
                });
        }
        toastInfo(global.clickResetToTakeAnotherPhoto);
    };

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.DialogGetCameraPhotoPath,
        });
    }, [globalStateDispatch]);

    useEffect(() => {
        if (
            globalState.getCameraPhotoEditionObject !== null &&
            globalState.featuresOfTheGetCameraPhotoEditionObject.objectType ===
                global.getCameraPhoto
        ) {
            setValue("name", globalState.getCameraPhotoEditionObject.name);
            if (globalState.getCameraPhotoEditionObject.takePhotoAgain) {
                toastInfo(global.takePhotoAgain);
            }

            globalStateDispatch({
                type: globalStateContextActions.clearGetCameraPhotoEditionObject,
            });
        }
    }, [
        globalState.getCameraPhotoEditionObject,
        globalState.featuresOfTheGetCameraPhotoEditionObject,
        globalStateDispatch,
        setValue,
    ]);

    function handleHelp() {
        let photoEditionObject = {};
        photoEditionObject.name = nameValue;
        if (capturedImage) photoEditionObject.takePhotoAgain = true;
        else photoEditionObject.takePhotoAgain = false;

        globalStateDispatch({
            type: globalStateContextActions.setGetCameraPhotoEditionObject,
            payload: photoEditionObject,
        });
        appNavigate(global.helpPath, {
            state: {
                videoName: "private_dialog_get_camera_photo",
            },
        });
    }

    function handleGoBack() {
        appNavigate(global.DialogSelectFileSourcePath);
    }

    function handleCancel() {
        stopCamera(mediaStream.current);
        handleGoBack();
    }

    const handleReset = () => {
        reset();
        setCapturedImage(null);
        stopCamera(mediaStream.current);
        startCamera();
        setDisableTakePhoto(false);
        toastSuccess(global.resetWasPerformed);
    };

    const validateField = (fieldName) => (value) => {
        let trimmedValue = "";
        switch (fieldName) {
            case "name":
                trimmedValue = value.trim();

                if (trimmedValue === "") {
                    return global.nameRequired;
                }
                break;

            default:
                break;
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
                    if (capturedImage) {
                        // Convert the captured image data URL to a Blob
                        const response = await axios.get(capturedImage, {
                            responseType: "blob",
                        });
                        const blob = response.data;

                        // Convert Blob to File
                        const file = new File([blob], "captured_image.png", {
                            type: "image/png",
                        });

                        uploadFileToCloudinary(
                            file,
                            `Restaurant_${menu.restaurant.id}`,
                            true
                        )
                            .then(async (responseData) => {
                                let imageData = {
                                    image_name: newName,
                                    image_original_name:
                                        responseData.original_filename,
                                    image_public_id: responseData.public_id,
                                    image_resource_type:
                                        responseData.resource_type,
                                    image_url: responseData.secure_url,
                                    user_id:
                                        menu.restaurant.currently_logged_in,
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

                                setShowCurtain(false);
                                appNavigate(global.showImageCollectionPath);
                            })
                            .catch(() => {
                                setShowCurtain(false);
                                toastError(
                                    global.connectionErrorOrUserCanNotPerformOperations
                                );
                            });
                    } else {
                        setShowCurtain(false);
                        toastError(global.noPhotoWastaken);
                    }
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
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                zIndex: 100,
                userSelect: "none",
            }}
        >
            <audio id="cameraSound" src={cameraClickSound}></audio>
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
                            width: "250px",
                        }}
                    >
                        <FormControl
                            component="fieldset"
                            style={{
                                color: "black",
                                marginLeft: "5px",
                                width: "230px",
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
                                    sx={{
                                        fontWeight: "bold",
                                        margin: "8px",
                                    }}
                                >
                                    {global.getCameraImage}
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
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={takePhoto}
                                style={{marginTop: "10px"}}
                                disabled={clickedTakePhoto}
                            >
                                <PhotoCameraIcon />
                            </Button>
                            <TextField
                                label={global.nameText}
                                fullWidth
                                variant="filled"
                                value={nameValue}
                                inputProps={{
                                    autoComplete: "off",
                                    maxLength:
                                        global.maxDialogGetCameraPhotoNameLength,
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
                        <div style={{marginBottom: "10px"}}>
                            <VideoContainer show={showCamera}>
                                <Video ref={videoRef} autoPlay playsInline />
                            </VideoContainer>
                            {capturedImage && (
                                <StyledImage
                                    show={!showCamera}
                                    src={capturedImage}
                                    alt="Captured"
                                />
                            )}
                        </div>

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
