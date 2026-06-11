import { Page } from '@playwright/test';

export class ProductsPage {
    readonly page: Page;
    constructor(page: Page) { this.page = page; }

    async getDefaultSortOption(): Promise<string> {
        return await this.page.locator('.product_sort_container').inputValue();
    }

    async getProductNames(): Promise<string[]> {
        return await this.page.locator('.inventory_item_name').allTextContents();
    }

    async sortProducts(value: string) {
        await this.page.locator('.product_sort_container').selectOption(value);
        // wait for reorder effect
        await this.page.waitForLoadState('networkidle');
    }

    async addToCart(itemIdSlug: string) {
        // expects id slug like 'sauce-labs-backpack' or full id suffix used in DOM
        const selector = `#add-to-cart-${itemIdSlug}`;
        await this.page.locator(selector).click();
    }

    async getProductButtonTextByName(name: string): Promise<string | null> {
        const button = this.page.locator('.inventory_item').filter({ has: this.page.locator('.inventory_item_name', { hasText: name }) }).locator('button');
        return await button.first().textContent();
    }
}