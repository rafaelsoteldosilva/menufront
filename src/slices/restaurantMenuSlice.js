import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import * as global from "../globalDefinitions/globalConstants";
import cloneDeep from "lodash/cloneDeep";
import {mySampleMenu} from "../utils/SampleMenu";
import {loadWholeMenuFromApi} from "../axiosCalls/axiosAPICalls";
import {toastError} from "../utils/toastMessages";

export const fetchMenu = createAsyncThunk(
    "menu/fetchMenu",
    async (restaurantId) => {
        var menuPromise = new Promise(function (resolve, reject) {
            if (global.accessBackend) {
                // whole_menu will check for payment state
                loadWholeMenuFromApi(restaurantId)
                    .then((dataM) => {
                        return resolve(dataM);
                    })
                    .catch((error) => {
                        toastError(
                            global.connectionErrorOrUserCanNotPerformOperations
                        );
                        reject(error);
                    });
            } else {
                return resolve(mySampleMenu);
            }
        });
        return menuPromise;
    }
);

const initialState = {
    restaurantMenu: [],
    restaurantMenuStatus: global.backendReadingIdle, //'idle' | 'loading' | 'succeeded' | 'failed'
    restaurantMenuError: null,
    aSpecificChangeHasBeenMade: global.specificChangeToNothing,
    theStateHasChanged: false,
    changeNumber: 0,
    restaurantDeliveryCompaniesRestarted: false,
};

const restaurantMenuSlice = createSlice({
    name: "restaurantMenu",
    initialState,
    reducers: {
        setDoneRestartingRestaurantDeliveryCompanies: (state) => {
            state.restaurantDeliveryCompaniesRestarted = true;
        },
        resetRestartRestaurantDeliveryCompanies: (state) => {
            state.restaurantDeliveryCompaniesRestarted = false;
        },
        resetChangeNumber: (state) => {
            state.changeNumber = 0;
        },
        resetStateChange: (state) => {
            state.theStateHasChanged = false;
        },
        setSpecificChange: (state, action) => {
            state.aSpecificChangeHasBeenMade = action.payload;
            state.theStateHasChanged = true;
        },
        resetMenuState: (state) => {
            state.restaurantMenu = initialState.restaurantMenu;
            state.restaurantMenuStatus = initialState.restaurantMenuStatus;
            state.restaurantMenuError = initialState.restaurantMenuError;
            state.aSpecificChangeHasBeenMade = global.specificChangeToNothing;
            state.theStateHasChanged = true;
            state.changeNumber = 0;
            state.restaurantDeliveryCompaniesRestarted = false;
        },
        loginToAdminArea: (state, action) => {
            const {userId, userRandom} = action.payload;
            state.restaurant.currently_logged_in = userId;
            state.restaurant.logged_in_user_random_number = userRandom;
            state.theStateHasChanged = true;
        },
        logoutFromAdminArea: (state) => {
            state.restaurantMenu.restaurant.currently_logged_in =
                global.noValue;
            state.restaurantMenu.restaurant.logged_in_user_random_number =
                global.noValue;
            state.theStateHasChanged = true;
        },
        startEditingMenu: (state) => {
            state.restaurantMenu.restaurant.menu_edition_is_pending = true;
            state.theStateHasChanged = true;
        },
        stopEditingMenu: (state) => {
            state.restaurantMenu.restaurant.menu_edition_is_pending = false;
            state.theStateHasChanged = true;
        },
        startRestaurantDeliveriesEdition: (state) => {
            state.restaurantMenu.restaurant.restaurant_deliveries_edition_is_pending = true;
            state.theStateHasChanged = true;
        },
        startUpdatingReviews: (state) => {
            state.restaurantMenu.restaurant.reviews_updates_are_pending = true;
            state.theStateHasChanged = true;
        },
        stopUpdatingReviews: (state) => {
            state.restaurantMenu.restaurant.reviews_updates_are_pending = false;
            state.theStateHasChanged = true;
        },
        startSortingMenu: (state) => {
            state.restaurantMenu.restaurant.menu_sorting_is_pending = true;
            state.theStateHasChanged = true;
        },
        stopSortingMenu: (state) => {
            state.restaurantMenu.restaurant.menu_sorting_is_pending = false;
            state.theStateHasChanged = true;
        },
        startPromotionsEdition: (state) => {
            state.restaurantMenu.restaurant.promotions_edition_is_pending = true;
            state.theStateHasChanged = true;
        },
        stopPromotionsEdition: (state) => {
            state.restaurantMenu.restaurant.promotions_edition_is_pending = false;
            state.theStateHasChanged = true;
        },
        stopRestaurantDeliveriesEdition: (state) => {
            state.restaurantMenu.restaurant.restaurant_deliveries_edition_is_pending = false;
            state.theStateHasChanged = true;
        },
        startEditingPreferences: (state) => {
            state.restaurantMenu.restaurant.preferences_edition_is_pending = true;
            state.theStateHasChanged = true;
        },
        stopEditingPreferences: (state) => {
            state.restaurantMenu.restaurant.preferences_edition_is_pending = false;
            state.theStateHasChanged = true;
        },
        startEditingRestaurantUsers: (state) => {
            state.restaurantMenu.restaurant.users_edition_is_pending = true;
            state.theStateHasChanged = true;
        },
        stopEditingRestaurantUsers: (state) => {
            state.restaurantMenu.restaurant.users_edition_is_pending = false;
            state.theStateHasChanged = true;
        },
        clearAllPrivateViewOrders: (state) => {
            state.restaurantMenu.categories.forEach((categoryObj) => {
                categoryObj.category.private_view_order = null;
                categoryObj.dishes.forEach((dishObj) => {
                    dishObj.dish.private_view_order = null;
                });
            });
            state.theStateHasChanged = true;
        },
        clearCategoriesPrivateViewOrders: (state) => {
            state.restaurantMenu.categories.forEach((categoryObj) => {
                categoryObj.category.private_view_order = null;
            });
            state.theStateHasChanged = true;
        },
        clearCategoryDishesPrivateViewOrders: (state, action) => {
            const categoryId = action.payload;
            const categoryIndex = state.restaurantMenu.categories.findIndex(
                (category) => category.category.id === categoryId
            );

            if (categoryIndex !== global.noValue) {
                state.restaurantMenu.categories[categoryIndex].dishes.forEach(
                    (dishObj) => {
                        dishObj.dish.private_view_order = null;
                    }
                );
                state.theStateHasChanged = true;
            }
        },
        changeCategoryData: (state, action) => {
            const {categoryId, updatedData} = action.payload;

            const categoryIndex = state.restaurantMenu.categories.findIndex(
                (category) => category.category.id === categoryId
            );

            if (categoryIndex !== global.noValue) {
                const updatedCategoryData = {
                    ...updatedData,
                    has_been_modified: true,
                };
                state.restaurantMenu.categories[categoryIndex].category = {
                    ...state.restaurantMenu.categories[categoryIndex].category,
                    ...updatedCategoryData,
                };
                state.theStateHasChanged = true;
            }
        },
        changePromotionData: (state, action) => {
            const {promotionId, updatedData} = action.payload;
            const promotionIndex = state.restaurantMenu.promotions.findIndex(
                (promotion) => promotion.promotion.id === promotionId
            );
            if (promotionIndex !== global.noValue) {
                const updatedPromotionData = {
                    ...updatedData,
                    has_been_modified: true,
                };
                state.restaurantMenu.promotions[promotionIndex].promotion = {
                    ...state.restaurantMenu.promotions[promotionIndex]
                        .promotion,
                    ...updatedPromotionData,
                };
                state.theStateHasChanged = true;
            }
        },
        // payload: {categoryData: {id: 65, public_name: '', public_description: '', ... all of them}}
        addCategory: (state, action) => {
            const categoryId = action.payload;

            let newCategory = {
                category: {
                    id: categoryId,
                    public_name: "",
                    private_name: "",
                    public_description: "",
                    private_description: "",
                    public_image_id: global.noValue,
                    private_image_id: global.noValue,
                    recently_created: false,
                    marked_for_deletion: false,
                },
                dishes: [],
            };

            state.restaurantMenu.categories.push(newCategory);
            state.theStateHasChanged = true;
        },

        addANewCategory: (state, action) => {
            const {categoryId, updatedData} = action.payload;

            let newCategory = {
                category: {
                    id: categoryId,
                    public_name: "",
                    private_name: updatedData.private_name,
                    public_description: "",
                    private_description: updatedData.private_description,
                    public_image_id: global.noValue,
                    private_image_id:
                        updatedData.private_image_id || global.noValue,
                    recently_created: true,
                    has_been_modified: true,
                    marked_for_deletion: false,
                },
                dishes: [],
            };

            state.restaurantMenu.categories.push(newCategory);
            state.theStateHasChanged = true;
        },

        addPromotion: (state, action) => {
            const {promotionId} = action.payload;

            let newPromotion = {
                promotion: {
                    id: promotionId,
                    public_name: "",
                    private_name: "",
                    public_attractor_text: "",
                    private_attractor_text: "",
                    public_promotion_text: "",
                    private_promotion_text: "",
                    recently_created: true,
                    marked_for_deletion: false,
                },
            };
            state.restaurantMenu.promotions.push(newPromotion);
            state.theStateHasChanged = true;
        },

        addANewPromotion: (state, action) => {
            const {promotionId, updatedData} = action.payload;

            let newPromotion = {
                promotion: {
                    id: promotionId,
                    public_name: "",
                    private_name: updatedData.private_name,
                    public_attractor_text: "",
                    private_attractor_text: updatedData.private_attractor_text,
                    public_promotion_text: "",
                    private_promotion_text: updatedData.private_promotion_text,
                    recently_created: true,
                    has_been_modified: true,
                    marked_for_deletion: false,
                },
                dishes: [],
            };

            state.restaurantMenu.promotions.push(newPromotion);
            state.theStateHasChanged = true;
        },

        changeCategoryMarkedForDeletion: (state, action) => {
            const {categoryId, markedForDeletion} = action.payload;
            const categoryIndex = state.restaurantMenu.categories.findIndex(
                (category) => category.category.id === categoryId
            );

            if (categoryIndex !== global.noValue) {
                state.restaurantMenu.categories[
                    categoryIndex
                ].category.marked_for_deletion = markedForDeletion;
                state.restaurantMenu.categories[categoryIndex].dishes.forEach(
                    (dish) => {
                        dish.dish.marked_for_deletion_by_parent =
                            markedForDeletion;
                    }
                );
                state.theStateHasChanged = true;
            }
        },
        changeCategoryPrivateViewOrderValue: (state, action) => {
            const {categoryId, viewOrder} = action.payload;
            const categoryIndex = state.restaurantMenu.categories.findIndex(
                (category) => category.category.id === categoryId
            );

            if (categoryIndex !== global.noValue) {
                state.restaurantMenu.categories[
                    categoryIndex
                ].category.private_view_order = viewOrder;
                state.restaurantMenu.categories[
                    categoryIndex
                ].category.has_been_modified = true;
                state.theStateHasChanged = true;
            }
        },

        // payload: {categoryId: 46, dishId: 35, dishData: {private_name: 'kjk', private_description: 'mjnb', ... whatever field(s)}}
        changeDishData: (state, action) => {
            const {categoryId, dishId, updatedData} = action.payload;
            const categoryIndex = state.restaurantMenu.categories.findIndex(
                (category) => category.category.id === categoryId
            );

            if (categoryIndex !== global.noValue) {
                const dishIndex = state.restaurantMenu.categories[
                    categoryIndex
                ].dishes.findIndex((dish) => dish.dish.id === dishId);

                if (dishIndex !== global.noValue) {
                    const updatedDishData = {
                        ...updatedData,
                        has_been_modified: true,
                    };
                    state.restaurantMenu.categories[categoryIndex].dishes[
                        dishIndex
                    ].dish = {
                        ...state.restaurantMenu.categories[categoryIndex]
                            .dishes[dishIndex].dish,
                        ...updatedDishData,
                    };
                    state.theStateHasChanged = true;
                }
            }
        },
        // payload: {categoryId: 56, dishData: {id: 65, public_name: '', public_description: '', ... all of them, they can be empty ''}}
        addDish: (state, action) => {
            const {categoryIndex, dishId} = action.payload;

            let newDish = {
                dish: {
                    id: dishId,
                    public_name: "",
                    private_name: "",
                    public_description: "",
                    private_description: "",
                    public_image_id: global.noValue,
                    private_image_id: global.noValue,
                    public_price: "0",
                    private_price: "0",
                    recently_created: false,
                    marked_for_deletion: false,
                    marked_for_deletion_by_parent: false,
                },
                dish_reviews_average: 0,
                reviews: [],
            };

            state.restaurantMenu.categories[categoryIndex].dishes.push(newDish);
            state.theStateHasChanged = true;
        },

        addANewDish: (state, action) => {
            const {categoryIndex, dishId, updatedData} = action.payload;

            let newDish = {
                dish: {
                    id: dishId,
                    public_name: "",
                    private_name: updatedData.private_name,
                    public_description: "",
                    private_description: updatedData.private_description,
                    public_image_id: global.noValue,
                    private_image_id:
                        updatedData.private_image_id || global.noValue,
                    public_price: "0",
                    private_price: updatedData.private_price,
                    recently_created: true,
                    has_been_modified: true,
                    marked_for_deletion: false,
                    marked_for_deletion_by_parent: false,
                },
                dish_number_of_reviews: 0,
                dish_reviews_average: 0,
                reviews: [],
            };

            state.restaurantMenu.categories[categoryIndex].dishes.push(newDish);
            state.theStateHasChanged = true;
        },

        // payload: {categoryId: 45, dishId: 35, markedForDeletion: true/false}
        changeDishMarkedForDeletion: (state, action) => {
            const {categoryId, dishId, markedForDeletion} = action.payload;
            const categoryIndex = state.restaurantMenu.categories.findIndex(
                (category) => category.category.id === categoryId
            );

            if (categoryIndex !== global.noValue) {
                const dishIndex = state.restaurantMenu.categories[
                    categoryIndex
                ].dishes.findIndex((dish) => dish.dish.id === dishId);

                if (dishIndex !== global.noValue) {
                    state.restaurantMenu.categories[categoryIndex].dishes[
                        dishIndex
                    ].dish.marked_for_deletion = markedForDeletion;
                    state.theStateHasChanged = true;
                }
            }
        },

        // payload: {categoryId: 45, dishId: 35, markedForDeletion: true/false}
        changePromotionMarkedForDeletion: (state, action) => {
            const {promotionId, markedForDeletion} = action.payload;
            const promotionIndex = state.restaurantMenu.promotions.findIndex(
                (promotion) => promotion.promotion.id === promotionId
            );
            if (promotionIndex !== global.noValue) {
                state.restaurantMenu.promotions[
                    promotionIndex
                ].promotion.marked_for_deletion = markedForDeletion;
                state.theStateHasChanged = true;
            }
        },

        changeDishPrivateViewOrderValue: (state, action) => {
            const {categoryId, dishId, viewOrder} = action.payload;
            const categoryIndex = state.restaurantMenu.categories.findIndex(
                (category) => category.category.id === categoryId
            );

            if (categoryIndex !== global.noValue) {
                const dishIndex = state.restaurantMenu.categories[
                    categoryIndex
                ].dishes.findIndex((dish) => dish.dish.id === dishId);

                if (dishIndex !== global.noValue) {
                    state.restaurantMenu.categories[categoryIndex].dishes[
                        dishIndex
                    ].dish.private_view_order = viewOrder;
                    state.restaurantMenu.categories[categoryIndex].dishes[
                        dishIndex
                    ].dish.has_been_modified = true;
                    state.theStateHasChanged = true;
                }
            }
        },

        changePreferencesData: (state, action) => {
            const {restaurantId, updatedData} = action.payload;

            if (restaurantId !== global.noValue) {
                state.restaurantMenu.restaurant = {
                    ...state.restaurantMenu.restaurant,
                    ...updatedData,
                };
                state.theStateHasChanged = true;
            }
        },
        // payload: {categoryId: 46, dishId: 35, dishData: {private_name: 'kjk', private_description: 'mjnb', ... whatever field(s)}}

        updateImageUses: (state) => {
            const {images, restaurant} = state.restaurantMenu;
            const {categories} = state.restaurantMenu;
            const {restaurant_user_images_and_names} = state.restaurantMenu;

            const updatedImages = images.map((imageObj) => {
                let newUseCount = 0;
                if (restaurant.public_facade_image_id === imageObj.image.id) {
                    newUseCount++;
                }
                if (restaurant.public_logo_image_id === imageObj.image.id) {
                    newUseCount++;
                }
                categories.forEach((category) => {
                    if (
                        category.category.public_image_id === imageObj.image.id
                    ) {
                        newUseCount++;
                    }
                    category.dishes.forEach((dish) => {
                        if (dish.dish.public_image_id === imageObj.image.id) {
                            newUseCount++;
                        }
                    });
                });
                restaurant_user_images_and_names.forEach((userImageAndName) => {
                    if (
                        userImageAndName.user.public_image_id ===
                        imageObj.image.id
                    ) {
                        newUseCount++;
                    }
                });

                return {
                    ...imageObj,
                    image: {...imageObj.image, use_count: newUseCount},
                };
            });

            state.restaurantMenu.images = updatedImages;
            state.theStateHasChanged = true;
        },

        addNewImageData: (state, action) => {
            const {imageId, imageData} = action.payload;
            let newImageData = {
                image: {
                    id: imageId,
                    image_name: imageData.image_name,
                    image_original_name: imageData.image_original_name,
                    image_public_id: imageData.image_public_id,
                    image_resource_type: imageData.image_resource_type,
                    image_url: imageData.image_url,
                    use_count: 0,
                    finished_setting: true,
                    image_creation_date: 0,
                    image_next_revision_date: 0,
                },
            };

            state.restaurantMenu.images.push(newImageData);
            state.theStateHasChanged = true;
        },

        changeImageData: (state, action) => {
            const {imageId, newName} = action.payload;
            const imageIndex = state.restaurantMenu.images.findIndex(
                (image) => image.image.id === imageId
            );

            if (imageIndex !== global.noValue) {
                state.restaurantMenu.images[imageIndex].image.image_name =
                    newName;
                state.restaurantMenu.images[imageIndex].image.finished_setting =
                    true;
                state.theStateHasChanged = true;
            }
        },

        addRestaurantDelivery: (state, action) => {
            const {newRestaurantDeliveryId, deliverySelected, updatedData} =
                action.payload;

            let newRestaurantDeliveryCompany = {
                restaurant_delivery_company: {
                    id: newRestaurantDeliveryId,
                    public_token: "",
                    private_token: updatedData.private_token,
                    recently_created: true,
                    has_been_modified: true,
                    recently_recently_created: true,
                    marked_for_deletion: false,
                    delivery_company_details: {
                        id: deliverySelected.id,
                        name: deliverySelected.name,
                        company_image_url: deliverySelected.company_image_url,
                        url_template: deliverySelected.url_template,
                        country: deliverySelected.country,
                    },
                },
            };

            state.restaurantMenu.restaurant_delivery_companies.push(
                newRestaurantDeliveryCompany
            );
            state.theStateHasChanged = true;
            state.changeNumber++;
        },
        deleteRestaurantDeliveryCompany: (state, action) => {
            const {restaurantDeliveryCompanyToDeleteId} = action.payload;
            const updatedRestaurantDeliveryCompanies =
                state.restaurantMenu.restaurant_delivery_companies.filter(
                    (company) =>
                        company.restaurant_delivery_company.id !==
                        restaurantDeliveryCompanyToDeleteId
                );

            state.restaurantMenu.restaurant_delivery_companies =
                updatedRestaurantDeliveryCompanies;
            state.theStateHasChanged = true;
        },

        restaurantDeliveryCompanySwitchMarkForDeletion: (state, action) => {
            const {restaurantDeliveryCompanyToSwitchMarkForDeletionId} =
                action.payload;
            const restaurantDeliveryCompanyToSwitchMarkForDeletionIndex =
                state.restaurantMenu.restaurant_delivery_companies.findIndex(
                    (company) =>
                        company.restaurant_delivery_company.id ===
                        restaurantDeliveryCompanyToSwitchMarkForDeletionId
                );

            if (
                restaurantDeliveryCompanyToSwitchMarkForDeletionIndex !==
                global.noValue
            ) {
                state.restaurantMenu.restaurant_delivery_companies[
                    restaurantDeliveryCompanyToSwitchMarkForDeletionIndex
                ].restaurant_delivery_company.marked_for_deletion =
                    !state.restaurantMenu.restaurant_delivery_companies[
                        restaurantDeliveryCompanyToSwitchMarkForDeletionIndex
                    ].restaurant_delivery_company.marked_for_deletion;

                state.theStateHasChanged = true;
            }
        },

        restaurantDeliveryCompaniesTurnRecentlyRecentlyCreatedToFalse: (
            state
        ) => {
            const newState =
                state.restaurantMenu.restaurant_delivery_companies.map(
                    (company) => ({
                        ...company,
                        restaurant_delivery_company: {
                            ...company.restaurant_delivery_company,
                            recently_recently_created: false,
                        },
                    })
                );

            state.restaurantMenu.restaurant_delivery_companies = newState;
            state.theStateHasChanged = true;
        },
        deleteRestaurantDeliveryCompaniesRecentlyRecentlyCreated: (state) => {
            const updatedRestaurantDeliveryCompanies =
                state.restaurantMenu.restaurant_delivery_companies.filter(
                    (company) =>
                        !company.restaurant_delivery_company
                            .recently_recently_created
                );

            state.restaurantMenu.restaurant_delivery_companies =
                updatedRestaurantDeliveryCompanies;
            state.theStateHasChanged = true;
        },

        deleteAllRestaurantDeliveryCompanies: (state) => {
            state.restaurantMenu.restaurant_delivery_companies = [];
            state.aSpecificChangeHasBeenMade =
                global.restaurantDeliveryCompaniesHaveBeenDeletedNowRestartThem;
            state.theStateHasChanged = true;
        },

        changeRestaurantDelivery: (state, action) => {
            const {restaurantDeliveryCompanyId, updatedData} = action.payload;
            const restaurantDeliveryCompanyIndex =
                state.restaurantMenu.restaurant_delivery_companies.findIndex(
                    (restaurantDeliveryCompany) =>
                        restaurantDeliveryCompany.restaurant_delivery_company
                            .id === restaurantDeliveryCompanyId
                );
            if (restaurantDeliveryCompanyIndex !== global.noValue) {
                const updatedRestaurantDeliveryCompanyData = {
                    ...updatedData,
                    has_been_modified: true,
                };
                state.restaurantMenu.restaurant_delivery_companies[
                    restaurantDeliveryCompanyIndex
                ].restaurant_delivery_company = {
                    ...state.restaurantMenu.restaurant_delivery_companies[
                        restaurantDeliveryCompanyIndex
                    ].restaurant_delivery_company,
                    ...updatedRestaurantDeliveryCompanyData,
                };

                state.theStateHasChanged = true;
            }
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchMenu.pending, (state) => {
                state.restaurantMenuStatus = global.backendReadingLoading;
            })
            .addCase(fetchMenu.fulfilled, (state, action) => {
                state.restaurantMenuStatus = global.backendReadingSucceeded;
                state.restaurantMenu = cloneDeep(action.payload);
            })
            .addCase(fetchMenu.rejected, (state, action) => {
                state.restaurantMenuStatus = global.backendReadingFailed;
                state.restaurantMenuError = action.error.message;
            });
    },
});

export const {
    resetRestartRestaurantDeliveryCompanies,
    setDoneRestartingRestaurantDeliveryCompanies,
    resetChangeNumber,
    resetStateChange,
    setSpecificChange,
    setNumberOfFutureChanges,
    resetMenuState,
    loginToAdminArea,
    logoutFromAdminArea,
    startEditingMenu,
    stopEditingMenu,
    startUpdatingReviews,
    startRestaurantDeliveriesEdition,
    stopRestaurantDeliveriesEdition,
    stopUpdatingReviews,
    startSortingMenu,
    stopSortingMenu,
    startPromotionsEdition,
    stopPromotionsEdition,
    startEditingPreferences,
    stopEditingPreferences,
    startEditingRestaurantUsers,
    stopEditingRestaurantUsers,
    changeCategoryData,
    changePromotionData,
    addPromotion,
    addANewPromotion,
    addCategory,
    addANewCategory,
    changeCategoryMarkedForDeletion,
    changeCategoryPrivateViewOrderValue,
    changeDishData,
    changePromotionMarkedForDeletion,
    addDish,
    addANewDish,
    changeDishMarkedForDeletion,
    changeDishPrivateViewOrderValue,
    changeDishBeingEdited,
    clearAllPrivateViewOrders,
    clearCategoriesPrivateViewOrders,
    clearCategoryDishesPrivateViewOrders,
    changePreferencesData,
    updateImageUses,
    changeImageData,
    addNewImageData,
    // deleteProvisionalImageData,
    addRestaurantDeliveryCompanyWithSpecificData,
    deleteRestaurantDeliveryCompany,
    restaurantDeliveryCompanySwitchMarkForDeletion,
    deleteRestaurantDeliveryCompaniesRecentlyRecentlyCreated,
    restaurantDeliveryCompaniesTurnRecentlyRecentlyCreatedToFalse,
    deleteAllRestaurantDeliveryCompanies,
    changeRestaurantDelivery,
    addRestaurantDelivery,
    changeDeliveryToken,
} = restaurantMenuSlice.actions;

export const getRestaurantMenu = (state) => state.restaurantMenu.restaurantMenu;
export const getRestaurantMenuStatus = (state) =>
    state.restaurantMenu.restaurantMenuStatus;
export const getRestaurantMenuError = (state) =>
    state.restaurantMenu.restaurantMenuError;
export const getSpecificChange = (state) =>
    state.restaurantMenu.aSpecificChangeHasBeenMade;
export const getTheStateHasChanged = (state) =>
    state.restaurantMenu.theStateHasChanged;
export const getNumberOfChangesSoFar = (state) =>
    state.restaurantMenu.changeNumber;
export const getDoneRestartingRestaurantDeliveryCompanies = (state) =>
    state.restaurantMenu.restaurantDeliveryCompaniesRestarted;

// export const getFinishedSeveralChanges = (state) =>
//     state.restaurantMenu.doneSeveralChangesToTheTheState;

export default restaurantMenuSlice.reducer;
