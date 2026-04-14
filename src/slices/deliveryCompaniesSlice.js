import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {loadDeliveryCompaniesApi} from "../axiosCalls/axiosAPICalls";
import * as global from "../globalDefinitions/globalConstants";
import cloneDeep from "lodash/cloneDeep";

export const fetchDeliveryCompanies = createAsyncThunk(
    "deliveryCompanies/fetchDeliveryCompanies",
    async (restaurantId, {rejectWithValue}) => {
        try {
            const dataM = await loadDeliveryCompaniesApi(restaurantId);
            return dataM;
        } catch (error) {
            // Use rejectWithValue to dispatch an error action with payload
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    deliveryCompanies: [],
    deliveryCompaniesStatus: global.backendReadingIdle, //'idle' | 'loading' | 'succeeded' | 'failed'
    deliveryCompaniesError: null,
};

export const deliveryCompaniesSlice = createSlice({
    name: "deliveryCompanies",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchDeliveryCompanies.pending, (state) => {
                state.deliveryCompaniesStatus = global.backendReadingLoading;
            })
            .addCase(fetchDeliveryCompanies.fulfilled, (state, action) => {
                state.deliveryCompaniesStatus = global.backendReadingSucceeded;
                state.deliveryCompanies = cloneDeep(action.payload);
            })
            .addCase(fetchDeliveryCompanies.rejected, (state, action) => {
                state.deliveryCompaniesStatus = global.backendReadingFailed;
                state.deliveryCompaniesError = action.error.message;
            });
    },
});

export const getDeliveryCompanies = (state) =>
    state.deliveryCompanies.deliveryCompanies;
export const getDeliveryCompaniesStatus = (state) =>
    state.deliveryCompanies.deliveryCompaniesStatus;
export const getDeliveryCompaniesError = (state) =>
    state.deliveryCompanies.deliveryCompaniesError;

export default deliveryCompaniesSlice.reducer;
