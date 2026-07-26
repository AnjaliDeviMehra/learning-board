
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

// ===== SHARE FORM VALIDATION =====
const shareForm = document.getElementById('share-form');

if (shareForm) {
    shareForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let valid = true;

        const name     = document.getElementById('share-name');
        const email    = document.getElementById('share-email');
        const role     = document.getElementById('share-role');
        const company  = document.getElementById('share-company');
        const title    = document.getElementById('share-title');
        const category = document.getElementById('share-category');
        const body     = document.getElementById('share-body');
        const agree    = document.getElementById('share-agree');

        if (name.value.trim().length < 2) {
            showError(name, 'Please enter a display name (at least 2 characters).');
            valid = false;
        } else { clearError(name); }

        if (!isValidEmail(email.value.trim())) {
            showError(email, 'Please enter a valid email address.');
            valid = false;
        } else { clearError(email); }

        if (role.value.trim() === '') {
            showError(role, 'Please enter your job title or role.');
            valid = false;
        } else { clearError(role); }

        if (company.value.trim() === '') {
            showError(company, 'Please enter your company or organization.');
            valid = false;
        } else { clearError(company); }

        if (title.value.trim().length < 5) {
            showError(title, 'Please enter a post title (at least 5 characters).');
            valid = false;
        } else { clearError(title); }

        if (category.value === '') {
            showError(category, 'Please select a skill category.');
            valid = false;
        } else { clearError(category); }

        if (body.value.trim().length < 50) {
            showError(body, 'Please write at least 50 characters describing your experience.');
            valid = false;
        } else { clearError(body); }

        if (!agree.checked) {
            showError(agree, 'You must check this box before submitting.');
            valid = false;
        } else { clearError(agree); }

        if (valid) {
            shareForm.innerHTML = '<div class="form-success">✅ Thank you! Your post has been submitted. It will appear on the Browse Experiences page shortly.</div>';
        }
    });

    // Clear error as user types
    shareForm.querySelectorAll('input, textarea, select').forEach(function (field) {
        field.addEventListener('input', function () {
            if (field.value.trim() !== '') {
                clearError(field);
            }
        });
    });
}

// ===== CONTACT FORM VALIDATION =====
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
