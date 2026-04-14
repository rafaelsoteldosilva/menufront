import React, {useContext, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import styled from "styled-components";
import DOMPurify from "dompurify";
import {globalThemePublic} from "../globalDefinitions/globalStyles";
import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";
import * as global from "../globalDefinitions/globalConstants";

const PromotionContainer = styled.div`
    margin-top: 150px;
    margin-left: 55px;
    width: 290px;
`;

const PromotionName = styled.div`
    font-size: 32px;
    font-weight: bold;
`;
const PromotionText = styled.div`
    width: 90%;
    font-size: ${({fontSize}) => fontSize};
    margin-top: 20px;
    & ol,
    & ul {
        margin-left: 30px;
    }
`;
// it is all good
function CompShowPublicPromotion() {
    const {globalStateDispatch} = useContext(GlobalStateContext);

    const {state} = useLocation();
    const {myPromotion} = state;
    const [thePromotion, setThePromotion] = useState("");

    useEffect(() => {
        setThePromotion(DOMPurify.sanitize(myPromotion?.public_promotion_text));

        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.showPublicPromotionPath,
        });
    }, [globalStateDispatch, myPromotion?.public_promotion_text]);

    useEffect(() => {
        if (myPromotion !== undefined && myPromotion !== null) {
            globalStateDispatch({
                type: globalStateContextActions.setPromotionObjectForHelpReturn,
                payload: myPromotion,
            });
        }
    }, [globalStateDispatch, myPromotion]);

    return (
        <PromotionContainer>
            <PromotionName>{myPromotion.public_name}</PromotionName>
            <PromotionText
                fontSize={globalThemePublic.fontSize}
                dangerouslySetInnerHTML={{
                    __html: thePromotion,
                }}
            />
        </PromotionContainer>
    );
}

export default CompShowPublicPromotion;
