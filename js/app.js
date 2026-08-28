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
  [...new Set(state.models.map(m => m.provider))].sort().forEach(p => {
    const o = document.createElement("option");
    o.value = p; o.textContent = p; select.appendChild(o);
  });
}

function bindEvents() {
  $("#searchInput").addEventListener("input", render);
  ["providerFilter","typeFilter","modalityFilter","contextFilter","sortSelect"].forEach(id => {
    $("#" + id).addEventListener("change", render);
  });
  $("#filtersToggle").addEventListener("click", () => $("#filtersPanel").classList.toggle("open"));
  $("#clearFilters").addEventListener("click", () => {
    $("#searchInput").value = "";
    $("#providerFilter").value = "";
    $("#typeFilter").value = "";
    $("#modalityFilter").value = "";
    $("#contextFilter").value = "0";
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
  const sort = $("#sortSelect").value;

  let arr = state.models.filter(m => {
    const hay = `${m.name} ${m.provider} ${m.type} ${m.modalities.join(" ")}`.toLowerCase();
    return (!q || hay.includes(q))
      && (!provider || m.provider === provider)
      && (!type || m.type === type)
      && (!modality || m.modalities.includes(modality))
      && m.context >= minContext;
  });

  arr.sort((a,b) => {
    if (sort === "date") return new Date(b.releaseDate) - new Date(a.releaseDate);
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "context") return b.context - a.context;
    return b.atlasScore - a.atlasScore;
  });
  return arr;
}

function render() {
  state.filtered = getFiltered();
  $("#modelCount").textContent = state.filtered.length;
  $("#modelGrid").innerHTML = state.filtered.map(cardHTML).join("");
  $("#emptyState").classList.toggle("hidden", state.filtered.length !== 0);
  $("#modelGrid").classList.toggle("hidden", state.filtered.length === 0);
  $("#activeFilters").innerHTML = buildActiveFilters();
  $("#compareCount").textContent = state.compare.size;
  $("#compareBar").classList.toggle("visible", state.compare.size > 0);
  $$(".details-btn").forEach(b => b.addEventListener("click", () => openDetails(b.dataset.id)));
  $$(".compare-check").forEach(c => c.addEventListener("change", e => toggleCompare(e.target.dataset.id, e.target.checked)));
}

function cardHTML(m) {
  const initials = m.provider.slice(0,2).toUpperCase();
  const metrics = Object.entries(m.benchmarks).slice(0,4)
    .map(([k,v]) => `<div class="metric"><small>${escapeHTML(k)}</small><strong>${v}</strong></div>`).join("");
  const checked = state.compare.has(m.id) ? "checked" : "";
  return `<article class="card">
    <div class="card-top">
      <div class="logo">${initials}</div>
      <div class="card-title">
        <h2>${escapeHTML(m.name)}</h2>
        <div class="provider">${escapeHTML(m.provider)}</div>
        <div class="meta"><span class="badge">${escapeHTML(m.type)}</span><span class="badge">${formatContext(m.context)} contexto</span></div>
      </div>
      <div><input class="compare-check" type="checkbox" data-id="${m.id}" ${checked} title="Añadir a comparación" aria-label="Comparar ${escapeHTML(m.name)}"></div>
      <div class="score"><b>${m.atlasScore}</b><span>ATLAS SCORE</span></div>
    </div>
    <div class="benchmarks">${metrics}</div>
    <div class="date">Lanzamiento: ${formatDate(m.releaseDate)}</div>
    <div class="card-footer">
      <button class="secondary-btn details-btn" data-id="${m.id}">Ver detalles</button>
      <a class="primary-btn" href="${m.officialUrl}" target="_blank" rel="noopener noreferrer">Web ↗</a>
    </div>
  </article>`;
}

function buildActiveFilters() {
  const labels = [];
  if ($("#searchInput").value) labels.push(`Búsqueda: ${escapeHTML($("#searchInput").value)}`);
  if ($("#providerFilter").value) labels.push(escapeHTML($("#providerFilter").value));
  if ($("#typeFilter").value) labels.push(escapeHTML($("#typeFilter").value));
  if ($("#modalityFilter").value) labels.push(escapeHTML($("#modalityFilter").value));
  if ($("#contextFilter").value !== "0") labels.push(`${formatContext(Number($("#contextFilter").value))}+`);
  return labels.map(x => `<span class="badge">${x}</span>`).join("");
}

function openDetails(id) {
  const m = state.models.find(x => x.id === id);
  $("#dialogContent").innerHTML = `<div class="dialog-body">
    <div class="detail-grid">
      <section>
        <div class="badge">${escapeHTML(m.type)}</div>
        <h1 style="font-size:42px;margin:12px 0 4px">${escapeHTML(m.name)}</h1>
        <p class="provider">${escapeHTML(m.provider)}</p>
        <div class="detail-score">${m.atlasScore}<small style="font-size:14px;color:var(--muted)"> / 100 Atlas Score</small></div>
        <p>Fecha de lanzamiento: <strong>${formatDate(m.releaseDate)}</strong></p>
        <p>Ventana de contexto: <strong>${formatContext(m.context)}</strong></p>
        <p>Modalidades: <strong>${escapeHTML(m.modalities.join(", "))}</strong></p>
        <p><a class="primary-btn" style="display:inline-block" href="${m.officialUrl}" target="_blank" rel="noopener noreferrer">Sitio oficial ↗</a></p>
        <p><a class="secondary-btn" style="display:inline-block" href="${m.apiUrl}" target="_blank" rel="noopener noreferrer">API / documentación ↗</a></p>
      </section>
      <section>
        <h3>Benchmarks</h3>
        <table class="bench-table">
          <thead><tr><th>Benchmark</th><th>Puntaje</th></tr></thead>
          <tbody>${Object.entries(m.benchmarks).map(([k,v]) => `<tr><td>${escapeHTML(k)}</td><td><strong>${v}</strong></td></tr>`).join("")}</tbody>
        </table>
        <p class="date">Los valores del catálogo son datos de referencia y deben verificarse contra la fuente original.</p>
      </section>
    </div>
  </div>`;
  $("#modelDialog").showModal();
}

function toggleCompare(id, checked) {
  if (checked) {
    if (state.compare.size >= 5) { alert("Puedes comparar hasta 5 modelos."); render(); return; }
    state.compare.add(id);
  } else state.compare.delete(id);
  render();
}

function openCompare() {
  const selected = state.models.filter(m => state.compare.has(m.id));
  if (selected.length < 2) { alert("Selecciona al menos 2 modelos."); return; }
  const benchmarks = [...new Set(selected.flatMap(m => Object.keys(m.benchmarks)))];
  $("#compareContent").innerHTML = `<table class="compare-table">
    <thead><tr><th>Métrica</th>${selected.map(m => `<th>${escapeHTML(m.name)}</th>`).join("")}</tr></thead>
    <tbody>
      <tr><th>Proveedor</th>${selected.map(m => `<td>${escapeHTML(m.provider)}</td>`).join("")}</tr>
      <tr><th>Atlas Score</th>${selected.map(m => `<td><strong>${m.atlasScore}</strong></td>`).join("")}</tr>
      <tr><th>Lanzamiento</th>${selected.map(m => `<td>${formatDate(m.releaseDate)}</td>`).join("")}</tr>
      <tr><th>Contexto</th>${selected.map(m => `<td>${formatContext(m.context)}</td>`).join("")}</tr>
      ${benchmarks.map(b => `<tr><th>${escapeHTML(b)}</th>${selected.map(m => `<td>${m.benchmarks[b] ?? "—"}</td>`).join("")}</tr>`).join("")}
    </tbody>
  </table>`;
  $("#compareDialog").showModal();
}

function formatContext(n) {
  if (n >= 1000000) return `${(n/1000000).toFixed(n%1000000 ? 1 : 0)}M`;
  return `${Math.round(n/1000)}K`;
}
function formatDate(s) {
  return new Intl.DateTimeFormat("es-CL", {year:"numeric", month:"short", day:"numeric"}).format(new Date(s + "T12:00:00"));
}
function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("llm-atlas-theme", next);
}
function restoreTheme() {
  const saved = localStorage.getItem("llm-atlas-theme");
  if (saved) document.documentElement.dataset.theme = saved;
}
init().catch(err => {
  console.error(err);
  $("#modelGrid").innerHTML = `<div class="empty"><h2>No se pudo cargar el catálogo</h2><p>Abre la aplicación desde un servidor local (no directamente como file://).</p></div>`;
});
