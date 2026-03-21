const ARTICLE_DATA_PATH = 'data/articles.json';

async function loadArticleData(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
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

function renderArticleHero(article) {
  const target = document.querySelector('[data-article-hero]');
  if (!target) return;

  target.innerHTML = `
    <p class="eyebrow">${article.category}</p>
    <h1>${article.title}</h1>
    <p class="page-hero__lede">${article.summary}</p>
    <div class="article-reader-actions">
      <a class="button button--secondary button--compact" href="articles.html">Back to Articles</a>
      <a class="button button--primary button--compact" href="${article.externalUrl}" target="_blank" rel="noreferrer">Original on LinkedIn</a>
    </div>
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
    ${createMetaRow('Internal URL', `article.html?slug=${article.slug}`)}
    <div class="article-reader-meta__actions">
      <a class="text-link" href="article.html?slug=${article.slug}">Readable Version</a>
      <a class="text-link" href="${article.externalUrl}" target="_blank" rel="noreferrer">Original on LinkedIn</a>
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

function renderArticleError(message) {
  const hero = document.querySelector('[data-article-hero]');
  const meta = document.querySelector('[data-article-meta]');
  const content = document.querySelector('[data-article-content]');

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
}

async function initArticleReader() {
  const slug = getArticleSlug();
  if (!slug) {
    renderArticleError('No article slug was provided in the URL.');
    return;
  }

  try {
    const articlesPayload = await loadArticleData(ARTICLE_DATA_PATH);
    const article = articlesPayload.items.find((item) => item.slug === slug);

    if (!article) {
      renderArticleError(`No article was found for slug: ${slug}`);
      return;
    }

    document.title = `${article.title} | Babak Mohammadi`;
    renderArticleHero(article);
    renderArticleMeta(article);
    await renderArticleContent(article);
  } catch (error) {
    console.error(error);
    renderArticleError('The article could not be loaded at this time.');
  }
}

initArticleReader();
