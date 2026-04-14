import React, {useContext, useEffect} from "react";
import {useNavigation} from "../contexts/navigationContext";

import styled from "styled-components";

import EditIcon from "@mui/icons-material/Edit";
import {Button} from "../globalDefinitions/globalStyles";

import * as global from "../globalDefinitions/globalConstants";

import {
    GlobalStateContext,
    globalStateContextActions,
} from "../contexts/globalStateContext";

import {getRestaurantMenu} from "../slices/restaurantMenuSlice";

import {useSelector} from "react-redux";
import {useState} from "react";
import {ShowImage} from "../utils/ImageFunctions";
import {decimalToTimeStr} from "../utils/severalFunctions";

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin-left: 50px;
    margin-top: 60px;
    width: 100%;
    user-select: none;
`;

const EditButton = styled(Button)`
    margin-top: 5px;
    margin-left: 5px;
    width: 60px;
    height: 30px;
`;

const Elements = styled.div`
    width: 90%;
    margin-left: 10px;
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
`;

const TableContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
    max-width: 400px;
`;

const TableRow = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`;

const TableCell = styled.div`
    text-align: center;
    padding: 8px;
    font-size: 10px;
    width: 10%;
    box-sizing: border-box;
`;

const TableHeader = styled(TableCell)`
    font-weight: bold;
`;

const TableItem = styled(TableCell)``;

const SeparatorLine = styled.div`
    margin-top: 20px;
`;

const ScreenName = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
`;

const ParagraphText = styled.div``;

const FacadeImage = styled.div``;

const LogoImage = styled.div``;

function ShowPreferences() {
    const {globalState, globalStateDispatch} = useContext(GlobalStateContext);

    const menu = useSelector(getRestaurantMenu);

    const {appNavigate} = useNavigation();

    const [data, setData] = useState({});

    function handleEditButtonClick() {
        appNavigate(global.DialogPreferencesPath);
    }

    function isObjectEmpty(obj) {
        return Object.entries(obj).length === 0;
    }

    useEffect(() => {
        if (!isObjectEmpty(menu.restaurant)) {
            let newData = {...menu.restaurant};

            newData.openHours = [0, 0, 0, 0, 0, 0, 0];
            newData.openHours[0] = decimalToTimeStr(
                menu.restaurant.private_monday_open_hour_in_minutes / 60
            );
            newData.openHours[1] = decimalToTimeStr(
                menu.restaurant.private_tuesday_open_hour_in_minutes / 60
            );
            newData.openHours[2] = decimalToTimeStr(
                menu.restaurant.private_wednesday_open_hour_in_minutes / 60
            );
            newData.openHours[3] = decimalToTimeStr(
                menu.restaurant.private_thursday_open_hour_in_minutes / 60
            );
            newData.openHours[4] = decimalToTimeStr(
                menu.restaurant.private_friday_open_hour_in_minutes / 60
            );
            newData.openHours[5] = decimalToTimeStr(
                menu.restaurant.private_saturday_open_hour_in_minutes / 60
            );
            newData.openHours[6] = decimalToTimeStr(
                menu.restaurant.private_sunday_open_hour_in_minutes / 60
            );

            newData.closeHours = [0, 0, 0, 0, 0, 0, 0];
            newData.closeHours[0] = decimalToTimeStr(
                menu.restaurant.private_monday_close_hour_in_minutes / 60
            );
            newData.closeHours[1] = decimalToTimeStr(
                menu.restaurant.private_tuesday_close_hour_in_minutes / 60
            );
            newData.closeHours[2] = decimalToTimeStr(
                menu.restaurant.private_wednesday_close_hour_in_minutes / 60
            );
            newData.closeHours[3] = decimalToTimeStr(
                menu.restaurant.private_thursday_close_hour_in_minutes / 60
            );
            newData.closeHours[4] = decimalToTimeStr(
                menu.restaurant.private_friday_close_hour_in_minutes / 60
            );
            newData.closeHours[5] = decimalToTimeStr(
                menu.restaurant.private_saturday_close_hour_in_minutes / 60
            );
            newData.closeHours[6] = decimalToTimeStr(
                menu.restaurant.private_sunday_close_hour_in_minutes / 60
            );
            setData(newData);
        }
    }, [menu]);

    useEffect(() => {
        globalStateDispatch({
            type: globalStateContextActions.setCurrentFunction,
            payload: global.showPreferencesPath,
        });
    });

    if (isObjectEmpty(data)) {
        return <div>{global.waiting}</div>;
    } else {
        return (
            <ContentContainer>
                <div
                    style={{
                        borderLeft: "2px solid #4C867D",
                        borderBottom: "2px solid #4C867D",
                        marginLeft: "10px",
                    }}
                >
                    <ScreenName>
                        <div style={{padding: "5px"}}>
                            <div>{global.showingPreferences}</div>

                            {globalState.notifyOfAChangeMade && (
                                <div>
                                    <div style={{color: "yellow"}}>
                                        {global.thisInfoHasNotBeenPublished}
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScreenName>
                    <EditButton onClick={() => handleEditButtonClick()}>
                        <EditIcon />
                    </EditButton>
                </div>
                <Elements>
                    <div style={{width: "100%"}}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginTop: "5px",
                            }}
                        >
                            <p style={{fontWeight: "bold"}}>
                                {global.restaurantRutText}:&nbsp;
                            </p>
                            <p>{data.rut}</p>
                        </div>
                        <SeparatorLine />
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginTop: "5px",
                            }}
                        >
                            <p style={{fontWeight: "bold"}}>
                                {global.restaurantNameText}:&nbsp;
                            </p>
                            <p>{data.private_name}</p>
                        </div>
                        <SeparatorLine />

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginTop: "5px",
                            }}
                        >
                            <p style={{fontWeight: "bold"}}>
                                {global.restaurantDescriptionText}
                            </p>
                            {data.private_description
                                .split("\n")
                                .map((paragraph, index) => (
                                    <ParagraphText key={index}>
                                        {paragraph}
                                    </ParagraphText>
                                ))}
                        </div>

                        <SeparatorLine />

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginTop: "5px",
                            }}
                        >
                            <p style={{fontWeight: "bold"}}>
                                {global.restaurantAddressText}:&nbsp;
                            </p>
                            <p>{data.private_address}</p>
                        </div>

                        <SeparatorLine />

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginTop: "10px",
                            }}
                        >
                            <p style={{fontWeight: "bold"}}>
                                {global.restaurantCountryText}:&nbsp;
                            </p>
                            <img
                                src={
                                    menu.restaurant.private_country
                                        .flag_image_url
                                }
                                alt="Flag"
                            />
                            {menu.restaurant.private_country.name}
                        </div>

                        <SeparatorLine />

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginTop: "5px",
                            }}
                        >
                            <p style={{fontWeight: "bold"}}>
                                {global.restaurantPhoneText}:&nbsp;
                            </p>
                            <p>{data.private_phone}</p>
                        </div>

                        <SeparatorLine />

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginTop: "5px",
                            }}
                        >
                            <p style={{fontWeight: "bold"}}>
                                {global.restaurantInstagramURLText}:&nbsp;
                            </p>
                            <p>
                                {data.private_instagram_url !== ""
                                    ? "https://" + data.private_instagram_url
                                    : ""}
                            </p>
                        </div>

                        <SeparatorLine />

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginTop: "5px",
                            }}
                        >
                            <p style={{fontWeight: "bold"}}>
                                {global.restaurantFacebookURLText}:&nbsp;
                            </p>
                            <p>
                                {data.private_facebook_url !== ""
                                    ? "https://" + data.private_facebook_url
                                    : ""}
                            </p>
                        </div>

                        <SeparatorLine />

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginTop: "5px",
                            }}
                        >
                            <p style={{fontWeight: "bold"}}>
                                {global.restaurantTwitterURLText}:&nbsp;
                            </p>
                            <p>
                                {data.private_twitter_url !== ""
                                    ? "https://" + data.private_twitter_url
                                    : ""}
                            </p>
                        </div>

                        <SeparatorLine />

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginTop: "5px",
                            }}
                        >
                            <p style={{fontWeight: "bold"}}>
                                {global.restaurantWebsiteURLText}:&nbsp;
                            </p>
                            <p>
                                {data.private_website_url !== ""
                                    ? "https://" + data.private_website_url
                                    : ""}
                            </p>
                        </div>

                        <SeparatorLine />

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginTop: "5px",
                            }}
                        >
                            <p style={{fontWeight: "bold"}}>
                                {global.restaurantScheduleText}
                            </p>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginTop: "5px",
                            }}
                        >
                            <p
                                style={{
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                {global.restaurantOpenHoursText}
                            </p>
                        </div>
                        <TableContainer>
                            <TableRow>
                                {global.daysOfTheWeekAbr.map((day) => (
                                    <TableHeader key={day}>{day}</TableHeader>
                                ))}
                            </TableRow>
                            <TableRow>
                                {data.openHours.map((value, index) => (
                                    <TableItem key={index}>{value}</TableItem>
                                ))}
                            </TableRow>
                        </TableContainer>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginTop: "5px",
                            }}
                        >
                            <p
                                style={{
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                {global.restaurantCloseHoursText}
                            </p>
                        </div>

                        <TableContainer>
                            <TableRow>
                                {global.daysOfTheWeekAbr.map((day) => (
                                    <TableHeader key={day}>{day}</TableHeader>
                                ))}
                            </TableRow>
                            <TableRow>
                                {data.closeHours.map((value, index) => (
                                    <TableItem key={index}>{value}</TableItem>
                                ))}
                            </TableRow>
                        </TableContainer>

                        <SeparatorLine />

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginTop: "5px",
                            }}
                        >
                            <p style={{fontWeight: "bold"}}>
                                {global.showImagesText}
                            </p>
                            <p>
                                {data.private_show_images
                                    ? global.yes
                                    : global.no}
                            </p>
                        </div>

                        <SeparatorLine />

                        {menu.restaurant.price_type === global.fullPrice && (
                            <div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        marginTop: "5px",
                                    }}
                                >
                                    <p style={{fontWeight: "bold"}}>
                                        {global.showRestaurantReviewsText}
                                    </p>
                                    <p>
                                        {data.private_show_restaurant_reviews
                                            ? global.yes
                                            : global.no}
                                    </p>
                                </div>

                                <SeparatorLine />

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        marginTop: "5px",
                                    }}
                                >
                                    <p style={{fontWeight: "bold"}}>
                                        {global.showDishesReviewsText}
                                    </p>
                                    <p>
                                        {data.private_show_dishes_reviews
                                            ? global.yes
                                            : global.no}
                                    </p>
                                </div>

                                <SeparatorLine />
                            </div>
                        )}

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginTop: "5px",
                            }}
                        >
                            <p style={{fontWeight: "bold"}}>
                                {global.showPricesText}
                            </p>
                            <p>
                                {data.private_show_prices
                                    ? global.yes
                                    : global.no}
                            </p>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginTop: "15px",
                            }}
                        >
                            <p style={{fontWeight: "bold"}}>
                                {global.showAskButtonText}
                            </p>
                            <p>
                                {data.private_show_ask_button
                                    ? global.yes
                                    : global.no}
                            </p>
                        </div>

                        <SeparatorLine />

                        <div style={{display: "flex", flexWrap: "wrap"}}>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    marginTop: "5px",
                                }}
                            >
                                <p style={{fontWeight: "bold"}}>
                                    {global.facadeImageText}
                                </p>
                                <FacadeImage>
                                    {ShowImage(
                                        data.private_show_images,
                                        data.private_name,
                                        data.private_facade_image_id,
                                        menu,
                                        false,
                                        230,
                                        120,
                                        ""
                                    )}
                                </FacadeImage>
                                <p
                                    style={{
                                        fontWeight: "bold",
                                        marginTop: "10px",
                                    }}
                                >
                                    {global.logoImageText}
                                </p>
                                <LogoImage>
                                    {ShowImage(
                                        data.private_show_images,
                                        global.logoText,
                                        data.private_logo_image_id,
                                        menu,
                                        false,
                                        230,
                                        120,
                                        ""
                                    )}
                                </LogoImage>
                            </div>
                        </div>

                        <SeparatorLine />

                        <div style={{marginBottom: "5px"}}>&nbsp;</div>
                    </div>
                </Elements>
            </ContentContainer>
        );
    }
}

export default ShowPreferences;
