import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const PromotionElementsContainer = styled.div`
    width: 100%;
`;

const PromotionContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 200px;
    height: 50px;
`;

const PromotionName = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const PromotionAttractor = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

function CompShowPublicPromotionInList({promotion}) {
    return (
        <PromotionElementsContainer>
            <PromotionContainer>
                <PromotionName style={{width: "100%"}}>
                    {promotion.public_name}
                </PromotionName>
                <PromotionAttractor style={{width: "100%"}}>
                    {promotion.public_attractor_text}
                </PromotionAttractor>
            </PromotionContainer>
        </PromotionElementsContainer>
    );
}

export default CompShowPublicPromotionInList;

CompShowPublicPromotionInList.propTypes = {
    promotion: PropTypes.object.isRequired, // promotion should be an object and is required
};
