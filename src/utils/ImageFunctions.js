import * as global from "../globalDefinitions/globalConstants";
import {AdvancedImage} from "@cloudinary/react";
import {fill} from "@cloudinary/url-gen/actions/resize";
import {source} from "@cloudinary/url-gen/actions/overlay";
import {text} from "@cloudinary/url-gen/qualifiers/source";
import {Position} from "@cloudinary/url-gen/qualifiers/position";
import {compass} from "@cloudinary/url-gen/qualifiers/gravity";
import {TextStyle} from "@cloudinary/url-gen/qualifiers/textStyle";

import styled from "styled-components";

import ImageIcon from "@mui/icons-material/Image";
import {globalThemePrivate} from "../globalDefinitions/globalStyles";

const NoImageComponent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${({width}) => width}px};
    height: ${({height}) => height}px};
    filter: ${({markedForDeletion}) =>
        markedForDeletion ? "blur(3px)" : "none"};
    background-color: #1D1F3C;
    border: 2px solid gray;
    margin: 2px;
    padding: 5px;
    color: white; 
    font-size: ${({fontSize}) => fontSize}px};
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    line-height: 1.0;
`;

const ImageComponent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${({width}) => width}px};
    height: ${({height}) => height}px};
    filter: ${({markedForDeletion}) =>
        markedForDeletion ? "blur(5px)" : "none"};
    padding: 5px;
    color: white; 
    font-size: ${({fontSize}) => fontSize}px};
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    line-height: 1.0;
`;

function getCloudinaryResourceFromPublicId(menu, imagePublicId) {
    const index = menu.images.findIndex(
        (imageObj) => imageObj.image.image_public_id === imagePublicId
    );
    if (index > global.noValue)
        return global.cloudinaryInstance.image(
            menu.images[index].image.image_public_id
        );
    else return null;
}

function getCloudinaryResourceFromImageId(menu, imageId) {
    const index = menu.images.findIndex(
        (imageObj) => imageObj.image.id === imageId
    );
    if (index > global.noValue) {
        if (menu.images[index].image === "video") {
            return global.cloudinaryInstance.video(
                menu.images[index].image.image_public_id
            );
        } else
            return global.cloudinaryInstance.image(
                menu.images[index].image.image_public_id
            );
    } else return null;
}

function showCloudinaryResource(
    cloudinaryImage,
    width,
    height,
    markedForDeletion
) {
    cloudinaryImage = cloudinaryImage.resize(fill());
    if (markedForDeletion) {
        cloudinaryImage = cloudinaryImage.overlay(
            source(
                text(
                    "X",
                    new TextStyle("roboto", 90)
                        .fontWeight("bold")
                        .fontStyle("normal")
                ).textColor(globalThemePrivate.backgroundColor)
            ).position(new Position().gravity(compass("center")))
        );
    }

    return <AdvancedImage cldImg={cloudinaryImage} />;
}

export function ShowImage(
    showImages,
    imageName,
    imageId,
    menu,
    markedForDeletion,
    width,
    height,
    newItemName,
    usePublicId = false,
    isLogo = false,
    fontSize = 30,
    isSort = false
) {
    let fontSizeLocal = fontSize;
    let newWidth = width;
    let newHeight = height;
    if (isSort) {
        newWidth = newWidth - (newWidth * 20) / 100;
        newHeight = newHeight - (newHeight * 20) / 100;
    }
    if (showImages && imageId !== global.noValue) {
        let cloudinaryImage = null;
        if (usePublicId) {
            cloudinaryImage = getCloudinaryResourceFromPublicId(menu, imageId);
        } else {
            cloudinaryImage = getCloudinaryResourceFromImageId(menu, imageId);
        }
        newWidth = newWidth + 10;
        newHeight = newHeight + 10;
        return (
            <ImageComponent
                markedForDeletion={markedForDeletion}
                width={newWidth}
                height={newHeight}
                fontSize={fontSizeLocal}
            >
                {showCloudinaryResource(
                    cloudinaryImage,
                    newWidth,
                    newHeight,
                    markedForDeletion
                )}
            </ImageComponent>
        );
    } else {
        if (imageName.length > 40) {
            fontSizeLocal = 20;
        }

        return (
            <NoImageComponent
                markedForDeletion={markedForDeletion}
                width={newWidth + 7}
                height={newHeight}
                fontSize={fontSizeLocal}
            >
                {isLogo ? (
                    <ImageIcon />
                ) : imageName.length === 0 ? (
                    newItemName
                ) : (
                    imageName
                )}
            </NoImageComponent>
        );
    }
}

// good
