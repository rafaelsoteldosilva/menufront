import {createGlobalStyle} from "styled-components";
import styled, {css} from "styled-components";

const devices = {
    mobileS: "(min-width: 320px)",
    mobileM: "(min-width: 375px)",
    mobileL: "(min-width: 425px)",
    tablet: "(min-width: 768px)",
    laptop: "(min-width: 1024px)",
    laptopL: "(min-width: 1440px)",
    desktop: "(min-width: 2560px)",
    desktopL: "(min-width: 3000px)",
};

// good

export const globalThemePublic = {
    device: devices,
    backgroundColor: "#000000",
    buttonsBackgroundColor: "#6669A3",
    buttonsHoverBackgroundColor: "#4E657B",
    buttonsTextColor: "white",
    focusColor: "blue",
    navigationItemColor: "white",
    navigationItemActiveColor: "black",
    navigationItemBackgroundColor: "black",
    navigationItemHoverBackgroundColor: "#4E657B",
    navigationItemComponentActiveBackgroundColor: "#6669A3",
    categoryCardBackgroundColor: "gray",
    categoryCardBorderColor: "black",
    textColor: "#EFEDFB",
    priceColor: "#07FF00",
    fontFamily: "Courgette",
    fontSize: "16px",
};

export const globalThemePrivate = {
    device: devices,
    backgroundColor: "#1E2150",
    buttonsBackgroundColor: "#6669A3",
    buttonsHoverBackgroundColor: "#4E657B",
    buttonsTextColor: "white",
    focusColor: "blue",
    navigationItemColor: "white",
    navigationItemActiveColor: "black",
    navigationItemBackgroundColor: "black",
    navigationItemHoverBackgroundColor: "#4E657B",
    navigationItemComponentActiveBackgroundColor: "#6669A3",
    categoryCardBackgroundColor: "gray",
    categoryCardBorderColor: "black",
    textColor: "#EFEDFB",
    priceColor: "#07FF00",
    fontFamily: "Roboto",
    fontSize: "16px",
};

export const ButtonInternals = css`
    width: 120px;
    background-color: ${({theme}) => theme.buttonsBackgroundColor};
    opacity: ${({disabled}) => (disabled ? "0.4" : "1")};
    margin: 0 0.8em 0.8em 0;
    border: 0.16em solid rgba(255, 255, 255, 0);
    border-radius: 2em;
    box-sizing: border-box;
    text-decoration: none;
    font-weight: 300;
    color: ${({theme}) => theme.buttonsTextColor};
    text-shadow: 0 0.04em 0.04em rgba(0, 0, 0, 0.35);
    text-align: center;
    transition: all 0.2s;
    cursor: ${({disabled}) => (disabled ? "not-allowed" : "pointer")};
    &:hover {
        background-color: ${({theme, disabled}) =>
            disabled ? "none" : theme.buttonsHoverBackgroundColor};
    }
    &:active {
        box-shadow: 7px 6px 28px 1px rgba(0, 0, 0, 0.24);
        transform: ${({disabled}) => (disabled ? "none" : "translateY(4px)")};
    }
`;

export const Button = styled.button`
    ${ButtonInternals}
`;

export const CSSReset = createGlobalStyle`
  /* Reset box-sizing to ensure consistent sizing */
  html {
    box-sizing: border-box;
    -moz-osx-font-smoothing: grayscale; /* for Firefox */
    -webkit-font-smoothing: antialiased; /* for Chrome, Safari */
    background-color: ${({theme}) => theme.backgroundColor};
    font-family: ${({theme}) => theme.fontFamily};
    font-size: ${({theme}) => theme.fontSize}; /* Default font size from theme */
    color: ${({theme}) => theme.textColor};
  }
  *, *::before, *::after {
    box-sizing: inherit;
    margin: 0;
    padding: 0;
  }

  /* Body styles */
  body {
    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */
    overflow: scroll;
    display: block;
    line-height: 1.5;
    background-color: ${({theme}) => theme.backgroundColor};
    font-family: ${({theme}) => theme.fontFamily};
    color: ${({theme}) => theme.textColor};
    font-size: ${({theme}) => theme.fontSize}; /* Default font size from theme */
  }

  body::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }

  /* Reset some common HTML elements */
  body,
  div,
  h1, h2, h3, h4, h5, h6,
  p, li, dl, dt, dd,
  form, fieldset, legend,
  input, textarea, button,
  blockquote, figure, hr, pre {
    margin: 0;
    padding: 0;
    border: 0;
    vertical-align: baseline;
    font-family: inherit;
    font-size: 100%;
    font-weight: inherit;
  }

  /* Remove default text styling */
  a, a:visited {
    text-decoration: none;
  }

  /* Make images and other embedded objects responsive */
  img, embed, iframe, object, video {
    max-width: 100%;
    height: auto;
  }

  /* Set default styles for forms and buttons */
  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
    border: none;
    outline: none;
    background: transparent;
    box-shadow: none;
    padding: 0;
    margin: 0;
    appearance: none;
    -webkit-appearance: none; /* for Safari */
  }

  /* Focus styles for accessibility */
  a:focus, button:focus, input:focus, select:focus, textarea:focus {
    outline: 2px solid ${({theme}) => theme.focusColor || "#0000"};
    outline-offset: 2px;
  }

  /* Extend scrollbar reset */
  *::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }

  /* End of CSS Reset */
`;
