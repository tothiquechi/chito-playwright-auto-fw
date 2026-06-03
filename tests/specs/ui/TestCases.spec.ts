import {test, expect} from '@playwright/test';
import { assert } from 'node:console';

// Before each test, create a new page and log in to the SauceDemo page
test.beforeEach(async ({ page }) => {

    //Login the SauceDemo page
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('[data-test="title"]')).toBeVisible();
});

test ('Default sort state after login', async({page}) => {

    // Verify that the default sort state is "Name (A to Z)"
    const defaultSortOption = await page.locator('.product_sort_container').inputValue();
    assert(defaultSortOption === 'az', 'Default sort state is not "Name (A to Z)"');

    // Verify that the products are sorted in ascending order by name
    const productNames = await page.locator('.inventory_item_name').allTextContents();
    const sortedProductNames = [...productNames].sort();
    assert(JSON.stringify(productNames) === JSON.stringify(sortedProductNames), 'Products are not sorted in ascending order by name');

});

test ('Sort resets after logout and re-login', async({page}) => {

    //Select 'Name (Z to A)' from the sort dropdown
    await page.locator('.product_sort_container').selectOption('za');

    // Verify that the products are sorted in descending order by name
    const productNames = await page.locator('.inventory_item_name').allTextContents();
    const sortedProductNames = [...productNames].sort().reverse();
    assert(JSON.stringify(productNames) === JSON.stringify(sortedProductNames), 'Products are not sorted in descending order by name');

    // Logout from the application
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator("//a[@id='logout_sidebar_link']").click();

    // Re-login to the application
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify that the default sort state is reset to "Name (A to Z)"
    const defaultSortOption = await page.locator('.product_sort_container').inputValue();
    assert(defaultSortOption === 'az', 'Default sort state is not reset to "Name (A to Z)" after re-login');
    
});

test ('Sort works correctly with items in cart and equal-price', async({page}) => {

    //Click on "Add to cart" for "Sauce Labs Backpack"
    await page.locator("//button[@id='add-to-cart-sauce-labs-backpack']").click();

    //Click on "Add to cart" for "Sauce Labs Onesie"
    await page.locator("//button[@id='add-to-cart-sauce-labs-onesie']").click();

    //Verify the cart badge shows "2"
    const cartBadge = await page.locator('.shopping_cart_badge').textContent();
    assert(cartBadge === '2', 'Cart badge does not show "2" after adding two items to the cart');

    //Select 'Price (low to high)' from the sort dropdown
    await page.locator('.product_sort_container').selectOption('lohi');

    //Verify that the products are re-ordered by descending price, with the "Sauce Labs Onesie" appearing before the "Sauce Labs Backpack"
    const productNames = await page.locator('.inventory_item_name').allTextContents();
    const expectedOrder = ['Sauce Labs Onesie', 'Sauce Labs Backpack'];
    assert(JSON.stringify(productNames.slice(0, 2)) === JSON.stringify(expectedOrder), 'Products are not sorted correctly by price with items in cart and equal-price');

    //Verify that the cart badge still shows "2" after sorting
    const cartBadgeAfterSort = await page.locator('.shopping_cart_badge').textContent();
    assert(cartBadgeAfterSort === '2', 'Cart badge does not show "2" after sorting the products');

    //Verify that the "Sauce Labs Backpack" button shows "Remove" and the "Sauce Labs Onesie" button shows "Remove"
    const onesieIndex = productNames.findIndex(n => n === 'Sauce Labs Onesie');
    const backpackIndex = productNames.findIndex(n => n === 'Sauce Labs Backpack');
    assert(onesieIndex !== -1 && backpackIndex !== -1, 'One or both products not found after sorting');
    assert(onesieIndex < backpackIndex, 'Sauce Labs Onesie does not appear before Sauce Labs Backpack after sorting by price (low to high)');

    //Verify that other products' buttons still show "Add to cart"
    const otherProductButtons = await page.locator('.inventory_item').filter({ hasNot: page.locator('.inventory_item_name', { hasText: 'Sauce Labs Backpack' }) }).filter({ hasNot: page.locator('.inventory_item_name', { hasText: 'Sauce Labs Onesie' }) }).locator('button');
    const otherProductButtonTexts = await otherProductButtons.allTextContents();
    const allAddToCart = otherProductButtonTexts.every(text => text === 'Add to cart');
    assert(allAddToCart, 'Not all other products\' buttons show "Add to cart" after sorting');

    //Select 'Price (low to high)' from the sort dropdown
    await page.locator('.product_sort_container').selectOption('lohi');

    //Verify that the "Sauce Labs Bolt T-shirt" appears before the "Test.allTheThings() T-shirt (Red)"
    const productNamesAfterSort = await page.locator('.inventory_item_name').allTextContents();
    const expectedOrderAfterSort = ['Sauce Labs Bolt T-shirt', 'Test.allTheThings() T-shirt (Red)'];
    assert(JSON.stringify(productNamesAfterSort.slice(2, 4)) === JSON.stringify(expectedOrderAfterSort), 'Products with equal price are not sorted correctly by name after sorting by price');

    //Select 'Price (high to low)' from the sort dropdown
    await page.locator('.product_sort_container').selectOption('hilo');

    //Verify that the "Sauce Labs Bolt T-shirt" appears before the "Test.allTheThings() T-shirt (Red)"
    const productNamesAfterSortHighToLow = await page.locator('.inventory_item_name').allTextContents();
    const expectedOrderAfterSortHighToLow = ['Sauce Labs Bolt T-shirt', 'Test.allTheThings() T-shirt (Red)'];
    assert(JSON.stringify(productNamesAfterSortHighToLow.slice(2, 4)) === JSON.stringify(expectedOrderAfterSortHighToLow), 'Products with equal price are not sorted correctly by name after sorting by price high to low');

});