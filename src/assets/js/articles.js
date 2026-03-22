const ARTICLE_LIBRARY_PATH = 'data/articles.json';

async function loadArticleLibrary() {
  const response = await fetch(ARTICLE_LIBRARY_PATH);
  if (!response.ok) {
    throw new Error(`Failed to load ${ARTICLE_LIBRARY_PATH}`);
  }
  return response.json();
}

function createMetaPillMarkup(value) {
  return `<span class="meta-pill">${value}</span>`;
}

function createTagMarkup(tag) {
  return `<span class="tag">${tag}</span>`;
}

function normalizeArticles(payload) {
  return Array.isArray(payload) ? payload : payload.items || [];
}

function getExternalUrl(article) {
  return article.externalUrl || '#';
}

function createArticleCardMarkup(article) {
  return `
    <article class="card article-card article-card--library" data-category="${article.category}">
      <div class="article-card__header-block">
        <p class="eyebrow">${article.category}</p>
        <h3>${article.title}</h3>
      </div>
      <div class="article-card__meta">
        ${createMetaPillMarkup(article.date)}
        ${createMetaPillMarkup(article.readingTime)}
      </div>
      <p class="article-card__summary">${article.excerpt || article.summary}</p>
      <div class="article-card__tags">${article.tags.map(createTagMarkup).join('')}</div>
      <div class="article-card__actions">
        <a class="article-card__link" href="article.html?slug=${article.slug}">Read Here</a>
        <a class="article-card__link article-card__link--secondary" href="${getExternalUrl(article)}" target="_blank" rel="noreferrer">Original on LinkedIn</a>
      </div>
    </article>
  `;
}

function createFeaturedArticleMarkup(article) {
  return `
    <article class="card featured-article-card">
      ${article.heroImage ? `<img class="featured-article-card__image" src="${article.heroImage}" alt="${article.heroImageAlt || article.title}" />` : ''}
      <div class="featured-article-card__body">
        <div class="featured-article-card__topline">
          <p class="eyebrow">${article.featuredLabel || 'Featured Article'}</p>
          <div class="article-card__meta">
            ${createMetaPillMarkup(article.category)}
            ${createMetaPillMarkup(article.readingTime)}
          </div>
        </div>
        <h3>${article.title}</h3>
        <p class="featured-article-card__excerpt">${article.excerpt || article.summary}</p>
        <div class="article-card__tags">${article.tags.map(createTagMarkup).join('')}</div>
        <div class="article-card__actions">
          <a class="article-card__link" href="article.html?slug=${article.slug}">Read Here</a>
          <a class="article-card__link article-card__link--secondary" href="${getExternalUrl(article)}" target="_blank" rel="noreferrer">Original on LinkedIn</a>
        </div>
      </div>
    </article>
  `;
}

function initArticlesPage(articles) {
  const featuredTarget = document.querySelector('[data-featured-articles]');
  const grid = document.querySelector('[data-articles-grid]');
  const filters = document.querySelector('[data-article-filters]');
  const searchInput = document.querySelector('[data-article-search]');
  const summary = document.querySelector('[data-article-results-summary]');
  if (!featuredTarget || !grid || !filters || !searchInput || !summary) return;

  const featured = articles.filter((article) => article.featured);
  featuredTarget.innerHTML = featured.map(createFeaturedArticleMarkup).join('');
  if (!featured.length) {
    featuredTarget.innerHTML = '<div class="empty-state">No featured articles are configured yet.</div>';
  }

  const categories = ['All', ...new Set(articles.map((article) => article.category))];
  let activeCategory = 'All';
  let query = '';

  const paint = () => {
    const normalized = query.trim().toLowerCase();
    const filtered = articles.filter((article) => {
      const categoryMatch = activeCategory === 'All' || article.category === activeCategory;
      const haystack = [article.title, article.summary, article.excerpt, article.category, article.author, article.audience, ...(article.tags || [])]
        .join(' ')
        .toLowerCase();
      const queryMatch = !normalized || haystack.includes(normalized);
      return categoryMatch && queryMatch;
    });

    grid.innerHTML = filtered.map(createArticleCardMarkup).join('');
    if (!filtered.length) {
      grid.innerHTML = '<div class="empty-state">No articles match the current search and filter combination.</div>';
    }

    summary.textContent = `${filtered.length} article${filtered.length === 1 ? '' : 's'} shown`;

    filters.querySelectorAll('button').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.category === activeCategory);
    });
  };

  filters.innerHTML = categories
    .map(
      (category) => `<button class="filter-chip ${category === 'All' ? 'is-active' : ''}" data-category="${category}" type="button">${category}</button>`
    )
    .join('');

  filters.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-category]');
    if (!button) return;
    activeCategory = button.dataset.category;
    paint();
  });

  searchInput.addEventListener('input', (event) => {
    query = event.target.value;
    paint();
  });

  paint();
}

async function initArticlesLibrary() {
  try {
    const payload = await loadArticleLibrary();
    initArticlesPage(normalizeArticles(payload));
  } catch (error) {
    console.error(error);
    const grid = document.querySelector('[data-articles-grid]');
    const featured = document.querySelector('[data-featured-articles]');
    const summary = document.querySelector('[data-article-results-summary]');
    if (featured) {
      featured.innerHTML = '<div class="empty-state">Featured articles could not be loaded.</div>';
    }
    if (grid) {
      grid.innerHTML = '<div class="empty-state">The article library could not be loaded at this time.</div>';
    }
    if (summary) {
      summary.textContent = 'Article library unavailable';
    }
  }
}

initArticlesLibrary();
