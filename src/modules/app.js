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
import { DiagnosticWizard } from './diagnostic-wizard.js';
import { RatingSystem } from './rating-system.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Recambio Azul App Initialized');

    // Initialize Rating System (async but non-blocking)
    const ratingSystem = new RatingSystem();
    ratingSystem.init().then(() => {
        ratingSystem.attachGlobalEvents();
        console.log('Rating System loaded');
    }).catch(error => {
        console.warn('Rating System failed to load:', error);
    });

    // Initialize components if their containers exist
    if (document.getElementById('vehicle-selector-container')) {
        const vehicleSelector = new VehicleSelector('vehicle-selector-container');
        vehicleSelector.init();
    }

    if (document.getElementById('product-list-container')) {
        const productList = new ProductList('product-list-container', ratingSystem);
        productList.init();
    }

    // Initialize Vehicle Search (Plate/VIN)
    if (document.getElementById('vehicle-search-container')) {
        const vehicleSearch = new VehicleSearch('vehicle-search-container');
        vehicleSearch.init();
    }

    // Initialize Diagnostic Wizard
    if (document.getElementById('diagnostic-wizard-container')) {
        const diagnosticWizard = new DiagnosticWizard('diagnostic-wizard-container');
        diagnosticWizard.init();
    }

    // Initialize Shopping Cart
    const cart = new Cart();
    cart.init();

    // Initialize Product Details
    const productDetails = new ProductDetails(ratingSystem);
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

    // Hero Buttons
    const heroBtnDiagnostic = document.getElementById('hero-btn-diagnostic');
    if (heroBtnDiagnostic) {
        heroBtnDiagnostic.addEventListener('click', () => {
            window.location.hash = '#/diagnostico';
        });
    }

    const heroBtnSearch = document.getElementById('hero-btn-search');
    if (heroBtnSearch) {
        heroBtnSearch.addEventListener('click', () => {
            const target = document.getElementById('category-search-container');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Initialize General Navigation
    initNavigation();

    // Handle initial route
    handleRouting();
});
