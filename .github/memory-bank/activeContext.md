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