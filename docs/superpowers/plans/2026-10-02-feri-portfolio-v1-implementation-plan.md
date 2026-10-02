# Feri Portfolio V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Feri Ramdani's new one-page portfolio in `/Users/senja/Desktop/test-1/feri-portfolio-next/` from the approved PRD and the new concept ZIP.

**Architecture:** Use Next.js App Router for the page shell and semantic content. Keep projects, Skills, robot, and contact in focused feature folders. An interaction provider connects the Skills dialog to the robot; the 3D canvas loads separately and has a PNG fallback.

**Tech Stack:** JavaScript/JSX, Next.js, React, Tailwind CSS, Three.js, React Three Fiber, Drei, Lucide React, Vitest for pure behavior tests, Playwright for critical browser flows.

**Spec:** `/Users/senja/Desktop/test-1/PRD-feri-portfolio-next.md` (approved 2 October 2026).

## Global Constraints

- The website is one page in `/Users/senja/Desktop/test-1/feri-portfolio-next/`.
- Use JavaScript/JSX. Do not introduce TypeScript.
- The new ZIP `feri-portfolio-all-assets.zip` supplies the design direction and robot assets. The old React project is historical reference, not implementation source.
- Projects come from `src/features/projects/data/projects.json`; adding a record must not require a component edit.
- Example projects and unverified personal content must carry a visible “Contoh” label.
- Contact form is a demo: no submission, storage, email API, or false success message.
- Content and navigation must work when the 3D canvas or Wikipedia fails.
- Prefer built-in browser/Next features to additional packages; add GSAP only if scroll choreography needs it after a working basic implementation.
- Use `@/` imports and domain-focused modules; do not add backend-style repositories/facades for local data.

## Review Focus

1. Duplicate project IDs or missing JSON fields must fail a data test, rather than produce unstable React keys (Task 2).
2. Rapidly selecting two skills must display the second result, even if the first request resolves last (Task 6).
3. A failed GLB/WebGL load must show the PNG robot and leave the page usable (Task 5).
4. Reduced-motion preference must suppress looping/moving robot animation without hiding its controls (Task 5).
5. At narrow widths, the floating robot and Skills dialog must not cover the close button, content, or Contact CTA (Tasks 6 and 8).

---

## File map and module boundaries

| Files | Responsibility |
| --- | --- |
| `src/app/{layout,page,globals}.jsx/css` | Metadata, global tokens, page composition; no robot or API logic. |
| `src/components/layout/{Header,Footer}.jsx` | Shared page chrome and anchor navigation. |
| `src/content/site.js` | Draft copy and example flags for non-project sections. |
| `src/features/portfolio/sections/*.jsx` | Static Hero, About, Currently, Journey, Beyond Coding sections. |
| `src/features/projects/{data/projects.json,lib/projects.js,components/*.jsx}` | Project contract, validation, grid/card rendering. |
| `src/features/interaction/{InteractionProvider,robotState}.jsx/js` | Small shared state between robot and Skills. |
| `src/features/robot/components/*.jsx` | Canvas, GLB actor, PNG fallback, optional beam; owns 3D-specific work. |
| `src/features/skills/{data/skills.js,lib/wiki.js,components/*.jsx}` | Explicit Wikipedia mapping, request function, grid and dialog. |
| `src/features/contact/components/ContactSection.jsx` | Social links and visibly non-functional form. |
| `public/{models,images}` | Copied assets from the new ZIP and project placeholder images. |
| `src/**/*.test.js(x)` | Focused behavior tests close to the owning module. |
| `tests/e2e/portfolio.spec.js` | Browser checks for fallback, Skills races, mobile layout, and contact behavior. |

### Task 1: Runnable Next.js foundation and semantic shell

**Files:** Create `package.json`, `package-lock.json`, `next.config.mjs`, `jsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `playwright.config.js`, `src/app/layout.jsx`, `src/app/page.jsx`, `src/app/globals.css`, `src/components/layout/Header.jsx`, `src/components/layout/Footer.jsx`.

**Interfaces:** Produces `@/` alias and scripts `npm run dev`, `npm run lint`, `npm run build`, `npm run test` (Vitest), and `npm run test:e2e` (Playwright). `page.jsx` is the composition root for later sections.

- [ ] Create the Next.js JavaScript App Router project inside the exact target directory; install only the PRD's core dependencies plus Vitest and Playwright as test dependencies. Configure scripts and Tailwind/PostCSS using their current compatible stable releases.
- [ ] Add semantic `<main>`, header anchor navigation, footer, theme tokens, and a visible text-first Hero shell. No canvas yet.
- [ ] Run `npm run lint` and `npm run build`; both must exit 0 and render `/` with Feri's name and a working Projects anchor.
- [ ] Commit foundation as `chore: initialize portfolio app` if this directory is initialized as its own Git repository; otherwise record the completed file set before the next task.

### Task 2: JSON project contract and cards

**Files:** Create `src/features/projects/data/projects.json`, `src/features/projects/lib/projects.js`, `src/features/projects/lib/projects.test.js`, `src/features/projects/components/ProjectCard.jsx`, `src/features/projects/components/ProjectsSection.jsx`; modify `src/app/page.jsx`.

**Interfaces:** `validateProjects(projects)` returns an array of error strings. `getProjects()` validates and returns the imported records in JSON order, throwing on invalid data so the build fails. `ProjectCard({project})` renders optional links only when their URLs are non-null.

- [ ] Write failing `projects.test.js` assertions for valid records, duplicate `id`, missing required fields, absent optional links, and an `isExample: true` record.
- [ ] Run `npm run test -- src/features/projects/lib/projects.test.js`; expect the new tests to fail before implementation.
- [ ] Implement the validator and add example projects in JSON based on the new ZIP's concept labels. Use `image: null` and a designed placeholder when no separate thumbnail exists; do not crop the composite mockup into a claimed project screenshot.
- [ ] Render the grid/cards from `getProjects()`, display the “Contoh” marker, and omit buttons with null destinations. Do not put project-specific branches in the component.
- [ ] Run the focused test, lint, and build. Add a new JSON record temporarily to confirm it appears without editing a component, then remove that temporary record.
- [ ] Commit as `feat: render projects from JSON` if Git is available.

### Task 3: Complete static one-page content and demo contact

**Files:** Create `src/content/site.js`, `src/features/portfolio/sections/{HeroSection,AboutSection,CurrentlySection,JourneySection,BeyondCodingSection}.jsx`, `src/features/contact/components/ContactSection.jsx`; modify `src/app/page.jsx`, `src/components/layout/Header.jsx`, `src/app/globals.css`.

**Interfaces:** `site.js` exports text and example flags for the five sections plus contact labels; the sections consume their content without direct imports from the old app.

- [ ] Add the eight sections in PRD order and update anchor navigation. Write new copy guided by the current brief/mockup; mark illustrative Currently, Journey, and Beyond Coding content as “Contoh”.
- [ ] Add contact social links only when their exact destinations have been checked; otherwise omit the link. Create the form layout with editable fields, a visible demo label, and a disabled/non-sending action.
- [ ] Check desktop and 390px layout in a browser: heading order, two Hero CTAs, navigable mobile menu, all sections, and no horizontal scroll. Correct visual defects before the next task.
- [ ] Run `npm run lint` and `npm run build`; build must succeed without any 3D code.
- [ ] Commit as `feat: add one-page portfolio content` if Git is available.

### Task 4: Shared robot/Skills interaction state

**Files:** Create `src/features/interaction/robotState.js`, `src/features/interaction/robotState.test.js`, `src/features/interaction/InteractionProvider.jsx`; modify `src/app/page.jsx`.

**Interfaces:** State `{ location: 'hero'|'companion', expression: 'happy'|'deadpan'|'side-eye'|'panic', activeSkillId: string|null, previousExpression: string|null }`. Reducer events: `HERO_VISIBILITY_CHANGED`, `ROBOT_CLICKED`, `SKILL_OPENED`, `SKILL_CLOSED`. Provider exposes `usePortfolioInteraction()` returning state plus `setHeroVisible(visible)`, `cycleExpression()`, `openSkill(id)`, `closeSkill()`.

- [ ] Write failing reducer tests for Hero → companion → Hero, four-expression click cycle, skill open/close with previous-expression restoration, and robot clicks while a skill is open.
- [ ] Run the focused test and confirm failure.
- [ ] Implement the reducer/provider with the signatures above. Wrap the composed page through the provider while preserving server-rendered section children.
- [ ] Run focused tests, lint, and build; expect all to pass.
- [ ] Commit as `feat: coordinate portfolio interactions` if Git is available.

### Task 5: Robot GLB, expression controls, and fallback

**Files:** Copy `feri-robot-rigged.glb` to `public/models/`; copy four PNG expressions to `public/images/robot/`. Create `src/features/robot/components/{RobotExperience,RobotCanvas,RobotModel,RobotFallback,RobotErrorBoundary}.jsx`, `tests/e2e/portfolio.spec.js`; modify `src/app/page.jsx`, `src/app/globals.css`.

**Interfaces:** `RobotExperience` reads `usePortfolioInteraction()`. `RobotModel({expression, projecting})` uses the GLB's Idle/Wave/Project/Face_* clips and morphs. `RobotFallback({expression})` uses the matching PNG.

- [ ] Add failing Playwright checks in `tests/e2e/portfolio.spec.js`: block `**/feri-robot-rigged.glb` and assert fallback plus usable Projects/Contact links; emulate reduced motion and assert a static robot plus usable expression control. Run `npm run test:e2e` and confirm failure before implementing.
- [ ] Load the canvas only on the client and keep it outside the page's essential content. Observe Hero visibility and place the robot in Hero or corner companion mode; keyboard/tap control cycles expressions.
- [ ] Use the model's real clip/morph names from its README. Crossfade body states; prevent competing face tracks from overriding the chosen expression. Do not load a remote HDR preset.
- [ ] Implement error boundary and reduced-motion PNG/static behavior. Ensure fallback occurs on model/WebGL failure without blanking the page.
- [ ] Run browser checks on desktop and mobile, then lint/build. Inspect the actual appearance against the selected mockup and record the known model-fidelity gap.
- [ ] Commit as `feat: add interactive robot with fallback` if Git is available.

### Task 6: Skills data, Wikipedia request, and accessible dialog

**Files:** Create `src/features/skills/data/skills.js`, `src/features/skills/lib/wiki.js`, `src/features/skills/lib/wiki.test.js`, `src/features/skills/components/{SkillsSection,SkillCard,SkillDialog}.jsx`; modify `src/app/page.jsx`, `tests/e2e/portfolio.spec.js`.

**Interfaces:** Each skill record has `{id, label, wikiTitle, iconLabel}`. `fetchSkillSummary(wikiTitle, {signal, fetchImpl})` returns `{title, extract, url}` or throws a typed request/not-found error. `SkillDialog({skill, onClose})` owns loading, success, not-found, and error views.

- [ ] Write failing Vitest API tests for successful plain-text summary, not found, network failure, and abort. Add a Playwright check with intercepted Wikipedia requests where the first of two requests resolves last and the dialog still shows the second skill.
- [ ] Run the focused tests and confirm failure.
- [ ] Implement explicit mappings and a client-side request to Wikimedia. Abort stale requests when selection changes; never render remote HTML. Skills cards are buttons with visible focus styles.
- [ ] Implement dialog close button, Escape, focus return, retry, and source link. `openSkill(id)` and `closeSkill()` update the robot through the provider.
- [ ] Run focused tests, lint/build, then manually verify narrow-screen dialog placement and keyboard flow.
- [ ] Commit as `feat: add Wikipedia Skills dialog` if Git is available.

### Task 7: Hologram projection and visual refinement

**Files:** Create `src/features/robot/components/HologramBeam.jsx`; modify `RobotModel.jsx`, `RobotExperience.jsx`, `SkillDialog.jsx`, and section styles.

**Interfaces:** Projection is decorative. The beam starts at `ProjectorSocket.L` or `.R` world position, projected to screen coordinates, and terminates near the HTML dialog. The dialog never depends on beam visibility.

- [ ] On skill open, blend into the GLB's Project pose and connect the projected socket to an SVG/CSS overlay. Update coordinates on scroll/resize; hide the beam on reduced motion or when geometry cannot be projected reliably.
- [ ] Match card spacing, panel treatment, warm background, cyan accents, and orange annotations to the three selected images in the new ZIP. Use CSS/SVG for decorations that have no standalone asset.
- [ ] Inspect desktop, tablet, and 390px screenshots; verify the beam does not cross text or obscure the dialog close control. If it does, adjust or omit it at that breakpoint.
- [ ] Run lint/build and the Skills interaction tests; expect all to pass.
- [ ] Commit as `feat: refine hologram presentation` if Git is available.

### Task 8: SEO, resilience, and release checks

**Files:** Create `src/app/{icon.png,opengraph-image.png,robots.js,sitemap.js}` as applicable; modify `src/app/layout.jsx`, `next.config.mjs`, and relevant feature files for any verified defects. Add small browser tests under `tests/e2e/` only for the critical flows established above.

**Interfaces:** Metadata and canonical URL are set for `https://www.ferii-r.my.id/`; static export is enabled only after confirming its compatibility with the selected hosting and image strategy.

- [ ] Add accurate metadata and share image. Verify link targets, image alt text, section headings, keyboard focus, and no dummy link presented as live.
- [ ] Exercise the five Review Focus conditions, the PRD's FR-01 through FR-22, 360/390/768/1440px layouts, reduced motion, blocked GLB, failed Wikipedia, and the non-sending contact form.
- [ ] Run `npm run test`, `npm run lint`, and `npm run build`; capture actual outputs and fix failures. Inspect the production page for missing assets and console errors.
- [ ] Record remaining release blockers separately: factual copy, current public links, model visual fidelity, and hosting decision. Do not claim public-launch readiness while they remain unresolved.
- [ ] Commit final verified changes as `chore: prepare portfolio release` if Git is available.

## Plan self-review checklist

- [ ] Every PRD section and FR-01 through FR-22 maps to a task above.
- [ ] Interfaces and filenames match across tasks; `projects.json` is the only project data source.
- [ ] The five Review Focus conditions have checks in their owning tasks.
- [ ] The plan does not copy old React source or treat illustrative mockup text as verified biography.
- [ ] The target path remains `/Users/senja/Desktop/test-1/feri-portfolio-next/` throughout implementation.
