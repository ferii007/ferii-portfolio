import { existsSync } from 'node:fs';
import { join } from 'node:path';
import projects from '../data/projects.json';
import categories from '../data/categories.json';

export function validateProjects(records, { checkImages = false } = {}) {
  if (!Array.isArray(records)) return ['Projects data must be an array'];
  const errors = [];
  const ids = new Set();
  records.forEach((project, index) => {
    const label = `Project ${index + 1}`;
    if (!project || typeof project !== 'object') {
      errors.push(`${label} must be an object`);
      return;
    }
    for (const field of ['image', 'demoUrl', 'codeUrl', 'isExample']) {
      if (!Object.hasOwn(project, field)) errors.push(`${label}: ${field} field is required`);
    }
    for (const field of ['id', 'title', 'summary', 'category']) {
      if (typeof project[field] !== 'string' || !project[field].trim()) errors.push(`${label}: ${field} is required`);
    }
    if (project.id) {
      if (ids.has(project.id)) errors.push(`${label}: duplicate id ${project.id}`);
      ids.add(project.id);
    }
    if (!categories.some((category) => category.id === project.category)) errors.push(`${label}: category is invalid`);
    if (!Array.isArray(project.stack) || project.stack.some((item) => typeof item !== 'string' || !item.trim())) errors.push(`${label}: stack must be an array of technology names`);
    if (typeof project.isExample !== 'boolean') errors.push(`${label}: isExample must be boolean`);
    if (project.presentation != null && !['feature', 'compact'].includes(project.presentation)) errors.push(`${label}: presentation must be feature or compact`);
    for (const field of ['demoUrl', 'codeUrl']) {
      if (project[field] != null) {
        try {
          if (!['http:', 'https:'].includes(new URL(project[field]).protocol)) throw new Error();
        } catch { errors.push(`${label}: ${field} must be an HTTP URL or null`); }
      }
    }
    if (project.image != null) {
      if (typeof project.image !== 'string' || !project.image.startsWith('/images/projects/')) errors.push(`${label}: image must be under /images/projects/`);
      else if (checkImages && !existsSync(join(process.cwd(), 'public', project.image))) errors.push(`${label}: image file is missing`);
    }
  });
  return errors;
}

export function getProjects() {
  const errors = validateProjects(projects, { checkImages: true });
  if (errors.length) throw new Error(`Invalid projects.json:\n${errors.join('\n')}`);
  return projects;
}
