
// ===== FORM VALIDATION HELPERS =====

function showError(field, message) {
    field.classList.add('invalid');
    field.classList.remove('valid');
    let error = field.parentElement.querySelector('.field-error');
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
    const error = field.parentElement.querySelector('.field-error');
    if (error) error.textContent = '';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== CONTACT FORM VALIDATION =====
// Share-form handling now lives in js/share.js. This file keeps the shared
// validation helpers (used by both) and the contact-form handler.
const contactForm = document.querySelector('form[action="#"]');

if (contactForm && !document.getElementById('share-form')) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let valid = true;

        const name    = document.getElementById('name');
        const email   = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');

        if (name.value.trim() === '') {
            showError(name, 'Please enter your name.');
            valid = false;
        } else { clearError(name); }

        if (!isValidEmail(email.value.trim())) {
            showError(email, 'Please enter a valid email address.');
            valid = false;
        } else { clearError(email); }

        if (subject.value.trim() === '') {
            showError(subject, 'Please enter a subject.');
            valid = false;
        } else { clearError(subject); }

        if (message.value.trim().length < 10) {
            showError(message, 'Please write a message (at least 10 characters).');
            valid = false;
        } else { clearError(message); }

        if (valid) {
            contactForm.innerHTML = '<div class="form-success">✅ Message sent! We\'ll get back to you soon.</div>';
        }
    });

    // Clear error as user types
    contactForm.querySelectorAll('input, textarea').forEach(function (field) {
        field.addEventListener('input', function () {
            if (field.value.trim() !== '') {
                clearError(field);
            }
        });
    });
}

// ===== DYNAMIC FOOTER YEAR =====
document.querySelectorAll('.footer-year').forEach(function(el) {
    el.textContent = new Date().getFullYear();
});

// ===== BACK TO TOP BUTTON =====
var backToTop = document.createElement('button');
backToTop.id = 'back-to-top';
backToTop.textContent = '↑ Top';
document.body.appendChild(backToTop);

window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }
});

backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== CATEGORY PILLS (about.html) =====
var categoryDescriptions = {
    'communication': 'Tips and lessons about workplace communication — emails, meetings, presentations, and talking to coworkers or managers.',
    'tech': 'Advice about tools, coding, data, software, and solving technical problems on the job.',
    'teamwork': 'Lessons about working with others, collaborating across teams, asking for help, and supporting your coworkers.',
    'problem-solving': 'Examples of how students handled mistakes, pressure, and difficult tasks at work — and what they learned from it.'
};

var categoryPills = document.querySelectorAll('.category-pills li');
var categoryInfo = document.getElementById('category-info');

if (categoryPills.length > 0 && categoryInfo) {
    categoryPills.forEach(function(pill) {
        pill.addEventListener('click', function() {
            var key = pill.getAttribute('data-category');

            // If clicking the already active pill, close it
            if (pill.classList.contains('active')) {
                pill.classList.remove('active');
                categoryInfo.style.display = 'none';
                categoryInfo.textContent = '';
                return;
            }

            // Remove active from all pills
            categoryPills.forEach(function(p) { p.classList.remove('active'); });

            // Set active and show description
            pill.classList.add('active');
            categoryInfo.textContent = categoryDescriptions[key];
            categoryInfo.style.display = 'block';
        });
    });
}
