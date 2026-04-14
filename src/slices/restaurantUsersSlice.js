import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {loadRestaurantUsersApi} from "../axiosCalls/axiosAPICalls";
import * as global from "../globalDefinitions/globalConstants";
import cloneDeep from "lodash/cloneDeep";

export const fetchRestaurantUsers = createAsyncThunk(
    "restaurantUsers/fetchRestaurantUsers",
    async (restaurantId, {rejectWithValue}) => {
        try {
            const dataM = await loadRestaurantUsersApi(restaurantId);
            return dataM;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    restaurantUsers: [],
    restaurantUsersStatus: global.backendReadingIdle, //'idle' | 'loading' | 'succeeded' | 'failed'
    restaurantUsersError: null,
};

export const restaurantUsersSlice = createSlice({
    name: "restaurantUsers",
    initialState,
    reducers: {
        changeRestaurantUserMarkedForDeletion: (state, action) => {
            const {userId, markedForDeletion} = action.payload;
            const userIndex = state.restaurantUsers.findIndex(
                (user) => user.restaurant_user.id === userId
            );

            if (userIndex !== -1) {
                state.restaurantUsers[
                    userIndex
                ].restaurant_user.marked_for_deletion = markedForDeletion;
            }
        },
        changeRestaurantUserData: (state, action) => {
            const {userId, updatedData} = action.payload;
            const userIndex = state.restaurantUsers.findIndex(
                (user) => user.restaurant_user.id === userId
            );

            if (userIndex !== -1) {
                const updatedUserData = {
                    ...updatedData,
                    has_been_modified: true,
                };
                state.restaurantUsers[userIndex].restaurant_user = {
                    ...state.restaurantUsers[userIndex].restaurant_user,
                    ...updatedUserData,
                };
            }
        },

        changeRestaurantUserEMailValidation: (state, action) => {
            const {userId, newValue} = action.payload;
            const userIndex = state.restaurantUsers.findIndex(
                (user) => user.restaurant_user.id === userId
            );

            if (userIndex !== -1) {
                state.restaurantUsers[
                    userIndex
                ].restaurant_user.has_been_modified = true;
                state.restaurantUsers[
                    userIndex
                ].restaurant_user.private_email_validated = newValue;
            }
        },

        addANewRestaurantUser: (state, action) => {
            const {userId, updatedData} = action.payload;

            let newRestaurantUser = {
                restaurant_user: {
                    id: userId,
                    public_name: "",
                    private_name: updatedData.private_name,
                    // public_phone: "",
                    // private_phone: updatedData.private_phone || "",
                    public_password: "",
                    private_password: updatedData.private_password,
                    public_email: "",
                    private_email: updatedData.private_email || "",
                    public_image_id: global.noValue,
                    private_image_id:
                        updatedData.private_image_id === global.noValue ||
                        updatedData.private_image_id === undefined
                            ? global.noValue
                            : updatedData.private_image_id,
                    recently_created: true,
                    has_been_modified: true,
                    marked_for_deletion: false,
                },
            };

            state.restaurantUsers.push(newRestaurantUser);
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchRestaurantUsers.pending, (state) => {
                state.restaurantUsersStatus = global.backendReadingLoading;
            })
            .addCase(fetchRestaurantUsers.fulfilled, (state, action) => {
                state.restaurantUsersStatus = global.backendReadingSucceeded;
                state.restaurantUsers = cloneDeep(action.payload);
            })
            .addCase(fetchRestaurantUsers.rejected, (state, action) => {
                state.restaurantUsersStatus = global.backendReadingFailed;
                state.restaurantUsersError = action.error.message;
            });
    },
});

export const {
    changeRestaurantUserMarkedForDeletion,
    changeRestaurantUserData,
    switchRestaurantUserEMailValidation,
    // switchRestaurantUserPhoneValidation,
    addANewRestaurantUser,
} = restaurantUsersSlice.actions;

export const getRestaurantUsers = (state) =>
    state.restaurantUsers.restaurantUsers;
export const getRestaurantUsersStatus = (state) =>
    state.restaurantUsers.restaurantUsersStatus;
export const getRestaurantUsersError = (state) =>
    state.restaurantUsers.restaurantUsersError;

export default restaurantUsersSlice.reducer;
