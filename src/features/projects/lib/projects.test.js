import { describe, expect, it } from 'vitest';
import { validateProjects } from './projects';

const valid = { id: 'sample', title: 'Sample', summary: 'A sample project', contribution: '', image: null, stack: ['Next.js'], demoUrl: null, codeUrl: null, isExample: true };

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
  it('requires example flag', () => {
    expect(validateProjects([{ ...valid, isExample: undefined }]).join(' ')).toMatch(/isExample/);
  });
});
