import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {CSSReset} from "./globalDefinitions/globalStyles";

import * as global from "./globalDefinitions/globalConstants";

import ShowCategories from "./routes/ShowCategories";
import Home from "./routes/ShowHome";
import ShowDishes from "./routes/ShowDishes";
import ShowDish from "./routes/ShowDish";
import ShowHeaderStripAndCheckForData from "./RouteProtectors/ShowHeaderStripAndCheckForData";
import ShowReviews from "./routes/ShowReviews";
import ShowReview from "./routes/ShowReview";
import DialogAddNewReview from "./routes/DialogAddNewReview";
import DialogWhatsappShare from "./routes/DialogWhatsappShare";
import DialogManagementLogin from "./routes/DialogManagementLogin";
import ShowManagement from "./routes/ShowManagement";
import DialogCategory from "./routes/DialogCategory";
import DialogDish from "./routes/DialogDish";
import DialogImageName from "./routes/DialogImageName";
import ShowNotAllowed from "./routes/ShowNotAllowed";
import DialogRestaurantUser from "./routes/DialogRestaurantUser";
import ShowRestaurantNumber from "./routes/ShowRestaurantNumber";
import ShowQR from "./routes/ShowQR";
import ShowHelp from "./routes/ShowHelp";
import ShowPaypalOnePayment from "./routes/ShowPaypalOnePayment";
import ShowImageCollection from "./routes/ShowImageCollection";
import ShowPreferences from "./routes/ShowPreferences";
import ShowRestaurantUsers from "./routes/ShowRestaurantUsers";
import DialogPreferences from "./routes/DialogPreferences";
import ShowSelectRestaurantDeliveries from "./routes/SelectPublicRestaurantDeliveries";
import DialogShowOtherThanPropioDeliveryMessage from "./routes/DialogShowOtherThanPropioDeliveryMessage";
import DialogRestaurantDeliveryToken from "./routes/DialogRestaurantDeliveryToken";
import ShowPrivateRestaurantDeliveries from "./routes/ShowPrivateRestaurantDeliveries";
import SelectDeliveryForAddingANewRestaurantDelivery from "./routes/SelectDeliveryForAddingANewRestaurantDelivery";
import ShowPublicPromotions from "./routes/ShowPublicPromotions";
import CompShowPublicPromotion from "./components/CompShowPublicPromotion";
import ShowPrivatePromotions from "./routes/ShowPrivatePromotions";
import DialogPromotion from "./routes/DialogPromotion";
import ShowImageUses from "./routes/ShowImageUses";
import ShowAllRejectionReasons from "./routes/ShowAllRejectionReasons";
import DialogSelectFileSource from "./routes/DialogSelectFileSource";
import DialogSelectLocalImageFile from "./routes/DialogSelectLocalImageFile";
import DialogGetCameraPhoto from "./routes/DialogGetCameraPhoto";
import DialogReviewRejectionReason from "./routes/DialogReviewRejectionReason";
import FAQsComponent from "./routes/ShowFAQs";
import SelectPaymentOption from "./routes/SelectPaymentOption";
import ShowPaymentState from "./routes/ShowPaymentState";
import DialogEMailValidation from "./routes/DialogEMailValidation";
import {NavigationProvider} from "./contexts/navigationContext";
import {RouteProtector} from "./RouteProtectors/RouteProtector";
import {ShowChangesMade} from "./routes/ShowChangesMade";
import ShowWebPayPlusPayment from "./routes/ShowWebPayPlusPayment";
import WebpayPlusPaymentResult from "./routes/WebpayPlusPaymentResult";

function Main() {
    let DefaultComponent = null;

    switch (global.defaultPath) {
        case global.categoriesPath:
            DefaultComponent = <ShowCategories />;
            break;
        case global.homePath:
            DefaultComponent = <Home />;
            break;

        default:
            break;
    }

    return (
        <Router>
            <NavigationProvider>
                <CSSReset />
                <div style={{width: "70vw", height: "100vh"}}>
                    <Routes>
                        <Route element={<ShowHeaderStripAndCheckForData />}>
                            {/* This next path is present for VS launching purposes only */}
                            <Route
                                path={global.rootPath}
                                element={DefaultComponent}
                            />
                            <Route
                                path={`${global.homePath}/:restaurantId`}
                                element={<Home />}
                            />
                            <Route
                                path={`${global.categoriesPath}/:restaurantId`}
                                element={<ShowCategories />}
                            />
                            <Route
                                path={`${global.dishesPath}/:restaurantId/:categoryIndex`}
                                element={<ShowDishes />}
                            />
                            <Route
                                path={`${global.dishPath}/:restaurantId/:categoryIndex/:dishIndex`}
                                element={<ShowDish />}
                            />
                            <Route
                                path={global.showReviewsPath}
                                element={
                                    <RouteProtector>
                                        <ShowReviews />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.showReviewPath}
                                element={
                                    <RouteProtector>
                                        <ShowReview />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.DialogAddNewReviewPath}
                                element={
                                    <RouteProtector>
                                        <DialogAddNewReview />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.DialogWhatsappSharePath}
                                element={
                                    <RouteProtector>
                                        <DialogWhatsappShare />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.managementLoginPath}
                                element={
                                    <RouteProtector>
                                        <DialogManagementLogin />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.managementLogoutPath}
                                element={
                                    <RouteProtector>
                                        <ShowCategories />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.notAllowedPath}
                                element={
                                    <RouteProtector>
                                        <ShowNotAllowed />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.managementPath}
                                element={
                                    <RouteProtector>
                                        <ShowManagement />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.showImageCollectionPath}
                                element={
                                    <RouteProtector>
                                        <ShowImageCollection />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.DialogCategoryPath}
                                element={
                                    <RouteProtector>
                                        <DialogCategory />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.DialogDishPath}
                                element={
                                    <RouteProtector>
                                        <DialogDish />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.showPreferencesPath}
                                element={
                                    <RouteProtector>
                                        <ShowPreferences />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.showRestaurantUsersPath}
                                element={
                                    <RouteProtector>
                                        <ShowRestaurantUsers />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.DialogRestaurantUserPath}
                                element={
                                    <RouteProtector>
                                        <DialogRestaurantUser />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.dialogEMailValidationPath}
                                element={
                                    <RouteProtector>
                                        <DialogEMailValidation />
                                    </RouteProtector>
                                }
                            />
                            {/* <Route
                                path={global.dialogPhoneValidationPath}
                                element={
                                    <RouteProtector>
                                        <DialogPhoneValidation />
                                    </RouteProtector>
                                }
                            /> */}
                            <Route
                                path={global.DialogImageNamePath}
                                element={
                                    <RouteProtector>
                                        <DialogImageName />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.frequentlyAskedQuestionsPath}
                                element={
                                    <RouteProtector>
                                        <FAQsComponent />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.showRestaurantNumberPath}
                                element={
                                    <RouteProtector>
                                        <ShowRestaurantNumber />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.payPalOnePaymentPath}
                                element={
                                    <RouteProtector>
                                        <ShowPaypalOnePayment />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.webPayPlusPaymentPath}
                                element={
                                    <RouteProtector>
                                        <ShowWebPayPlusPayment />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.paymentStatePath}
                                element={
                                    <RouteProtector>
                                        <ShowPaymentState />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.selectPaymentOptionPath}
                                element={
                                    <RouteProtector>
                                        <SelectPaymentOption />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.showQRPath}
                                element={
                                    <RouteProtector>
                                        <ShowQR />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.helpPath}
                                element={
                                    <RouteProtector>
                                        <ShowHelp />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.DialogPreferencesPath}
                                element={
                                    <RouteProtector>
                                        <DialogPreferences />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={
                                    global.SelectPublicRestaurantDeliveriesPath
                                }
                                element={
                                    <RouteProtector>
                                        <ShowSelectRestaurantDeliveries />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={
                                    global.dialogShowOtherThanPropioDeliveryMessagePath
                                }
                                element={
                                    <DialogShowOtherThanPropioDeliveryMessage />
                                }
                            />
                            <Route
                                path={global.DialogRestaurantDeliveryTokenPath}
                                element={
                                    <RouteProtector>
                                        <DialogRestaurantDeliveryToken />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={
                                    global.ShowPrivateRestaurantDeliveriesPath
                                }
                                element={
                                    <RouteProtector>
                                        <ShowPrivateRestaurantDeliveries />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={
                                    global.selectDeliveryForAddingANewRestaurantDeliveryPath
                                }
                                element={
                                    <RouteProtector>
                                        <SelectDeliveryForAddingANewRestaurantDelivery />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.showPublicPromotionsPath}
                                element={
                                    <RouteProtector>
                                        <ShowPublicPromotions />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.showPublicPromotionPath}
                                element={
                                    <RouteProtector>
                                        <CompShowPublicPromotion />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.showPrivatePromotionsPath}
                                element={
                                    <RouteProtector>
                                        <ShowPrivatePromotions />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.DialogPromotionPrivatePath}
                                element={
                                    <RouteProtector>
                                        <DialogPromotion />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.showImageUsesPath}
                                element={
                                    <RouteProtector>
                                        <ShowImageUses />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.showAllReviewRejectionReasonsPath}
                                element={
                                    <RouteProtector>
                                        <ShowAllRejectionReasons />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.DialogSelectFileSourcePath}
                                element={
                                    <RouteProtector>
                                        <DialogSelectFileSource />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.DialogSelectLocalImagePath}
                                element={
                                    <RouteProtector>
                                        <DialogSelectLocalImageFile />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.DialogGetCameraPhotoPath}
                                element={
                                    <RouteProtector>
                                        <DialogGetCameraPhoto />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.DialogReviewRejectionReasonPath}
                                element={
                                    <RouteProtector>
                                        <DialogReviewRejectionReason />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.showChangesMadePath}
                                element={
                                    <RouteProtector>
                                        <ShowChangesMade />
                                    </RouteProtector>
                                }
                            />
                            <Route
                                path={global.webpayPlusPaymentResultPath}
                                element={<WebpayPlusPaymentResult />}
                            />
                            {/* comment */}
                        </Route>
                    </Routes>
                </div>
            </NavigationProvider>
        </Router>
    );
}

export default Main;

// good
