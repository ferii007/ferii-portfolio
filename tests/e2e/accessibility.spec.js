import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { id } from '../../src/constants/languages/id.js';
import { en } from '../../src/constants/languages/en.js';

const viewports = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };

// WCAG 2.2 A/AA plus axe best practices, on both languages and both layouts. Colour contrast over the paper
// textures can't be judged by axe (pseudo-element backgrounds); it was measured against rendered pixels instead.
for (const path of ['/', '/en']) {
  for (const [name, viewport] of Object.entries(viewports)) {
    test(`no axe violations on ${path} (${name})`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(path, { waitUntil: 'networkidle' });
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .exclude('nextjs-portal') // Next's dev-only overlay
        .analyze();
      expect(results.violations.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`)).toEqual([]);
    });
  }
}

test('keyboard users can skip the navigation and reach every interactive part', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: id.skip_to_content });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();

  // Skill cards open their dialog from the keyboard and return focus on Escape.
  const card = page.getByRole('button', { name: 'HTML', exact: true });
  await card.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(card).toBeFocused();

  // Beyond Coding cards answer through the robot when activated with the keyboard.
  await page.getByRole('button', { name: new RegExp(id.beyond_stories_title) }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.robot-speech-bubble')).toContainText(id.beyond_stories_message);

  // The language switch is a reachable link whose name starts with its visible code.
  const toggle = page.locator('.header-language');
  await toggle.focus();
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAccessibleName(`EN (${id.language_switch})`);
});

test('the English skip link is translated too', async ({ page }) => {
  await page.goto('/en', { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: en.skip_to_content })).toBeFocused();
});
