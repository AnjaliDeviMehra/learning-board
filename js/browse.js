
const heroSearchForm = document.getElementById('hero-search-form');
const heroSearchInput = document.getElementById('hero-search-input');

if (heroSearchForm && heroSearchInput) {
    heroSearchForm.addEventListener('submit', function (e) {
        e.preventDefault();
    });

    heroSearchInput.addEventListener('input', function () {
        searchQuery = heroSearchInput.value.trim().toLowerCase();
        visiblePageCount = PAGE_SIZE;
        applyFilters();
    });
}

const filterToggle = document.getElementById('filter-toggle');
const filterPanel = document.getElementById('filter-panel');

if (filterToggle && filterPanel) {
    filterToggle.addEventListener('click', function () {
        const isOpen = !filterPanel.hidden;
        filterPanel.hidden = isOpen;
        filterToggle.setAttribute('aria-expanded', String(!isOpen));
    });

    document.addEventListener('click', function (e) {
        const clickedInside = filterPanel.contains(e.target) || filterToggle.contains(e.target);
        if (!filterPanel.hidden && !clickedInside) {
            filterPanel.hidden = true;
            filterToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

const CATEGORY_META = {
    'communication': { label: 'Communication', emoji: '💬' },
    'tech': { label: 'Tech Skills', emoji: '💻' },
    'teamwork': { label: 'Teamwork', emoji: '👥' },
    'problem-solving': { label: 'Problem Solving', emoji: '🧩' }
};

const POSTS_STORAGE_KEY = 'learningboard_posts';

function timeAgo(dateString) {
    const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    const units = [
        ['year', 31536000],
        ['month', 2592000],
        ['week', 604800],
        ['day', 86400],
        ['hour', 3600],
        ['minute', 60]
    ];

    for (const [name, secondsInUnit] of units) {
        const value = Math.floor(seconds / secondsInUnit);
        if (value >= 1) {
            return value === 1 ? '1 ' + name + ' ago' : value + ' ' + name + 's ago';
        }
    }
    return 'just now';
}

function getUserPosts() {
    try {
        return JSON.parse(localStorage.getItem(POSTS_STORAGE_KEY)) || [];
    } catch (e) {
        return [];
    }
}

const STATS_STORAGE_KEY = 'learningboard_stats';

function getStats() {
    try {
        return JSON.parse(localStorage.getItem(STATS_STORAGE_KEY)) || {};
    } catch (e) {
        return {};
    }
}

function bumpStat(postId, field, baseValue) {
    const stats = getStats();
    const current = stats[postId] || {};
    const newCount = (typeof current[field] === 'number' ? current[field] : (baseValue || 0)) + 1;
    stats[postId] = Object.assign({}, current, { [field]: newCount });
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    return newCount;
}

function createPostCard(post) {
    const meta = CATEGORY_META[post.category] || { label: post.category, emoji: '📝' };

    const article = document.createElement('article');
    article.dataset.category = post.category;

    const cardTop = document.createElement('div');
    cardTop.className = 'card-top';

    const cardAuthor = document.createElement('div');
    cardAuthor.className = 'card-author';

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = (post.name || '?').trim().charAt(0).toUpperCase();

    const authorInfo = document.createElement('div');
    const authorName = document.createElement('h3');
    authorName.textContent = post.name;
    const authorContext = document.createElement('p');
    authorContext.textContent = post.role && post.company ? post.role + ' at ' + post.company : (post.role || post.company || '');
    authorInfo.append(authorName, authorContext);

    cardAuthor.append(avatar, authorInfo);

    cardTop.append(cardAuthor);

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const title = document.createElement('h3');
    title.textContent = post.title;

    const body = document.createElement('p');
    body.textContent = post.body;

    const tags = document.createElement('div');
    tags.className = 'tags';
    const tag = document.createElement('span');
    tag.textContent = meta.emoji + ' ' + meta.label;
    tags.appendChild(tag);

    cardBody.append(title, body, tags);

    const cardActions = document.createElement('div');
    cardActions.className = 'card-actions';

    const stats = getStats()[post.id] || {};
    const helpfulCount = typeof stats.helpful === 'number' ? stats.helpful : (post.helpful || 0);
    const likeCount = typeof stats.like === 'number' ? stats.like : (post.like || 0);

    const helpfulBtn = document.createElement('button');
    helpfulBtn.type = 'button';
    helpfulBtn.setAttribute('aria-label', 'Mark as helpful');
    helpfulBtn.textContent = '👍 Helpful (' + helpfulCount + ')';
    helpfulBtn.addEventListener('click', function () {
        const newCount = bumpStat(post.id, 'helpful', post.helpful);
        helpfulBtn.textContent = '👍 Helpful (' + newCount + ')';
    });

    const likeBtn = document.createElement('button');
    likeBtn.type = 'button';
    likeBtn.setAttribute('aria-label', 'Like post');
    likeBtn.textContent = '❤️ Like (' + likeCount + ')';
    likeBtn.addEventListener('click', function () {
        const newCount = bumpStat(post.id, 'like', post.like);
        likeBtn.textContent = '❤️ Like (' + newCount + ')';
    });

    cardActions.append(helpfulBtn, likeBtn);

    article.append(cardTop, cardBody, cardActions);

    return article;
}

const PAGE_SIZE = 10;
const LOAD_MORE_INCREMENT = 5;
let visiblePageCount = PAGE_SIZE;
let searchQuery = '';

function applyFilters() {
    const container = document.getElementById('posts-container');
    const emptyState = document.getElementById('posts-empty');
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!container) return;

    const activeCategories = filterPanel
        ? Array.from(filterPanel.querySelectorAll('input[type="checkbox"]'))
            .filter(function (cb) { return cb.checked; })
            .map(function (cb) { return cb.value; })
        : [];

    const cards = Array.from(container.querySelectorAll('article[data-category]'));
    const matching = cards.filter(function (card) {
        const matchesCategory = activeCategories.length === 0 || activeCategories.includes(card.dataset.category);
        const matchesSearch = searchQuery === '' || card.textContent.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    cards.forEach(function (card) { card.hidden = true; });
    matching.slice(0, visiblePageCount).forEach(function (card) { card.hidden = false; });

    if (emptyState) emptyState.hidden = matching.length !== 0;
    if (loadMoreBtn) loadMoreBtn.disabled = visiblePageCount >= matching.length;
}

function renderPosts(posts) {
    const container = document.getElementById('posts-container');
    if (!container) return;

    container.innerHTML = '';

    posts
        .slice()
        .sort(function (a, b) { return new Date(b.date) - new Date(a.date); })
        .forEach(function (post) {
            container.appendChild(createPostCard(post));
        });

    applyFilters();
}

function loadPosts() {
    const seedPosts = typeof SEED_POSTS !== 'undefined' ? SEED_POSTS : [];
    renderPosts(seedPosts.concat(getUserPosts()));
}

if (document.getElementById('posts-container')) {
    loadPosts();

    if (filterPanel) {
        filterPanel.querySelectorAll('input[type="checkbox"]').forEach(function (checkbox) {
            checkbox.addEventListener('change', function () {
                visiblePageCount = PAGE_SIZE;
                applyFilters();
            });
        });
    }

    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
            visiblePageCount += LOAD_MORE_INCREMENT;
            applyFilters();
        });
    }
}
