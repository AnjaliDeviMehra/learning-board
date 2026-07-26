/*
 * faq.js — FAQ accordion + keyword search
 * Self-contained, vanilla JS (no external libraries). Turns each <dt>
 * question inside .faq-card into a keyboard-accessible toggle that
 * shows/hides its matching <dd> answer, and adds a live keyword filter
 * with a "Showing X of Y" count and a no-results message.
 *
 * Progressive enhancement only: without JavaScript the answers stay
 * visible and the search box (styled hidden until JS runs) never appears,
 * so no content is ever lost.
 */
(function () {
    'use strict';

    var questions = document.querySelectorAll('.faq-card dt');
    if (!questions.length) return;

    // Each entry pairs a question with its answer and section wrapper so we
    // can filter and toggle them together.
    var pairs = [];
    var counter = 0;

    questions.forEach(function (dt) {
        var dd = dt.nextElementSibling;
        if (!dd || dd.tagName !== 'DD') return;

        counter += 1;
        var ddId = dd.id || ('faq-answer-' + counter);
        var dtId = dt.id || ('faq-question-' + counter);
        dd.id = ddId;
        dt.id = dtId;

        // Make the <dt> behave like a button for AT and keyboard users.
        dt.setAttribute('role', 'button');
        dt.setAttribute('tabindex', '0');
        dt.setAttribute('aria-controls', ddId);
        dt.classList.add('faq-toggle');

        dd.setAttribute('role', 'region');
        dd.setAttribute('aria-labelledby', dtId);

        setExpanded(dt, dd, false);

        dt.addEventListener('click', function () {
            toggle(dt, dd);
        });

        dt.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                toggle(dt, dd);
            }
        });

        pairs.push({
            dt: dt,
            dd: dd,
            section: dt.closest('.faq-section'),
            text: (dt.textContent + ' ' + dd.textContent).toLowerCase()
        });
    });

    function toggle(dt, dd) {
        var isOpen = dt.getAttribute('aria-expanded') === 'true';
        setExpanded(dt, dd, !isOpen);
    }

    function setExpanded(dt, dd, expanded) {
        dt.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        dd.hidden = !expanded;
    }

    // ===== Keyword search =====

    var input = document.getElementById('faq-search-input');
    var countEl = document.getElementById('faq-search-count');
    var emptyEl = document.getElementById('faq-search-empty');
    var searchWrap = document.querySelector('.faq-search');

    if (!input) return;

    // Reveal the search UI only now that JS is confirmed running.
    if (searchWrap) searchWrap.classList.add('faq-search-ready');

    var total = pairs.length;

    // Unique list of section wrappers that contain FAQ pairs.
    var sections = [];
    pairs.forEach(function (pair) {
        if (pair.section && sections.indexOf(pair.section) === -1) {
            sections.push(pair.section);
        }
    });

    function runSearch() {
        var query = input.value.trim().toLowerCase();
        var shown = 0;

        pairs.forEach(function (pair) {
            var match = query === '' || pair.text.indexOf(query) !== -1;
            pair.dt.hidden = !match;
            // Collapse hidden answers so they don't linger when re-shown.
            if (!match) {
                setExpanded(pair.dt, pair.dd, false);
            } else {
                pair.dd.hidden = pair.dt.getAttribute('aria-expanded') !== 'true';
            }
            if (match) shown += 1;
        });

        // Hide section wrappers with no visible questions.
        sections.forEach(function (section) {
            var hasVisible = section.querySelector('.faq-card dt:not([hidden])') !== null;
            section.hidden = !hasVisible;
        });

        // Update the live count and no-results message.
        if (query === '') {
            countEl.textContent = '';
        } else {
            countEl.textContent = 'Showing ' + shown + ' of ' + total + ' questions';
        }
        if (emptyEl) emptyEl.hidden = !(query !== '' && shown === 0);
    }

    input.addEventListener('input', runSearch);
    runSearch();
})();
