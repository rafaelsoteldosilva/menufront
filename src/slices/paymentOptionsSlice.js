import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {loadPaymentOptionsApi} from "../axiosCalls/axiosAPICalls";
import * as global from "../globalDefinitions/globalConstants";
import cloneDeep from "lodash/cloneDeep";

export const fetchPaymentOptions = createAsyncThunk(
    "paymentOptions/fetchPaymentOptions",
    async (countryId, {rejectWithValue}) => {
        try {
            const dataM = await loadPaymentOptionsApi(countryId);
            return dataM;
        } catch (error) {
            // Use rejectWithValue to dispatch an error action with payload
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    paymentOptions: [],
    paymentOptionsStatus: global.backendReadingIdle, //'idle' | 'loading' | 'succeeded' | 'failed'
    paymentOptionsError: null,
};

export const paymentOptionsSlice = createSlice({
    name: "paymentOptions",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchPaymentOptions.pending, (state) => {
                state.paymentOptionsStatus = global.backendReadingLoading;
            })
            .addCase(fetchPaymentOptions.fulfilled, (state, action) => {
                state.paymentOptionsStatus = global.backendReadingSucceeded;
                state.paymentOptions = cloneDeep(action.payload);
            })
            .addCase(fetchPaymentOptions.rejected, (state, action) => {
                state.paymentOptionsStatus = global.backendReadingFailed;
                state.paymentOptionsError = action.error.message;
            });
    },
});

export const getPaymentOptions = (state) => state.paymentOptions.paymentOptions;
export const getPaymentOptionsStatus = (state) =>
    state.paymentOptions.paymentOptionsStatus;
export const getPaymentOptionsError = (state) =>
    state.paymentOptions.paymentOptionsError;

export default paymentOptionsSlice.reducer;
