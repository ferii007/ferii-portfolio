// Same shape as rebill_backoffice_fe's LANGUAGES. Each language also owns a URL, so search engines can index
// both versions: Indonesian stays at "/" (the existing address) and English lives at "/en".
export const LANGUAGES = [
	{ value: "id", label: "Bahasa Indonesia", short: "ID", path: "/", locale: "id-ID" },
	{ value: "en", label: "English", short: "EN", path: "/en", locale: "en-US" },
];

export const DEFAULT_LANGUAGE = "id";

export const LANGUAGE_ALIASES = {
	in: "id",
};

export function resolveLanguageCode(languageCode) {
	const normalized = String(languageCode || "")
		.trim()
		.toLowerCase()
		.split("-")[0];

	return LANGUAGE_ALIASES[normalized] || normalized;
}

export function getLanguage(languageCode) {
	const code = resolveLanguageCode(languageCode);
	return LANGUAGES.find((language) => language.value === code) || LANGUAGES.find((language) => language.value === DEFAULT_LANGUAGE);
}
