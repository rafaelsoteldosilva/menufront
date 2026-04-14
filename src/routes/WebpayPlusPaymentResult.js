import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {getRestaurantMenu} from "../slices/restaurantMenuSlice";
import {useSelector} from "react-redux";
import {logoutFromAdminAreaApi} from "../axiosCalls/axiosAPICalls";

function WebpayPlusPaymentResult() {
    const {search} = useLocation();
    const [transactionMessage, setTransactionMessage] = useState(null);
    const [message, setMessage] = useState(null);
    const [status, setStatus] = useState(null);
    const [amount, setAmount] = useState(null);
    const [formattedAmount, setFormattedAmount] = useState(null);
    const [responseCode, setResponseCode] = useState(null);
    const [buyOrder, setBuyOrder] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [transactionDate, setTransactionDate] = useState(null);
    const [formattedTransactionDate, setFormattedTransactionDate] =
        useState(null);
    const [authorizationCode, setAuthorizationCode] = useState(null);
    const [cardNumber, setCardNumber] = useState(null);
    const [restaurantRut, setRestaurantRut] = useState(null);

    const menu = useSelector(getRestaurantMenu);

    async function logoutFromAdminArea(restaurantId) {
        await logoutFromAdminAreaApi(restaurantId);
    }

    useEffect(() => {
        if (menu) logoutFromAdminArea(menu.restaurant.id);
    }, [menu]);

    useEffect(() => {
        const params = new URLSearchParams(search);
        const statusParam = params.get("status");
        const amountParam = params.get("amount");
        const responseCodeParam = params.get("response_code");
        const buyOrderParam = params.get("buy_order");
        const sessionIdParam = params.get("session_id");
        const transactionDateParam = params.get("transaction_date");
        const authorizationCodeParam = params.get("authorization_code");
        const cardNumberParam = params.get("card_number");
        const restaurantRutParam = params.get("restaurant_rut");
        const messageParam = params.get("message");

        setStatus(statusParam);
        setAmount(amountParam);
        setFormattedAmount(
            amount
                ? new Intl.NumberFormat("es-CL", {
                      style: "currency",
                      currency: "CLP",
                  }).format(amount)
                : "N/A"
        );
        setResponseCode(responseCodeParam);
        setBuyOrder(buyOrderParam);
        setSessionId(sessionIdParam);
        setTransactionDate(transactionDateParam);
        setFormattedTransactionDate(
            transactionDate
                ? new Date(transactionDate).toLocaleString("es-CL", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                  })
                : "N/A"
        );
        setAuthorizationCode(authorizationCodeParam);
        setCardNumber(cardNumberParam);
        setRestaurantRut(restaurantRutParam);
        setMessage(messageParam);

        // Display success or failure message based on response_code or status
        if (responseCodeParam.toString() === "0") {
            setTransactionMessage("Transacción Exitosa!");
        } else {
            setTransactionMessage("Transacción Fallida!");
        }
    }, [amount, search, transactionDate]);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                width: "100vw",
            }}
        >
            <div>
                <h1 style={{marginBottom: "10px", fontSize: "24px"}}>
                    {transactionMessage}
                </h1>
                <p>Cantidad: {formattedAmount}</p>
                <p>
                    Estatus:{" "}
                    {status === "AUTHORIZED" ? "Authorizeada" : "Fallida"}
                </p>
                <p>Código de Respuesta: {responseCode}</p>
                <p>Orden de Compra: {buyOrder}</p>
                <p>Id de la Sesión: {sessionId}</p>
                <p>Fecha de la Transacción: {formattedTransactionDate}</p>
                <p>Código de Autorización: {authorizationCode}</p>
                <p>Últimos 4 números de la Tarjeta: {cardNumber}</p>
                <p>RUT del Restaurant: {restaurantRut}</p>
                <p>Mensaje: {message}</p>
            </div>
        </div>
    );
}

export default WebpayPlusPaymentResult;
