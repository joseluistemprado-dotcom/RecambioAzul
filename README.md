# Recambio Azul

Recambio Azul is a modern e-commerce platform for second-hand electric vehicle parts. This project features a responsive design, vehicle-based filtering, and a complete shopping experience.

## Features

-   **Vehicle Selector**: Filter parts by specific brands (Tesla, Renault, etc.) and models.
-   **Product Catalog**: View available parts with an electric blue theme.
-   **Shopping Cart**: Manage items, view summaries, and persist data using local storage.
-   **Product Details**: View detailed information about each part in a modal.
-   **Checkout Flow**: Simulated checkout process with order summary and payment form.
-   **Client Area**: Simulated login and order tracking dashboard.
-   **Responsive Design**: Optimized for desktop and mobile devices.

## How to Run

1.  Open the project folder in VS Code.
2.  Use a local server extension like **Live Server**.
3.  Open `index.html` in your browser.

## Project Structure

-   `index.html`: Main application structure.
-   `styles.css`: Global styles and electric blue theme definitions.
-   `src/modules/`: JavaScript modules for application logic.
    -   `app.js`: Main entry point.
    -   `vehicle-selector.js`: Handles vehicle data and filtering.
    -   `product-list.js`: Renders products and handles interactions.
    -   `cart.js`: Manages shopping cart state.
    -   `product-details.js`: Controls the details modal.
    -   `checkout.js`: Manages the checkout flow.
    -   `client-area.js`: Handles client login and dashboard.
    -   `navigation.js`: Manages general navigation and modals.
-   `src/data/`: JSON data files for vehicles and products.
