# Project Documentation

## Overview
This project is an automated testing framework for the SauceDemo application using Playwright. It includes a set of test cases that validate the functionality of the application, including user login, product sorting, and cart management.

## Project Structure
```
auto-fw
├── tests
│   └── specs
│       └── ui
│           └── test-cases.spec.ts
├── page-objects
│   └── pages
│       ├── LoginPage.ts
│       ├── ProductsPage.ts
│       ├── CartPage.ts
│       └── MenuPage.ts
├── package.json
├── tsconfig.json
├── playwright.config.ts
└── README.md
```

## Page Objects
- **LoginPage.ts**: Encapsulates the login functionality with methods to navigate to the login page, fill in the username and password, and perform the login action.
- **ProductsPage.ts**: Represents the products page with methods to get the default sort option, sort products, retrieve product names, and add products to the cart.
- **CartPage.ts**: Manages the shopping cart with methods to get the cart badge count, verify products in the cart, and remove products from the cart.
- **MenuPage.ts**: Handles interactions with the application menu, including opening the menu, logging out, and navigating to different sections of the application.

## Configuration Files
- **tsconfig.json**: TypeScript configuration file that specifies compiler options and files to include in the compilation.
- **package.json**: npm configuration file that lists dependencies and scripts for the project.
- **playwright.config.ts**: Configuration settings for Playwright, specifying test runner options and browser settings.

## Running Tests
To run the tests, use the following command:
```
npx playwright test
```

## Dependencies
Make sure to install the necessary dependencies by running:
```
npm install
```

## Contribution
Feel free to contribute to this project by submitting issues or pull requests.