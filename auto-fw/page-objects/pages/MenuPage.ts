import { Page } from '@playwright/test';

export class MenuPage {
    readonly page: Page;
    constructor(page: Page) { this.page = page; }

    async openMenu() {
        await this.page.getByRole('button', { name: 'Open Menu' }).click();
    }

    async logout() {
        // menu should be open before calling
        await this.page.locator('#logout_sidebar_link').click();
    }
}