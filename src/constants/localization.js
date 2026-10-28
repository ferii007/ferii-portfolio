import { en } from './languages/en.js';
import { id } from './languages/id.js';
import { DEFAULT_LANGUAGE, getLanguage, resolveLanguageCode } from './languages.js';
import { PERSON } from './site.js';

const languages = {
	en,
	id,
};

// Fills "{name}"-style placeholders, like rebill's interpolate helper. Unknown placeholders are left as they are.
export const interpolate = (template, values = {}) =>
	String(template).replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => (key in values ? values[key] : match));

// The person's name and role are facts, not copy: every language file refers to them as {firstName}, {name}, …
const personValues = Object.fromEntries(Object.entries(PERSON).filter(([, value]) => typeof value === "string"));
const withPerson = (strings) => Object.fromEntries(Object.entries(strings).map(([key, value]) => [key, interpolate(value, personValues)]));

// Same contract as rebill_backoffice_fe: `localization.text.some_key`, falling back to the base language for a
// missing key. The base here is Indonesian, the site's primary language.
class Localization {
	text = {}
	language = DEFAULT_LANGUAGE

	constructor(region) {
		region = resolveLanguageCode(region);
		const baseLang = withPerson(languages[DEFAULT_LANGUAGE]);
		const selected = languages[region];

		if (!selected) {
			if (region) console.warn(`Language '${region}' not found, defaulting to '${DEFAULT_LANGUAGE}'`);
			this.text = baseLang;
			return;
		}

		this.language = region;
		this.text = new Proxy(withPerson(selected), {
			get(obj, prop) {
				if (prop in obj) return obj[prop];

				return baseLang[prop];
			}
		});
	}

	get locale() {
		return getLanguage(this.language).locale;
	}

	// Open Graph writes locales with an underscore (id_ID) where HTML uses a hyphen (id-ID).
	get openGraphLocale() {
		return this.locale.replace("-", "_");
	}

	// "Laravel, React, dan Next.js" / "Laravel, React, and Next.js"
	list(items) {
		return new Intl.ListFormat(this.locale, { type: "conjunction" }).format(items);
	}

	// "14.32" / "2:32 PM": the visitor's clock, in the page's language.
	time(date) {
		return new Intl.DateTimeFormat(this.locale, { hour: "numeric", minute: "2-digit" }).format(date);
	}

	month(year, month) {
		return new Intl.DateTimeFormat(this.locale, { month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, 1)));
	}
}

// Data records use kebab-case ids ("rebill-pos"); locale keys use snake_case ("project_rebill_pos_contribution").
export const localeKey = (...parts) => parts.join("_").replaceAll("-", "_");

// Page <title>: "<page> | Feri Ramdani"; the home page is "Feri Ramdani | Full Stack Developer".
export const pageTitle = (page) => (page ? `${page} | ${PERSON.name}` : `${PERSON.name} | ${PERSON.role}`);

const cache = {};

// Server components read text directly; one instance per language is enough.
export function getLocalization(region) {
	const code = resolveLanguageCode(region) || DEFAULT_LANGUAGE;
	cache[code] ??= new Localization(code);
	return cache[code];
}

export { languages };
export default Localization;
