import { en } from './languages/en.js';
import { id } from './languages/id.js';
import { DEFAULT_LANGUAGE, resolveLanguageCode } from './languages.js';

const languages = {
	en,
	id,
};

const localeMap = {
	en: "en-US",
	id: "id-ID",
};

// Open Graph uses underscores (id_ID) where HTML uses hyphens (id-ID).
const openGraphLocaleMap = {
	en: "en_US",
	id: "id_ID",
};

// Same contract as rebill_backoffice_fe: `localization.text.some_key`, falling back to the base language for a
// missing key. The base here is Indonesian, the site's primary language.
class Localization {
	text = {}
	language = DEFAULT_LANGUAGE
	locale = localeMap[DEFAULT_LANGUAGE]
	openGraphLocale = openGraphLocaleMap[DEFAULT_LANGUAGE]

	constructor(region) {
		region = resolveLanguageCode(region);
		const baseLang = languages[DEFAULT_LANGUAGE];
		const selectedLang = languages[region];

		if (!selectedLang) {
			if (region) console.warn(`Language '${region}' not found, defaulting to '${DEFAULT_LANGUAGE}'`);
			this.text = baseLang;
			return;
		}

		this.language = region;
		this.locale = localeMap[region];
		this.openGraphLocale = openGraphLocaleMap[region];
		this.text = new Proxy(selectedLang, {
			get(obj, prop) {
				if (prop in obj) return obj[prop];

				return baseLang[prop];
			}
		});
	}
}

// Fills "{name}"-style placeholders, like rebill's interpolate helper.
export const interpolate = (template, values = {}) =>
	String(template).replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => (key in values ? values[key] : match));

// Data records use kebab-case ids ("rebill-pos"); locale keys use snake_case ("project_rebill_pos_contribution").
export const localeKey = (...parts) => parts.join("_").replaceAll("-", "_");

const cache = {};

// Server components read text directly; one instance per language is enough.
export function getLocalization(region) {
	const code = resolveLanguageCode(region) || DEFAULT_LANGUAGE;
	cache[code] ??= new Localization(code);
	return cache[code];
}

export { languages };
export default Localization;
