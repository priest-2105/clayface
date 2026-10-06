import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import { Pool } from '../../apps/api/src/database';

process.loadEnvFile('.env');
const password = 'A browser test password 42';
const headers = { origin: 'http://127.0.0.1:3000', 'x-clayface-request': '1' };
let email = '';
test.beforeEach(() => { email = `flow-${Date.now()}-${Math.random().toString(16).slice(2)}@browser.clayface.test`; });
test.afterEach(async () => {
  const db = new Pool({ connectionString: process.env.DATABASE_URL });
  try { await db.query('DELETE FROM app_user WHERE email=$1', [email]); } finally { await db.end(); }
});

test('signup leads through saved onboarding into the first design on desktop and mobile', async ({ page }) => {
  fs.mkdirSync('.impeccable/review', { recursive: true });
  await page.goto('/dashboard'); await expect(page).toHaveURL(/signin/);
  await page.getByRole('link', { name: 'Create an account' }).click();
  await expect(page.getByRole('heading', { name: 'Make space for your next idea.' })).toBeVisible();
  await page.screenshot({ path: '.impeccable/review/signup-desktop.png', fullPage: true, animations: 'disabled' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: '.impeccable/review/signup-mobile.png', fullPage: true, animations: 'disabled' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'What should we call you?' })).toBeVisible();
  await page.getByLabel('Your name').fill('Alex');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'What are you creating?' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'What are you creating?' })).toBeVisible();
  await page.getByLabel('Project name').fill('Studio North');
  await page.getByLabel('What do you do, and who is it for?').fill('We create thoughtful websites for independent businesses.');
  await page.screenshot({ path: '.impeccable/review/onboarding-desktop.png', fullPage: true, animations: 'disabled' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: '.impeccable/review/onboarding-mobile.png', fullPage: true, animations: 'disabled' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Choose your starting direction.' })).toBeVisible();
  await page.screenshot({ path: '.impeccable/review/design-mobile.png', fullPage: true, animations: 'disabled' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: '.impeccable/review/design-desktop.png', fullPage: true, animations: 'disabled' });
  await page.getByRole('button', { name: 'Create my first design' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.frameLocator('iframe[title="Design canvas"]').getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByLabel('Active direction')).toHaveCount(1);
  await page.reload();
  await expect(page.frameLocator('iframe[title="Design canvas"]').getByRole('heading', { level: 1 })).toBeVisible();
});

test('authenticated edits survive reload and preview', async ({ page }) => {
  const signup = await page.request.post('/api/auth/signup', { headers, data: { email, password } }); expect(signup.ok()).toBeTruthy();
  await page.request.post('/api/onboarding/name', { headers, data: { name: 'Alex' } });
  await page.request.post('/api/onboarding/project', { headers, data: { name: 'Northstar', productType: 'Software / SaaS', brief: 'A thoughtful workspace for independent teams.', pages: ['Home','Pricing','Contact'] } });
  await page.request.post('/api/onboarding/design', { headers, data: { strategy: 'product' } });
  await page.goto('/dashboard');
  await page.getByRole('button', { name: 'Hero', exact: true }).click();
  await page.getByRole('textbox', { name: 'Heading', exact: true }).fill('A calmer way to work.');
  await expect(page.getByText('Saved to your account', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.frameLocator('iframe[title="Design canvas"]').getByRole('heading', { level: 1 })).toHaveText('A calmer way to work.');
  await page.getByRole('link', { name: 'Preview', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A calmer way to work.');
});

test('forgot password, local email and reset lead back through sign-in', async ({ page }) => {
  await page.request.post('/api/auth/signup', { headers, data: { email, password } });
  await page.request.post('/api/auth/signout', { headers, data: {} });
  await page.goto('/forgot-password'); await page.getByLabel('Email address').fill(email);
  await page.getByRole('button', { name: 'Send reset link' }).click();
  await expect(page.getByRole('heading', { name: 'Check your email.' })).toBeVisible();
  const mail = fs.readdirSync('.local-mail').map(name => ({ name, value: JSON.parse(fs.readFileSync(`.local-mail/${name}`, 'utf8')) })).find(item => item.value.to === email);
  expect(mail).toBeTruthy();
  const link = mail!.value.text.match(/http[^\s]+/)[0];
  await page.goto(link);
  await page.getByLabel('Password', { exact: true }).fill(password + ' changed');
  await page.getByRole('button', { name: 'Update password' }).click();
  await expect(page.getByRole('heading', { name: 'Your password is updated.' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to sign in' }).click();
  await page.getByLabel('Email address').fill(email); await page.getByLabel('Password', { exact: true }).fill(password + ' changed');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'What should we call you?' })).toBeVisible();
  fs.unlinkSync(`.local-mail/${mail!.name}`);
});

test('account settings enable two-factor and recovery-code sign-in', async ({ page }) => {
  await page.request.post('/api/auth/signup', { headers, data: { email, password } });
  await page.request.post('/api/onboarding/name', { headers, data: { name: 'Alex' } });
  await page.request.post('/api/onboarding/project', { headers, data: { name: 'Northstar', productType: 'Software / SaaS', brief: 'A thoughtful workspace for independent teams.', pages: ['Home'] } });
  await page.request.post('/api/onboarding/design', { headers, data: { strategy: 'product' } });
  await page.goto('/dashboard/account'); await expect(page.getByRole('heading', { name: 'Your account.' })).toBeVisible();
  await page.screenshot({ path: '.impeccable/review/account-desktop.png', fullPage: true, animations: 'disabled' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: '.impeccable/review/account-mobile.png', fullPage: true, animations: 'disabled' });
  await page.getByLabel('Confirm your password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Set up authenticator', exact: true }).click();
  const secret = await page.locator('.setup-secret').innerText();
  const { authenticator } = await import('../../apps/api/src/security');
  await page.getByLabel('Authenticator or recovery code').fill(authenticator(secret, email).generate());
  await page.getByRole('button', { name: 'Confirm and enable' }).click();
  await expect(page.getByText('Two-factor authentication is on. Save your recovery codes now.')).toBeVisible();
  const codes = (await page.locator('.recovery-codes').innerText()).split('\n');
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await page.getByLabel('Email address').fill(email); await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'One more check.' })).toBeVisible();
  await page.getByLabel('Authenticator or recovery code').fill(codes[0]);
  await page.getByRole('button', { name: 'Verify and sign in' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.goto('/signin');
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Big ideas. Beautifully put together.' })).toBeVisible();
});

test('public routes work without the API and the demo works on desktop and mobile', async ({ page }) => {
  await page.route('**/api/**', route => route.abort());
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Big ideas. Beautifully put together.' })).toBeVisible();
  await page.getByRole('button', { name: 'Editorial', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Editorial', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Forest palette' }).click();
  await expect(page.getByRole('button', { name: 'Forest palette' })).toHaveAttribute('aria-pressed', 'true');
  await page.screenshot({ path: '.impeccable/review/public-desktop.png', fullPage: true, animations: 'disabled' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: '.impeccable/review/public-mobile.png', fullPage: true, animations: 'disabled' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('navigation', { name: 'Public navigation' }).getByRole('link', { name: 'Help & resources' }).click();
  await expect(page).toHaveURL(/\/help$/);
  await page.locator('summary').filter({ hasText: 'Where is my project?' }).click();
  await expect(page.getByText('The public homepage is separate', { exact: false })).toBeVisible();
  await page.goto('/product');
  await expect(page.getByRole('heading', { name: 'From a first thought to a coherent website.' })).toBeVisible();
});

test('localhost signup resumes onboarding and incomplete accounts stay out of the dashboard', async ({ page }) => {
  await page.goto('http://localhost:3000/signup');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page).toHaveURL('http://localhost:3000/onboarding');
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL('http://localhost:3000/onboarding');
  await page.goto('http://localhost:3000/signin');
  await expect(page).toHaveURL('http://localhost:3000/onboarding');
});
