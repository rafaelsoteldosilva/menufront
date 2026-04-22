# Restaurant Digital Menu Platform — Frontend

Frontend for a browser-based restaurant digital menu platform built with React.

This project was created to let restaurants publish a digital menu that customers can open directly in the browser, without needing to install a mobile app. It also includes private management flows so restaurant staff can manage categories, dishes, promotions, deliveries, reviews, users, and related menu settings.

This repository represents the frontend application of the system.

---

## Project Summary

Many restaurants need a practical digital menu solution that is easy for customers to access and easy for staff to maintain.

This frontend was built to solve that problem by covering two main areas:

- **public side**: menu browsing, promotions, reviews, delivery-related views, payment-related screens
- **private side**: restaurant management area for editing menu content and configuration

This project is part of a full-stack solution and is presented as a portfolio project / case study that demonstrates my ability to build a real-world web application with React, state management, protected routes, reusable components, and API integration.

---

## What This Frontend Demonstrates

This project demonstrates my ability to:

- build a real-world React application with multiple business flows
- structure a frontend around both public and private areas
- organize screens, dialogs, and reusable components clearly
- integrate a frontend with a backend API
- manage application state with slices/reducers and shared contexts
- implement protected routes and restricted management views
- build UI flows for menu administration, promotions, reviews, deliveries, and payments

---

## Main Features

### Public Features

- Restaurant menu browsing from the browser
- Category and dish visualization
- Promotions display
- Reviews and rating-related screens
- Delivery-related public views
- Share-related flows
- Payment-related screens

### Private / Management Features

- Management login dialog
- Category management
- Dish management
- Promotion management
- Preferences management
- Restaurant user management
- Delivery configuration flows
- Review moderation / rejection reason flows
- Image selection and image usage flows

### Application Features

- Route protection for restricted areas
- API-driven data loading
- State slices for key entities
- Shared global state and navigation contexts
- Reusable visual components for menu and management screens

---

## Tech Stack

- **React**
- **JavaScript**
- **CSS / project-defined styling approach**
- **Redux-style state management**
- **Context API**
- **Axios**
- **React Router style navigation structure**
- **PaypalImage Hostings like cloudinary**

---

## Frontend Architecture

The frontend is organized to separate concerns and keep the app maintainable as features grow.

### Main architectural areas

- `components/`  
  Reusable UI components for menu display, list items, headers, deliveries, promotions, reviews, and shared visual pieces.

- `routes/`  
  Main screens and dialog flows for both public usage and private restaurant management.

- `slices/`  
  State slices for important application domains such as reviews, menu data, payment options, delivery companies, and restaurant users.

- `appReducers/`  
  Additional reducer-based state handling.

- `axiosCalls/`  
  Centralized API communication layer.

- `contexts/`  
  Shared state for environment options, global state, and navigation behavior.

- `RouteProtectors/`  
  Logic for guarding restricted routes and checking access/state conditions.

- `utils/`  
  Support functions such as response checking, image utilities, helper functions, video handling, and toast/message behavior.

- `globalDefinitions/`  
  Global constants, modal definitions, and shared styles.

This structure reflects an app that is not just a simple menu viewer, but a broader restaurant management frontend with multiple user flows.

---

## Relevant Functional Areas in the Codebase

Some important functional areas reflected in the project structure are:

- menu display
- category and dish flows
- image management
- restaurant deliveries
- promotions
- reviews
- payment views
- admin dialogs
- user management
- route protection
- shared UI behavior

This matters because it shows the project handles real product workflows rather than only static pages.

---

## Example User Flows

### Customer / Public User

- Open the digital menu in the browser
- Browse categories and dishes
- View promotions
- Read reviews
- Access restaurant delivery information
- Go through payment-related screens where applicable

### Restaurant / Admin User

- Log into the management area
- Create or edit categories
- Create or edit dishes
- Configure restaurant preferences
- Manage restaurant users
- Manage promotions
- Review or moderate review-related data
- Configure restaurant delivery information

---

## Project Structure

```bash
MENUFRONT
├─ public/
├─ src/
│  ├─ appReducers/
│  ├─ assets/
│  ├─ axiosCalls/
│  ├─ components/
│  ├─ contexts/
│  ├─ globalDefinitions/
│  ├─ RouteProtectors/
│  ├─ routes/
│  ├─ slices/
│  ├─ utils/
│  ├─ App.js
│  ├─ index.js
│  └─ Main.js
├─ .env
├─ .gitignore
├─ package.json
├─ settings.json
└─ README.md
```
