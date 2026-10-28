import { expect, test } from '@playwright/test';
import projects from '../../src/features/projects/data/projects.json' with { type: 'json' };
import { id } from '../../src/constants/languages/id.js';
import { en } from '../../src/constants/languages/en.js';
import { LABELS, PERSON, SECTIONS, SITE_URL } from '../../src/constants/site.js';
import { interpolate, localeKey } from '../../src/constants/localization.js';

const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const named = (value) => new RegExp(escape(value), 'i');

test('hero does not flash a flat image while the 3D model loads', async ({ page }) => {
  let releaseModel;
  const modelHeld = new Promise((resolve) => { releaseModel = resolve; });
  await page.route('**/feri-robot-rigged.glb', async (route) => {
    await modelHeld;
    await route.continue();
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const robot = page.locator('.robot-hero');
  await expect(robot).toBeVisible();
  // The canvas mounts once the lazily loaded three.js chunk arrives, which a busy dev server can take a while to serve.
  await expect(robot.locator('canvas')).toHaveCount(1, { timeout: 30_000 });
  await expect(robot.getByTestId('robot-fallback')).toHaveCount(0);
  releaseModel();
  await expect(robot).toHaveClass(/robot-ready/);
});

test('robot asset failure keeps the portfolio usable', async ({ page }) => {
  await page.route('**/feri-robot-rigged.glb', (route) => route.abort());
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.getByTestId('robot-fallback')).toBeVisible();
  await page.getByRole('link', { name: named(id.hero_cta_projects) }).click();
  await expect(page).toHaveURL(/#projects$/);
  await page.getByRole('link', { name: named(SECTIONS.contact.nav) }).first().click();
  await expect(page).toHaveURL(/#contact$/);
});

test('hero renders the GLB and clicking the robot changes its face', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'networkidle' });
  const robot = page.locator('.robot-hero');
  await expect(robot.locator('canvas')).toBeVisible();
  await expect(robot.getByTestId('robot-fallback')).toHaveCount(0);
  await expect(page.locator('.robot-control')).toHaveCount(0);
  const before = await robot.locator('canvas').screenshot();
  await page.getByRole('button', { name: named(id.robot_change_expression) }).click();
  await expect(robot).toHaveAttribute('data-expression', 'deadpan');
  // The canvas mounts once the lazily loaded three.js chunk arrives, which a busy dev server can take a while to serve.
  await expect(robot.locator('canvas')).toHaveCount(1, { timeout: 30_000 });
  await expect(robot.getByTestId('robot-fallback')).toHaveCount(0);
  const after = await robot.locator('canvas').screenshot();
  expect(after.equals(before)).toBe(false);
});

test('latest selected skill wins when an earlier Wikipedia request finishes later', async ({ page }) => {
  await page.route('**/page/summary/HTML', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ title: 'HTML', extract: 'First response' }) });
  });
  await page.route('**/page/summary/CSS', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ title: 'CSS', extract: 'Second response' }) }));
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'HTML' }).click();
  await page.getByRole('button', { name: 'CSS', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Second response');
  await page.waitForTimeout(850);
  await expect(page.getByRole('dialog')).not.toContainText('First response');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'CSS', exact: true })).toBeFocused();
});

test('skill detail shows a skeleton and closes only for outside clicks', async ({ page }) => {
  let releaseSummary;
  const summaryHeld = new Promise((resolve) => { releaseSummary = resolve; });
  await page.route('**/page/summary/HTML', async (route) => {
    await summaryHeld;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ title: 'HTML', extract: 'Loaded skill summary.' }) });
  });
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'HTML', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.locator('.skill-skeleton-lines')).toBeVisible();
  // While loading only the skeleton is visible; the loading message is there for screen readers only.
  await expect(dialog.getByText(id.skill_dialog_loading)).toHaveClass(/fp-visually-hidden/);
  await dialog.getByRole('heading', { name: interpolate(id.skill_dialog_about, { skill: 'HTML' }) }).click();
  await expect(dialog).toBeVisible();
  releaseSummary();
  await expect(dialog).toContainText('Loaded skill summary.');
  await expect(dialog.locator('.skill-skeleton')).toHaveCount(0);
  await page.locator('.skills-handnote').click();
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('Wikipedia failure and demo contact remain honest', async ({ page }) => {
  await page.route('**/page/summary/HTML', (route) => route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'HTML', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(id.skill_dialog_error);
  await expect(page.getByRole('button', { name: id.skill_dialog_retry })).toBeVisible();
  await page.getByRole('button', { name: id.skill_dialog_close }).click();
  await page.locator('#contact').scrollIntoViewIfNeeded();
  const submit = page.getByRole('button', { name: id.contact_submit });
  await expect(submit).toBeDisabled();
  await page.getByLabel(id.contact_name).fill('Pengunjung');
  await page.getByLabel(LABELS.email).fill('visitor@example.com');
  await expect(submit).toBeDisabled();
  await page.getByLabel(id.contact_message).fill('Halo');
  await expect(submit).toBeEnabled();
  const sent = [];
  page.on('request', (request) => { if (request.method() !== 'GET') sent.push(request.url()); });
  const beforeEnter = page.url();
  await page.getByLabel(LABELS.email).press('Enter');
  await expect(page).toHaveURL(beforeEnter);
  // Local simulation only: the bubble says so, the form resets, and nothing leaves the browser.
  await expect(page.locator('.robot-speech-bubble')).toContainText(id.contact_sent_message);
  await expect(page.getByLabel(id.contact_name)).toHaveValue('');
  await expect(page.getByLabel(id.contact_message)).toHaveValue('');
  await expect(submit).toBeDisabled();
  expect(sent).toEqual([]);
});

test('mobile companion does not cover the contact submit button', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('.robot-companion')).toBeVisible();
  const positions = await page.evaluate(() => {
    const robot = document.querySelector('.robot-companion').getBoundingClientRect();
    const button = document.querySelector('.contact-form button').getBoundingClientRect();
    return { overlapsButton: robot.bottom > button.top && robot.top < button.bottom && robot.right > button.left && robot.left < button.right, horizontalOverflow: document.documentElement.scrollWidth > innerWidth };
  });
  expect(positions).toEqual({ overlapsButton: false, horizontalOverflow: false });
});

test('mobile navigation closes after selecting a section', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.getByLabel(id.nav_open_menu).click();
  await page.locator('.mobile-menu-links').getByRole('link', { name: SECTIONS.projects.nav }).click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open');
  const headingTop = await page.locator('#projects-title').evaluate((element) => element.getBoundingClientRect().top);
  const headerBottom = await page.locator('.site-header').evaluate((element) => element.getBoundingClientRect().bottom);
  expect(headingTop).toBeGreaterThan(headerBottom);
});

test('every project contribution is readable by scrolling, without extra controls', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const section = page.locator('#projects');
  await expect(section.locator('article.project')).toHaveCount(projects.length);
  for (const project of projects) {
    const story = section.getByText(id[localeKey('project', project.id, 'contribution')], { exact: true });
    await story.scrollIntoViewIfNeeded();
    await expect(story).toBeVisible();
  }
  await expect(section.locator('details, [role="tablist"], [aria-roledescription="carousel"]')).toHaveCount(0);
  await expect(section.getByRole('link')).toHaveCount(0);
});

test('the English page is a full translation that search engines can pair with the Indonesian one', async ({ page }) => {
  await page.goto('/en', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE_URL}/en`);
  await expect(page.locator('link[rel="alternate"][hreflang="id-ID"]')).toHaveAttribute('href', SITE_URL);
  await expect(page.locator('.hero-copy')).toHaveText(en.hero_intro);
  await expect(page.getByRole('button', { name: en.contact_submit })).toBeDisabled();
  await expect(page.locator('#projects').getByText(en.project_elc_contribution, { exact: true })).toBeVisible();
  // No Indonesian UI copy leaks into the English page.
  for (const key of ['hero_intro', 'contact_submit', 'project_elc_contribution', 'journey_senja_solutions_description']) {
    await expect(page.getByText(id[key], { exact: true })).toHaveCount(0);
  }
});

test('the language switch moves between / and /en and keeps the section', async ({ page }) => {
  // Wait for hydration: before it the link still works, it just lands at the top of the other page.
  await page.goto('/#projects', { waitUntil: 'networkidle' });
  await page.locator('.header-language').click();
  await expect(page).toHaveURL(/\/en#projects$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
  await page.waitForLoadState('networkidle');
  await page.locator('.header-language').click();
  await expect(page).toHaveURL(/\/#projects$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'id-ID');
});

test('robot chat answers quick questions locally and falls back when the AI is down', async ({ page }) => {
  const answers = ['Websites, ', 'mostly.'];
  await page.route('**/api/chat', (route) => (answers.length ? route.fulfill({ status: 200, contentType: 'text/plain', body: answers.splice(0).join('') }) : route.fulfill({ status: 503 })));
  await page.goto('/en');
  await page.getByRole('button', { name: en.chat_open }).click();
  const chat = page.getByRole('dialog', { name: interpolate(en.chat_title, PERSON) });
  await expect(chat).toBeVisible();
  await expect(chat.getByRole('textbox')).toBeFocused();

  // Quick questions never call the AI.
  await chat.getByRole('button', { name: interpolate(en.chat_quick_contact, PERSON) }).click();
  await expect(chat.getByRole('link', { name: interpolate(en.chat_see_section, { section: SECTIONS.contact.nav }) })).toHaveAttribute('href', '#contact');

  const send = chat.getByRole('button', { name: en.chat_send });
  await expect(send).toBeDisabled();
  await chat.getByRole('textbox').fill(`What does ${PERSON.firstName} build?`);
  await send.click();
  await expect(chat.locator('.chat-message--robot').last()).toHaveText('Websites, mostly.');
  await chat.getByRole('textbox').fill('And after that?');
  await chat.getByRole('textbox').press('Enter');
  await expect(chat.locator('.chat-message--robot').last()).toHaveText(en.chat_unavailable);

  await page.keyboard.press('Escape');
  await expect(chat).toBeHidden();
  await page.getByRole('button', { name: en.chat_open }).click();
  await expect(chat).toContainText('Websites, mostly.');
});
