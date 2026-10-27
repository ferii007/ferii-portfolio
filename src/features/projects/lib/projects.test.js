import { describe, expect, it } from 'vitest';
import { validateProjects } from './projects';

const valid = { id: 'sample', title: 'Sample', summary: 'A sample project', contribution: '', image: null, stack: ['Next.js'], category: 'featured', demoUrl: null, codeUrl: null, isExample: true };

describe('project data contract', () => {
  it('accepts a complete example without external links', () => {
    expect(validateProjects([valid])).toEqual([]);
  });
  it('rejects duplicate IDs', () => {
    expect(validateProjects([valid, { ...valid }]).join(' ')).toMatch(/duplicate/i);
  });
  it('rejects missing required fields', () => {
    expect(validateProjects([{ ...valid, title: '', stack: [] }]).join(' ')).toMatch(/title|stack/i);
  });
  it('rejects invalid optional links', () => {
    expect(validateProjects([{ ...valid, demoUrl: 'not-a-url' }]).join(' ')).toMatch(/demoUrl/);
  });
  it('requires every contract field even when its value may be null', () => {
    const { image, ...incomplete } = valid;
    expect(validateProjects([incomplete]).join(' ')).toMatch(/image/);
  });
  it('rejects a missing project image when image checks are enabled', () => {
    expect(validateProjects([{ ...valid, image: '/images/projects/missing.webp' }], { checkImages: true }).join(' ')).toMatch(/image file is missing/);
  });
  it('requires example flag', () => {
    expect(validateProjects([{ ...valid, isExample: undefined }]).join(' ')).toMatch(/isExample/);
  });
  it('rejects unknown categories instead of silently hiding a project', () => {
    expect(validateProjects([{ ...valid, category: 'unknown' }]).join(' ')).toMatch(/category/);
  });
  it('accepts an optional presentation and rejects unknown ones', () => {
    expect(validateProjects([{ ...valid, presentation: 'feature' }])).toEqual([]);
    expect(validateProjects([{ ...valid, presentation: 'hero' }]).join(' ')).toMatch(/presentation/);
  });
  it('allows an empty stack when the technologies have not been confirmed', () => {
    expect(validateProjects([{ ...valid, stack: [] }])).toEqual([]);
  });
});
