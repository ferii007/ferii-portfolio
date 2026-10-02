import { expect, test } from '@playwright/test';

test('robot asset failure keeps the portfolio usable', async ({ page }) => {
  await page.route('**/feri-robot-rigged.glb', (route) => route.abort());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('robot-fallback')).toBeVisible();
  await page.getByRole('link', { name: /Lihat proyek/i }).click();
  await expect(page).toHaveURL(/#projects$/);
  await page.getByRole('link', { name: /Contact/i }).first().click();
  await expect(page).toHaveURL(/#contact$/);
});

test('reduced motion keeps a static robot and expression control', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('robot-fallback')).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('button', { name: /ubah ekspresi robot/i }).click();
  await expect(page.getByTestId('robot-fallback')).toHaveAttribute('data-expression', 'deadpan');
});

test('latest selected skill wins when an earlier Wikipedia request finishes later', async ({ page }) => {
  await page.route('**/page/summary/HTML', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ title: 'HTML', extract: 'First response' }) });
  });
  await page.route('**/page/summary/CSS', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ title: 'CSS', extract: 'Second response' }) }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'HTML' }).click();
  await page.getByRole('button', { name: 'CSS', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Second response');
  await page.waitForTimeout(850);
  await expect(page.getByRole('dialog')).not.toContainText('First response');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'CSS', exact: true })).toBeFocused();
});

test('Wikipedia failure and demo contact remain honest', async ({ page }) => {
  await page.route('**/page/summary/HTML', (route) => route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'HTML', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Ringkasan belum bisa dimuat');
  await expect(page.getByRole('button', { name: 'Coba lagi' })).toBeVisible();
  await page.getByRole('button', { name: 'Tutup detail skill' }).click();
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.getByLabel('Nama').fill('Pengunjung');
  await page.getByLabel('Email').fill('visitor@example.com');
  await page.getByLabel('Pesan').fill('Halo');
  await expect(page.getByRole('button', { name: 'Pengiriman belum tersedia' })).toBeDisabled();
  await expect(page.locator('.demo-note')).toContainText('Demo — pengiriman belum tersedia');
});

test('mobile companion stays in the header without covering contact', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('.robot-companion')).toBeVisible();
  const positions = await page.evaluate(() => {
    const robot = document.querySelector('.robot-companion').getBoundingClientRect();
    const header = document.querySelector('.site-header').getBoundingClientRect();
    const button = document.querySelector('.contact-form button').getBoundingClientRect();
    return { inHeader: robot.top >= header.top && robot.bottom <= header.bottom, overlapsButton: robot.bottom > button.top && robot.top < button.bottom, horizontalOverflow: document.documentElement.scrollWidth > innerWidth };
  });
  expect(positions).toEqual({ inHeader: true, overlapsButton: false, horizontalOverflow: false });
});

test('mobile navigation closes after selecting a section', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByLabel('Buka navigasi').click();
  await page.locator('.mobile-menu-links').getByRole('link', { name: 'Projects' }).click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open');
  const headingTop = await page.locator('#projects-title').evaluate((element) => element.getBoundingClientRect().top);
  const headerBottom = await page.locator('.site-header').evaluate((element) => element.getBoundingClientRect().bottom);
  expect(headingTop).toBeGreaterThan(headerBottom);
});
