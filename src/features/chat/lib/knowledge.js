import journey from '@/features/portfolio/data/journey.json';
import projects from '@/features/projects/data/projects.json';
import skills from '@/features/skills/data/skills.json';
import { interpolate, localeKey } from '@/constants/localization';
import { CURRENTLY_ITEMS, HIGHLIGHT_SKILLS, PERSON, SITE_URL, SOCIAL } from '@/constants/site';
import { formatPeriod, journeyDescription, journeyRole } from '@/lib/journey';

// What the robot knows, built from the same data the page renders, so editing a project, a journey step or a skill
// updates the chat too. Quick answers are written from it without AI; free questions send it to the model.

// "Des\n2021–\nSekarang" → "Des 2021–Sekarang"
const oneLine = (value) => value.replace(/\n/g, ' ').replace(/– /g, '–');

const newestFirst = [...journey].reverse();
const journeyLine = (item, localization) => `${item.organization}, ${journeyRole(item, localization.text)} (${oneLine(formatPeriod(item.period, localization))})`;

const skillLabels = (ids) => ids.map((id) => skills.find((skill) => skill.id === id).label);
const otherSkills = skills.filter((skill) => !HIGHLIGHT_SKILLS.includes(skill.id)).map((skill) => skill.label);
const featuredProjects = projects.filter((project) => project.category === 'featured').map((project) => project.title);
const profiles = Object.values(SOCIAL);

// Quick questions: each answer points to the section that shows more.
export const QUICK_QUESTIONS = [
  { id: 'experience', section: 'journey' },
  { id: 'skills', section: 'skills' },
  { id: 'projects', section: 'projects' },
  { id: 'contact', section: 'contact' },
];

const quickValues = {
  experience: (localization) => ({ items: newestFirst.map((item) => `• ${journeyLine(item, localization)}`).join('\n') }),
  skills: (localization) => ({ highlight: localization.list(skillLabels(HIGHLIGHT_SKILLS)), others: localization.list(otherSkills) }),
  projects: (localization) => ({ projects: localization.list(featuredProjects) }),
  contact: (localization) => ({ profiles: localization.list(profiles.map((profile) => profile.label)) }),
};

export const quickAnswer = (id, localization) => interpolate(localization.text[localeKey('chat_answer', id)], quickValues[id](localization));

// Plain-text fact sheet for the model, in the page's language.
export function portfolioFacts(localization) {
  const { text } = localization;
  return [
    `Name: ${PERSON.name} (friends call him ${PERSON.firstName} or ${PERSON.nickname})`,
    `Role: ${PERSON.role}`,
    `Website: ${SITE_URL}`,
    `About: ${text.about_lead} ${text.about_detail}`,
    `Currently: ${CURRENTLY_ITEMS.map((item) => `${text[`currently_${item}_title`]} ${text[`currently_${item}_detail`]}`).join('; ')}`,
    'Journey (newest first):',
    ...newestFirst.map((item) => `- ${journeyLine(item, localization)}: ${journeyDescription(item, text)}`),
    `Main skills: ${skillLabels(HIGHLIGHT_SKILLS).join(', ')}`,
    `Other skills: ${otherSkills.join(', ')}`,
    'Projects:',
    ...projects.map((project) => `- ${project.title} [${project.stack.join(', ')}]${project.isExample ? ' (example)' : ''}: ${text[localeKey('project', project.id, 'contribution')]}`),
    `Profiles: ${profiles.map((profile) => `${profile.label} ${profile.url}`).join(', ')}`,
  ].join('\n');
}
