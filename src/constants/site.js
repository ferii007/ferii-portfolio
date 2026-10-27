// Fixed facts: written once here, never in the language files. Anything a visitor reads that is the same in every
// language lives here; anything that changes per language lives in ./languages/*.js.

export const PERSON = {
	firstName: "Feri",
	lastName: "Ramdani",
	nickname: "Pei",
	role: "Full Stack Developer",
};
PERSON.name = `${PERSON.firstName} ${PERSON.lastName}`;

export const SITE_URL = "https://feriramdani.my.id";

export const SOCIAL = {
	github: { label: "GitHub", url: "https://github.com/ferii007" },
	linkedin: { label: "LinkedIn", url: "https://www.linkedin.com/in/feri-ramdani/" },
};

// Theme colours read outside CSS (manifest, browser theme colour). RootDocument publishes them as the CSS tokens
// --color-canvas / --color-heading, so tokens.css doesn't repeat them.
export const THEME = {
	canvas: "#F8F5EF",
	heading: "#081827",
};

// Section anchors, titles (English by design, in both languages), menu labels and the spark beside each title.
export const SECTIONS = {
	top: { id: "top" },
	hero: { id: "hero" },
	about: { id: "about", title: "About Me", nav: "About", spark: "sparkTitle" },
	currently: { id: "currently", title: "Currently", spark: "sparkTitle" },
	skills: { id: "skills", title: "My Skills", nav: "Skills", spark: "sparkTitle" },
	journey: { id: "journey", title: "My Journey", nav: "Journey", spark: "sparkJourney" },
	projects: { id: "projects", title: "Some things I’ve worked on", nav: "Projects" },
	beyond: { id: "beyond", title: "Beyond Coding" },
	contact: { id: "contact", title: "Contact Me", nav: "Contact", spark: "sparkTitle" },
};
SECTIONS.beyond.nav = SECTIONS.beyond.title;

export const NAV_SECTIONS = ["about", "skills", "journey", "projects", "beyond"];

export const anchor = (section) => `#${SECTIONS[section].id}`;

// Header and mobile menu links (Contact has its own button).
export const NAV_LINKS = NAV_SECTIONS.map((section) => ({ href: anchor(section), label: SECTIONS[section].nav }));

// Short fixed labels that read the same in every language.
export const LABELS = {
	heroGreeting: "Hello, World!",
	skillKicker: "Stack explorer",
	email: "Email",
	notFoundCode: "Error 404",
	letterGreeting: `Hi, ${PERSON.firstName}!`,
	logo: PERSON.firstName.toLowerCase(),
};

// Skills named in the SEO description, by id from features/skills/data/skills.json.
export const HIGHLIGHT_SKILLS = ["laravel", "react", "nextjs"];

// Share images live in public/og with fixed URLs (file-convention images get hashed names inside route groups).
export const OG_IMAGES = {
	id: "/og/feri-ramdani-id.png",
	en: "/og/feri-ramdani-en.png",
	width: 1200,
	height: 630,
};

// Cards whose copy lives in the language files under keys built from their id.
export const CURRENTLY_ITEMS = ["building", "learning", "exploring"];
export const BEYOND_CARDS = [
	{ id: "stories", image: "/images/beyond/notebook.webp" },
	{ id: "moments", image: "/images/beyond/mountains.webp" },
];
