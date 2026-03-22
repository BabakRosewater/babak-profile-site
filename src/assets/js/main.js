const DATA_PATHS = {
  profile: 'data/profile.json',
  experience: 'data/experience.json',
  articles: 'data/articles.json',
  projects: 'data/projects.json'
};

const page = document.body.dataset.page || 'home';

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
}

function createMetaPill(value) {
  return `<span class="meta-pill">${value}</span>`;
}

function wireHeadshotFallback() {
  const image = document.querySelector('[data-headshot-image]');
  if (!image) return;

  image.addEventListener('error', () => {
    image.src = 'assets/img/headshot-placeholder.svg';
    image.classList.add('is-placeholder');
  }, { once: true });
}

function renderHeader(profile) {
  const target = document.querySelector('[data-site-header]');
  if (!target) return;

  const navItems = [
    ['home', 'Home', 'index.html'],
    ['about', 'About', 'about.html'],
    ['experience', 'Experience', 'experience.html'],
    ['articles', 'Articles', 'articles.html'],
    ['projects', 'Projects', 'projects.html']
  ];

  target.innerHTML = `
    <header class="site-header">
      <div class="site-header__inner">
        <a class="brand-mark" href="index.html" aria-label="Babak Mohammadi home">
          <strong>${profile.name}</strong>
          <span>${profile.title}</span>
        </a>
        <nav class="site-nav" aria-label="Primary">
          ${navItems
            .map(
              ([key, label, href]) =>
                `<a href="${href}" class="${page === key ? 'is-active' : ''}">${label}</a>`
            )
            .join('')}
          <a href="contact.html" class="button button--secondary button--compact site-nav__cta ${page === 'contact' ? 'is-active' : ''}">Contact</a>
        </nav>
      </div>
    </header>
  `;
}

function renderFooter(profile) {
  const target = document.querySelector('[data-site-footer]');
  if (!target) return;

  target.innerHTML = `
    <footer class="site-footer">
      <div class="site-footer__inner">
        <div>
          <strong>${profile.name}</strong>
          <p>${profile.footerBlurb}</p>
        </div>
        <div class="site-footer__nav">
          <a href="about.html">About</a>
          <a href="experience.html">Experience</a>
          <a href="articles.html">Articles</a>
          <a href="projects.html">Projects</a>
          <a href="contact.html">Contact</a>
        </div>
      </div>
    </footer>
  `;
}

function applyProfileContent(profile) {
  document.querySelectorAll('[data-profile-field="headline"]').forEach((node) => {
    node.textContent = profile.headline;
  });

  document.querySelectorAll('[data-profile-link]').forEach((node) => {
    const item = profile.links[node.dataset.profileLink];
    if (!item) return;

    node.href = item.href;
    node.textContent = item.label;
    if (item.external) {
      node.target = '_blank';
      node.rel = 'noreferrer';
    }
  });
}

function renderHome(profile, experience, articles, projects) {
  const highlightsTarget = document.querySelector('[data-home-highlights]');
  if (highlightsTarget) {
    highlightsTarget.innerHTML = profile.metrics
      .map((metric) => `<li><strong>${metric.value}</strong><span>${metric.label}</span></li>`)
      .join('');
  }

  const focusTarget = document.querySelector('[data-core-focus]');
  if (focusTarget) {
    focusTarget.innerHTML = profile.coreFocus
      .map(
        (item) => `
          <article class="card focus-card">
            <p class="eyebrow">${item.kicker}</p>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
          </article>
        `
      )
      .join('');
  }

  const experienceTarget = document.querySelector('[data-experience-preview]');
  if (experienceTarget) {
    experienceTarget.innerHTML = experience
      .slice(0, 3)
      .map(
        (item) => `
          <article class="timeline-item">
            <div class="timeline-item__header">
              <div>
                <p class="eyebrow">${item.period}</p>
                <h3>${item.role}</h3>
              </div>
            </div>
            <div class="timeline-item__meta">
              ${createMetaPill(item.company)}
              ${createMetaPill(item.location)}
            </div>
            <p>${item.summary}</p>
          </article>
        `
      )
      .join('');
  }

  const projectsTarget = document.querySelector('[data-projects-preview]');
  if (projectsTarget) {
    projectsTarget.innerHTML = projects
      .slice(0, 2)
      .map(
        (project) => `
          <div class="mini-metric">
            <strong>${project.title}</strong>
            <span>${project.shortLabel}</span>
          </div>
        `
      )
      .join('');
  }

  const articlesTarget = document.querySelector('[data-articles-preview]');
  if (articlesTarget) {
    articlesTarget.innerHTML = articles
      .slice(0, 3)
      .map(
        (article) => `
          <article class="card article-card">
            <p class="eyebrow">${article.category}</p>
            <h3>${article.title}</h3>
            <div class="article-card__meta">
              ${createMetaPill(article.date)}
              ${createMetaPill(article.readingTime)}
            </div>
            <p class="article-card__summary">${article.excerpt || article.summary}</p>
            <div class="article-card__tags">${(article.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join('')}</div>
            <div class="article-card__actions">
              <a class="article-card__link" href="article.html?slug=${article.slug}">Read Here</a>
              <a class="article-card__link article-card__link--secondary" href="${article.externalUrl || '#'}" target="_blank" rel="noreferrer">Original on LinkedIn</a>
            </div>
          </article>
        `
      )
      .join('');
  }
}

function renderAbout(profile) {
  const target = document.querySelector('[data-about-principles]');
  if (!target) return;

  target.innerHTML = profile.principles
    .map(
      (item) => `
        <article class="card focus-card">
          <p class="eyebrow">${item.kicker}</p>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </article>
      `
    )
    .join('');
}

function renderExperience(experience) {
  const target = document.querySelector('[data-experience-timeline]');
  if (!target) return;

  target.innerHTML = experience
    .map(
      (item) => `
        <article class="timeline-item">
          <div class="timeline-item__header">
            <div>
              <p class="eyebrow">${item.period}</p>
              <h3>${item.role}</h3>
            </div>
          </div>
          <div class="timeline-item__meta">
            ${createMetaPill(item.company)}
            ${createMetaPill(item.location)}
            ${createMetaPill(item.type)}
          </div>
          <p>${item.summary}</p>
          <ul class="detail-list">
            ${item.highlights.map((point) => `<li>${point}</li>`).join('')}
          </ul>
        </article>
      `
    )
    .join('');
}


function createProjectCard(project) {
  return `
    <article class="card project-card">
      <p class="eyebrow">${project.stage}</p>
      <h3>${project.title}</h3>
      <div class="project-card__meta">
        ${createMetaPill(project.shortLabel)}
        ${createMetaPill(project.focusArea)}
      </div>
      <p class="project-card__summary">${project.summary}</p>
      <div class="project-card__tags">${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}</div>
      <a class="project-card__link" href="${project.url}">${project.linkLabel}</a>
    </article>
  `;
}

function renderProjects(projects) {
  const target = document.querySelector('[data-projects-grid]');
  if (!target) return;
  target.innerHTML = projects.map(createProjectCard).join('');
}

async function init() {
  try {
    const [profile, experience, articles, projects] = await Promise.all([
      loadJson(DATA_PATHS.profile),
      loadJson(DATA_PATHS.experience),
      loadJson(DATA_PATHS.articles),
      loadJson(DATA_PATHS.projects)
    ]);

    renderHeader(profile);
    renderFooter(profile);
    applyProfileContent(profile);
    const articleItems = Array.isArray(articles) ? articles : articles.items;
    renderHome(profile, experience.items, articleItems, projects.items);
    renderAbout(profile);
    renderExperience(experience.items);
    renderProjects(projects.items);
    wireHeadshotFallback();
  } catch (error) {
    console.error(error);
  }
}

init();
