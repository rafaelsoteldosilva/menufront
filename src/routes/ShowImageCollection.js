import React, {useContext, useEffect, useState} from "react";
import {UpdateImageUsesApi} from "../axiosCalls/axiosAPICalls";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

import {
    getRestaurantMenu,
    updateImageUses,
} from "../slices/restaurantMenuSlice";
import {useDispatch, useSelector} from "react-redux";

import {Button} from "../globalDefinitions/globalStyles";

import {
    EnvironmentOptionItemsContext,
    environmentOptionItems,
} from "../contexts/environmentOptionItemsContext";

import * as global from "../globalDefinitions/globalConstants";

import CompShowImageInList from "../components/CompShowImageInList";

import styled from "styled-components";
import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";
import {useNavigation} from "../contexts/navigationContext";

import {checkResponseStatus} from "../utils/checkResponseStatus";
import {getComponentNameFromPath} from "../utils/severalFunctions";

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const ComponentContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: flex-start;
    @media ${({theme}) => theme.device.laptop} {
        flex-direction: row;
    }
`;

const EachItem = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-left: 50px;
`;

const ScreenName = styled.div`
    margin-top: 80px;
    margin-bottom: 10px;
`;

const AddButton = styled(Button)`
    margin-top: 5px;
    width: 60px;
    height: 30px;
    margin-left: 5px;
`;

const TextComponent = styled.div``;

function ShowImageCollection() {
    const {environmentOptionItemsState} = useContext(
        EnvironmentOptionItemsContext
    );
    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);
    const menu = useSelector(getRestaurantMenu);
    const reduxStateDispatch = useDispatch();
    const [isLoading] = useState(false);
    const {appNavigate} = useNavigation();

    useEffect(() => {
        async function localUpdateImageUses(restaurantId) {
            let result = await UpdateImageUsesApi(restaurantId);
            if (checkResponseStatus(result.status)) {
                reduxStateDispatch(updateImageUses());
            }
        }

        if (menu.restaurant.update_image_uses) {
            localUpdateImageUses(menu.restaurant.id);
        }
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.showImageCollectionPath,
        });
    }, [
        globalStateDispatch,
        menu.restaurant.id,
        menu.restaurant.update_image_uses,
        reduxStateDispatch,
    ]);

    function AddImage() {
        appNavigate(global.DialogSelectFileSourcePath);
    }

    function WhoIsCalling() {
        if (globalState.currentlyWatching !== global.management) {
            return getComponentNameFromPath(
                globalState.featuresOfTheEditionObject.objectOriginPath,
                globalState.nameOfTheItemSelectingAnImage || ""
            );
        } else {
            return null;
        }
    }

    return (
        <div style={{userSelect: "none"}}>
            <div
                style={{
                    marginLeft: "55px",
                    marginBottom: "15px",
                    borderLeft: "2px solid #4C867D",
                    borderBottom: "2px solid #4C867D",
                    userSelect: "none",
                }}
            >
                <ScreenName>
                    <div
                        style={{
                            padding: "5px",
                            fontSize: "16px",
                        }}
                    >
                        {globalState.notifyOfAChangeMade ? (
                            <div>
                                <div style={{color: "yellow"}}>
                                    {global.thisInfoHasNotBeenPublished}
                                </div>
                                <div> {WhoIsCalling()} </div>
                                <div> {global.showingImages} </div>
                            </div>
                        ) : (
                            <div>
                                <div> {WhoIsCalling()} </div>
                                <div> {global.showingImages} </div>
                            </div>
                        )}
                    </div>
                </ScreenName>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    <AddButton onClick={AddImage}>
                        <LibraryAddIcon />
                    </AddButton>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            userSelect: "none",
                        }}
                    >
                        {global.addImageText}
                    </div>
                </div>
            </div>
            <ContentContainer>
                <ComponentContainer>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {(environmentOptionItemsState.environmentOptionItems ===
                                environmentOptionItems.menuPrivateEnvironment ||
                                environmentOptionItemsState.environmentOptionItems ===
                                    environmentOptionItems.preferencesPrivateEnvironment ||
                                environmentOptionItemsState.environmentOptionItems ===
                                    environmentOptionItems.usersPrivateEnvironment) && (
                                <div>
                                    <TextComponent
                                        style={{
                                            fontWeight: "bold",
                                            marginLeft: "55px",
                                        }}
                                    >
                                        {global.selectAnImage}
                                    </TextComponent>
                                </div>
                            )}
                            {menu.images.length === 0 && !isLoading && (
                                <TextComponent
                                    style={{
                                        marginTop: "30px",
                                        marginLeft: "55px",
                                    }}
                                >
                                    {global.noImages}
                                </TextComponent>
                            )}
                        </div>
                        <EachItem>
                            {menu.images.length !== 0 &&
                                menu.images.map((imageObj, index) => {
                                    return (
                                        <div key={index}>
                                            <CompShowImageInList
                                                image={imageObj.image}
                                            />
                                        </div>
                                    );
                                })}
                        </EachItem>
                    </div>
                </ComponentContainer>
            </ContentContainer>
        </div>
    );
}

export default ShowImageCollection;
