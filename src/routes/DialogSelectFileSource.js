import React, {useContext, useEffect, useState} from "react";

import CancelIcon from "@mui/icons-material/Cancel";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";

import styled from "styled-components";
import * as global from "../globalDefinitions/globalConstants";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";

import {useNavigation} from "../contexts/navigationContext";

import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    Paper,
    Radio,
    RadioGroup,
    Typography,
} from "@mui/material";

import {faQuestion} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const DialogBox = styled.div`
    max-width: 390px;
    margin-top: 80px;
    margin-left: 10px;
    height: 500px;
`;

function DialogSelectFileSource() {
    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);
    const {appNavigate} = useNavigation();

    const [source, setSource] = useState(
        globalState.currentImageFileSource || global.localImage
    );

    useEffect(() => {
        if (
            globalState.currentImageFileSource &&
            globalState.currentImageFileSource !== source
        ) {
            setSource(globalState.currentImageFileSource);
        }
    }, [globalState.currentImageFileSource, source]);

    const handleSourceChange = (event) => {
        setSource(event.target.value);
        globalStateDispatch({
            type: globalStateContextActions.setCurrentImageFileSource,
            payload: event.target.value,
        });
    };

    function handleGoBack() {
        appNavigate(global.showImageCollectionPath);
    }

    useEffect(() => {
        async function selectSourceStopCamera() {
            if (
                globalState.mediaStream !== null &&
                globalState.mediaStream !== undefined
            ) {
                const tracks = globalState.mediaStream.getTracks();
                if (tracks.length > 0) {
                    await Promise.all(tracks.map((track) => track.stop()));
                    globalStateDispatch({
                        type: globalStateContextActions.clearMediaStream,
                    });
                }
            }
        }

        selectSourceStopCamera();
    }, [globalState.mediaStream, globalStateDispatch]);

    function handleCancel() {
        handleGoBack();
    }

    const handleSourceSelect = () => {
        switch (source) {
            case "localImage": {
                appNavigate(global.DialogSelectLocalImagePath);
                break;
            }

            case "cameraImage": {
                appNavigate(global.DialogGetCameraPhotoPath);
                break;
            }

            default: {
                break;
            }
        }
    };

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.DialogSelectFileSourcePath,
        });
    });

    useEffect(() => {
        if (
            globalState.selectFileSourceEditionObject !== null &&
            globalState.featuresOfTheSelectFileSourceEditionObject
                .objectType === global.SelectFileSource
        ) {
            setSource(globalState.selectFileSourceEditionObject.source);

            globalStateDispatch({
                type: globalStateContextActions.clearSelectFileSourceEditionObject,
            });
        }
    }, [
        globalState.selectFileSourceEditionObject,
        globalState.featuresOfTheSelectFileSourceEditionObject,
        globalStateDispatch,
    ]);

    function handleHelp() {
        let selectSourceObject = {};

        selectSourceObject.source = source;

        globalStateDispatch({
            type: globalStateContextActions.setSelectFileSourceEditionObject,
            payload: selectSourceObject,
        });
        appNavigate(global.helpPath, {
            state: {
                videoName: "private_dialog_select_file_source",
            },
        });
    }

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
            <DialogBox>
                <Paper
                    sx={{
                        padding: "5px",
                        width: "240px",
                    }}
                >
                    <FormControl
                        component="fieldset"
                        style={{color: "black", marginLeft: "10px"}}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                            }}
                        >
                            <Typography
                                component="div" // Render as a <div> instead of <p>
                                align="center"
                                sx={{fontWeight: "bold", margin: "8px"}}
                            >
                                <Box>{global.SelectFileSource}</Box>
                                <Box sx={{marginTop: "10px"}}>
                                    {globalState.nameOfTheItemSelectingAnImage}
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
                        <RadioGroup
                            aria-label="source"
                            name="source"
                            value={source}
                            onChange={handleSourceChange}
                            column="true"
                        >
                            <FormControlLabel
                                value="localImage"
                                control={<Radio />}
                                label={global.localSystemImage}
                            />
                            <FormControlLabel
                                value="cameraImage"
                                control={<Radio />}
                                label={global.cameraImage}
                            />
                        </RadioGroup>
                    </FormControl>

                    <Box
                        sx={{
                            margin: "10px",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSourceSelect}
                        >
                            <DoneOutlineIcon />
                        </Button>

                        <Button
                            onClick={handleCancel}
                            variant="outlined"
                            color="primary"
                        >
                            <CancelIcon />
                        </Button>
                    </Box>
                </Paper>
            </DialogBox>
        </div>
    );
}

export default DialogSelectFileSource;
