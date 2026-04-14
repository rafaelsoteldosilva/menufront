import styled from "styled-components";
import React, {useState, useEffect, useRef} from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import Replay5Icon from "@mui/icons-material/Replay5";
import Forward5Icon from "@mui/icons-material/Forward5";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

import PropTypes from "prop-types";

const StyledButton = styled.button`
    border-radius: 50%;
    padding: 10px;
    font-size: 16px;
    margin-right: 5px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    background-color: #85baef;
    outline: none;
    transition:
        background-color 0.3s,
        transform 0.1s;

    &:active {
        transform: translateY(4px);
    }
`;

export const VideoPlayer = ({videoUrl, onExit}) => {
    const videoRef = useRef(null);
    const progressBarRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const handlePlayPause = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleExit = () => {
        if (onExit) {
            onExit();
        }
    };

    const handleGoBack5 = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.max(
                0,
                videoRef.current.currentTime - 5
            );
        }
    };

    const handleGoAhead5 = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.min(
                videoRef.current.duration,
                videoRef.current.currentTime + 5
            );
        }
    };

    const handleVolumeToggle = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    const handleProgressBarClick = (event) => {
        if (videoRef.current && progressBarRef.current) {
            const progressBarWidth = progressBarRef.current.offsetWidth;
            const clickPosition = event.nativeEvent.offsetX;
            const newTime =
                (clickPosition / progressBarWidth) * videoRef.current.duration;
            videoRef.current.currentTime = newTime;
        }
    };

    const handleDotDragStart = () => {
        setIsDragging(true);
    };

    const handleDotDragMove = (event) => {
        if (isDragging && progressBarRef.current && videoRef.current) {
            const progressBarWidth = progressBarRef.current.offsetWidth;
            const boundingRect = progressBarRef.current.getBoundingClientRect();
            const offsetX = event.clientX - boundingRect.left;
            const clampedX = Math.max(0, Math.min(offsetX, progressBarWidth));
            const newTime =
                (clampedX / progressBarWidth) * videoRef.current.duration;
            videoRef.current.currentTime = newTime;
            setProgress((clampedX / progressBarWidth) * 100);
        }
    };

    const handleDotDragEnd = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const handleTimeUpdate = () => {
            if (videoRef.current) {
                const current = videoRef.current.currentTime;
                const total = videoRef.current.duration;
                setCurrentTime(current);
                setDuration(total);
                if (!isDragging) {
                    setProgress((current / total) * 100);
                }
            }
        };

        const handleEnded = () => {
            setIsPlaying(false);
        };

        const handleContextMenu = (event) => {
            event.preventDefault();
        };

        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.addEventListener("ended", handleEnded);
            videoElement.addEventListener("contextmenu", handleContextMenu);
            videoElement.addEventListener("timeupdate", handleTimeUpdate);
        }

        return () => {
            if (videoElement) {
                videoElement.removeEventListener("ended", handleEnded);
                videoElement.removeEventListener(
                    "contextmenu",
                    handleContextMenu
                );
                videoElement.removeEventListener(
                    "timeupdate",
                    handleTimeUpdate
                );
            }
        };
    }, [isDragging]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    return (
        <div
            style={{
                marginTop: "70px",
                border: "2px solid #FFF",
                borderRadius: "10px",
                padding: "10px",
                width: "fit-content",
            }}
        >
            <video
                ref={videoRef}
                src={videoUrl}
                width="300"
                height="380"
                style={{display: "block"}}
                autoPlay
                controls={false}
            />
            <div style={{marginTop: "20px", textAlign: "center"}}>
                <StyledButton onClick={handleGoBack5}>
                    <Replay5Icon />
                </StyledButton>
                <StyledButton onClick={handlePlayPause}>
                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </StyledButton>
                <StyledButton onClick={handleGoAhead5}>
                    <Forward5Icon />
                </StyledButton>
                <StyledButton onClick={handleExit}>
                    <StopIcon />
                </StyledButton>
                <StyledButton onClick={handleVolumeToggle}>
                    {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </StyledButton>
            </div>
            <div
                style={{
                    marginTop: "10px",
                    textAlign: "center",
                    color: "#B6BFC8",
                }}
            >
                <span>
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <div
                    ref={progressBarRef}
                    onClick={handleProgressBarClick}
                    style={{
                        height: "4px",
                        backgroundColor: "#ddd",
                        width: "100%",
                        borderRadius: "2px",
                        overflow: "hidden",
                        marginTop: "5px",
                        cursor: "pointer",
                        position: "relative",
                    }}
                    onMouseMove={handleDotDragMove}
                    onMouseUp={handleDotDragEnd}
                >
                    <div
                        style={{
                            height: "100%",
                            width: `${progress}%`,
                            backgroundColor: "#007bff",
                            position: "relative",
                            borderRadius: "2px",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                right: "-6px",
                                top: "-4px",
                                width: "12px",
                                height: "12px",
                                backgroundColor: "#007bff",
                                borderRadius: "50%",
                                cursor: "grab",
                            }}
                            onMouseDown={handleDotDragStart}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

VideoPlayer.propTypes = {
    videoUrl: PropTypes.string.isRequired, // 'videoUrl' must be a string and is required
    onExit: PropTypes.func.isRequired, // 'onExit' must be a function and is required
};
