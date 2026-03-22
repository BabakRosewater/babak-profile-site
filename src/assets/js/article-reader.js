const ARTICLE_DATA_PATH = 'data/articles.json';

async function loadArticleData(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
}

function normalizeArticles(payload) {
  return Array.isArray(payload) ? payload : payload.items || [];
}

function getExternalUrl(article) {
  return article.externalUrl || '#';
}

function getArticleSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

function createMetaRow(label, value) {
  return `
    <div class="article-reader-meta__row">
      <span class="article-reader-meta__label">${label}</span>
      <span class="article-reader-meta__value">${value}</span>
    </div>
  `;
}

function createTagMarkup(tag) {
  return `<span class="tag">${tag}</span>`;
}

function createRelatedArticleMarkup(article) {
  return `
    <article class="card article-card article-card--related">
      <p class="eyebrow">${article.category}</p>
      <h3>${article.title}</h3>
      <div class="article-card__meta">
        <span class="meta-pill">${article.date}</span>
        <span class="meta-pill">${article.readingTime}</span>
      </div>
      <p class="article-card__summary">${article.excerpt || article.summary}</p>
      <div class="article-card__tags">${(article.tags || []).map(createTagMarkup).join('')}</div>
      <div class="article-card__actions">
        <a class="article-card__link" href="article.html?slug=${article.slug}">Read Here</a>
        <a class="article-card__link article-card__link--secondary" href="${getExternalUrl(article)}" target="_blank" rel="noreferrer">Original on LinkedIn</a>
      </div>
    </article>
  `;
}

function updateArticleSeo(article) {
  document.title = `${article.seo?.metaTitle || article.seo?.title || article.title} | Babak Mohammadi`;

  const description = article.seo?.metaDescription || article.seo?.description || article.summary || article.excerpt || '';
  const ogTitle = article.seo?.ogTitle || article.seo?.metaTitle || article.title;
  const ogDescription = article.seo?.ogDescription || description;

  const descriptionMeta = document.querySelector('[data-article-meta-description]');
  const ogTitleMeta = document.querySelector('[data-article-meta-og-title]');
  const ogDescriptionMeta = document.querySelector('[data-article-meta-og-description]');

  if (descriptionMeta) descriptionMeta.setAttribute('content', description);
  if (ogTitleMeta) ogTitleMeta.setAttribute('content', ogTitle);
  if (ogDescriptionMeta) ogDescriptionMeta.setAttribute('content', ogDescription);
}

function renderArticleHero(article) {
  const target = document.querySelector('[data-article-hero]');
  if (!target) return;

  target.innerHTML = `
    <p class="eyebrow">${article.category}</p>
    <h1>${article.title}</h1>
    <p class="page-hero__lede">${article.excerpt || article.summary}</p>
    <div class="article-card__meta article-card__meta--hero">
      <span class="meta-pill">${article.date}</span>
      <span class="meta-pill">${article.readingTime}</span>
    </div>
    <div class="article-card__tags article-card__tags--hero">${(article.tags || []).map(createTagMarkup).join('')}</div>
    <div class="article-reader-actions">
      <a class="button button--secondary button--compact" href="articles.html">Back to Articles</a>
      <a class="button button--primary button--compact" href="${getExternalUrl(article)}" target="_blank" rel="noreferrer">Original on LinkedIn</a>
    </div>
    ${article.heroImage ? `<img class="article-hero-image" src="${article.heroImage}" alt="${article.heroImageAlt || article.title}" />` : ''}
  `;
}

function renderArticleMeta(article) {
  const target = document.querySelector('[data-article-meta]');
  if (!target) return;

  target.innerHTML = `
    <p class="eyebrow">Article Details</p>
    ${createMetaRow('Category', article.category)}
    ${createMetaRow('Published', article.date)}
    ${createMetaRow('Reading Time', article.readingTime)}
    ${createMetaRow('Slug', article.slug)}
    ${createMetaRow('Author', article.author || 'Babak Mohammadi')}
    ${createMetaRow('Audience', article.audience || 'Automotive leaders')}
    ${createMetaRow('SEO Title', article.seo?.metaTitle || article.seo?.title || article.title)}
    <div class="article-reader-meta__actions">
      <a class="text-link" href="article.html?slug=${article.slug}">Readable Version</a>
      <a class="text-link" href="${getExternalUrl(article)}" target="_blank" rel="noreferrer">Original on LinkedIn</a>
    </div>
  `;
}

async function renderArticleContent(article) {
  const target = document.querySelector('[data-article-content]');
  if (!target) return;

  const response = await fetch(article.internalPath);
  if (!response.ok) {
    throw new Error(`Failed to load article content: ${article.internalPath}`);
  }

  target.innerHTML = await response.text();
}

function renderRelatedArticles(article, articles) {
  const section = document.querySelector('[data-related-articles-section]');
  const target = document.querySelector('[data-related-articles]');
  if (!section || !target) return;

  const related = (article.relatedSlugs || [])
    .map((slug) => articles.find((item) => item.slug === slug))
    .filter(Boolean);

  if (!related.length) {
    section.hidden = true;
    return;
  }

  section.hidden = false;
  target.innerHTML = related.map(createRelatedArticleMarkup).join('');
}

function renderArticleError(message) {
  const hero = document.querySelector('[data-article-hero]');
  const meta = document.querySelector('[data-article-meta]');
  const content = document.querySelector('[data-article-content]');
  const relatedSection = document.querySelector('[data-related-articles-section]');

  if (hero) {
    hero.innerHTML = `
      <p class="eyebrow">Article</p>
      <h1>Article unavailable</h1>
      <p class="page-hero__lede">${message}</p>
      <div class="article-reader-actions">
        <a class="button button--secondary button--compact" href="articles.html">Back to Articles</a>
      </div>
    `;
  }

  if (meta) {
    meta.innerHTML = `
      <p class="eyebrow">Article Details</p>
      <p class="article-reader-meta__empty">No article metadata could be loaded for this request.</p>
    `;
  }

  if (content) {
    content.innerHTML = `<div class="empty-state">${message}</div>`;
  }

  if (relatedSection) {
    relatedSection.hidden = true;
  }
}

async function initArticleReader() {
  const slug = getArticleSlug();
  if (!slug) {
    renderArticleError('No article slug was provided in the URL.');
    return;
  }

  try {
    const articlesPayload = await loadArticleData(ARTICLE_DATA_PATH);
    const articles = normalizeArticles(articlesPayload);
    const article = articles.find((item) => item.slug === slug);

    if (!article) {
      renderArticleError(`No article was found for slug: ${slug}`);
      return;
    }

    updateArticleSeo(article);
    renderArticleHero(article);
    renderArticleMeta(article);
    await renderArticleContent(article);
    renderRelatedArticles(article, articles);
  } catch (error) {
    console.error(error);
    renderArticleError('The article could not be loaded at this time.');
  }
}

initArticleReader();
