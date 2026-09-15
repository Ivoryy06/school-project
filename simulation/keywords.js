/**
 * keywords.js
 * Serper.dev API integration for the Keywords page.
 *
 * Serper.dev provides Google Search results (web + images) via a simple
 * REST endpoint — no Search Engine ID required, just one API key.
 *
 * Docs: https://serper.dev/api-reference
 */

'use strict';

// ─── Default API key (pre-filled) ────────────────────────────────────────────
// Users can override this in the ⚙️ config panel; it gets saved to localStorage.
const DEFAULT_API_KEY = 'd033bb9718bace3741ef7e882a6d291841591554';
const DEFAULT_LANG    = 'id'; // 'id' = Indonesian, 'en' = English, etc.

// ─── Storage keys ─────────────────────────────────────────────────────────────
const LS_API_KEY = 'kw_apiKey';
const LS_LANG    = 'kw_lang';
const LS_CACHE   = 'kw_cache'; // { cacheKey: resultArray }

// ─── State ────────────────────────────────────────────────────────────────────
let openCount = 0;
let currentResults = [];

// ─── Config helpers ───────────────────────────────────────────────────────────
function getConfig() {
  return {
    apiKey: localStorage.getItem(LS_API_KEY) || DEFAULT_API_KEY,
    lang:   localStorage.getItem(LS_LANG)    || DEFAULT_LANG,
  };
}

// ─── Cache helpers ────────────────────────────────────────────────────────────
function loadCache() {
  try { return JSON.parse(localStorage.getItem(LS_CACHE)) || {}; }
  catch { return {}; }
}

function saveCache(cache) {
  try { localStorage.setItem(LS_CACHE, JSON.stringify(cache)); }
  catch { /* quota exceeded — ignore */ }
}

// ─── UI helpers ───────────────────────────────────────────────────────────────
function setStatus(msg, type = '') {
  const el = document.getElementById('statusBar');
  if (!el) return;
  el.className = 'status-bar' + (type ? ' ' + type : '');
  el.innerHTML = msg;
}

function updateCount() {
  const el = document.getElementById('openCount');
  if (el) el.textContent = openCount;
}

function updateTotal(n) {
  const el = document.getElementById('totalCount');
  if (el) el.textContent = n;
}

// ─── Serper.dev API ───────────────────────────────────────────────────────────
/**
 * Fetch web + image results from Serper.dev for `query`.
 * Returns an array of:
 *   { word, explanation, thumbUrl, searchUrl, displayUrl }
 *
 * Two parallel requests:
 *   POST https://google.serper.dev/search  → organic results (snippets)
 *   POST https://google.serper.dev/images  → image thumbnails
 */
async function fetchFromSerper(query) {
  const { apiKey, lang } = getConfig();

  if (!apiKey) {
    throw new Error('API key diperlukan. Buka panel ⚙️ dan masukkan Serper.dev API key.');
  }

  // Cache check
  const cache = loadCache();
  const cacheKey = `${query}__${lang}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  const headers = {
    'X-API-KEY': apiKey,
    'Content-Type': 'application/json',
  };

  const body = (extra = {}) => JSON.stringify({
    q: query,
    hl: lang,
    num: 10,
    ...extra,
  });

  // Parallel: web search + image search
  const [webResp, imgResp] = await Promise.allSettled([
    fetch('https://google.serper.dev/search', { method: 'POST', headers, body: body() })
      .then(r => r.json()),
    fetch('https://google.serper.dev/images', { method: 'POST', headers, body: body() })
      .then(r => r.json()),
  ]);

  // Handle web search failure
  if (webResp.status === 'rejected') {
    throw new Error('Network error: ' + webResp.reason);
  }

  const webData = webResp.value;

  // Serper returns { message } on auth/quota errors
  if (webData.message) {
    throw new Error('Serper.dev: ' + webData.message);
  }

  const organicItems = webData.organic || [];
  const imageItems   = (imgResp.status === 'fulfilled' && !imgResp.value.message)
                       ? (imgResp.value.images || [])
                       : [];

  // Merge: pair each organic result with the matching image
  const results = organicItems.map((item, i) => {
    const img = imageItems[i];
    return {
      word:       item.title || query,
      explanation: item.snippet || '',
      thumbUrl:   img ? (img.thumbnailUrl || img.imageUrl || null) : null,
      searchUrl:  item.link || null,
      displayUrl: item.displayLink || item.link || '',
    };
  });

  // If there were no organic results but there's a knowledgeGraph, surface it
  if (results.length === 0 && webData.knowledgeGraph) {
    const kg = webData.knowledgeGraph;
    results.push({
      word:       kg.title || query,
      explanation: kg.description || '',
      thumbUrl:   kg.imageUrl || null,
      searchUrl:  kg.descriptionLink || null,
      displayUrl: kg.descriptionSource || '',
    });
  }

  cache[cacheKey] = results;
  saveCache(cache);
  return results;
}

// ─── Card builder ─────────────────────────────────────────────────────────────
function buildCard(item, index) {
  const card = document.createElement('div');
  card.className = 'card';

  const imgHtml = item.thumbUrl
    ? `<img
         class="card-image"
         src="${escapeAttr(item.thumbUrl)}"
         alt="${escapeAttr(item.word)}"
         loading="lazy"
         onerror="this.style.display='none'"
       />`
    : '';

  card.innerHTML = `
    <div class="card-number">#${String(index + 1).padStart(3, '0')}</div>
    <div class="card-word">${escapeHtml(item.word)}</div>
    <div class="card-body">
      ${imgHtml}
      <div class="card-explanation">${escapeHtml(item.explanation)}</div>
      ${item.searchUrl
        ? `<a class="card-link"
               href="${escapeAttr(item.searchUrl)}"
               target="_blank"
               rel="noopener noreferrer">
             🔗 ${escapeHtml(item.displayUrl)}
           </a>`
        : ''}
    </div>
    <div class="card-toggle">+</div>
  `;

  card.addEventListener('click', (e) => {
    if (e.target.closest('.card-link')) return; // let link open normally
    const wasActive = card.classList.contains('active');
    card.classList.toggle('active');
    openCount += wasActive ? -1 : 1;
    updateCount();
  });

  return card;
}

// ─── Escape helpers ───────────────────────────────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}

function escapeAttr(str) {
  if (!str) return '';
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ─── Grid renderer ────────────────────────────────────────────────────────────
function renderGrid(items) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  openCount = 0;
  updateCount();

  if (!items || items.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <span class="icon">🔍</span>
        Tidak ada hasil. Coba kata kunci lain.
      </div>`;
    updateTotal(0);
    return;
  }

  currentResults = items;
  items.forEach((item, i) => grid.appendChild(buildCard(item, i)));
  updateTotal(items.length);
}

// ─── Search handler ───────────────────────────────────────────────────────────
async function doSearch() {
  const input = document.getElementById('searchInput');
  const btnEl = document.getElementById('btnSearch');
  const query = (input?.value || '').trim();

  if (!query) {
    setStatus('Masukkan kata kunci terlebih dahulu.', 'error');
    input?.focus();
    return;
  }

  setStatus('<span class="spinner"></span>Mencari…', 'loading');
  if (btnEl) btnEl.disabled = true;

  try {
    const results = await fetchFromSerper(query);
    renderGrid(results);
    setStatus(`✅ ${results.length} hasil untuk "<strong>${escapeHtml(query)}</strong>"`);
  } catch (err) {
    setStatus('❌ ' + escapeHtml(err.message), 'error');
    console.error('[keywords.js]', err);
  } finally {
    if (btnEl) btnEl.disabled = false;
  }
}

// ─── Expand / Collapse all ────────────────────────────────────────────────────
function expandAll() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(c => c.classList.add('active'));
  openCount = cards.length;
  updateCount();
}

function collapseAll() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(c => c.classList.remove('active'));
  openCount = 0;
  updateCount();
}

// ─── Config panel handlers ────────────────────────────────────────────────────
function saveConfig() {
  const apiKey = document.getElementById('cfgApiKey')?.value.trim();
  const lang   = document.getElementById('cfgLang')?.value.trim() || DEFAULT_LANG;

  if (apiKey) localStorage.setItem(LS_API_KEY, apiKey);
  localStorage.setItem(LS_LANG, lang);

  // Bust cache so new key/language is used immediately
  localStorage.removeItem(LS_CACHE);
  setStatus('✅ Konfigurasi disimpan. Cache dikosongkan.');
}

function clearCache() {
  localStorage.removeItem(LS_CACHE);
  setStatus('🗑️ Cache dikosongkan.');
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const cfg = getConfig();

  // Pre-fill config inputs
  const cfgApiKey = document.getElementById('cfgApiKey');
  const cfgLang   = document.getElementById('cfgLang');
  if (cfgApiKey) cfgApiKey.value = cfg.apiKey;
  if (cfgLang)   cfgLang.value   = cfg.lang;

  // Enter key triggers search
  document.getElementById('searchInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });

  // Placeholder state
  const grid = document.getElementById('grid');
  if (grid) {
    grid.innerHTML = `
      <div class="empty-state">
        <span class="icon">🌐</span>
        Masukkan kata kunci dan klik <strong>Cari</strong> untuk memulai.
      </div>`;
  }

  setStatus('✅ Serper.dev siap. Masukkan kata kunci untuk mencari.');
});
