import { describe, expect, it } from 'vitest';
import Localization, { getLocalization, interpolate, languages, localeKey } from './localization';
import { getLanguage, LANGUAGES, resolveLanguageCode } from './languages';
import projects from '../features/projects/data/projects.json';
import categories from '../features/projects/data/categories.json';
import journey from '../features/portfolio/data/journey.json';
import { BEYOND_CARDS, CURRENTLY_ITEMS, PERSON } from './site';

const placeholders = (value) => [...String(value).matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((match) => match[1]).sort();

describe('localization', () => {
  it('maps browser-style codes to supported languages', () => {
    expect(resolveLanguageCode('id-ID')).toBe('id');
    expect(resolveLanguageCode('in')).toBe('id');
    expect(resolveLanguageCode('EN-us')).toBe('en');
    expect(getLanguage('fr').value).toBe('id');
    expect(getLanguage('en').path).toBe('/en');
  });

  it('has a locale file for every listed language', () => {
    expect(Object.keys(languages).sort()).toEqual(LANGUAGES.map((language) => language.value).sort());
  });

  it('keeps the same keys and placeholders in every language', () => {
    const base = languages.id;
    for (const [code, strings] of Object.entries(languages)) {
      expect(Object.keys(strings).sort(), code).toEqual(Object.keys(base).sort());
      for (const key of Object.keys(base)) {
        expect(typeof strings[key], `${code}.${key}`).toBe('string');
        expect(strings[key].trim(), `${code}.${key}`).not.toBe('');
        expect(placeholders(strings[key]), `${code}.${key}`).toEqual(placeholders(base[key]));
      }
    }
  });

  it('has copy for every data record in every language', () => {
    const required = [
      ...projects.map((project) => localeKey('project', project.id, 'contribution')),
      ...categories.flatMap((category) => ['title', 'note'].map((field) => localeKey('category', category.id, field))),
      // Fixed job titles live in journey.json (`roles`); only a role that needs translating is copy.
      ...journey.flatMap((item) => ['title', 'description', ...(item.roles ? [] : ['role'])].map((field) => localeKey('journey', item.id, field))),
      ...BEYOND_CARDS.flatMap((item) => ['title', 'detail', 'message'].map((field) => `beyond_${item.id}_${field}`)),
      ...CURRENTLY_ITEMS.flatMap((item) => ['title', 'detail'].map((field) => `currently_${item}_${field}`)),
    ];
    for (const [code, strings] of Object.entries(languages)) {
      for (const key of required) expect(strings, `${code} is missing ${key}`).toHaveProperty(key);
    }
  });

  // Copy that reads the same in every language is a fixed fact, so it belongs in ./site.js, not here.
  it('has no copy that is identical in every language', () => {
    const [first, ...others] = Object.values(languages);
    const identical = Object.keys(first).filter((key) => others.every((strings) => strings[key] === first[key]));
    expect(identical).toEqual([]);
  });

  it('does not repeat the same copy under two keys', () => {
    for (const [code, strings] of Object.entries(languages)) {
      const seen = {};
      for (const [key, value] of Object.entries(strings)) (seen[value] ??= []).push(key);
      expect(Object.values(seen).filter((keys) => keys.length > 1), code).toEqual([]);
    }
  });

  it('never types the person\'s name or role into the copy', () => {
    for (const [code, strings] of Object.entries(languages)) {
      for (const [key, value] of Object.entries(strings)) {
        for (const fact of [PERSON.name, PERSON.firstName, PERSON.role]) expect(value.includes(fact), `${code}.${key} contains "${fact}"`).toBe(false);
      }
    }
  });

  // {name}, {role}, … are filled from PERSON before any component sees the text, so a key that means something else
  // (a skill, a project title) must use its own placeholder, or it would silently show the person's name.
  it('keeps PERSON placeholders for the person only', () => {
    const personKeys = Object.keys(PERSON);
    const personCopy = ['logo_back_to_top', 'not_found_logo', 'hero_robot_label', 'robot_fallback_alt', 'about_lead', 'footer_copyright', 'seo_description', 'seo_share_description', 'chat_title', 'chat_intro', 'chat_quick_experience', 'chat_quick_projects', 'chat_quick_contact', 'chat_answer_experience', 'chat_placeholder'];
    for (const [code, strings] of Object.entries(languages)) {
      for (const [key, value] of Object.entries(strings)) {
        if (personKeys.some((field) => placeholders(value).includes(field))) expect(personCopy, `${code}.${key} uses a PERSON placeholder`).toContain(key);
      }
    }
    expect(interpolate(getLocalization('id').text.skill_dialog_about, { skill: 'HTML' })).toBe('Tentang HTML');
  });

  it('falls back to the base language and fills placeholders', () => {
    expect(new Localization('fr').language).toBe('id');
    expect(getLocalization('en').locale).toBe('en-US');
    expect(getLocalization('id').text.nav_open_menu).toBe('Buka navigasi');
    expect(interpolate('Tentang {name}', { name: 'HTML' })).toBe('Tentang HTML');
    expect(interpolate('{missing} stays', {})).toBe('{missing} stays');
  });
});
