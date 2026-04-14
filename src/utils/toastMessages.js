import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {Button} from "../globalDefinitions/globalStyles";
import * as global from "../globalDefinitions/globalConstants";
import PropTypes from "prop-types";

const Modal = ({message, onClose}) => {
    return (
        <div>
            <p>{message}</p>
            <Button
                style={{
                    marginTop: "10px",
                    width: "70px",
                }}
                onClick={onClose}
            >
                OK
            </Button>
        </div>
    );
};

const OkCancelModal = ({message, onClose}) => {
    return (
        <div>
            <p>{message}</p>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    marginTop: "10px",
                }}
            >
                <Button
                    style={{
                        width: "90px",
                        backgroundColor: "#4CAF50", // Green for OK
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "8px 12px",
                        fontSize: "14px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                    onClick={() => {
                        onClose(true); // Resolve as true on OK
                    }}
                >
                    OK
                </Button>
                <Button
                    style={{
                        width: "90px",
                        backgroundColor: "#f44336", // Red for Cancel
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "8px 12px",
                        fontSize: "14px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                    onClick={() => {
                        onClose(false); // Resolve as false on Cancel
                    }}
                >
                    Cancelar
                </Button>
            </div>
        </div>
    );
};

OkCancelModal.propTypes = {
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired, // onClose now resolves with the result
};

export const toastOkCancel = (message) => {
    return new Promise((resolve) => {
        if (message) {
            const toastId = toast.info(
                <OkCancelModal
                    message={message}
                    onClose={(result) => {
                        toast.dismiss(toastId); // Dismiss toast when a button is clicked
                        resolve(result); // Resolve the promise with the result (true or false)
                    }}
                />,
                {
                    position: toast.POSITION.TOP_CENTER,
                    closeOnClick: false,
                    draggable: false,
                    autoClose: false,
                    style: {
                        fontWeight: "bold",
                    },
                }
            );
        } else {
            toastError(global.toastMessagesToastModalInfoNothingToShow);
            resolve(false); // Resolve as false if no message is provided
        }
    });
};

export const toastModalInfo = (message) => {
    if (message)
        toast.info(<Modal message={message} onClose={toast.dismiss} />, {
            position: toast.POSITION.TOP_CENTER,
            closeOnClick: true,
            draggable: false,
            autoClose: false,
            style: {
                fontWeight: "bold",
            },
        });
    else toastError(global.toastMessagesToastModalInfoNothingToShow);
};

export const toastModalError = (message) => {
    if (message)
        toast.error(<Modal message={message} onClose={toast.dismiss} />, {
            position: toast.POSITION.TOP_CENTER,
            closeOnClick: true,
            draggable: false,
            autoClose: false,
            style: {
                fontWeight: "bold",
            },
        });
    else toastError(global.toastMessagesToastModalErrorNothingToShow);
};

export const toastSuccess = (
    message,
    messageDuration = global.toastMessagesDurationInMiliSeconds
) => {
    if (message)
        toast.success(message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: messageDuration,
            hideProgressBar: false,
            style: {
                fontWeight: "bold",
            },
        });
    else toastError(global.toastMessagesToastSuccessNothingToShow);
};

export const toastError = (
    message = global.toastMessagesToastErrorNothingToShow,
    messageDuration = global.toastMessagesDurationInMiliSeconds
) => {
    toast.error(message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: messageDuration,
        hideProgressBar: false,
        style: {
            fontWeight: "bold",
        },
    });
};

export const toastWarning = (
    message,
    messageDuration = global.toastMessagesDurationInMiliSeconds
) => {
    if (message)
        toast.warn(message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: messageDuration,
            hideProgressBar: false,
            style: {
                fontWeight: "bold",
            },
        });
    else toastError(global.toastMessagesToastWarningNothingToShow);
};

export const toastInfo = (
    message,
    messageDuration = global.toastMessagesDurationInMiliSeconds
) => {
    if (message)
        toast.info(message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: messageDuration,
            hideProgressBar: false,
            style: {
                fontWeight: "bold",
            },
        });
    else toastError(global.toastMessagesToastInfoNothingToShow);
};

Modal.propTypes = {
    message: PropTypes.string.isRequired, // 'message' must be a string and is required
    onClose: PropTypes.func.isRequired, // 'onClose' must be a function and is required
};
