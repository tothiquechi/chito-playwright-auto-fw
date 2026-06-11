import { Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    constructor(page: Page) { this.page = page; }

    async navigate() {
        await this.page.goto('https://www.saucedemo.com');
    }

    async fillUsername(username: string) {
        await this.page.locator('#user-name').fill(username);
    }

    async fillPassword(password: string) {
        await this.page.locator('#password').fill(password);
    }

    async login() {
        await this.page.getByRole('button', { name: 'Login' }).click();
    }
}