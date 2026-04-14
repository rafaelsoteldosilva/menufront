//
import {useState, useEffect} from "react";
import {webPayPlusPayApi, getUserObjectApi} from "../axiosCalls/axiosAPICalls";

import {
    fetchPaymentOptions,
    getPaymentOptions,
} from "../slices/paymentOptionsSlice";

import {getRestaurantMenu} from "../slices/restaurantMenuSlice";
import {useDispatch, useSelector} from "react-redux";
import * as global from "../globalDefinitions/globalConstants";

export default function ShowWebpayPlusPayment() {
    const reduxStateDispatch = useDispatch();
    const [paymentData, setPaymentData] = useState(null);

    const [webPayIcon, setWebPayIcon] = useState(null);
    const [doContinue, setDoContinue] = useState(false);

    const menu = useSelector(getRestaurantMenu);
    const paymentOptions = useSelector(getPaymentOptions);

    useEffect(() => {
        if (menu)
            reduxStateDispatch(
                fetchPaymentOptions(menu.restaurant.public_country.id),
            );
    }, [menu, reduxStateDispatch]);

    useEffect(() => {
        if (paymentOptions) {
            const webPayPlusPaymentOption = paymentOptions.find(
                (paymentOption) =>
                    paymentOption.payment_option.name === "WebPay",
            );
            if (webPayPlusPaymentOption) {
                setWebPayIcon(
                    webPayPlusPaymentOption.payment_option
                        .payment_option_image_url,
                );
                setDoContinue(true);
            }
        }
    }, [paymentOptions]);

    const handlePayment = async () => {
        // let getCurrentUserObj = null;
        const getMainUserObj = await getUserObjectApi(
            menu.restaurant.main_user_id,
        );
        if (
            menu.restaurant.main_user_id !== menu.restaurant.currently_logged_in
        ) {
            await getUserObjectApi(menu.restaurant.currently_logged_in);
        }
        try {
            const response = await webPayPlusPayApi(
                menu.restaurant.public_country.id,
                menu.restaurant.rut,
                menu.restaurant.price_type,
                getMainUserObj.user_obj.email,
                global.payingNormalFee,
            );
            if (response.data?.response) {
                setPaymentData(response.data.response); // State updates, triggering a re-render
            } else {
                console.error("Invalid response data:", response.data);
            }
        } catch (error) {
            console.error("Error creating payment:", error);
        }
    };

    // Once paymentData is updated, this effect will run, ensuring the form exists
    useEffect(() => {
        if (paymentData) {
            const form = document.getElementById("paymentForm");
            if (form) form.submit();
        }
    }, [paymentData]); // Runs when `paymentData` updates

    if (!doContinue)
        return (
            <div>
                <h1>WebPay Plus payment option not available</h1>
            </div>
        );
    else {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >
                {!paymentData ? (
                    <button
                        onClick={handlePayment}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px", // Adds spacing between icon and text
                            padding: "12px 24px",
                            fontSize: "18px",
                            borderRadius: "8px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        <img
                            src={webPayIcon}
                            alt="WebPay Plus"
                            style={{
                                width: "65px", // Adjust size as needed
                                height: "65px",
                            }}
                        />
                        Iniciar pago con WebPay Plus
                    </button>
                ) : (
                    <form
                        id="paymentForm"
                        action={paymentData.url}
                        method="POST"
                    >
                        <input
                            type="hidden"
                            name="token_ws"
                            value={paymentData.token}
                        />
                    </form>
                )}
            </div>
        );
    }
}
