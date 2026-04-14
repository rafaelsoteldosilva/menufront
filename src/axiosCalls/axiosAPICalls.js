import axios from "axios";
import {DecryptForAuthorizations} from "../utils/severalFunctions";
import * as global from "../globalDefinitions/globalConstants";

// Set up Axios instance with the base URL
const apiCall = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Add a request interceptor
apiCall.interceptors.request.use(
    (config) => {
        if (config.headers["ATONNA-APP-TOKEN"] === undefined) {
            const decryptedToken = DecryptForAuthorizations(
                localStorage.getItem("authToken"),
                process.env.REACT_APP_SECRET_KEY,
            );
            // Add the token to the headers
            config.headers["ATONNA-APP-TOKEN"] = decryptedToken;
            apiCall.defaults.headers["ATONNA-APP-TOKEN"] = decryptedToken;
            localStorage.removeItem("authToken");
        }

        return config;
    },
    (error) => {
        // Handle the error
        return Promise.reject(error);
    },
);

apiCall.interceptors.response.use(
    (response) => {
        // If the response contains a new token, update the local storage
        const newToken = response.data.token;
        if (newToken) {
            // Also update the header in the axios instance to ensure future requests use the new token
            apiCall.defaults.headers["ATONNA-APP-TOKEN"] = newToken;
        }
        // localStorage.removeItem("authToken");
        return response;
    },
    (error) => {
        // Handle error responses
        return Promise.reject(error);
    },
);

// Payment
export async function doesTheRestaurantHaveToPayApi(restaurantId) {
    try {
        const response = await apiCall.get(
            `/does_the_restaurant_have_to_pay/${restaurantId}/`,
        );

        return response.data;
    } catch (error) {
        return error.message;
    }
}

export async function getPaymentPeriodApi(restaurantId, userId, userRandom) {
    const response = await apiCall.get(`/payment_period/${restaurantId}/`, {
        user_id: userId,
        user_random: userRandom,
    });
    return response.data;
}

export async function getServicePeriodApi(restaurantId, userId, userRandom) {
    const response = await apiCall.get(`/service_period/${restaurantId}/`, {
        user_id: userId,
        user_random: userRandom,
    });
    return response.data;
}

export async function paymentReceivedApi(restaurantId) {
    const response = await apiCall.patch(`/payment_received/${restaurantId}/`);
    return response.data;
}

export async function createPaypalOrderAtonnaApi(restaurantId, action) {
    try {
        const response = await apiCall.post(
            `/create_paypal_order_atonna/${restaurantId}/${action}/`,
        );

        return response.data;
    } catch (error) {
        return error.message;
    }
}

export async function capturePaypalOrderAtonnaApi(
    restaurantId,
    orderId,
    currently_logged_in,
) {
    try {
        const response = await apiCall.post(
            `/capture_paypal_order_atonna/${restaurantId}/`,
            {orderID: orderId, currently_logged_in: currently_logged_in},
        );

        return response.data;
    } catch (error) {
        return error.message;
    }
}

export async function loadPaymentOptionsApi(countryId) {
    try {
        const response = await apiCall.get(
            `/load_payment_options/${countryId}/`,
        );
        return response.data;
    } catch (error) {
        return;
    }
}

export async function payApi(restaurantId, userId, userRandom) {
    try {
        const response = await apiCall.patch(`/pay/${restaurantId}/`, {
            user_id: userId,
            user_random: userRandom,
        });

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function getAmountToBePaidApi(restaurantId, userId, userRandom) {
    try {
        const response = await apiCall.get(
            `/get_amount_to_be_paid/${restaurantId}/`,
            {
                user_id: userId,
                user_random: userRandom,
            },
        );

        return {
            status: response.status,
            value: response.data.value,
            priceType: response.data.price_type,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

// General

export async function isItPublicApi(restaurantId) {
    try {
        const response = await apiCall.get(
            `/public_or_private/${restaurantId}/`,
        );
        return response.data === -1; // -1 for public
    } catch (error) {
        return error.message;
    }
}

// Connection

export async function checkForConnectionApi(restaurantId) {
    try {
        const response = await apiCall.get(
            `/check_for_connection/${restaurantId}/`,
        );

        return response.data;
    } catch (error) {
        return error.message;
    }
}

// Help

export async function getHelpVideoUrlApi(video_name) {
    try {
        const response = await apiCall.get(
            `/get_help_video_url/${video_name}/`,
        );
        return {
            status: response.status,
            data: response.data,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return {data: null, error: error.message};
    }
}

// Restaurant
// Preferences

export async function updatePreferencesPrivatelyApi(
    restaurantId,
    updatedData,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.patch(`/restaurant/`, {
            restaurant_id: restaurantId,
            user_id: userId,
            user_random: userRandom,
            ...updatedData,
        });

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function checkRestaurantExistenceApi(restaurantId) {
    try {
        const response = await apiCall.get(
            `/check_restaurant_existence/${restaurantId}/`,
        );
        return response.data;
    } catch (error) {
        return error.message;
    }
}

// Menu

export async function loadWholeMenuFromApi(restaurantId) {
    const response = await apiCall.get(`/whole_menu/${restaurantId}/`);
    return response.data;
}

export async function SaveDeviceDescriptionApi(deviceDescription) {
    const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/save_device_description/${deviceDescription}/`,
    );
    return response.data;
}

// Reviews

// This function is to be executed outside the admin area
// def review(request, element_id, creating='true', review_type='restaurant'):
export async function createRestaurantReviewApi(restaurantId, newReviewData) {
    try {
        const response = await apiCall.patch(
            `/review/${restaurantId}/true/restaurant/`,
            {
                restaurant_id: restaurantId,
                ...newReviewData,
            },
        );

        return {
            status: response.status,
            message: response.data,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

// This function is to be executed outside the admin area
// def review(request, element_id, creating='true', review_type='restaurant'):
export async function createDishReviewApi(restaurantId, dishId, newReviewData) {
    try {
        const response = await apiCall.post(`/review/${dishId}/true/dish/`, {
            restaurant_id: restaurantId,
            ...newReviewData,
        });

        return {
            status: response.status,
            message: response.data,
            error: response.error,
        };
    } catch (error) {
        alert(global.connectionErrorOrUserCanNotPerformOperations);

        return error.message;
    }
}

export async function switchReviewForRejectionApi(
    restaurantId,
    reviewId,
    rejectionReasonId,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.patch(
            `/switch_review_rejection/${restaurantId}/${reviewId}/${rejectionReasonId}/`,
            {
                user_id: userId,
                user_random: userRandom,
            },
        );

        return {
            status: response.status,
            message: response.data,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function loadAllReviewsApi(restaurantId) {
    try {
        const response = await apiCall.get(
            `/all_reviews_with_rejections_if_any/${restaurantId}/`,
        );
        return response.data;
    } catch (error) {
        return;
    }
}

// Deliveries

export async function deleteRestaurantDeliveryCompanyApi(
    restaurantId,
    restaurantDeliveryCompanyToDeleteId,
    markedForDeletion,
    userId,
    userRandom,
) {
    let markedForDeletionObj = {
        marked_for_deletion: !markedForDeletion,
        restaurant_id: restaurantId,
        user_id: userId,
        user_random: userRandom,
    };
    try {
        const response = await apiCall.patch(
            `/restaurant_delivery_company/${restaurantDeliveryCompanyToDeleteId}/`,
            markedForDeletionObj,
        );
        return {
            status: response.status,
            message: response.data.message,
            error: response.data.error,
        };
    } catch (error) {
        return {
            status: error.response.request.status,
            message: error.response.data.error,
            // error: response.data.error,
        };
    }
}

export async function updateRestaurantDeliveryCompanyPrivatelyApi(
    restaurantId,
    restaurantDeliveryCompanyId,
    updatedData,
) {
    try {
        const response = await apiCall.patch(
            `/restaurant_delivery_company/${restaurantDeliveryCompanyId}/`,
            {
                restaurant_id: restaurantId,
                ...updatedData,
            },
        );
        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function restaurantDeliverySwitchMarkForDeletionApi(
    restaurantDeliveryId,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.delete(
            `/restaurant_delivery_company/${restaurantDeliveryId}/`,
            {
                user_id: userId,
                user_random: userRandom,
            },
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.data.error,
        };
    } catch (error) {
        return {
            status: error.response.request.status,
            message: error.response.data.error,
            // error: response.data.error,
        };
    }
}

export async function createANewRestaurantDeliveryApi(
    restaurantId,
    deliverySelectedId,
    newRestaurantDeliveryData,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.post(
            `/restaurant_delivery_company/${global.noValue}/${deliverySelectedId}/`,
            {
                restaurant_id: restaurantId,
                user_id: userId,
                user_random: userRandom,
                ...newRestaurantDeliveryData,
            },
        );
        return {
            id: response.data.id,
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function loadDeliveryCompaniesApi(restaurantId) {
    try {
        const response = await apiCall.get(
            `/load_delivery_companies/${restaurantId}/`,
        );
        return response.data;
    } catch (error) {
        return;
    }
}

// Users
// Restaurant_User

export async function createANewRestaurantUserApi(
    restaurantId,
    newUserData,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.post(
            `/restaurant_user/${global.noValue}/`,
            {
                restaurant_id: restaurantId,
                user_id: userId,
                user_random: userRandom,
                ...newUserData,
            },
        );

        return {
            id: response.data.id,
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function restaurantUserSwitchMarkForDeletionApi(
    restaurantId,
    restaurantUserId,
    markedForDeletion,
    userId,
    userRandom,
) {
    let markedForDeletionObj = {
        restaurant_id: restaurantId,
        marked_for_deletion: !markedForDeletion,
        user_id: userId,
        user_random: userRandom,
    };
    try {
        const response = await apiCall.patch(
            `/restaurant_user/${restaurantUserId}/`,
            markedForDeletionObj,
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function updateRestaurantUserPrivatelyApi(userId, updatedData) {
    // updatedData already has user_id, user_random and restaurant_id in itself
    try {
        const response = await apiCall.patch(
            `/restaurant_user/${userId}/`,
            updatedData,
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function loadRestaurantUsersApi(restaurantId) {
    try {
        const response = await apiCall.get(
            `/load_restaurant_users/${restaurantId}/`,
        );

        return response.data;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(new Error(`Whoops, something bad happened ${error}`));
        return;
    }
}

export async function retrieveRestaurantUserForEditionApi(userId) {
    try {
        const response = await apiCall.get(
            `/retrieve_restaurant_user_for_edition/${userId}/`,
        );
        // the return values must heve the same names as the TextFields
        return {
            userName: response.data.name,
            // userPhone: response.data.phone,
            userImageId: response.data.image_id,
            userPassword: response.data.password,
            userEmail: response.data.email,
            userEmailValidated: response.data.email_validated,
            // userPhoneValidated: response.data.phone_validated,
        };
    } catch (error) {
        return;
    }
}

// Start

export async function startEditingUsersApi(restaurantId, userId, userRandom) {
    try {
        const response = await apiCall.patch(
            `/start_restaurant_users_editing/${restaurantId}/`,
            {user_id: userId, user_random: userRandom},
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function startEditingPreferencesApi(
    restaurantId,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.patch(
            `/start_preferences_editing/${restaurantId}/`,
            {user_id: userId, user_random: userRandom},
        );
        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function startEditingPromotionsApi(
    restaurantId,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.post(
            `/start_promotions_editing/${restaurantId}/`,
            {
                user_id: userId,
                user_random: userRandom,
            },
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.data.error,
        };
    } catch (error) {
        return {
            status: error.response.request.status,
            message: error.response.data.error,
            // error: response.data.error,
        };
    }
}

export async function startEditingRestaurantDeliveryCompaniesApi(
    restaurantId,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.post(
            `/start_restaurant_deliveries_editing/${restaurantId}/`,
            {
                user_id: userId,
                user_random: userRandom,
            },
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.data.error,
        };
    } catch (error) {
        return {
            status: error.response.request.status,
            message: error.response.data.error,
            // error: response.data.error,
        };
    }
}

export async function startEditingMenuApi(restaurantId, userId, userRandom) {
    try {
        const response = await apiCall.patch(
            `/start_menu_editing/${restaurantId}/`,
            {user_id: userId, user_random: userRandom},
        );
        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function startEditingReviewsApi(restaurantId, userId, userRandom) {
    try {
        const response = await apiCall.patch(
            `/start_reviews_editing/${restaurantId}/`,
            {user_id: userId, user_random: userRandom},
        );
        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function startEditingMenuSortApi(
    restaurantId,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.patch(
            `/start_menu_sort_editing/${restaurantId}/`,
            {user_id: userId, user_random: userRandom},
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

// Images

export async function updateImageNameApi(imageId, updatedData) {
    try {
        const response = await apiCall.patch(`/image/${imageId}/`, updatedData);
        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function loadAllImagesApi(restaurantId) {
    try {
        const response = await apiCall.get(`/get_all_images/${restaurantId}/`);
        return {
            data: response.data,
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

// imageData must be of the form: {image_name: 'kjs', image_url: 'kjds', image_thumbnail_url: 'http://...', image_public_id: 'dsvvds'}
export async function addNewImageApi(restaurantId, imageData) {
    try {
        const response = await apiCall.post(
            `/add_image/${restaurantId}/`,
            imageData,
        );

        return {
            id: response.data.id,
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function UpdateImageUsesApi(restaurantId) {
    try {
        const response = await apiCall.patch(
            `/update_image_uses/${restaurantId}/`,
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function deleteImageApi(
    restaurantId,
    imageId,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.delete(`/image/${imageId}/`, {
            restaurant_id: restaurantId,
            user_id: userId,
            user_random: userRandom,
        });

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function handleLoadedImagesApi(restaurantId, userId, userRandom) {
    try {
        const response = await apiCall.patch(
            `/handle_loaded_images/${restaurantId}/`,
            {user_id: userId, user_random: userRandom},
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

// Random

export async function showRestarurantNumberApi(
    restaurantId,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.patch(
            `/show_restaurant_number/${restaurantId}/`,
            {
                user_id: userId,
                user_random: userRandom,
            },
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

// QR

export async function qrApi(restaurantId, userId, userRandom) {
    try {
        const response = await apiCall.patch(
            `/handle_show_qr/${restaurantId}/`,
            {
                user_id: userId,
                user_random: userRandom,
            },
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

// Publish

export async function publishEditedUsersApi(restaurantId, userId, userRandom) {
    try {
        const response = await apiCall.patch(
            `/publish_restaurant_users_editing/${restaurantId}/`,
            {user_id: userId, user_random: userRandom},
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function publishEditedPreferencesApi(
    restaurantId,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.patch(
            `/publish_preferences_editing/${restaurantId}/`,
            {user_id: userId, user_random: userRandom},
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function publishRestaurantDeliveriesEditedApi(
    restaurantId,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.post(
            `/publish_restaurant_deliveries_editing/${restaurantId}/`,
            {user_id: userId, user_random: userRandom},
        );
        return {
            status: response.status,
            message: response.data.message,
            error: response.data.error,
        };
    } catch (error) {
        return {
            status: error.response.request.status,
            message: error.response.data.message,
            // error: response.data.error,
        };
    }
}

export async function publishEditedMenuApi(restaurantId, userId, userRandom) {
    try {
        const response = await apiCall.patch(
            `/publish_menu_editing/${restaurantId}/`,
            {user_id: userId, user_random: userRandom},
        );
        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function publishMenuSortedApi(restaurantId, userId, userRandom) {
    try {
        const response = await apiCall.patch(
            `/publish_menu_sort_editing/${restaurantId}/`,
            {user_id: userId, user_random: userRandom},
        );
        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function publishReviewsUpdatedApi(
    restaurantId,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.patch(
            `/publish_reviews_editing/${restaurantId}/`,
            {user_id: userId, user_random: userRandom},
        );
        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function publishPromotionsUpdatedApi(
    restaurantId,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.post(
            `/publish_promotions_editing/${restaurantId}/`,
            {user_id: userId, user_random: userRandom},
        );
        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

// discard

export async function discardEditingRestaurantUsersApi(restaurantId) {
    try {
        const response = await apiCall.patch(
            `/discard_restaurant_users_editing/${restaurantId}/`,
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function discardEditingPreferencesApi(restaurantId) {
    try {
        const response = await apiCall.patch(
            `/discard_preferences_editing/${restaurantId}/`,
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function discardEditedMenuApi(restaurantId) {
    try {
        const response = await apiCall.patch(
            `/discard_menu_editing/${restaurantId}/`,
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function discardReviewsUpdatesApi(restaurantId) {
    try {
        const response = await apiCall.patch(
            `/discard_reviews_editing/${restaurantId}/`,
        );
        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function discardMenuSortingApi(restaurantId) {
    try {
        const response = await apiCall.patch(
            `/discard_menu_sort_editing/${restaurantId}/`,
        );
        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function discardRestaurantDeliveriesEditingApi(restaurantId) {
    try {
        const response = await apiCall.patch(
            `/discard_restaurant_deliveries_editing/${restaurantId}/`,
        );
        return {
            status: response.status,
            message: response.data.message,
            error: response.data.error,
        };
    } catch (error) {
        return {
            status: error.response.request.status,
            message: error.response.data.message,
            // error: response.data.error,
        };
    }
}

export async function discardPromotionsEditingApi(restaurantId) {
    try {
        const response = await apiCall.patch(
            `/discard_promotions_editing/${restaurantId}/`,
        );
        return {
            status: response.status,
            message: response.data.message,
            error: response.data.error,
        };
    } catch (error) {
        return {
            status: error.response.request.status,
            message: error.response.data.message,
            // error: response.data.error,
        };
    }
}

// Login

// export async function loginToAdminAreaApi(
//     restaurantId,
//     userId,
//     userPassword,
//     userForcedIn
// ) {
//     try {
//         const response = await apiCall.patch(
//             `/login_to_admin_area/${restaurantId}/${userId}/${userPassword}/${userForcedIn}/`
//         );
//         return {
//             status: response.status,
//             message: response.data.message,
//             error: response.data.error,
//         };
//     } catch (error) {
//         return {
//             status: error.response.request.status,
//             message: error.response.data.error,
//             // error: response.data.error,
//         };
//     }
// }

export async function tryTologinIntoTheAdminAreaApi(
    restaurantId,
    userName,
    userPassword,
) {
    try {
        const response = await apiCall.patch(
            `/try_to_login_into_the_admin_area/${restaurantId}/`,
            {
                userName: userName,
                userPassword: userPassword,
            },
        );

        return {
            status: response.status,
            somebodyIn: response.data.somebody_in,
            currentUserName: response.data.current_user_name,
            newUserId: response.data.new_user_id,
            newUserIsMain: response.data.new_user_is_main,
            newUserIsSuper: response.data.new_user_is_super,
            message: response.data.message,
        };
    } catch (error) {
        return {
            status: error.response.request.status,
            error: error.response.data.error,
        };
    }
}

// Login_normally(request, restaurant_id, new_user_id)
export async function loginNormallyApi(restaurantId, newUserId) {
    try {
        const response = await apiCall.patch(
            `/login_normally/${restaurantId}/`,
            {
                newUserId: newUserId,
            },
        );
        return {
            status: response.status,
            message: response.data.message,
        };
    } catch (error) {
        return {
            status: error.response.request.status,
            error: error.response.data.error,
        };
    }
}
// def Login_no_further_actions(request, restaurant_id, new_user_id):
export async function loginNoFurtherActionsApi(restaurantId, newUserId) {
    try {
        const response = await apiCall.patch(
            `/login_no_further_actions/${restaurantId}/`,
            {
                newUserId: newUserId,
            },
        );
        return {
            status: response.status,
            message: response.data.message,
        };
    } catch (error) {
        return {
            status: error.response.request.status,
            error: error.response.data.error,
        };
    }
}

// Logout

export async function logoutFromAdminAreaApi(restaurantId) {
    try {
        const response = await apiCall.patch(
            `/logout_from_admin_area/${restaurantId}/`,
        );
        return {
            status: response.status,
            message: response.data.message,
        };
    } catch (error) {
        return {
            status: error.response.request.status,
            error: error.response.data.error,
        };
    }
}

// Promotion

export async function createANewPromotionApi(
    restaurantId,
    newPromotionData,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.post(`/promotion/${global.noValue}/`, {
            restaurant_id: restaurantId,
            user_id: userId,
            user_random: userRandom,
            ...newPromotionData,
        });

        return {
            id: response.data.id,
            status: response.status,
            message: response.data.message,
        };
    } catch (error) {
        return error.message;
    }
}

export async function promotionSwitchMarkForDeletionApi(
    restaurantId,
    promotionId,
    markedForDeletion,
    userId,
    userRandom,
) {
    let markedForDeletionObj = {
        marked_for_deletion: !markedForDeletion,
        restaurant_id: restaurantId,
        user_id: userId,
        user_random: userRandom,
    };
    try {
        const response = await apiCall.patch(
            `/promotion/${promotionId}/`,
            markedForDeletionObj,
        );

        return {
            status: response.status,
            message: response.data.message,
        };
    } catch (error) {
        return error.message;
    }
}

export async function updatePromotionPrivatelyApi(
    restaurantId,
    promotionId,
    updatedData,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.patch(`/promotion/${promotionId}/`, {
            restaurant_id: restaurantId,
            user_id: userId,
            user_random: userRandom,
            ...updatedData,
        });

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

// Dish

export async function createANewDishApi(
    restaurantId,
    categoryId,
    newDishData,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.post(
            `/dish/${categoryId}/${global.noValue}/`,
            {
                restaurant_id: restaurantId,
                user_id: userId,
                user_random: userRandom,
                ...newDishData,
            },
        );

        return {
            id: response.data.id,
            status: response.status,
            message: response.data.message,
        };
    } catch (error) {
        return error.message;
    }
}

export async function updateDishPrivatelyApi(
    restaurantId,
    categoryId,
    dishId,
    updatedData,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.patch(`/dish/${categoryId}/${dishId}/`, {
            user_id: userId,
            user_random: userRandom,
            restaurant_id: restaurantId,
            ...updatedData,
        });

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function dishSwitchMarkForDeletionApi(
    restaurantId,
    categoryId,
    dishId,
    markedForDeletion,
    userId,
    userRandom,
) {
    let markedForDeletionObj = {
        marked_for_deletion: !markedForDeletion,
        restaurant_id: restaurantId,
        user_id: userId,
        user_random: userRandom,
    };
    try {
        const response = await apiCall.patch(
            `/dish/${categoryId}/${dishId}/`,
            markedForDeletionObj,
        );

        return {
            status: response.status,
            message: response.data.message,
        };
    } catch (error) {
        return error.message;
    }
}

// Categories

export async function createANewCategoryApi(
    restaurantId,
    newCategoryData,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.post(`/category/${global.noValue}/`, {
            restaurant_id: restaurantId,
            user_id: userId,
            user_random: userRandom,
            ...newCategoryData,
        });

        return {
            id: response.data.id,
            status: response.status,
            message: response.data.message,
        };
    } catch (error) {
        return error.message;
    }
}

export async function checkForDishRevisionsApi(dishId) {
    try {
        const response = await apiCall.get(
            `/check_for_dish_revisions/${dishId}/`,
        );

        return {
            hasRevisions: response.data.message,
            status: response.status,
        };
    } catch (error) {
        return error.message;
    }
}

export async function checkForCategoryDishesRevisionsApi(categoryId) {
    try {
        const response = await apiCall.get(
            `/check_for_category_dishes_revisions/${categoryId}`,
        );

        return {
            status: response.status,
            hasRevisions: response.data.message,
        };
    } catch (error) {
        return error.message;
    }
}

export async function categorySwitchMarkForDeletionApi(
    restaurantId,
    categoryId,
    markedForDeletion,
    userId,
    userRandom,
) {
    let markedForDeletionObj = {
        marked_for_deletion: !markedForDeletion,
        restaurant_id: restaurantId,
        user_id: userId,
        user_random: userRandom,
    };
    try {
        const response = await apiCall.patch(
            `/category/${categoryId}/`,
            markedForDeletionObj,
        );

        return {
            status: response.status,
            message: response.data.message,
        };
    } catch (error) {
        return error.message;
    }
}

export async function updateCategoryPrivatelyApi(
    restaurantId,
    categoryid,
    categoryData,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.patch(`/category/${categoryid}/`, {
            restaurant_id: restaurantId,
            user_id: userId,
            user_random: userRandom,
            ...categoryData,
        });

        return {
            status: response.status,
            message: response.data.message,
        };
    } catch (error) {
        return error.message;
    }
}

// Order

export async function setCategoryPrivateViewOrderValueApi(
    restaurantId,
    categoryId,
    viewOrder,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.patch(
            `/category/${categoryId}/${viewOrder}/`,
            {
                restaurant_id: restaurantId,
                user_id: userId,
                user_random: userRandom,
            },
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function setDishPrivateViewOrderValueApi(
    restaurantId,
    categoryId,
    dishId,
    viewOrder,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.patch(
            `/dish/${categoryId}/${dishId}/${viewOrder}/`,
            {
                restaurant_id: restaurantId,
                user_id: userId,
                user_random: userRandom,
            },
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function clearAllPrivateViewOrdersApi(
    restaurantId,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.patch(
            `/clear_all_private_view_orders/${restaurantId}/`,
            {user_id: userId, user_random: userRandom},
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function clearCategoriesPrivateViewOrdersApi(
    restaurantId,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.patch(
            `/clear_categories_private_view_orders/${restaurantId}/`,
            {user_id: userId, user_random: userRandom},
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function clearCategoryDishesPrivateViewOrdersApi(
    categoryId,
    userId,
    userRandom,
) {
    try {
        const response = await apiCall.patch(
            `/clear_category_dishes_private_view_orders/${categoryId}/`,
            {user_id: userId, user_random: userRandom},
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

// Cloudinary

export async function deleteCloudinaryResourceAndImageApi(
    restaurantId,
    publicId,
    imageId,
    userId,
    userRandomNumber,
) {
    try {
        const encodedPublicId = encodeURIComponent(publicId);
        let response = await apiCall.delete(
            `/delete_cloudinary_resource_and_image/${restaurantId}/${imageId}/${encodedPublicId}/`,
            {
                user_id: userId,
                user_random: userRandomNumber,
            },
        );
        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

// "send_key_via_email/<str:user_email>/<str:four_digits_key>/"
export async function sendConfirmationKeyToEMailApi(
    emailAddress,
    fourDigitskey,
    restaurantId,
    userId,
    userRandomNumber,
) {
    try {
        const response = await apiCall.patch(
            `/send_key_via_email/${emailAddress}/${fourDigitskey}/${restaurantId}`,
            {
                restaurant_id: restaurantId,
                user_id: userId,
                user_random: userRandomNumber,
            },
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function sendQRCodeToEMailApi(
    restaurantId,
    reactBaseUrl,
    categoriesPath,
    toEMailAddress,
    userId,
    userRandomNumber,
) {
    try {
        const response = await apiCall.patch(
            `/send_qr_code_via_email/`, // 🔹 No more URL parameters!
            {
                email_address: toEMailAddress,
                react_base_url: reactBaseUrl,
                categories_path: categoriesPath,
                restaurant_id: restaurantId,
                user_id: userId,
                user_random: userRandomNumber,
            },
        );

        return {
            status: response.status,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function getUserObjectApi(userId, currentUserId, userRandom) {
    try {
        const response = await apiCall.get(`/get_user_object/${userId}/`, {
            user_id: currentUserId,
            user_random: userRandom,
        });

        return {
            status: response.status,
            user_obj: response.data,
            error: response.error,
        };
    } catch (error) {
        return error.message;
    }
}

export async function webPayPlusPayApi(
    countryId,
    restaurantRut,
    priceType,
    userEMail,
    action,
) {
    try {
        const response = await apiCall.get(
            `/webpay-plus/create/${countryId}/${restaurantRut}/${priceType}/${userEMail}/${action}/`,
        );
        return {
            status: response.status,
            data: response.data,
            message: response.data.message,
            error: response.error,
        };
    } catch (error) {
        return {data: null, error: error.message};
    }
}
