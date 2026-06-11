import { Page } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    constructor(page: Page) { this.page = page; }

    async getCartBadgeCount(): Promise<string | null> {
        const badge = this.page.locator('.shopping_cart_badge');
        if (await badge.count() === 0) return null;
        return (await badge.textContent())?.trim() ?? null;
    }
}