### [RSVP-1] — Convert test.html to Next.js Root Page

- **Artifacts:**
  - `src/app/page.tsx` (modified — now renders RSVPGateExperience instead of Home)
  - `src/components/rsvp/RSVPGateExperience.tsx` (modified — all keyframes, animations, responsive CSS via `<style>` tag)
  - `src/components/rsvp/AtmosphereLayer.tsx` (modified — added CSS class names for animation selectors)
  - `src/components/rsvp/GateScreen.tsx` (modified — added `introFlash` overlay, CSS class names)
  - `src/components/rsvp/MemoryStory.tsx` (modified — all class names match test.html exactly, added `--d` duration vars)
  - `src/components/rsvp/RSVPSection.tsx` (uses class-based film-burn via `.bleed`)
  - `src/app/global-styles.css` (modified — added body.locked, body.live, pseudo-element rules: trigger-btn, memory-submit, intro-tile, projection-image, beat-frame)

- **Decisions:**
  - RSVP experience is now the **root page** (`/`) — replaces the old OBLIVION landing page
  - The old `Home` component and `RSVPModal` are no longer imported by any page, but kept in the codebase
  - All CSS pseudo-elements (`::before`, `::after`) are in global-styles.css since they can't use inline styles
  - Keyframe animations injected via `<style>` tag in RSVPGateExperience to keep them scoped
  - RSVP form submits to Firestore `general-rsvp` collection

- **Timestamp:** 2026-05-19T09:01:00+05:30

### [PR-REVIEW-1] — Reviewed PRs, Made TheArcaneVamp's code canonical

- **Artifacts:**
  - PR #1 (Vortex-16) merged then reverted (`850b57d` → `8f66c4a`)
  - PR #2 (TheArcaneVamp) merged (`3f18f82`) — now canonical on main
  - PR #2 changes: `AGENTS.md` updated with project-specific context, `package-lock.json` cleaned (removed react-scripts/react-router-dom), Firebase config, scroll fixes, profile pics added

- **Decisions:**
  - Initially merged PR #1 but user preferred PR #2 (TheArcaneVamp)'s code
  - Reverted PR #1, then merged PR #2's branch `origin/rishabh`
  - PR #2 was a clean merge with no conflicts
  - Local stash conflicts resolved to preserve PR #2 as canonical, stash dropped

- **Timestamp:** 2026-05-06T23:42:00+05:30