import styled from "styled-components";
import {Button} from "@mui/material";
import PropTypes from "prop-types";

const ModalComponent = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    display: ${({show}) => (show ? "block" : "none")};
`;

const ModalMain = styled.div`
    position: fixed;
    padding: 1em;
    border: 1px solid black;
    background: white;
    width: 70%;
    height: auto;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 500px;
`;

const BackDrop = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 200;
    top: 0;
    right: 0;
`;

export const AnsweredYesButton = styled(Button)`
    margin-top: 5px;
    width: 60px;
    height: 30px;
`;

export const AnsweredNoButton = styled(Button)`
    margin-top: 5px;
    width: 60px;
    height: 30px;
`;

export const GlobalModal = ({show, children}) => {
    return (
        <ModalComponent show={show}>
            <BackDrop>
                <ModalMain>{children}</ModalMain>
            </BackDrop>
        </ModalComponent>
    );
};

GlobalModal.propTypes = {
    show: PropTypes.bool.isRequired, // show should be a boolean and is required
    children: PropTypes.node.isRequired, // children should be a valid React node and is required
};
