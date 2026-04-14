import axios from "axios";
import CryptoJS from "crypto-js";
import DOMPurify from "dompurify";
import {isURL} from "validator";
import * as global from "../globalDefinitions/globalConstants";
import PropTypes from "prop-types";

export function decimalToTimeStr(decimalHours) {
    if (decimalHours === null) return null;
    const totalMinutes = decimalHours * 60;

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    const formattedHours = ((24 + hours) % 24).toString().padStart(2, "0");
    const formattedMinutes = Math.abs(minutes).toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
}

export function uploadFileToCloudinary(fileInput, folderName, ItIsAnImage) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", fileInput);
        formData.append(
            "upload_preset",
            process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
        );
        formData.append("folder", folderName.toString());
        const fileInputType = ItIsAnImage ? "image" : "video";
        axios
            .post(
                `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/${fileInputType}/upload`,
                formData,
            )
            .then((response) => {
                resolve(response.data); // Resolve with the response data
            })
            .catch((error) => {
                reject(error); // Reject with the error
            });
    });
}

export function EncryptForAuthorizations(string, secretKey) {
    try {
        return CryptoJS.AES.encrypt(string, secretKey).toString();
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Encryption error:", error);
        return null;
    }
}

export function DecryptForAuthorizations(encryptedString, secretKey) {
    try {
        if (!encryptedString) {
            throw new Error("No encrypted string provided");
        }
        const bytes = CryptoJS.AES.decrypt(encryptedString, secretKey);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        // Check if the decryption result is valid
        if (!decryptedString) {
            throw new Error("Decryption failed");
        }
        return decryptedString;
    } catch (error) {
        if (error.message === "Malformed UTF-8 data") {
            // eslint-disable-next-line no-console
            console.error(
                "Malformed UTF-8 data encountered during decryption.",
            );
        } else {
            // eslint-disable-next-line no-console
            console.error("Decryption error:", error);
        }
        return null;
    }
}

export function sanitizeStr(inputStr, inputIsURL = false) {
    if (inputIsURL) {
        if (isURL(inputStr)) {
            return inputStr;
        } else {
            return "";
        }
    } else return DOMPurify.sanitize(inputStr);
}

export function CurrencyFormatter({
    value,
    style,
    currencySymbol,
    locale,
    minFrac,
    maxFrac,
}) {
    // Create a new instance of Intl.NumberFormat without worrying about the currency symbol
    const formatter = new Intl.NumberFormat(locale, {
        style: "decimal", // Use "decimal" to format the number without currency
        minimumFractionDigits: minFrac,
        maximumFractionDigits: maxFrac,
    });

    // Format the value as a regular number
    const formattedValue = formatter.format(value);

    return (
        <span style={style}>
            &nbsp; {currencySymbol} {formattedValue}
        </span>
    );
}

export function getComponentNameFromPath(componentPath, callingName) {
    switch (componentPath) {
        case global.DialogCategoryPath: {
            return `${global.dialogEditCategory}: ${callingName}`;
        }

        case global.DialogDishPath: {
            return `${global.dialogEditDish}: ${callingName}`;
        }

        case global.DialogPreferencesPath: {
            return `${global.dialogEditPreferences}: ${callingName}`;
        }

        case global.DialogRestaurantUserPath: {
            return `${global.dialogEditRestaurantUser}: ${callingName}`;
        }

        default: {
            return "path not found";
        }
    }
}

export function getHelpVideoName(
    isItPublic,
    currentFunction,
    currentMenuOption,
    currentlyWatching,
) {
    let resultStr = "";
    if (isItPublic) {
        switch (currentFunction) {
            case global.showReviewsPath:
            case global.showReviewPath: {
                if (currentlyWatching === global.restaurant) {
                    resultStr = `public_${currentFunction.slice(1)}_home`;
                } else {
                    resultStr = `public_${currentFunction.slice(1)}_dish`;
                }
                break;
            }

            default: {
                resultStr = `public_${currentFunction.slice(1)}`;
                break;
            }
        }
    } else {
        switch (currentMenuOption) {
            case global.menuOptions.private.management: {
                resultStr = `private_${currentFunction.slice(1)}`;
                break;
            }

            case global.menuOptions.private.menu:
                switch (currentFunction) {
                    case global.categoriesPath:
                    case global.dishesPath:
                    case global.dishPath: {
                        resultStr = `private_categories`;
                        break;
                    }
                    // menu uses image collection, categories, dishes and dish
                    case global.showImageCollectionPath: {
                        resultStr = `private_${currentFunction.slice(1)}`;
                        break;
                    }

                    default: {
                        resultStr = "no help video name";
                        break;
                    }
                }
                break;

            case global.menuOptions.private.evaluations:
            case global.menuOptions.private.deliveries:
            case global.menuOptions.private.promotions:
            case global.menuOptions.private.restaurant_number:
            case global.menuOptions.private.image_collection:
            case global.menuOptions.private.payment:
            case global.menuOptions.private.QR: {
                resultStr = `private_${currentFunction.slice(1)}`;
                break;
            }

            case global.menuOptions.private.sorting:
                switch (currentFunction) {
                    case global.categoriesPath:
                    case global.dishesPath: {
                        resultStr = `private_sorting`;
                        break;
                    }

                    default: {
                        resultStr = "no help video name";
                        break;
                    }
                }
                break;

            // remember, users and preferences use image collection, so does menu, but it is already
            // taken care of
            case global.menuOptions.private.restaurant_users:
            case global.menuOptions.private.preferences:
                switch (currentFunction) {
                    case global.showImageCollectionPath: {
                        resultStr = `private_${currentFunction.slice(1)}`;
                        break;
                    }

                    default: {
                        resultStr = `private_${currentFunction.slice(1)}`;
                        break;
                    }
                }
                break;

            default: {
                resultStr = "no help video name";
                break;
            }
        }
    }
    return resultStr;
}

export function truncateLongWordsInAString(str) {
    return str
        .split(" ")
        .map((word) =>
            word.length > global.maxWordLength
                ? word.slice(0, global.maxWordLength) + "…"
                : word,
        )
        .join(" ");
}

export function truncateLongWordsInObject(obj) {
    const truncatedObj = {};
    let wordsHaveBeenTruncated = false;

    for (const key in obj) {
        if (typeof obj[key] === "string") {
            // Split on word boundaries, truncate long words, and rejoin
            let result = obj[key].split(/\b/).reduce(
                (acc, segment) => {
                    // Only process word-like segments (letters, not punctuation or whitespace)
                    if (
                        /\w/.test(segment) &&
                        segment.length > global.maxWordLength
                    ) {
                        acc.truncated = true;
                        acc.words.push(
                            segment.slice(0, global.maxWordLength) + "…",
                        );
                    } else {
                        acc.words.push(segment);
                    }
                    return acc;
                },
                {truncated: false, words: []},
            );

            if (!wordsHaveBeenTruncated && result.truncated)
                wordsHaveBeenTruncated = result.truncated;
            truncatedObj[key] = result.words.join("");
        } else {
            truncatedObj[key] = obj[key]; // Copy non-string values directly
        }
    }
    truncatedObj[global.wordsHaveBeenTruncated] = wordsHaveBeenTruncated;
    return truncatedObj;
}

export function monthsAppart(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    // Validate the dates
    if (isNaN(d1) || isNaN(d2)) {
        throw new Error("Invalid Date passed to monthsApart function");
    }

    // Ensure d1 is the earlier date
    const earlierDate = d1.getTime() < d2.getTime() ? d1 : d2;
    const laterDate = d1.getTime() < d2.getTime() ? d2 : d1;

    // Extract years and months
    const yearDiff = laterDate.getFullYear() - earlierDate.getFullYear();
    const monthDiff = laterDate.getMonth() - earlierDate.getMonth();

    // Total calendar months
    const totalMonths = yearDiff * 12 + monthDiff;

    return totalMonths;
}

CurrencyFormatter.propTypes = {
    value: PropTypes.number.isRequired, // 'value' must be a number and is required
    style: PropTypes.object, // 'style' is an optional object
    currencySymbol: PropTypes.string.isRequired, // 'currencySymbol' must be a string and is required
    locale: PropTypes.string.isRequired, // 'locale' must be a string and is required
    minFrac: PropTypes.number, // 'minFrac' is an optional number
    maxFrac: PropTypes.number, // 'maxFrac' is an optional number
};
