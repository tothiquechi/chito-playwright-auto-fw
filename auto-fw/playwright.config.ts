import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/specs',
    timeout: 30000,
    expect: {
        timeout: 5000,
    },
    reporter: 'html',
    use: {
        headless: false,
        actionTimeout: 0,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { browserName: 'chromium' },
        },
        {
            name: 'firefox',
            use: { browserName: 'firefox' },
        },
        {
            name: 'webkit',
            use: { browserName: 'webkit' },
        },
    ],
});