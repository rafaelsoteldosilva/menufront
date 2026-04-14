import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {loadAllReviewsApi} from "../axiosCalls/axiosAPICalls";
import * as global from "../globalDefinitions/globalConstants";
import cloneDeep from "lodash/cloneDeep";
import {toastError} from "../utils/toastMessages";
import {mySampleAllReviews} from "../utils/SampleAllReviews";

export const fetchAllReviews = createAsyncThunk(
    "allReviews/fetchAllReviews",
    async (restaurantId) => {
        var allReviewsPromise = new Promise(function (resolve, reject) {
            if (global.accessBackend) {
                loadAllReviewsApi(restaurantId)
                    .then((dataM) => {
                        return resolve(dataM);
                    })
                    .catch((error) => {
                        toastError(
                            global.connectionErrorOrUserCanNotPerformOperations
                        );
                        reject(error);
                    });
            } else resolve(mySampleAllReviews);
        });
        return allReviewsPromise;
    }
);

const initialState = {
    allReviews: [],
    allReviewsStatus: global.backendReadingIdle, //'idle' | 'loading' | 'succeeded' | 'failed'
    allReviewsError: null,
};

const allReviewsSlice = createSlice({
    name: "allReviews",
    initialState,
    reducers: {
        allReviewsResetLocalData: (state) => {
            state.allReviews = initialState.allReviews;
            state.allReviewsStatus = initialState.allReviewsStatus;
            state.allReviewsError = initialState.allReviewsError;
        },
        AllReviewsChangeReviewMarkedForRejection: (state, action) => {
            const {reviewId, markedForRejection} = action.payload;

            const reviewIndex = state.allReviews.reviews.findIndex(
                (reviewObj) => reviewObj.review.id === reviewId
            );

            if (reviewIndex !== -1) {
                state.allReviews.reviews[reviewIndex].review.private_rejected =
                    markedForRejection;
            }
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchAllReviews.pending, (state) => {
                state.allReviewsStatus = global.backendReadingLoading;
            })
            .addCase(fetchAllReviews.fulfilled, (state, action) => {
                state.allReviewsStatus = global.backendReadingSucceeded;
                state.allReviews = cloneDeep(action.payload);
            })
            .addCase(fetchAllReviews.rejected, (state, action) => {
                state.allReviewsStatus = global.backendReadingFailed;
                state.allReviewsError = action.error.message;
            });
    },
});

export const {
    allReviewsResetLocalData,
    AllReviewsChangeReviewMarkedForRejection,
} = allReviewsSlice.actions;

export const getAllReviews = (state) => state.allReviews.allReviews;
export const getAllReviewsStatus = (state) => state.allReviews.allReviewsStatus;
export const getAllReviewsError = (state) => state.allReviews.allReviewsError;

export default allReviewsSlice.reducer;
