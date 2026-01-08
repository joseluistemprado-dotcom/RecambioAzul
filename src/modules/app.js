import { VehicleSelector } from './vehicle-selector.js';
import { ProductList } from './product-list.js';
import { Cart } from './cart.js';
import { ProductDetails } from './product-details.js';
import { Checkout } from './checkout.js';
import { ClientArea } from './client-area.js';
import { initNavigation, handleRouting } from './navigation.js';
import { CategorySearch } from './category-search.js';
import { ThemeToggle } from './theme-toggle.js';
import { DonorVehicles } from './donor-vehicles.js';
import { ChatBot } from './chatbot.js';
import { VehicleSearch } from './vehicle-search.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Recambio Azul App Initialized');

    // Initialize components if their containers exist
    if (document.getElementById('vehicle-selector-container')) {
        const vehicleSelector = new VehicleSelector('vehicle-selector-container');
        vehicleSelector.init();
    }

    if (document.getElementById('product-list-container')) {
        const productList = new ProductList('product-list-container');
        productList.init();
    }

    // Initialize Vehicle Search (Plate/VIN)
    if (document.getElementById('vehicle-search-container')) {
        const vehicleSearch = new VehicleSearch('vehicle-search-container');
        vehicleSearch.init();
    }

    // Initialize Shopping Cart
    const cart = new Cart();
    cart.init();

    // Initialize Product Details
    const productDetails = new ProductDetails();
    productDetails.init();

    // Initialize Checkout
    const checkout = new Checkout();
    checkout.init(cart);

    // Initialize Client Area
    const clientArea = new ClientArea();
    clientArea.init();

    // Initialize Category Search
    const categorySearch = new CategorySearch('category-search-container');
    categorySearch.init();

    // Initialize Theme Toggle
    const themeToggle = new ThemeToggle();
    themeToggle.init();

    // Initialize Donor Vehicles
    const donorVehicles = new DonorVehicles();
    donorVehicles.init();

    // Initialize ChatBot
    const chatbot = new ChatBot();
    chatbot.init();

    // Initialize Search Bar
    const searchInput = document.getElementById('main-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            document.dispatchEvent(new CustomEvent('search-query', { detail: e.target.value }));
        });
    }

    // Initialize General Navigation
    initNavigation();

    // Handle initial route
    handleRouting();
});
