# LearningBoard

## Team
- Vardan Abrol — 222125231 — vabrol@my.yorku.ca
- Anjali — 222549125 — anjalim@my.yorku.ca
- Isa Din — 1166703 — isad07@my.yorku.ca
- Mohammad Jalili — 221243084 — mojaili@my.yorku.ca

## Project overview
LearningBoard is web app where students share short, practical lessons they learned on the job (internships, co-ops, part-time jobs, and placements). The goal is to capture and share useful, actionable workplace insights so other students can learn from peers' real experiences.

## Short description
Students learn a lot of useful things at work but there is no central place to share those lessons with other students. LearningBoard provides a simple platform where a student can write and submit a short post about something they learned that could help others. Anyone can read the posts, filter by category, and mark items as helpful.

## Target audience
Students who have workplace experience (part-time jobs, internships, co-op placements, or any work placement) and students preparing to enter the workplace who would like peer-sourced tips and practical advice.

## Pages included
- `index.html`
- `browse.html`
- `share.html`
- `skills-guide.html`
- `about.html`
- `contact.html`
- `faq.html`
- `credits.html`



## Phase 1 – HTML Structure and Content

- Built the semantic HTML skeleton for all 8 pages (`index.html`, `browse.html`, `share.html`, `skills-guide.html`, `about.html`, `contact.html`, `faq.html`, `credits.html`), with no CSS or JavaScript yet
- Consistent `<header>` with a logo link and `<nav aria-label="Main navigation">` containing the site-wide link list, repeated across every page
- Used `<main>`, `<section>`, and a proper heading hierarchy (`h1`–`h3`) to structure page content semantically
- Home page (`index.html`): hero intro, stats row, and a "Recent Experiences" list of sample posts marked up as `<article>` elements
- Browse page (`browse.html`): experience category list, featured post `<article>` elements, and a "Browse by Skill Level" `<table>` with `<caption>` and `scope="col"` header cells
- Credits page (`credits.html`): a `<table>` of team members and their contribution areas, plus an asset/reference credits section
- Skills Guide (`skills-guide.html`): an `<aside>` skill-links sidebar paired with per-topic `<section id="...">` content blocks, connected with `aria-labelledby`
- FAQ page (`faq.html`): question/answer content structured with `<dl>`/`<dt>`/`<dd>` definition lists, grouped into topic sections
- Share Your Learning form (`share.html`) and Contact form (`contact.html`): built with `<fieldset>`/`<legend>` grouping, a `<label for="">` on every field, and native HTML validation attributes (`required`, `minlength`, `maxlength`, `type="email"`)
- Baseline accessibility attributes were part of the markup from the start: `aria-current="page"` on the active nav link, `aria-hidden="true"` on decorative required-field asterisks, and `aria-controls`/`aria-expanded` on the (then non-functional) mobile menu button
- Pages were plain, unstyled HTML at this stage — content and structure only, validated for correct markup before Phase 2 styling began

## Phase 2 – CSS Styling and Responsive Design

- Added a single shared stylesheet (`css/styles.css`) linked to all pages
- Established a consistent green colour scheme (`#1b5e3b`, `#2d7a4f`, `#e8f5ee`) across all pages
- Styled the header, navigation bar, and footer consistently site-wide
- Added responsive navigation with a hamburger menu button for mobile screens
- Styled form elements: fieldsets, legends, labels, text inputs, selects, textareas, radio buttons, checkboxes, and submit/reset buttons (`share.html`, `contact.html`)
- Added focus states on all form inputs for keyboard accessibility
- Styled the About page logo and category tags as pill-shaped badges
- Added a two-column flex layout on the Skills Guide page (sticky sidebar navigation + main content area)
- Styled each skill section with a top border, heading hierarchy, and sub-section labels
- Styled `<aside>` elements with a left-border callout design
- Applied flexbox and CSS Grid for responsive layouts across pages
- Added media queries for tablet and mobile: single-column layout, stacked buttons, static sidebar
- Fixed header and footer structure on `skills-guide.html` to match all other pages

## Phase 3 – Dynamic Behaviour and Functionality

- Added client-side interactivity with vanilla JavaScript (no external libraries), each page-specific script kept in its own file under `js/`
- Share Your Learning form (`js/share.js`): full client-side validation of name, email (regex), role, company, title, skill category, a 50-character minimum body, the post-type radio group, and the agreement checkbox
- Added inline error messages, a live character counter on the experience field, and a success confirmation that echoes the submitted post title
- Uses `preventDefault`, `createElement`, and `aria-invalid` to handle submission and report errors accessibly
- FAQ page (`js/faq.js`): keyboard-accessible accordion using `aria-expanded` and `aria-controls`, toggled by click plus Enter/Space
- Added a keyword search filter on the FAQ page with a live "Showing X of Y" count and a no-results message
- Built with progressive enhancement so both pages remain usable with JavaScript turned off
- Techniques used: DOM manipulation (`querySelector`, `createElement`, `appendChild`, `textContent`, `classList`), event handling with `addEventListener` (`submit`, `input`, `change`, `keyup`, `keydown`), and accessibility attributes

## GitHub Pages link

https://anjalidevimehra.github.io/learning-board/

## Asset credits & references

- App built for DIGT 1302 — Web Development Basics (York University)


