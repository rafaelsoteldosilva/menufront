import {configureStore} from "@reduxjs/toolkit";
import menuReducer from "../slices/restaurantMenuSlice";
import allReviewsReducer from "../slices/allReviewsSlice";
import deliveryCompaniesReducer from "../slices/deliveryCompaniesSlice";
import paymentOptionsReducer from "../slices/paymentOptionsSlice";
import restaurantUsersReducer from "../slices/restaurantUsersSlice";

const reducers = configureStore({
    reducer: {
        restaurantMenu: menuReducer,
        allReviews: allReviewsReducer,
        deliveryCompanies: deliveryCompaniesReducer,
        paymentOptions: paymentOptionsReducer,
        restaurantUsers: restaurantUsersReducer,
    },
});
// hello world
export default reducers;
