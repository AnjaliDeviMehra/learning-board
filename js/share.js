/*
 * share.js — Share Your Learning form
 * Self-contained, vanilla JS. Handles client-side validation, a live
 * character counter for the experience textarea, and a success message
 * that echoes the submitted post title. Progressive enhancement only —
 * the form still submits (to "#") if JavaScript is disabled.
 */
(function () {
    'use strict';

    var form = document.getElementById('share-form');
    if (!form) return;

    var BODY_MIN = 50;
    var BODY_MAX = 3000;

    // ===== Validation helpers =====

    function showError(field, message) {
        field.classList.add('invalid');
        field.classList.remove('valid');
        field.setAttribute('aria-invalid', 'true');

        var error = field.parentElement.querySelector('.field-error');
        if (!error) {
            error = document.createElement('span');
            error.className = 'field-error';
            field.parentElement.appendChild(error);
        }
        error.textContent = message;
    }

    function clearError(field) {
        field.classList.remove('invalid');
        field.classList.add('valid');
        field.setAttribute('aria-invalid', 'false');

        var error = field.parentElement.querySelector('.field-error');
        if (error) error.textContent = '';
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ===== Field references =====

    var name     = document.getElementById('share-name');
    var email    = document.getElementById('share-email');
    var role     = document.getElementById('share-role');
    var company  = document.getElementById('share-company');
    var title    = document.getElementById('share-title');
    var category = document.getElementById('share-category');
    var body     = document.getElementById('share-body');
    var agree    = document.getElementById('share-agree');

    var postTypeRadios = form.querySelectorAll('input[name="post-type"]');
    var postTypeGroup  = document.querySelector('.radio-group');

    function postTypeSelected() {
        for (var i = 0; i < postTypeRadios.length; i++) {
            if (postTypeRadios[i].checked) return true;
        }
        return false;
    }

    // Show/clear an error scoped to the radio group container.
    function showGroupError(container, message) {
        container.setAttribute('aria-invalid', 'true');
        var error = container.parentElement.querySelector('.field-error');
        if (!error) {
            error = document.createElement('span');
            error.className = 'field-error';
            container.parentElement.appendChild(error);
        }
        error.textContent = message;
    }

    function clearGroupError(container) {
        container.setAttribute('aria-invalid', 'false');
        var error = container.parentElement.querySelector('.field-error');
        if (error) error.textContent = '';
    }

    // ===== Live character counter for the experience textarea =====

    var counter = null;
    if (body) {
        counter = document.createElement('span');
        counter.className = 'char-count';
        counter.setAttribute('aria-live', 'polite');
        // Announce the counter to the textarea for assistive tech.
        counter.id = 'share-body-count';
        var described = body.getAttribute('aria-describedby');
        body.setAttribute('aria-describedby', described ? described + ' ' + counter.id : counter.id);
        body.parentElement.appendChild(counter);

        var updateCount = function () {
            var len = body.value.trim().length;
            var text = len + ' / ' + BODY_MAX + ' characters';
            if (len < BODY_MIN) {
                text += ' — ' + (BODY_MIN - len) + ' more needed';
                counter.classList.add('char-count-short');
            } else {
                counter.classList.remove('char-count-short');
            }
            counter.textContent = text;
        };

        body.addEventListener('keyup', updateCount);
        body.addEventListener('input', updateCount); // catches paste/cut
        updateCount();
    }

    // ===== Submit handler =====

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var valid = true;
        var firstInvalid = null;

        function fail(field, message) {
            showError(field, message);
            valid = false;
            if (!firstInvalid) firstInvalid = field;
        }

        if (name.value.trim().length < 2) {
            fail(name, 'Please enter a display name (at least 2 characters).');
        } else { clearError(name); }

        if (!isValidEmail(email.value.trim())) {
            fail(email, 'Please enter a valid email address.');
        } else { clearError(email); }

        if (role.value.trim() === '') {
            fail(role, 'Please enter your job title or role.');
        } else { clearError(role); }

        if (company.value.trim() === '') {
            fail(company, 'Please enter your company or organization.');
        } else { clearError(company); }

        if (title.value.trim().length < 5) {
            fail(title, 'Please enter a post title (at least 5 characters).');
        } else { clearError(title); }

        if (category.value === '') {
            fail(category, 'Please select a skill category.');
        } else { clearError(category); }

        if (postTypeGroup && !postTypeSelected()) {
            showGroupError(postTypeGroup, 'Please choose a post type.');
            valid = false;
            if (!firstInvalid) firstInvalid = postTypeRadios[0];
        } else if (postTypeGroup) {
            clearGroupError(postTypeGroup);
        }

        if (body.value.trim().length < BODY_MIN) {
            fail(body, 'Please write at least ' + BODY_MIN + ' characters describing your experience.');
        } else { clearError(body); }

        if (!agree.checked) {
            fail(agree, 'You must check this box before submitting.');
        } else { clearError(agree); }

        if (!valid) {
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        // Success: replace the form with a confirmation that echoes the title.
        var postTitle = title.value.trim();
        var success = document.createElement('div');
        success.className = 'form-success';
        success.setAttribute('role', 'status');

        var heading = document.createElement('p');
        heading.textContent = '✅ Thank you! Your post has been submitted.';

        var detail = document.createElement('p');
        detail.appendChild(document.createTextNode('“'));
        var strong = document.createElement('strong');
        strong.textContent = postTitle;
        detail.appendChild(strong);
        detail.appendChild(document.createTextNode('” will appear on the Browse Experiences page shortly.'));

        success.appendChild(heading);
        success.appendChild(detail);

        form.replaceWith(success);
        success.setAttribute('tabindex', '-1');
        success.focus();
    });

    // ===== Clear errors as the user corrects fields =====

    form.querySelectorAll('input, textarea, select').forEach(function (field) {
        field.addEventListener('input', function () {
            if (field.type === 'checkbox') {
                if (field.checked) clearError(field);
            } else if (field.value.trim() !== '') {
                clearError(field);
            }
        });
        field.addEventListener('change', function () {
            if (field.type === 'checkbox' && field.checked) clearError(field);
            if (field.tagName === 'SELECT' && field.value !== '') clearError(field);
            if (field.type === 'radio' && postTypeGroup && postTypeSelected()) {
                clearGroupError(postTypeGroup);
            }
        });
    });
})();
