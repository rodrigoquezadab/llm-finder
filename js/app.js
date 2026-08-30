const state = {
  models: [],
  filtered: [],
  compare: new Set()
};

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

async function init() {
  state.models = await fetch("data/models.json").then(r => r.json());
  populateProviders();
  bindEvents();
  restoreTheme();
  render();
}

function populateProviders() {
  const select = $("#providerFilter");
  const providers = [...new Set(state.models.map(m => m.provider))].sort();
  providers.forEach(p => {
    const o = document.createElement("option");
    o.value = p;
    o.textContent = p;
    select.appendChild(o);
  });
}

function bindEvents() {
  $("#searchInput").addEventListener("input", render);
  ["providerFilter", "typeFilter", "modalityFilter", "contextFilter", "priceFilter", "speedFilter", "sortSelect"].forEach(id => {
    const el = $("#" + id);
    if (el) el.addEventListener("change", render);
  });
  $("#filtersToggle").addEventListener("click", () => $("#filtersPanel").classList.toggle("open"));
  $("#clearFilters").addEventListener("click", () => {
    $("#searchInput").value = "";
    $("#providerFilter").value = "";
    $("#typeFilter").value = "";
    $("#modalityFilter").value = "";
    $("#contextFilter").value = "0";
    if ($("#priceFilter")) $("#priceFilter").value = "999999";
    if ($("#speedFilter")) $("#speedFilter").value = "0";
    render();
  });
  $("#themeToggle").addEventListener("click", toggleTheme);
  $("#closeDialog").addEventListener("click", () => $("#modelDialog").close());
  $("#closeCompare").addEventListener("click", () => $("#compareDialog").close());
  $("#compareBtn").addEventListener("click", openCompare);
  $("#clearCompare").addEventListener("click", () => { state.compare.clear(); render(); });
}

function getFiltered() {
  const q = $("#searchInput").value.trim().toLowerCase();
  const provider = $("#providerFilter").value;
  const type = $("#typeFilter").value;
  const modality = $("#modalityFilter").value;
  const minContext = Number($("#contextFilter").value);
  const maxPrice = $("#priceFilter") ? Number($("#priceFilter").value) : 999999;
  const minSpeed = $("#speedFilter") ? Number($("#speedFilter").value) : 0;

  return state.models.filter(m => {
    const benchmarksStr = Object.entries(m.benchmarks || {}).map(([k, v]) => `${k} ${v}`).join(" ");
    const hay = `${m.name} ${m.provider} ${m.type} ${m.modalities.join(" ")} ${benchmarksStr}`.toLowerCase();
    
    const priceVal = m.type === "Open Source" || m.type === "Open Weights" ? 0 : (m.pricing?.blended ?? m.pricing?.input ?? 0);
    const speedVal = m.speed || 0;

    return (!q || hay.includes(q))
      && (!provider || m.provider === provider)
      && (!type || m.type === type)
      && (!modality || m.modalities.includes(modality))
      && m.context >= minContext
      && priceVal <= maxPrice
      && speedVal >= minSpeed;
  });
}

function getModelPrice(m) {
  if (m.type === "Open Source" || m.type === "Open Weights") return 0;
  return m.pricing?.blended ?? m.pricing?.input ?? 0;
}

function groupAndSortCompanies(filteredModels) {
  const sort = $("#sortSelect").value;
  const companyMap = new Map();

  filteredModels.forEach(m => {
    if (!companyMap.has(m.provider)) {
      companyMap.set(m.provider, {
        provider: m.provider,
        officialUrl: m.officialUrl,
        models: []
      });
    }
    companyMap.get(m.provider).models.push(m);
  });

  const companies = Array.from(companyMap.values());

  companies.forEach(company => {
    // Sort models inside company based on user preference or newest first by default
    company.models.sort((a, b) => {
      if (sort === "price_asc") return getModelPrice(a) - getModelPrice(b);
      if (sort === "price_desc") return getModelPrice(b) - getModelPrice(a);
      if (sort === "speed") return (b.speed || 0) - (a.speed || 0);
      if (sort === "coding") return ((b.benchmarks?.["SWE-bench"] || 0) - (a.benchmarks?.["SWE-bench"] || 0));
      if (sort === "context") return b.context - a.context;
      if (sort === "score") return b.atlasScore - a.atlasScore;
      return new Date(b.releaseDate) - new Date(a.releaseDate); // default date descending
    });

    company.topScore = Math.max(...company.models.map(m => m.atlasScore));
    company.minPrice = Math.min(...company.models.map(getModelPrice));
    company.maxPrice = Math.max(...company.models.map(getModelPrice));
    company.maxSpeed = Math.max(...company.models.map(m => m.speed || 0));
    company.maxCoding = Math.max(...company.models.map(m => m.benchmarks?.["SWE-bench"] || 0));
    company.maxContext = Math.max(...company.models.map(m => m.context || 0));
    company.latestRelease = company.models[0]?.releaseDate || "1970-01-01";
    company.totalCount = company.models.length;
  });

  // Sort companies
  companies.sort((a, b) => {
    if (sort === "price_asc") return a.minPrice - b.minPrice;
    if (sort === "price_desc") return b.maxPrice - a.maxPrice;
    if (sort === "speed") return b.maxSpeed - a.maxSpeed;
    if (sort === "coding") return b.maxCoding - a.maxCoding;
    if (sort === "context") return b.maxContext - a.maxContext;
    if (sort === "date") return new Date(b.latestRelease) - new Date(a.latestRelease);
    if (sort === "name") return a.provider.localeCompare(b.provider);
    if (sort === "count") return b.totalCount - a.totalCount;
    return b.topScore - a.topScore; // default score
  });

  return companies;
}

function render() {
  state.filtered = getFiltered();
  const companies = groupAndSortCompanies(state.filtered);

  $("#modelCount").textContent = state.filtered.length;
  $("#companyCount").textContent = companies.length;

  if (companies.length === 0) {
    $("#emptyState").classList.remove("hidden");
    $("#modelGrid").classList.add("hidden");
    $("#modelGrid").innerHTML = "";
  } else {
    $("#emptyState").classList.add("hidden");
    $("#modelGrid").classList.remove("hidden");
    $("#modelGrid").innerHTML = companies.map(companyCardHTML).join("");
  }

  $("#activeFilters").innerHTML = buildActiveFilters();
  $("#compareCount").textContent = state.compare.size;
  $("#compareBar").classList.toggle("visible", state.compare.size > 0);

  $$(".details-btn").forEach(b => b.addEventListener("click", () => openDetails(b.dataset.id)));
  $$(".compare-check").forEach(c => c.addEventListener("change", e => toggleCompare(e.target.dataset.id, e.target.checked)));
}

function getProviderTheme(provider) {
  const map = {
    "OpenAI": { color: "#10a37f", bg: "rgba(16, 163, 127, 0.12)" },
    "Anthropic": { color: "#d97757", bg: "rgba(217, 119, 87, 0.12)" },
    "Google": { color: "#4285f4", bg: "rgba(66, 133, 244, 0.12)" },
    "DeepSeek": { color: "#0066ff", bg: "rgba(0, 102, 255, 0.12)" },
    "Meta": { color: "#0081fb", bg: "rgba(0, 129, 251, 0.12)" },
    "xAI": { color: "#f3f3f3", bg: "rgba(255, 255, 255, 0.12)" },
    "Mistral AI": { color: "#ff7000", bg: "rgba(255, 112, 0, 0.12)" },
    "Alibaba": { color: "#ff6a00", bg: "rgba(255, 106, 0, 0.12)" },
    "Cohere": { color: "#39594d", bg: "rgba(57, 89, 77, 0.15)" },
    "IBM": { color: "#0f62fe", bg: "rgba(15, 98, 254, 0.12)" }
  };
  return map[provider] || { color: "var(--accent)", bg: "var(--surface-2)" };
}

function companyCardHTML(c) {
  const initials = c.provider.slice(0, 2).toUpperCase();
  const theme = getProviderTheme(c.provider);
  const modelsHTML = c.models.map((m, idx) => modelVersionHTML(m, idx === 0)).join("");

  return `<article class="company-card">
    <div class="company-header">
      <div class="company-brand">
        <div class="company-logo" style="border-color:${theme.color}; background:${theme.bg}; color:${theme.color};">
          ${initials}
        </div>
        <div class="company-info">
          <h2 class="company-name">${escapeHTML(c.provider)}</h2>
          <div class="company-badges">
            <span class="badge highlight">${c.models.length} ${c.models.length === 1 ? 'versión' : 'versiones'}</span>
            <span class="badge score-badge">Top Score: <strong>${c.topScore.toFixed(1)}</strong></span>
            ${c.maxSpeed ? `<span class="badge speed-badge">⚡ Hasta ${c.maxSpeed} tok/s</span>` : ''}
          </div>
        </div>
      </div>
      <a class="company-site-btn secondary-btn" href="${c.officialUrl}" target="_blank" rel="noopener noreferrer" title="Ir al sitio oficial de ${escapeHTML(c.provider)}">
        Sitio web ↗
      </a>
    </div>

    <div class="versions-header">
      <span>Versiones y modelos</span>
    </div>

    <div class="versions-list">
      ${modelsHTML}
    </div>
  </article>`;
}

function formatPrice(pricing, type) {
  if (type === "Open Source" || type === "Open Weights") return "Gratis / Open";
  if (!pricing) return "—";
  if (pricing.blended !== undefined) return `$${pricing.blended.toFixed(2)} / 1M`;
  if (pricing.input !== undefined) return `$${pricing.input.toFixed(2)} / 1M`;
  return "—";
}

function modelVersionHTML(m, isLatest) {
  const checked = state.compare.has(m.id) ? "checked" : "";
  const metrics = Object.entries(m.benchmarks || {}).slice(0, 4)
    .map(([k, v]) => `<div class="mini-metric"><span class="m-key">${escapeHTML(k)}</span><strong class="m-val">${v}</strong></div>`).join("");

  return `<div class="version-row ${isLatest ? 'is-latest' : ''}">
    <div class="version-top">
      <div class="version-main">
        <div class="version-title-wrap">
          <h3 class="version-name">${escapeHTML(m.name)}</h3>
          ${isLatest ? '<span class="tag-latest">Más reciente</span>' : ''}
        </div>
        <div class="version-meta">
          <span class="meta-pill date-pill">📅 ${formatDate(m.releaseDate)}</span>
          <span class="meta-pill type-pill">${escapeHTML(m.type)}</span>
          <span class="meta-pill ctx-pill">🧠 ${formatContext(m.context)} ctx</span>
          <span class="meta-pill price-pill">💰 ${formatPrice(m.pricing, m.type)}</span>
          ${m.speed ? `<span class="meta-pill speed-pill">⚡ ${m.speed} tok/s</span>` : ''}
          <span class="meta-pill mod-pill">✦ ${escapeHTML(m.modalities.join(", "))}</span>
        </div>
      </div>
      <div class="version-score-wrap">
        <div class="score-display">
          <b>${m.atlasScore.toFixed(1)}</b>
          <small>SCORE</small>
        </div>
      </div>
    </div>

    <div class="version-benchmarks">
      ${metrics}
    </div>

    <div class="version-actions">
      <label class="compare-label" title="Seleccionar para comparar">
        <input class="compare-check" type="checkbox" data-id="${m.id}" ${checked} aria-label="Comparar ${escapeHTML(m.name)}">
        <span>Comparar</span>
      </label>
      <div class="action-buttons">
        <button class="secondary-btn details-btn" data-id="${m.id}" type="button">Detalles</button>
        <a class="primary-btn mini-btn" href="${m.apiUrl || m.officialUrl}" target="_blank" rel="noopener noreferrer">Docs ↗</a>
      </div>
    </div>
  </div>`;
}

function buildActiveFilters() {
  const labels = [];
  if ($("#searchInput").value) labels.push(`Búsqueda: "${escapeHTML($("#searchInput").value)}"`);
  if ($("#providerFilter").value) labels.push(`Empresa: ${escapeHTML($("#providerFilter").value)}`);
  if ($("#typeFilter").value) labels.push(`Tipo: ${escapeHTML($("#typeFilter").value)}`);
  if ($("#modalityFilter").value) labels.push(`Modalidad: ${escapeHTML($("#modalityFilter").value)}`);
  if ($("#contextFilter").value !== "0") labels.push(`Contexto: ${formatContext(Number($("#contextFilter").value))}+`);
  if ($("#priceFilter") && $("#priceFilter").value !== "999999") {
    const val = Number($("#priceFilter").value);
    labels.push(val === 0 ? `Precio: Gratis / Open` : `Precio: ≤ $${val}/1M`);
  }
  if ($("#speedFilter") && $("#speedFilter").value !== "0") {
    labels.push(`Velocidad: ≥ ${$("#speedFilter").value} tok/s`);
  }
  return labels.map(x => `<span class="badge active-tag">${x}</span>`).join("");
}

function openDetails(id) {
  const m = state.models.find(x => x.id === id);
  if (!m) return;
  
  const pricingHTML = m.pricing ? `
    <li><span>Precio Entrada (Input):</span> <strong>$${m.pricing.input.toFixed(2)} / 1M tokens</strong></li>
    <li><span>Precio Salida (Output):</span> <strong>$${m.pricing.output.toFixed(2)} / 1M tokens</strong></li>
    <li><span>Precio Promedio (Blended):</span> <strong>$${m.pricing.blended.toFixed(2)} / 1M tokens</strong></li>
  ` : `<li><span>Precio:</span> <strong>${m.type === 'Propietario' ? 'Consultar proveedor' : 'Gratis / Open Source'}</strong></li>`;

  $("#dialogContent").innerHTML = `<div class="dialog-body">
    <div class="detail-grid">
      <section class="detail-overview">
        <div class="badge highlight">${escapeHTML(m.type)}</div>
        <h1 class="dialog-title">${escapeHTML(m.name)}</h1>
        <p class="dialog-provider">${escapeHTML(m.provider)}</p>
        <div class="detail-score-box">
          <span class="detail-score-val">${m.atlasScore}</span>
          <span class="detail-score-max">/ 100 Atlas Score</span>
        </div>
        <ul class="detail-specs">
          <li><span>Fecha de lanzamiento:</span> <strong>${formatDate(m.releaseDate)}</strong></li>
          <li><span>Ventana de contexto:</span> <strong>${formatContext(m.context)} tokens</strong></li>
          <li><span>Velocidad de generación:</span> <strong>${m.speed ? `${m.speed} tokens/segundo` : 'No medido'}</strong></li>
          <li><span>Modalidades:</span> <strong>${escapeHTML(m.modalities.join(", "))}</strong></li>
          <li><span>Tipo de licencia:</span> <strong>${escapeHTML(m.type)}</strong></li>
          ${pricingHTML}
        </ul>
        <div class="detail-links">
          <a class="primary-btn" href="${m.officialUrl}" target="_blank" rel="noopener noreferrer">Sitio oficial ↗</a>
          <a class="secondary-btn" href="${m.apiUrl || m.officialUrl}" target="_blank" rel="noopener noreferrer">Documentación / API ↗</a>
        </div>
      </section>
      <section class="detail-bench">
        <h3>Benchmarks Oficiales y Evaluaciones</h3>
        <table class="bench-table">
          <thead><tr><th>Benchmark</th><th>Puntaje</th><th>Estado</th></tr></thead>
          <tbody>${Object.entries(m.benchmarks).map(([k, v]) => `
            <tr>
              <td><strong>${escapeHTML(k)}</strong></td>
              <td><span class="bench-score">${v}</span></td>
              <td><span class="bench-bar-wrap"><span class="bench-bar" style="width: ${Math.min(100, v)}%"></span></span></td>
            </tr>`).join("")}
          </tbody>
        </table>
        <p class="bench-footnote">Los valores corresponden a evaluaciones de referencia oficiales e independientes estandarizadas (Artificial Analysis, Opper AI, Arena, Hugging Face).</p>
      </section>
    </div>
  </div>`;
  $("#modelDialog").showModal();
}

function toggleCompare(id, checked) {
  if (checked) {
    if (state.compare.size >= 5) {
      alert("Puedes comparar hasta 5 modelos simultáneamente.");
      render();
      return;
    }
    state.compare.add(id);
  } else {
    state.compare.delete(id);
  }
  render();
}

function openCompare() {
  const selected = state.models.filter(m => state.compare.has(m.id));
  if (selected.length < 2) {
    alert("Selecciona al menos 2 modelos para comparar.");
    return;
  }
  const benchmarks = [...new Set(selected.flatMap(m => Object.keys(m.benchmarks || {})))];
  
  $("#compareContent").innerHTML = `<table class="compare-table">
    <thead>
      <tr>
        <th>Métrica / Modelo</th>
        ${selected.map(m => `<th><div class="th-model">${escapeHTML(m.name)}</div><small class="th-provider">${escapeHTML(m.provider)}</small></th>`).join("")}
      </tr>
    </thead>
    <tbody>
      <tr><th>Empresa / Proveedor</th>${selected.map(m => `<td><strong>${escapeHTML(m.provider)}</strong></td>`).join("")}</tr>
      <tr><th>Atlas Score</th>${selected.map(m => `<td><span class="compare-score">${m.atlasScore}</span></td>`).join("")}</tr>
      <tr><th>Precio Blended (1M tokens)</th>${selected.map(m => `<td><strong>${formatPrice(m.pricing, m.type)}</strong></td>`).join("")}</tr>
      <tr><th>Velocidad (tok/s)</th>${selected.map(m => `<td><strong>${m.speed ? `${m.speed} tok/s` : '—'}</strong></td>`).join("")}</tr>
      <tr><th>Fecha Lanzamiento</th>${selected.map(m => `<td>${formatDate(m.releaseDate)}</td>`).join("")}</tr>
      <tr><th>Ventana Contexto</th>${selected.map(m => `<td>${formatContext(m.context)}</td>`).join("")}</tr>
      <tr><th>Tipo</th>${selected.map(m => `<td><span class="badge">${escapeHTML(m.type)}</span></td>`).join("")}</tr>
      <tr><th>Modalidades</th>${selected.map(m => `<td>${escapeHTML(m.modalities.join(", "))}</td>`).join("")}</tr>
      ${benchmarks.map(b => `<tr><th>${escapeHTML(b)}</th>${selected.map(m => `<td><strong>${m.benchmarks[b] ?? "—"}</strong></td>`).join("")}</tr>`).join("")}
    </tbody>
  </table>`;
  $("#compareDialog").showModal();
}

function formatContext(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(n % 1000000 ? 1 : 0)}M`;
  return `${Math.round(n / 1000)}K`;
}

function formatDate(s) {
  return new Intl.DateTimeFormat("es-CL", { year: "numeric", month: "short", day: "numeric" }).format(new Date(s + "T12:00:00"));
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function updateThemeUI(theme) {
  document.documentElement.dataset.theme = theme;
  const toggleBtn = $("#themeToggle");
  if (toggleBtn) {
    toggleBtn.textContent = theme === "dark" ? "☼" : "☾";
    toggleBtn.title = theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
    toggleBtn.setAttribute("aria-label", toggleBtn.title);
  }
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme || "dark";
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem("llm-atlas-theme", next);
  updateThemeUI(next);
}

function restoreTheme() {
  const saved = localStorage.getItem("llm-atlas-theme");
  const theme = saved || "dark";
  updateThemeUI(theme);
}

init().catch(err => {
  console.error(err);
  $("#modelGrid").innerHTML = `<div class="empty"><h2>No se pudo cargar el catálogo</h2><p>Abre la aplicación desde un servidor local (no directamente como file://).</p></div>`;
});
