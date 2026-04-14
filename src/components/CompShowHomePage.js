import React, {useContext, useEffect, useState} from "react";
import styled from "styled-components";

import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import HomeIcon from "@mui/icons-material/Home";

import {CompShowReviewAndShareButtons} from "./CompShowReviewAndShareButtons";
import {useSelector} from "react-redux";
import {getRestaurantMenu} from "../slices/restaurantMenuSlice";
import CompShowReviewsAverage from "./CompShowReviewsAverage";

import * as global from "../globalDefinitions/globalConstants";

import {
    EnvironmentOptionItemsContext,
    environmentOptionItems,
} from "../contexts/environmentOptionItemsContext";
import {GlobalStateContext} from "../contexts/globalStateContext";
import {ShowImage} from "../utils/ImageFunctions";
import {decimalToTimeStr} from "../utils/severalFunctions";

const ParagraphText = styled.div`
    margin-top: 10px;
    margin-bottom: 0;
    font-size: 2em;
`;

const DeviderComponent = styled.div`
    width: 98%;
    height: 1px;
    margin-bottom: 15px;
    background-color: gray;
`;

const ScreenName = styled.div`
    margin-top: ${({privateEnvironment}) =>
        privateEnvironment ? "160px" : "0"};
    margin-bottom: 10px;
`;

const TableContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 95%;
`;

const TableRow = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
`;

const TableCell = styled.div`
    text-align: center;
    font-size: 11px;
    box-sizing: border-box;
`;

const TableHeader = styled(TableCell)``;

const TableItem = styled(TableCell)``;

export default function CompShowHomePage() {
    const menu = useSelector(getRestaurantMenu);
    const {environmentOptionItemsState} = useContext(
        EnvironmentOptionItemsContext
    );
    const {globalState} = useContext(GlobalStateContext);

    const [scheduleData, setScheduleData] = useState(null);

    useEffect(() => {
        let schedules = {};
        schedules.openHours = [0, 0, 0, 0, 0, 0, 0];
        schedules.openHours[0] = decimalToTimeStr(
            menu.restaurant.public_monday_open_hour_in_minutes / 60
        );
        schedules.openHours[1] = decimalToTimeStr(
            menu.restaurant.public_tuesday_open_hour_in_minutes / 60
        );
        schedules.openHours[2] = decimalToTimeStr(
            menu.restaurant.public_wednesday_open_hour_in_minutes / 60
        );
        schedules.openHours[3] = decimalToTimeStr(
            menu.restaurant.public_thursday_open_hour_in_minutes / 60
        );
        schedules.openHours[4] = decimalToTimeStr(
            menu.restaurant.public_friday_open_hour_in_minutes / 60
        );
        schedules.openHours[5] = decimalToTimeStr(
            menu.restaurant.public_saturday_open_hour_in_minutes / 60
        );
        schedules.openHours[6] = decimalToTimeStr(
            menu.restaurant.public_sunday_open_hour_in_minutes / 60
        );

        schedules.closeHours = [0, 0, 0, 0, 0, 0, 0];
        schedules.closeHours[0] = decimalToTimeStr(
            menu.restaurant.public_monday_close_hour_in_minutes / 60
        );
        schedules.closeHours[1] = decimalToTimeStr(
            menu.restaurant.public_tuesday_close_hour_in_minutes / 60
        );
        schedules.closeHours[2] = decimalToTimeStr(
            menu.restaurant.public_wednesday_close_hour_in_minutes / 60
        );
        schedules.closeHours[3] = decimalToTimeStr(
            menu.restaurant.public_thursday_close_hour_in_minutes / 60
        );
        schedules.closeHours[4] = decimalToTimeStr(
            menu.restaurant.public_friday_close_hour_in_minutes / 60
        );
        schedules.closeHours[5] = decimalToTimeStr(
            menu.restaurant.public_saturday_close_hour_in_minutes / 60
        );
        schedules.closeHours[6] = decimalToTimeStr(
            menu.restaurant.public_sunday_close_hour_in_minutes / 60
        );
        setScheduleData(schedules);
    }, [menu.restaurant]);

    function GetFlagCorrespondingUrl(country) {
        return country.flag_image_url;
    }

    function GetFlagCorrespondingName(country) {
        return country.name;
    }

    if (scheduleData === null) {
        return <div>{global.waiting}</div>;
    } else {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    width: "120%",
                    marginLeft: "55px",
                    userSelect: "none",
                }}
            >
                <div
                    style={{
                        width: "90%",
                        marginBottom: "15px",
                        borderLeft: "2px solid #4C867D",
                        borderBottom: "2px solid #4C867D",
                    }}
                >
                    <ScreenName
                        privateEnvironment={
                            environmentOptionItemsState.environmentOptionItems ===
                            environmentOptionItems.publicEnvironment
                        }
                    >
                        <div
                            style={{
                                padding: "5px",
                                fontSize: "16px",
                                marginBottom: "10px",
                            }}
                        >
                            {globalState.notifyOfAChangeMade ? (
                                <div>
                                    <div style={{color: "yellow"}}>
                                        {global.thisInfoHasNotBeenPublished}
                                    </div>
                                </div>
                            ) : (
                                <div>{global.showingRestaurant}</div>
                            )}
                        </div>
                    </ScreenName>
                </div>
                <div style={{marginLeft: "-2px"}}>
                    <div>
                        {ShowImage(
                            menu.restaurant.public_show_images,
                            menu.restaurant.public_name,
                            menu.restaurant.public_facade_image_id,
                            menu,
                            false,
                            265,
                            145,
                            ""
                        )}
                    </div>
                    <div style={{width: "100%"}}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                fontSize: "2em",
                            }}
                        >
                            <div>
                                <p>{menu.restaurant.public_name}</p>
                            </div>
                        </div>
                        <div style={{marginTop: "10px"}}>
                            {menu.restaurant.public_description
                                .split("\n")
                                .map((paragraph, index) => (
                                    <ParagraphText key={index}>
                                        {paragraph}
                                    </ParagraphText>
                                ))}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                fontSize: "1em",
                                marginTop: "10px",
                            }}
                        >
                            <div style={{fontWeight: "bold"}}>
                                {global.rut}&nbsp;
                            </div>
                            <div>
                                <p>{menu.restaurant.rut}</p>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                fontSize: "1em",
                                marginTop: "10px",
                                flexWrap: "wrap",
                            }}
                        >
                            {menu.restaurant_delivery_companies.map(
                                (deliveryCompany, index) => (
                                    <div key={index}>
                                        {
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    marginTop: "5px",
                                                }}
                                            >
                                                <img
                                                    src={
                                                        deliveryCompany
                                                            .restaurant_delivery_company
                                                            .delivery_company_details
                                                            .company_image_url
                                                    }
                                                    width="60px"
                                                    height="60px"
                                                    alt=""
                                                />
                                                <p
                                                    style={{
                                                        margin: "5px",
                                                        marginRight: "10px",
                                                        alignSelf: "center",
                                                        width: "65px",
                                                    }}
                                                >
                                                    {
                                                        deliveryCompany
                                                            .restaurant_delivery_company
                                                            .delivery_company_details
                                                            .name
                                                    }
                                                </p>
                                            </div>
                                        }
                                    </div>
                                )
                            )}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                fontSize: "1em",
                                marginTop: "10px",
                            }}
                        >
                            <div style={{fontWeight: "bold"}}>
                                {global.address}&nbsp;
                            </div>
                            <div>
                                <p>{menu.restaurant.public_address}</p>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                marginTop: "10px",
                                fontSize: "1em",
                            }}
                        >
                            <img
                                src={GetFlagCorrespondingUrl(
                                    menu.restaurant.public_country
                                )}
                                // width="150px"
                                height="150px"
                                alt="Country"
                            />
                            {GetFlagCorrespondingName(
                                menu.restaurant.public_country
                            )}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                fontSize: "1em",
                                marginTop: "10px",
                            }}
                        >
                            <div style={{fontWeight: "bold"}}>
                                {global.phoneNumber}&nbsp;
                            </div>
                            <p>
                                {menu.restaurant.public_phone.replace(
                                    /^(\+\d{2})(\d{1})(\d{4})(\d{4})$/,
                                    "$1 $2 $3 $4"
                                )}
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
                                    width: "100%",
                                    fontSize: "1em",
                                    fontWeight: "bold",
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
                                {scheduleData.openHours.map((value, index) => (
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
                                    width: "100%",
                                    fontSize: "1em",
                                    fontWeight: "bold",
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
                                {scheduleData.closeHours.map((value, index) => (
                                    <TableItem key={index}>{value}</TableItem>
                                ))}
                            </TableRow>
                        </TableContainer>
                        <div style={{width: "90%"}}>
                            {menu.restaurant.public_instagram_url !== "" && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        fontSize: "1em",
                                        marginTop: "10px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                        }}
                                    >
                                        <InstagramIcon />
                                        <div style={{fontWeight: "bold"}}>
                                            &nbsp;{global.instagram}&nbsp;
                                        </div>
                                    </div>
                                    <div>
                                        <a
                                            href={
                                                "https://" +
                                                menu.restaurant
                                                    .public_instagram_url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <div
                                                style={{
                                                    color: "#534DEB",
                                                    fontSize: "14px",
                                                }}
                                            >
                                                {"https://" +
                                                    menu.restaurant
                                                        .public_instagram_url}
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            )}
                            {menu.restaurant.public_facebook_url !== "" && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        fontSize: "1em",
                                        marginTop: "10px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                        }}
                                    >
                                        <FacebookIcon />
                                        <div style={{fontWeight: "bold"}}>
                                            &nbsp;{global.facebook}&nbsp;
                                        </div>
                                    </div>
                                    <div>
                                        <a
                                            href={
                                                "https://" +
                                                menu.restaurant
                                                    .public_facebook_url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <div
                                                style={{
                                                    color: "#534DEB",
                                                    fontSize: "14px",
                                                }}
                                            >
                                                {"https://" +
                                                    menu.restaurant
                                                        .public_facebook_url}
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            )}
                            {menu.restaurant.public_twitter_url !== "" && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        fontSize: "1em",
                                        marginTop: "10px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                        }}
                                    >
                                        <TwitterIcon />
                                        <div style={{fontWeight: "bold"}}>
                                            &nbsp;{global.twitter}&nbsp;
                                        </div>
                                    </div>
                                    <div>
                                        <a
                                            href={
                                                "https://" +
                                                menu.restaurant
                                                    .public_twitter_url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <div
                                                style={{
                                                    color: "#534DEB",
                                                    fontSize: "14px",
                                                }}
                                            >
                                                {"https://" +
                                                    menu.restaurant
                                                        .public_twitter_url}
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            )}
                            {menu.restaurant.public_website_url !== "" && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        fontSize: "1em",
                                        marginTop: "10px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                        }}
                                    >
                                        <HomeIcon />
                                        <div style={{fontWeight: "bold"}}>
                                            &nbsp;{global.webSite}&nbsp;
                                        </div>
                                    </div>
                                    <div>
                                        <a
                                            href={
                                                "https://" +
                                                menu.restaurant
                                                    .public_website_url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <div
                                                style={{
                                                    color: "#534DEB",
                                                    fontSize: "14px",
                                                }}
                                            >
                                                {"https://" +
                                                    menu.restaurant
                                                        .public_website_url}
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <DeviderComponent />

                    {menu.restaurant.price_type === global.fullPrice && (
                        <div style={{width: "95%"}}>
                            <CompShowReviewsAverage
                                isDish={false}
                                isRestaurant={true}
                                isDishes={false}
                                categoryIndex={global.noValue}
                                dishIndex={global.noValue}
                            />
                        </div>
                    )}
                    <div style={{marginTop: "50px", fontSize: "14px"}}>
                        <CompShowReviewAndShareButtons
                            isRestaurant={true}
                            isDish={false}
                            categoryIndex={global.noValue}
                            dishIndex={global.noValue}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
