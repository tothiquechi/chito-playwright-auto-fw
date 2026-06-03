Locators: Using CSS and XPath to identify the following items:

1. Select the shopping cart link/icon -> //a[@class='shopping_cart_link']
2. Select all "Add to cart" buttons -> //button[text()='Add to cart']
3. Select the sort dropdown -> //select[@class='product_sort_container']
4. Select all product images -> //img[@class='inventory_item_img']
5. Select items whose price contains "$15.99" -> //div[@class='inventory_item_price' and text()='15.99'] 
6. Select the "Add to cart" button for "Sauce Labs Backpack" -> //button[@data-test='add-to-cart-sauce-labs-backpack']
7. Select the "Remove" button after adding "Sauce Labs Onesie" to cart -> //button[@data-test='remove-sauce-labs-onesie']
8. Select all buttons with "data-test" starting with "add-to-cart" -> //button[starts-with(@data-test, 'add-to-cart')]
9. Select all product names that do NOT contain "Sauce Labs"  -> //div[@class='inventory_item_name '][not(contains(text(),'Sauce Labs'))]
10. Select a product's image by matching alt text partially -> 
    - //img[contains(@alt,'Backpack')]
    - //img[contains(@alt,'Bike')]
    - //img[contains(@alt,'Bolt')]
    - //img[contains(@alt,'Fleece')]
    - //img[contains(@alt,'Onesie')]
    - //img[contains(@alt,'.allTheThings()')]