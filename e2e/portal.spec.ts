import { test, expect } from '@playwright/test';

test.describe('Portal loading and app cards', () => {
  test('displays app cards from apps.json', async ({ page }) => {
    await page.goto('/');

    // Wait for the app card to appear
    const card = page.locator('app-card');
    await expect(card).toHaveCount(1);

    // Verify card content from apps.json
    await expect(card.locator('.card__name')).toHaveText('DroneMesh3D');
    await expect(card.locator('.card__description')).toContainText('Aplikacja do planowania lotów dronów');
    await expect(card.locator('.card__status')).toHaveText('Aktywna');

    // Verify the link points to the correct URL
    const link = card.locator('a.card__link');
    await expect(link).toHaveAttribute('href', 'https://dronemesh3d.picoder.top');
    await expect(link).toHaveAttribute('target', '_blank');
  });

  test('displays header with PiCoder branding', async ({ page }) => {
    await page.goto('/');

    const logo = page.locator('.header__logo');
    await expect(logo).toHaveText('PiCoder');
  });

  test('displays footer with author info and GitHub link', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('app-footer footer');
    await expect(footer).toBeVisible();

    const githubLink = footer.locator('a.github-link');
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/piotrkorniak');
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

test.describe('Theme toggle', () => {
  test('switches between light and dark theme', async ({ page }) => {
    await page.goto('/');

    const body = page.locator('body');
    const toggleButton = page.locator('app-theme-toggle button');

    // Initial theme should be light (default when no localStorage preference)
    await expect(body).toHaveClass(/theme-light/);
    await expect(toggleButton).toHaveAttribute('aria-checked', 'false');

    // Click toggle to switch to dark
    await toggleButton.click();
    await expect(body).toHaveClass(/theme-dark/);
    await expect(toggleButton).toHaveAttribute('aria-checked', 'true');

    // Click toggle again to switch back to light
    await toggleButton.click();
    await expect(body).toHaveClass(/theme-light/);
    await expect(toggleButton).toHaveAttribute('aria-checked', 'false');
  });

  test('persists theme preference across page reloads', async ({ page }) => {
    await page.goto('/');

    const body = page.locator('body');
    const toggleButton = page.locator('app-theme-toggle button');

    // Switch to dark theme
    await toggleButton.click();
    await expect(body).toHaveClass(/theme-dark/);

    // Reload the page
    await page.reload();

    // Theme should persist as dark
    await expect(page.locator('body')).toHaveClass(/theme-dark/);
  });
});

test.describe('Responsive layout', () => {
  test('shows 1 column at viewport <600px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const grid = page.locator('.app-grid');
    await expect(grid).toBeVisible();

    const columns = await grid.evaluate((el) => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });

    // Should be single column (one value)
    const columnCount = columns.split(' ').length;
    expect(columnCount).toBe(1);
  });

  test('shows 2 columns at viewport 600-1024px', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    const grid = page.locator('.app-grid');
    await expect(grid).toBeVisible();

    const columns = await grid.evaluate((el) => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });

    // Should be two columns (two values)
    const columnCount = columns.split(' ').length;
    expect(columnCount).toBe(2);
  });

  test('shows 3 columns at viewport >1024px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const grid = page.locator('.app-grid');
    await expect(grid).toBeVisible();

    const columns = await grid.evaluate((el) => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });

    // Should be three columns (three values)
    const columnCount = columns.split(' ').length;
    expect(columnCount).toBe(3);
  });
});

test.describe('Keyboard navigation', () => {
  test('Tab navigates through skip-link, logo, toggle, cards, footer', async ({ page }) => {
    await page.goto('/');

    // First Tab should focus the skip-to-content link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a.skip-to-content');
    await expect(skipLink).toBeFocused();

    // Second Tab: header logo button
    await page.keyboard.press('Tab');
    const logo = page.locator('.header__logo');
    await expect(logo).toBeFocused();

    // Third Tab: theme toggle button
    await page.keyboard.press('Tab');
    const toggle = page.locator('app-theme-toggle button');
    await expect(toggle).toBeFocused();

    // Fourth Tab: card link (active card has an <a> link)
    await page.keyboard.press('Tab');
    const cardLink = page.locator('a.card__link');
    await expect(cardLink).toBeFocused();

    // Fifth Tab: footer GitHub link
    await page.keyboard.press('Tab');
    const githubLink = page.locator('a.github-link');
    await expect(githubLink).toBeFocused();
  });
});
