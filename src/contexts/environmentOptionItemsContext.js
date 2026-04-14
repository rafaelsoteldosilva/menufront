import React, {useReducer} from "react";
import * as global from "../globalDefinitions/globalConstants";
import produce from "immer";
import PropTypes from "prop-types";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faListUl} from "@fortawesome/free-solid-svg-icons";

import LoginIcon from "@mui/icons-material/Login";
import StorefrontIcon from "@mui/icons-material/Storefront";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LogoutIcon from "@mui/icons-material/Logout";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import GradingIcon from "@mui/icons-material/Grading";
import CellTowerIcon from "@mui/icons-material/CellTower";
import CampaignIcon from "@mui/icons-material/Campaign";
import CancelIcon from "@mui/icons-material/Cancel";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import RemoveDoneIcon from "@mui/icons-material/RemoveDone";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import CollectionsIcon from "@mui/icons-material/Collections";
import PsychologyIcon from "@mui/icons-material/Psychology";
import GroupIcon from "@mui/icons-material/Group";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PreviewIcon from "@mui/icons-material/Preview";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import EmailIcon from "@mui/icons-material/Email";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";

export const environmentOptionItemsContextActions = {
    setPublicEnvironment: "SET_PUBLIC_ENVIRONMENT",
    setPrivateEnvironment: "SET_PRIVATE_ENVIRONMENT",
    setEditMenuPrivateEnvironment: "SET_EDIT_MENU_PRIVATE_ENVIRONMENT",
    setInappropriateRevisionsPrivateEnvironment:
        "SET_INAPPROPRIATE_REVISIONS_PRIVATE_ENVIRONMENT",
    setSortMenuPrivateEnvironment: "SET_SORT_MENU_PRIVATE_ENVIRONMENT",
    setRestaurantDeliveriesPrivateEnvironment:
        "SET_RESTAURANT_DELIVERIES_PRIVATE_ENVIRONMENT",
    setPromotionsPrivateEnvironment: "SET_PROMOTIONS_PRIVATE_ENVIRONMENT",
    setHandleImagesPrivateEnvironment: "SET_HANDLE_IMAGES_PRIVATE_ENVIRONMENT",
    setEditRestaurantDataPrivateEnvironment:
        "SET_EDIT_RESTAURANT_DATA_PRIVATE_ENVIRONMENT",
    activateOrDeactivateAMenuItem: "ACTIVATE_OR_DEACTIVATE_A_MENU_ITEM",
    changeMenuItemName: "CHANGE_MENU_ITEM_NAME",
    setMenuItemColor: "SET_MENU_ITEM_COLOR",
    resetMenuItemColor: "RESTART_MENU_ITEM_COLOR",
    setPreferencesPrivateEnvironment: "SET_PREFERENCES_PRIVATE_ENVIRONMENT",
    setUsersEditionPrivateEnvironment: "SET_USERS_EDITION_PRIVATE_ENVIRONMENT",
    randomPrivateEnvironment: "SHOW_RANDOM_PRIVATE_ENVIRONMENT",
    payPrivateEnvironment: "PAY_PRIVATE_ENVIRONMENT",
    QRPrivateEnvironment: "SHOW_QR_PRIVATE_ENVIRONMENT",
};

export const environmentOptionItems = {
    publicEnvironment: "public",
    privateEnvironment: "private",
    menuPrivateEnvironment: "menuPrivate",
    inappropriateRevisionsPrivateEnvironment: "inappropriateRevisionsPrivate",
    handleImagesPrivateEnvironment: "handleImagesPrivate",
    preferencesPrivateEnvironment: "preferencesPrivate",
    sortMenuPrivateEnvironment: "sortMenuPrivate",
    restaurantDeliveriesPrivateEnvironment: "restaurantDeliveriesPrivate",
    promotionsPrivateEnvironment: "promotionsPrivate",
    usersPrivateEnvironment: "usersPrivate",
    randomPrivateEnvironment: "randomPrivate",
    payPrivateEnvironment: "payPrivate",
    QRPrivateEnvironment: "QRPrivate",
};

// those menu options that are not hidden have to be of type buttonItemType

const publicEnvironmentMenuItemOptions = {
    menuWidth: 260,
    optionsArray: [
        {
            menuItemTo: global.homePath,
            originalTitle: global.homeOptionTitle,
            title: global.homeOptionTitle,
            icon: <StorefrontIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: null,
            blur: null,
        },
        {
            menuItemTo: global.categoriesPath,
            originalTitle: global.menuCardOptionTitle,
            title: global.menuCardOptionTitle,
            icon: <FormatListBulletedIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: null,
            blur: null,
        },
        {
            menuItemTo: global.showPublicPromotionsPath,
            originalTitle: global.promotionsPublicOptionTitle,
            title: global.promotionsPublicOptionTitle,
            icon: <CampaignIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: null,
            // blur: "blur(5px)",
        },
        {
            menuItemTo: global.dishesPath,
            originalTitle: global.dishesOptionTitle,
            title: global.dishesOptionTitle,
            // these are repeated since they are hidden, fill it with what you want
            icon: <FontAwesomeIcon icon={faListUl} />,
            type: global.buttonItemType,
            hidden: true,
            disabled: false,
            indented: false,
            clickeable: true,
            color: null,
            blur: null,
        },
        {
            menuItemTo: global.dishPath,
            originalTitle: global.dishOptionTitle,
            title: global.dishOptionTitle,
            // these are repeated since they are hidden, fill it with what you want
            icon: <FontAwesomeIcon icon={faListUl} />,
            type: global.buttonItemType,
            hidden: true,
            disabled: false,
            indented: false,
            clickeable: true,
            color: null,
            blur: null,
        },
        {
            menuItemTo: global.showReviewsPath,
            originalTitle: global.showReviewsOptionTitle,
            title: global.showReviewsOptionTitle,
            // these are repeated since they are hidden, fill it with what you want
            icon: <FontAwesomeIcon icon={faListUl} />,
            type: global.buttonItemType,
            hidden: true,
            disabled: false,
            indented: false,
            clickeable: true,
            color: null,
            blur: null,
        },
        {
            menuItemTo: global.managementPath,
            originalTitle: global.helpOptionTitle,
            title: global.helpOptionTitle,
            icon: <HelpCenterIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#FF8E01",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            menuItemTo: global.managementLoginPath,
            originalTitle: global.managementLoginOptionTitle,
            title: global.managementLoginOptionTitle,
            icon: <LoginIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#BEDBBC",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
    ],
};

const privateEnvironmentMenuItemOptions = {
    menuWidth: 360,
    optionsArray: [
        {
            menuItemTo: global.categoriesPath,
            originalTitle: global.editMenuOptionTitle,
            title: global.editMenuOptionTitle,
            icon: <BorderColorIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#54EA5A",
            blur: null,
        },
        {
            originalTitle: global.inappropriateReviewsOptionTitle,
            title: global.inappropriateReviewsOptionTitle,
            icon: <GradingIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#54EA5A",
            // blur: "blur(5px)",
        },
        {
            menuItemTo: global.categoriesPath,
            originalTitle: global.sortMenuOptionTitle,
            title: global.sortMenuOptionTitle,
            icon: <SortByAlphaIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#54EA5A",
            // blur: "blur(5px)",
        },
        {
            menuItemTo: global.ShowPrivateRestaurantDeliveriesPath,
            originalTitle: global.restaurantDeliveriesOptionTitle,
            title: global.restaurantDeliveriesOptionTitle,
            icon: <DeliveryDiningIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#54EA5A",
            // blur: "blur(5px)",
        },
        {
            menuItemTo: global.showPrivatePromotionsPath,
            originalTitle: global.promotionsPrivateOptionTitle,
            title: global.promotionsPrivateOptionTitle,
            icon: <CampaignIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#54EA5A",
            blur: null,
        },
        {
            menuItemTo: global.showPreferencesPath,
            originalTitle: global.showPreferencesOptionTitle,
            title: global.showPreferencesOptionTitle,
            icon: <PsychologyIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#54EA5A",
            blur: null,
        },
        {
            menuItemTo: global.showRestaurantUsersPath,
            originalTitle: global.showUsersOptionTitle,
            title: global.showUsersOptionTitle,
            icon: <GroupIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#54EA5A",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            menuItemTo: global.showImageCollectionPath,
            originalTitle: global.imageCollectionOptionTitle,
            title: global.imageCollectionOptionTitle,
            icon: <CollectionsIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#BEDBBC",
            blur: null,
        },
        // {
        //     type: global.dividerItemType,
        //     color: "#C1CC41",
        // },
        {
            menuItemTo: global.showRestaurantNumberPath,
            originalTitle: global.showRestaurantNumberOptionTitle,
            title: global.showRestaurantNumberOptionTitle,
            icon: <PreviewIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#BEDBBC",
            // blur: "blur(5px)",
        },
        // {
        //     type: global.dividerItemType,
        //     color: "#C1CC41",
        // },
        {
            menuItemTo: global.paymentStatePath,
            originalTitle: global.paymentStateTitle,
            title: global.paymentStateTitle,
            icon: <MonetizationOnIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#BEDBBC",
            blur: null,
        },
        {
            menuItemTo: global.showQRPath,
            originalTitle: global.showQROptionTitle,
            title: global.showQROptionTitle,
            icon: <QrCode2Icon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#BEDBBC",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            menuItemTo: global.managementPath,
            originalTitle: global.helpOptionTitle,
            title: global.helpOptionTitle,
            icon: <HelpCenterIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#FF8E01",
            blur: null,
        },
        {
            menuItemTo: global.categoriesPath,
            originalTitle: global.managementLogoutOptionTitle,
            title: global.managementLogoutOptionTitle,
            icon: <LogoutIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#E5A8C2",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
    ],
};

const EditMenuPrivateEnvironmentMenuItemOptions = {
    menuWidth: 360,
    optionsArray: [
        {
            originalTitle: global.editMenuOptionTitle,
            title: global.editMenuOptionTitle,
            icon: <AppRegistrationIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: false,
            color: "#07B805",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            menuItemTo: global.managementPath,
            originalTitle: global.helpOptionTitle,
            title: global.helpOptionTitle,
            icon: <HelpCenterIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#FF8E01",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            originalTitle: global.showChangesMadeTitle,
            title: global.showChangesMadeTitle,
            icon: <DynamicFeedIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#BEDBBC",
            blur: null,
        },
        {
            originalTitle: global.publishOptionTitle,
            title: global.publishOptionTitle,
            icon: <CellTowerIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#F0F445",
            blur: null,
        },
        {
            originalTitle: global.discardOptionTitle,
            title: global.discardOptionTitle,
            icon: <CancelIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#E5A8C2",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
    ],
};

const InappropriateRevisionsPrivateEnvironmentMenuItemOptions = {
    menuWidth: 280,
    optionsArray: [
        {
            originalTitle: global.inappropriateReviewsOptionTitle,
            title: global.inappropriateReviewsOptionTitle,
            icon: <GradingIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: false,
            color: "#07B805",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            menuItemTo: global.managementPath,
            originalTitle: global.helpOptionTitle,
            title: global.helpOptionTitle,
            icon: <HelpCenterIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#FF8E01",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            originalTitle: global.publishOptionTitle,
            title: global.publishOptionTitle,
            icon: <CellTowerIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#F0F445",
            blur: null,
        },
        {
            originalTitle: global.discardOptionTitle,
            title: global.discardOptionTitle,
            icon: <CancelIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#E5A8C2",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
    ],
};

const SortMenuPrivateEnvironmentMenuItemOptions = {
    menuWidth: 380,
    optionsArray: [
        {
            originalTitle: global.sortMenuOptionTitle,
            title: global.sortMenuOptionTitle,
            icon: <SortByAlphaIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: false,
            color: "#07B805",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            originalTitle: global.clearAllSortingsOptionTitle,
            title: global.clearAllSortingsOptionTitle,
            icon: <ClearAllIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: null,
            blur: null,
        },
        {
            originalTitle: global.clearTheseSortingsOptionTitle,
            title: global.clearCategoriesSortingOptionTitle,
            icon: <RemoveDoneIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: !global.accessBackend,
            indented: false,
            clickeable: true,
            color: null,
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            menuItemTo: global.managementPath,
            originalTitle: global.helpOptionTitle,
            title: global.helpOptionTitle,
            icon: <HelpCenterIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#FF8E01",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            originalTitle: global.publishOptionTitle,
            title: global.publishOptionTitle,
            icon: <CellTowerIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#F0F445",
            blur: null,
        },
        {
            originalTitle: global.discardOptionTitle,
            title: global.discardOptionTitle,
            icon: <CancelIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#E5A8C2",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
    ],
};

const RestaurantDeliveriesPrivateEnvironmentMenuItemOptions = {
    menuWidth: 260,
    optionsArray: [
        {
            originalTitle: global.restaurantDeliveriesOptionTitle,
            title: global.restaurantDeliveriesOptionTitle,
            icon: <DeliveryDiningIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: false,
            color: "#07B805",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            menuItemTo: global.managementPath,
            originalTitle: global.helpOptionTitle,
            title: global.helpOptionTitle,
            icon: <HelpCenterIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#FF8E01",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            originalTitle: global.publishOptionTitle,
            title: global.publishOptionTitle,
            icon: <CellTowerIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#F0F445",
            blur: null,
        },
        {
            originalTitle: global.discardOptionTitle,
            title: global.discardOptionTitle,
            icon: <CancelIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#E5A8C2",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
    ],
};

const PromotionsPrivateEnvironmentMenuItemOptions = {
    menuWidth: 360,
    optionsArray: [
        {
            originalTitle: global.promotionsPrivateOptionTitle,
            title: global.promotionsPrivateOptionTitle,
            icon: <CampaignIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: false,
            color: "#07B805",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            menuItemTo: global.managementPath,
            originalTitle: global.helpOptionTitle,
            title: global.helpOptionTitle,
            icon: <HelpCenterIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#FF8E01",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            originalTitle: global.publishOptionTitle,
            title: global.publishOptionTitle,
            icon: <CellTowerIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#F0F445",
            blur: null,
        },
        {
            originalTitle: global.discardOptionTitle,
            title: global.discardOptionTitle,
            icon: <CancelIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#E5A8C2",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
    ],
};

const PreferencesPrivateEnvironmentMenuItemOptions = {
    menuWidth: 260,
    optionsArray: [
        {
            originalTitle: global.showPreferencesOptionTitle,
            title: global.showPreferencesOptionTitle,
            icon: <BorderColorIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: false,
            color: "#07B805",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            menuItemTo: global.managementPath,
            originalTitle: global.helpOptionTitle,
            title: global.helpOptionTitle,
            icon: <HelpCenterIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#FF8E01",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            originalTitle: global.publishOptionTitle,
            title: global.publishOptionTitle,
            icon: <CellTowerIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#F0F445",
            blur: null,
        },
        {
            originalTitle: global.discardOptionTitle,
            title: global.discardOptionTitle,
            icon: <CancelIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#E5A8C2",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
    ],
};

const UsersPrivateEnvironmentMenuItemOptions = {
    menuWidth: 260,
    optionsArray: [
        {
            originalTitle: global.showUsersOptionTitle,
            title: global.showUsersOptionTitle,
            icon: <GroupIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: false,
            color: "#07B805",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            menuItemTo: global.managementPath,
            originalTitle: global.helpOptionTitle,
            title: global.helpOptionTitle,
            icon: <HelpCenterIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#FF8E01",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            originalTitle: global.publishOptionTitle,
            title: global.publishOptionTitle,
            icon: <CellTowerIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#F0F445",
            blur: null,
        },
        {
            originalTitle: global.discardOptionTitle,
            title: global.discardOptionTitle,
            icon: <CancelIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#E5A8C2",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
    ],
};

const HandleImagesPrivateEnvironmentMenuItemOptions = {
    menuWidth: 260,
    optionsArray: [
        {
            originalTitle: global.imageCollectionOptionTitle,
            title: global.imageCollectionOptionTitle,
            icon: <CollectionsIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: false,
            color: "#07B805",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            originalTitle: global.exitOptionTitle,
            title: global.exitOptionTitle,
            icon: <ExitToAppIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#E5A8C2",
            blur: null,
        },
    ],
};

const ShowRestarurantNumberPrivateEnvironmentMenuItemOptions = {
    menuWidth: 310,
    optionsArray: [
        {
            originalTitle: global.showRestaurantNumberOptionTitle,
            title: global.showRestaurantNumberOptionTitle,
            icon: <PreviewIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: false,
            color: "#07B805",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            originalTitle: global.exitOptionTitle,
            title: global.exitOptionTitle,
            icon: <ExitToAppIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#E5A8C2",
            blur: null,
        },
    ],
};

const PayPrivateEnvironmentMenuItemOptions = {
    menuWidth: 260,
    optionsArray: [
        {
            originalTitle: global.paymentStateTitle,
            title: global.paymentStateTitle,
            icon: <MonetizationOnIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: false,
            color: "#07B805",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            originalTitle: global.exitOptionTitle,
            title: global.exitOptionTitle,
            icon: <ExitToAppIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#E5A8C2",
            blur: null,
        },
    ],
};

const ShowQRPrivateEnvironmentMenuItemOptions = {
    menuWidth: 260,
    optionsArray: [
        {
            originalTitle: global.showQROptionTitle,
            title: global.showQROptionTitle,
            icon: <QrCode2Icon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: false,
            color: "#07B805",
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            originalTitle: global.eMailQROptionTitle,
            title: global.eMailQROptionTitle,
            icon: <EmailIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: null,
            blur: null,
        },
        {
            type: global.dividerItemType,
            color: "#C1CC41",
        },
        {
            originalTitle: global.exitOptionTitle,
            title: global.exitOptionTitle,
            icon: <ExitToAppIcon />,
            type: global.buttonItemType,
            hidden: false,
            disabled: false,
            indented: false,
            clickeable: true,
            color: "#E5A8C2",
            blur: null,
        },
    ],
};

const initialState = {
    environmentOptionItems: environmentOptionItems.publicEnvironment,
    navigationOptions: publicEnvironmentMenuItemOptions,
};

const environmentOptionItemsReducer = (state = initialState, action) => {
    return produce(state, (draftState) => {
        switch (action.type) {
            case environmentOptionItemsContextActions.setPublicEnvironment: {
                draftState.environmentOptionItems =
                    environmentOptionItems.publicEnvironment;
                draftState.navigationOptions = publicEnvironmentMenuItemOptions;
                break;
            }
            case environmentOptionItemsContextActions.setPrivateEnvironment: {
                draftState.environmentOptionItems =
                    environmentOptionItems.privateEnvironment;
                draftState.navigationOptions =
                    privateEnvironmentMenuItemOptions;
                break;
            }
            case environmentOptionItemsContextActions.activateOrDeactivateAMenuItem: {
                const {itemOriginalTitle: title1, deactivate} = action.payload;
                const index =
                    draftState.navigationOptions.optionsArray.findIndex(
                        (obj) => obj.originalTitle === title1
                    );
                if (index !== global.noValue && global.accessBackend) {
                    draftState.navigationOptions.optionsArray[index].disabled =
                        deactivate;
                }
                break;
            }
            case environmentOptionItemsContextActions.setMenuItemColor: {
                const {itemOriginalTitle: title4, color} = action.payload;
                const counter =
                    draftState.navigationOptions.optionsArray.findIndex(
                        (obj) => obj.originalTitle === title4
                    );
                if (counter !== global.noValue && global.accessBackend) {
                    draftState.navigationOptions.optionsArray[counter].color =
                        color;
                }
                break;
            }
            case environmentOptionItemsContextActions.resetMenuItemColor: {
                const {itemOriginalTitle: title6} = action.payload;
                const index2 =
                    draftState.navigationOptions.optionsArray.findIndex(
                        (obj) => obj.originalTitle === title6
                    );
                if (index2 !== global.noValue) {
                    draftState.navigationOptions.optionsArray[index2].color =
                        "#BEDBBC";
                }
                break;
            }
            case environmentOptionItemsContextActions.changeMenuItemName: {
                const {itemOriginalTitle: title3, newName} = action.payload;
                const ndx = draftState.navigationOptions.optionsArray.findIndex(
                    (obj) => obj.originalTitle === title3
                );
                if (ndx !== global.noValue) {
                    draftState.navigationOptions.optionsArray[ndx].title =
                        newName;
                }
                break;
            }

            case environmentOptionItemsContextActions.setSortMenuPrivateEnvironment: {
                draftState.environmentOptionItems =
                    environmentOptionItems.sortMenuPrivateEnvironment;
                draftState.navigationOptions =
                    SortMenuPrivateEnvironmentMenuItemOptions;
                break;
            }
            case environmentOptionItemsContextActions.setRestaurantDeliveriesPrivateEnvironment: {
                draftState.environmentOptionItems =
                    environmentOptionItems.restaurantDeliveriesPrivateEnvironment;
                draftState.navigationOptions =
                    RestaurantDeliveriesPrivateEnvironmentMenuItemOptions;
                break;
            }
            case environmentOptionItemsContextActions.setPromotionsPrivateEnvironment: {
                draftState.environmentOptionItems =
                    environmentOptionItems.promotionsPrivateEnvironment;
                draftState.navigationOptions =
                    PromotionsPrivateEnvironmentMenuItemOptions;
                break;
            }
            case environmentOptionItemsContextActions.setEditMenuPrivateEnvironment: {
                draftState.environmentOptionItems =
                    environmentOptionItems.menuPrivateEnvironment;
                draftState.navigationOptions =
                    EditMenuPrivateEnvironmentMenuItemOptions;
                break;
            }
            case environmentOptionItemsContextActions.setInappropriateRevisionsPrivateEnvironment: {
                draftState.environmentOptionItems =
                    environmentOptionItems.inappropriateRevisionsPrivateEnvironment;
                draftState.navigationOptions =
                    InappropriateRevisionsPrivateEnvironmentMenuItemOptions;
                break;
            }
            case environmentOptionItemsContextActions.setHandleImagesPrivateEnvironment: {
                draftState.environmentOptionItems =
                    environmentOptionItems.handleImagesPrivateEnvironment;
                draftState.navigationOptions =
                    HandleImagesPrivateEnvironmentMenuItemOptions;
                break;
            }
            case environmentOptionItemsContextActions.setPreferencesPrivateEnvironment: {
                draftState.environmentOptionItems =
                    environmentOptionItems.preferencesPrivateEnvironment;
                draftState.navigationOptions =
                    PreferencesPrivateEnvironmentMenuItemOptions;
                break;
            }
            case environmentOptionItemsContextActions.setUsersEditionPrivateEnvironment: {
                draftState.environmentOptionItems =
                    environmentOptionItems.usersPrivateEnvironment;
                draftState.navigationOptions =
                    UsersPrivateEnvironmentMenuItemOptions;
                break;
            }
            case environmentOptionItemsContextActions.randomPrivateEnvironment: {
                draftState.environmentOptionItems =
                    environmentOptionItems.randomPrivateEnvironment;
                draftState.navigationOptions =
                    ShowRestarurantNumberPrivateEnvironmentMenuItemOptions;
                break;
            }
            case environmentOptionItemsContextActions.payPrivateEnvironment: {
                draftState.environmentOptionItems =
                    environmentOptionItems.payPrivateEnvironment;
                draftState.navigationOptions =
                    PayPrivateEnvironmentMenuItemOptions;
                break;
            }
            case environmentOptionItemsContextActions.QRPrivateEnvironment: {
                draftState.environmentOptionItems =
                    environmentOptionItems.QRPrivateEnvironment;
                draftState.navigationOptions =
                    ShowQRPrivateEnvironmentMenuItemOptions;
                break;
            }

            default: {
                break;
            }
        }
    });
};

const EnvironmentOptionItemsContext = React.createContext(null);

const EnvironmentOptionItemsContextProvider = ({children}) => {
    const [environmentOptionItemsState, environmentOptionItemsStateDispatch] =
        useReducer(environmentOptionItemsReducer, initialState);

    return (
        <EnvironmentOptionItemsContext.Provider
            value={{
                environmentOptionItemsState,
                environmentOptionItemsStateDispatch,
            }}
        >
            {children}
        </EnvironmentOptionItemsContext.Provider>
    );
};

export {EnvironmentOptionItemsContext, EnvironmentOptionItemsContextProvider};

EnvironmentOptionItemsContextProvider.propTypes = {
    children: PropTypes.node.isRequired, // children should be a valid React node and is required
};
