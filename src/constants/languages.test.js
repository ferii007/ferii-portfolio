import { describe, expect, it } from 'vitest';
import Localization, { getLocalization, interpolate, languages, localeKey } from './localization';
import { getLanguage, LANGUAGES, resolveLanguageCode } from './languages';
import projects from '../features/projects/data/projects.json';
import categories from '../features/projects/data/categories.json';
import journey from '../features/portfolio/data/journey.json';
import { site } from '../content/site';

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
      ...journey.flatMap((item) => ['period', 'title', 'role', 'description'].map((field) => localeKey('journey', item.id, field))),
      ...site.beyond.flatMap((item) => ['title', 'detail', 'message'].map((field) => `beyond_${item.id}_${field}`)),
      ...site.currently.flatMap((item) => ['title', 'detail'].map((field) => `currently_${item}_${field}`)),
    ];
    for (const [code, strings] of Object.entries(languages)) {
      for (const key of required) expect(strings, `${code} is missing ${key}`).toHaveProperty(key);
    }
  });

  it('falls back to the base language and fills placeholders', () => {
    expect(new Localization('fr').language).toBe('id');
    expect(getLocalization('en').locale).toBe('en-US');
    expect(getLocalization('id').text.nav_open_menu).toBe('Buka navigasi');
    expect(interpolate('Tentang {name}', { name: 'HTML' })).toBe('Tentang HTML');
    expect(interpolate('{missing} stays', {})).toBe('{missing} stays');
  });
});
