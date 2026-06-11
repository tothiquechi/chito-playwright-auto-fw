import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../auto-fw/page-objects/pages/LoginPage';
import { ProductsPage } from '../../../auto-fw/page-objects/pages/ProductsPage';
import { CartPage } from '../../../auto-fw/page-objects/pages/CartPage';
import { MenuPage } from '../../../auto-fw/page-objects/pages/MenuPage';

let loginPage: LoginPage;
let productsPage: ProductsPage;
let cartPage: CartPage;
let menuPage: MenuPage;

// Before each test, create a new page objects and log in to the SauceDemo page
test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    menuPage = new MenuPage(page);

    // Login to the SauceDemo page
    await loginPage.navigate();
    await loginPage.fillUsername('standard_user');
    await loginPage.fillPassword('secret_sauce');
    await loginPage.login();
    await expect(page.locator('[data-test="title"]')).toBeVisible();
});

test('Default sort state after login', async ({ page }) => {
    const defaultSortOption = await productsPage.getDefaultSortOption();
    expect(defaultSortOption).toBe('az');

    const productNames = await productsPage.getProductNames();
    const sortedProductNames = [...productNames].sort();
    expect(productNames).toEqual(sortedProductNames);
});

test('Sort resets after logout and re-login', async ({ page }) => {
    await productsPage.sortProducts('za');

    const productNames = await productsPage.getProductNames();
    const sortedProductNames = [...productNames].sort().reverse();
    expect(productNames).toEqual(sortedProductNames);

    await menuPage.openMenu();
    await menuPage.logout();

    await loginPage.fillUsername('standard_user');
    await loginPage.fillPassword('secret_sauce');
    await loginPage.login();

    const defaultSortOption = await productsPage.getDefaultSortOption();
    expect(defaultSortOption).toBe('az');
});

test('Sort works correctly with items in cart and equal-price', async ({ page }) => {
    await productsPage.addToCart('sauce-labs-backpack');
    await productsPage.addToCart('sauce-labs-onesie');

    const cartBadge = await cartPage.getCartBadgeCount();
    expect(cartBadge).toBe('2');

    await productsPage.sortProducts('lohi');

    const productNames = await productsPage.getProductNames();
    // don't assume exact indices for these two - assert relative order
    const onesieIndex = productNames.findIndex(n => n === 'Sauce Labs Onesie');
    const backpackIndex = productNames.findIndex(n => n === 'Sauce Labs Backpack');
    expect(onesieIndex).not.toBe(-1);
    expect(backpackIndex).not.toBe(-1);
    expect(onesieIndex).toBeLessThan(backpackIndex);

    const cartBadgeAfterSort = await cartPage.getCartBadgeCount();
    expect(cartBadgeAfterSort).toBe('2');

    const otherProductButtons = await page.locator('.inventory_item').filter({ hasNot: page.locator('.inventory_item_name', { hasText: 'Sauce Labs Backpack' }) }).filter({ hasNot: page.locator('.inventory_item_name', { hasText: 'Sauce Labs Onesie' }) }).locator('button');
    const otherProductButtonTexts = await otherProductButtons.allTextContents();
    const allAddToCart = otherProductButtonTexts.every(text => text === 'Add to cart');
    expect(allAddToCart).toBe(true);

    await productsPage.sortProducts('lohi');

    const productNamesAfterSort = await productsPage.getProductNames();
    // verify two shirts maintain relative order (not exact indices)
    const boltIndex = productNamesAfterSort.findIndex(n => n === 'Sauce Labs Bolt T-Shirt');
    const redIndex = productNamesAfterSort.findIndex(n => n === 'Test.allTheThings() T-Shirt (Red)');
    expect(boltIndex).not.toBe(-1);
    expect(redIndex).not.toBe(-1);
    expect(boltIndex).toBeLessThan(redIndex);

    await productsPage.sortProducts('hilo');

    const productNamesAfterSortHighToLow = await productsPage.getProductNames();
    const boltIndexHigh = productNamesAfterSortHighToLow.findIndex(n => n === 'Sauce Labs Bolt T-Shirt');
    const redIndexHigh = productNamesAfterSortHighToLow.findIndex(n => n === 'Test.allTheThings() T-Shirt (Red)');
    expect(boltIndexHigh).not.toBe(-1);
    expect(redIndexHigh).not.toBe(-1);
    expect(boltIndexHigh).toBeLessThan(redIndexHigh);
});
