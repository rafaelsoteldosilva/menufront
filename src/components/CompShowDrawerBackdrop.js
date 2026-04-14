import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Backdrop = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 100;
    top: 0;
    right: 0;
`;

export const CompShowDrawerBackdrop = ({closeDrawer}) => {
    return <Backdrop onClick={closeDrawer}></Backdrop>;
};

CompShowDrawerBackdrop.propTypes = {
    closeDrawer: PropTypes.func.isRequired, // closeDrawer should be a function and is required
};
