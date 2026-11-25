// NusaData — router, views and charts. All rendering is client-side from
// window.NUSA (data.js). No network requests: every link, tab, sort, search
// and selector below works offline in a static file.
(function () {
  var D = window.NUSA;
  var view = document.getElementById('view');
  var state = { year: 2024, sortKey: 'pop', sortDir: -1, query: '', selected: null, econTab: 'growth' };

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function fmt(n, d) {
    return Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  function ind(key, year) { return D.INDICATORS[key].values[year]; }
  function delta(key) {
    var a = ind(key, state.year), b = ind(key, state.year - 1);
    if (b === undefined) return '';
    var diff = a - b;
    var good = (key === 'inflation' || key === 'unemployment' || key === 'poverty') ? diff < 0 : diff > 0;
    var sign = diff > 0 ? '+' : '';
    return '<div class="delta ' + (good ? 'up' : 'down') + '">' + sign + fmt(diff, 2) +
      ' vs ' + (state.year - 1) + '</div>';
  }
  function kpi(key) {
    var I = D.INDICATORS[key];
    return '<div class="card kpi"><div class="num">' + fmt(ind(key, state.year), I.fmt) + '</div>' +
      '<div class="lbl">' + esc(I.label) + ' — ' + esc(I.unit) + ' (' + state.year + ')</div>' +
      delta(key) + '</div>';
  }
  function yearSeg() {
    return '<div class="seg" role="group" aria-label="Year">' + D.YEARS.map(function (y) {
      return '<button data-year="' + y + '" class="' + (y === state.year ? 'on' : '') + '">' + y + '</button>';
    }).join('') + '</div>';
  }
  function bars(rows, colorClass) {
    var max = Math.max.apply(null, rows.map(function (r) { return r.v; }));
    return rows.map(function (r) {
      return '<div class="bar-row"><span>' + esc(r.label) + '</span>' +
        '<span class="bar-track"><span class="bar-fill ' + (colorClass || '') + '" style="display:block;width:' +
        (r.v / max * 100).toFixed(1) + '%"></span></span>' +
        '<span class="bar-val">' + fmt(r.v, 1) + (r.suffix || '') + '</span></div>';
    }).join('');
  }
  function lineChart() {
    var pts = D.GROWTH_SERIES, W = 760, H = 270, PL = 44, PR = 16, PT = 30, PB = 34;
    var min = -3, max = 6;
    function X(i) { return PL + i * (W - PL - PR) / (pts.length - 1); }
    function Y(v) { return PT + (max - v) * (H - PT - PB) / (max - min); }
    var grid = '';
    [-2, 0, 2, 4, 6].forEach(function (g) {
      grid += '<line x1="' + PL + '" y1="' + Y(g) + '" x2="' + (W - PR) + '" y2="' + Y(g) + '" stroke="#e3e8ee" stroke-width="1"/>' +
        '<text x="' + (PL - 8) + '" y="' + (Y(g) + 4) + '" font-size="12" fill="#5b6675" text-anchor="end" font-family="Arial">' + g + '%</text>';
    });
    var line = pts.map(function (p, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(p.v).toFixed(1); }).join(' ');
    var dots = pts.map(function (p, i) {
      return '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(p.v).toFixed(1) + '" r="5" fill="#0f2a4a"/>' +
        '<text x="' + X(i) + '" y="' + (Y(p.v) - 11) + '" font-size="12.5" font-weight="bold" fill="#0f2a4a" text-anchor="middle" font-family="Arial">' + fmt(p.v, 2) + '%</text>' +
        '<text x="' + X(i) + '" y="' + (H - 10) + '" font-size="12.5" fill="#5b6675" text-anchor="middle" font-family="Arial">' + p.year + '</text>';
    }).join('');
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Real GDP growth 2019 to 2024">' +
      grid + '<path d="' + line + '" fill="none" stroke="#c9a227" stroke-width="3"/>' + dots + '</svg>';
  }
  function donut() {
    var total = D.SECTORS.reduce(function (a, s) { return a + s.v; }, 0);
    var r = 80, C = 2 * Math.PI * r, off = 0;
    var rings = D.SECTORS.map(function (s) {
      var len = s.v / total * C;
      var el = '<circle cx="110" cy="110" r="' + r + '" fill="none" stroke="' + s.color +
        '" stroke-width="34" stroke-dasharray="' + len.toFixed(1) + ' ' + (C - len).toFixed(1) +
        '" stroke-dashoffset="' + (-off).toFixed(1) + '"/>';
      off += len;
      return el;
    }).join('');
    var legend = D.SECTORS.map(function (s) {
      return '<span><i style="background:' + s.color + '"></i>' + esc(s.label) + ' ' + fmt(s.v, 1) + '%</span>';
    }).join('');
    return '<div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">' +
      '<svg width="220" height="220" viewBox="0 0 220 220" role="img" aria-label="GDP by sector 2024">' + rings +
      '<text x="110" y="104" font-size="26" font-weight="bold" fill="#0f2a4a" text-anchor="middle" font-family="Arial">US$1.40tn</text>' +
      '<text x="110" y="128" font-size="13" fill="#5b6675" text-anchor="middle" font-family="Arial">GDP, 2024</text></svg>' +
      '<div class="legend" style="flex:1;min-width:220px">' + legend + '</div></div>';
  }

  function vDashboard() {
    return '<p class="kicker">Indonesia · 2024</p><h1>Indonesia in numbers</h1>' +
      '<p class="lede">The world\u2019s fourth most populous country, the largest economy in ' +
      'Southeast Asia — population, economy, health and regions, on one page.</p>' +
      '<div class="toolbar"><span class="note">Show figures for</span>' + yearSeg() + '</div>' +
      '<div class="grid">' + kpi('population') + kpi('gdp') + kpi('unemployment') + kpi('poverty') + '</div>' +
      '<div class="grid two"><div class="card"><h2>Real GDP growth, 2019–2024</h2>' + lineChart() +
      '<p class="note">Growth rebounded after the 2020 pandemic contraction and has held above 5% since 2022. Source: BPS.</p></div>' +
      '<div class="card"><h2>Who lives here — age structure, 2024</h2>' +
      bars(D.AGE_GROUPS.map(function (g) { return { label: g.label, v: g.v, suffix: '%' }; }), 'teal') +
      '<p class="note">Median age ' + fmt(D.FACTS.medianAge, 1) + ' years; ' + fmt(D.FACTS.urbanShare, 1) +
      '% of people live in towns and cities. Source: BPS.</p></div></div>' +
      '<div class="card"><h2>At a glance</h2><p>38 provinces and 514 districts across more than 17,000 islands, ' +
      'covering 1,904,569 km². GDP per person is about US$' + fmt(D.FACTS.gdpPerCapita, 0) +
      '. Life expectancy is ' + fmt(D.FACTS.life, 1) + ' years and literacy is ' +
      fmt(D.FACTS.literacy, 1) + '%. <a href="#/regions">Explore the regions &rarr;</a></p></div>';
  }
  function vPopulation() {
    var top8 = D.PROVINCES.slice(0, 8).map(function (p) {
      return { label: p.name, v: p.pop, suffix: 'm' };
    });
    return '<p class="kicker">Population</p><h1>281.6 million people</h1>' +
      '<p class="lede">Indonesia is the world\u2019s fourth most populous country. Growth has ' +
      'slowed to about 0.9% a year as families have fewer children, and the population is still young.</p>' +
      '<div class="grid">' + kpi('population') + kpi('life') + kpi('literacy') +
      '<div class="card kpi"><div class="num">' + fmt(D.FACTS.medianAge, 1) + '</div>' +
      '<div class="lbl">Median age — years (2024)</div></div></div>' +
      '<div class="grid two"><div class="card"><h2>Age structure, 2024</h2>' +
      bars(D.AGE_GROUPS.map(function (g) { return { label: g.label, v: g.v, suffix: '%' }; }), 'teal') +
      '<p class="note">More than two in three Indonesians are of working age (15–64). Source: BPS.</p></div>' +
      '<div class="card"><h2>Largest provinces by population, 2024</h2>' +
      bars(top8, 'gold') +
      '<p class="note">Java holds over half the population on less than 7% of the land. ' +
      '<a href="#/regions">Full regional table &rarr;</a></p></div></div>';
  }
  function vEconomy() {
    var rows = D.YEARS.map(function (y) {
      return '<tr><td>' + y + '</td><td class="num">' + fmt(ind('gdp', y), 2) + '</td>' +
        '<td class="num">' + fmt(ind('growth', y), 2) + '%</td><td class="num">' + fmt(ind('inflation', y), 2) +
        '%</td><td class="num">' + fmt(ind('unemployment', y), 2) + '%</td><td class="num">' +
        fmt(ind('poverty', y), 2) + '%</td></tr>';
    }).join('');
    var tab = state.econTab === 'growth' ? lineChart() : donut();
    return '<p class="kicker">Economy</p><h1>US$1.40 trillion, growing above 5%</h1>' +
      '<p class="lede">Southeast Asia\u2019s largest economy. Household spending and investment ' +
      'drive growth; inflation fell to 1.57% in 2024, its lowest in years.</p>' +
      '<div class="tabs"><button data-tab="growth" class="' + (state.econTab === 'growth' ? 'on' : '') + '">GDP growth</button>' +
      '<button data-tab="sectors" class="' + (state.econTab === 'sectors' ? 'on' : '') + '">GDP by sector</button></div>' +
      '<div class="card">' + tab + '</div>' +
      '<div class="card" style="margin-top:14px"><h2>Key indicators by year</h2><table>' +
      '<thead><tr><th>Year</th><th class="num">GDP (US$ tn)</th><th class="num">Growth</th>' +
      '<th class="num">Inflation</th><th class="num">Unemployment</th><th class="num">Poverty</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table>' +
      '<p class="note">Sources: BPS, World Bank. GDP in current US dollars; growth is real (constant-price) GDP.</p></div>';
  }
  function vHealth() {
    return '<p class="kicker">Health &amp; Education</p><h1>Living longer, learning more</h1>' +
      '<p class="lede">Life expectancy has risen to 74 years and literacy is near-universal, ' +
      'but stunting and uneven schooling remain the country\u2019s biggest human-development challenges.</p>' +
      '<div class="grid">' + kpi('life') + kpi('literacy') +
      '<div class="card kpi"><div class="num">' + fmt(D.FACTS.meanSchooling, 1) + '</div>' +
      '<div class="lbl">Mean years of schooling (2024)</div></div>' +
      '<div class="card kpi"><div class="num">' + fmt(D.FACTS.expectedSchooling, 1) + '</div>' +
      '<div class="lbl">Expected years of schooling (2024)</div></div></div>' +
      '<div class="grid two"><div class="card"><h2>Health, 2024</h2>' +
      bars([
        { label: 'Life expectancy', v: 74.0, suffix: ' yrs' },
        { label: 'Infant mortality', v: 16.7, suffix: ' /1k' },
        { label: 'Stunting, under-5s', v: 19.8, suffix: '%' }
      ], 'teal') +
      '<p class="note">Infant mortality is deaths per 1,000 live births. Stunting is the share of ' +
      'children under five shorter than expected for their age. Sources: BPS, Ministry of Health.</p></div>' +
      '<div class="card"><h2>Education, 2024</h2>' +
      bars([
        { label: 'Literacy, 15+', v: 96.0, suffix: '%' },
        { label: 'Mean schooling', v: 9.0, suffix: ' yrs' },
        { label: 'Expected schooling', v: 13.2, suffix: ' yrs' }
      ], 'gold') +
      '<p class="note">Primary enrolment is near-universal; the gap opens in senior secondary ' +
      'school, especially outside Java. Source: BPS.</p></div></div>';
  }
  function density(p) { return Math.round(p.pop * 1000000 / p.area); }
  function vRegions() {
    var q = state.query.trim().toLowerCase();
    var list = D.PROVINCES.filter(function (p) {
      return !q || p.name.toLowerCase().indexOf(q) !== -1 || p.capital.toLowerCase().indexOf(q) !== -1;
    });
    list = list.slice().sort(function (a, b) {
      var ka = state.sortKey === 'density' ? density(a) : a[state.sortKey];
      var kb = state.sortKey === 'density' ? density(b) : b[state.sortKey];
      if (typeof ka === 'string') return state.sortDir * ka.localeCompare(kb);
      return state.sortDir * (ka - kb);
    });
    function th(key, label, num) {
      var arrow = state.sortKey === key ? (state.sortDir === 1 ? ' ▲' : ' ▼') : '';
      return '<th class="' + (num ? 'num' : '') + '"><button data-sort="' + key + '">' + label + arrow + '</button></th>';
    }
    var rows = list.map(function (p) {
      return '<tr data-prov="' + esc(p.name) + '" class="' + (state.selected === p.name ? 'sel' : '') + '">' +
        '<td><strong>' + esc(p.name) + '</strong><br><span class="note">Capital: ' + esc(p.capital) + '</span></td>' +
        '<td class="num">' + fmt(p.pop, 2) + '</td><td class="num">' + fmt(p.area, 0) + '</td>' +
        '<td class="num">' + fmt(density(p), 0) + '</td><td class="num">' + fmt(p.gdpShare, 1) + '%</td></tr>';
    }).join('');
    var sel = D.PROVINCES.find(function (p) { return p.name === state.selected; });
    var detail = sel ? '<div class="detail"><h3>' + esc(sel.name) + '</h3><p>Capital ' + esc(sel.capital) +
      ' · Population ' + fmt(sel.pop, 2) + ' million · Area ' + fmt(sel.area, 0) + ' km² · Density ' +
      fmt(density(sel), 0) + ' people per km² · About ' + fmt(sel.gdpShare, 1) +
      '% of national GDP (2024, rounded estimates).</p></div>' : '';
    return '<p class="kicker">Regions</p><h1>38 provinces, one archipelago</h1>' +
      '<p class="lede">The ten largest provinces hold most of the country. Tap a column to sort, ' +
      'search by name or capital, and tap a row for its detail.</p>' +
      '<div class="toolbar"><input type="search" id="q" placeholder="Search a province or capital…" value="' +
      esc(state.query) + '" aria-label="Search provinces">' + yearSeg() + '</div>' +
      '<div class="card"><table><thead><tr>' + th('name', 'Province') + th('pop', 'Population (m)', true) +
      th('area', 'Area (km²)', true) + th('density', 'Density /km²', true) + th('gdpShare', 'GDP share', true) +
      '</tr></thead><tbody>' + (rows || '<tr><td colspan="5">No province matches “' + esc(state.query) + '”.</td></tr>') +
      '</tbody></table>' + detail +
      '<p class="note">2024 mid-year estimates, BPS, rounded. Density is computed from the ' +
      'population and area shown. DKI Jakarta is the densest by far: 10.68 million people on 664 km².</p></div>';
  }
  function vSources() {
    return '<p class="kicker">Sources</p><h1>Where the numbers come from</h1>' +
      '<p class="lede">Every figure on this site is a rounded public statistic, labelled with its year.</p>' +
      '<div class="card"><ul class="src-list">' +
      '<li><strong>BPS — Statistics Indonesia</strong> (bps.go.id): population, GDP and growth, inflation, unemployment, poverty, life expectancy, literacy and schooling, provincial estimates.</li>' +
      '<li><strong>World Bank</strong> (data.worldbank.org): GDP in current US dollars and cross-checks of growth and poverty series.</li>' +
      '<li><strong>Ministry of Health, Indonesia</strong>: stunting and infant-mortality figures.</li>' +
      '</ul><p class="note">Figures are rounded to one or two decimals for readability; provincial ' +
      'populations are mid-year estimates. Where two sources disagree slightly, the BPS figure is shown. ' +
      'This site is an original presentation and is not affiliated with BPS or any government body.</p></div>';
  }

  var ROUTES = { '': vDashboard, population: vPopulation, economy: vEconomy, health: vHealth, regions: vRegions, sources: vSources };
  function route() {
    var r = (location.hash || '#/').replace(/^#\/?/, '').split('?')[0];
    return ROUTES[r] ? r : '';
  }
  function render() {
    var r = route();
    view.innerHTML = ROUTES[r]();
    document.querySelectorAll('.nav a').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-route') === r);
    });
    view.querySelectorAll('[data-year]').forEach(function (b) {
      b.addEventListener('click', function () { state.year = +b.getAttribute('data-year'); render(); });
    });
    view.querySelectorAll('[data-tab]').forEach(function (b) {
      b.addEventListener('click', function () { state.econTab = b.getAttribute('data-tab'); render(); });
    });
    view.querySelectorAll('[data-sort]').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-sort');
        if (state.sortKey === k) state.sortDir = -state.sortDir;
        else { state.sortKey = k; state.sortDir = k === 'name' ? 1 : -1; }
        render();
      });
    });
    view.querySelectorAll('tbody tr[data-prov]').forEach(function (tr) {
      tr.addEventListener('click', function () {
        state.selected = state.selected === tr.getAttribute('data-prov') ? null : tr.getAttribute('data-prov');
        render();
      });
    });
    var q = document.getElementById('q');
    if (q) {
      q.addEventListener('input', function () { state.query = q.value; render(); var nq = document.getElementById('q'); nq.focus(); nq.setSelectionRange(nq.value.length, nq.value.length); });
    }
  }
  window.addEventListener('hashchange', render);
  render();
})();
