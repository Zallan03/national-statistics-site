// NusaData — Indonesia data. Figures are rounded public statistics for 2022-2024
// (BPS - Statistics Indonesia, World Bank). Every figure on the site carries
// its year; see the Sources page for the origin of each series.
window.NUSA = (function () {
  var YEARS = [2022, 2023, 2024];

  // Headline indicators, by year.
  var INDICATORS = {
    population: { label: 'Population', unit: 'million people', values: { 2022: 275.8, 2023: 278.7, 2024: 281.6 }, fmt: 1 },
    gdp: { label: 'GDP', unit: 'US$ trillion', values: { 2022: 1.32, 2023: 1.37, 2024: 1.40 }, fmt: 2 },
    growth: { label: 'GDP growth', unit: '% per year', values: { 2022: 5.31, 2023: 5.05, 2024: 5.03 }, fmt: 2 },
    inflation: { label: 'Inflation', unit: '% per year', values: { 2022: 5.51, 2023: 2.61, 2024: 1.57 }, fmt: 2 },
    unemployment: { label: 'Unemployment', unit: '% of labour force', values: { 2022: 5.86, 2023: 5.32, 2024: 4.76 }, fmt: 2 },
    poverty: { label: 'Poverty rate', unit: '% of population', values: { 2022: 9.57, 2023: 9.36, 2024: 8.57 }, fmt: 2 },
    life: { label: 'Life expectancy', unit: 'years at birth', values: { 2022: 73.0, 2023: 73.5, 2024: 74.0 }, fmt: 1 },
    literacy: { label: 'Literacy rate', unit: '% aged 15+', values: { 2022: 96.0, 2023: 96.0, 2024: 96.0 }, fmt: 1 }
  };

  // Real GDP growth, 2019-2024 (% per year).
  var GROWTH_SERIES = [
    { year: 2019, v: 5.02 }, { year: 2020, v: -2.07 }, { year: 2021, v: 3.70 },
    { year: 2022, v: 5.31 }, { year: 2023, v: 5.05 }, { year: 2024, v: 5.03 }
  ];

  // Age structure, 2024 (% of population).
  var AGE_GROUPS = [
    { label: 'Aged 0-14', v: 24.5 },
    { label: 'Aged 15-64', v: 68.9 },
    { label: 'Aged 65+', v: 6.6 }
  ];

  // GDP by sector, 2024 (% of GDP).
  var SECTORS = [
    { label: 'Manufacturing', v: 18.9, color: '#0f2a4a' },
    { label: 'Trade', v: 12.9, color: '#16406b' },
    { label: 'Agriculture', v: 12.1, color: '#0f766e' },
    { label: 'Construction', v: 9.9, color: '#c9a227' },
    { label: 'Mining', v: 8.9, color: '#7a6a2f' },
    { label: 'All other sectors', v: 37.3, color: '#9aa7b8' }
  ];

  // Ten largest provinces, 2024 mid-year estimates (BPS, rounded).
  // pop in millions, area in km2, gdpShare = % of national GDP (approx).
  var PROVINCES = [
    { name: 'Jawa Barat', pop: 50.35, area: 35378, gdpShare: 14.4, capital: 'Bandung' },
    { name: 'Jawa Timur', pop: 41.81, area: 47803, gdpShare: 14.2, capital: 'Surabaya' },
    { name: 'Jawa Tengah', pop: 38.01, area: 32801, gdpShare: 8.2, capital: 'Semarang' },
    { name: 'Sumatera Utara', pop: 16.03, area: 72981, gdpShare: 4.9, capital: 'Medan' },
    { name: 'Banten', pop: 12.43, area: 9663, gdpShare: 6.6, capital: 'Serang' },
    { name: 'DKI Jakarta', pop: 10.68, area: 664, gdpShare: 16.4, capital: 'Jakarta' },
    { name: 'Sulawesi Selatan', pop: 9.47, area: 46717, gdpShare: 3.0, capital: 'Makassar' },
    { name: 'Lampung', pop: 9.34, area: 34624, gdpShare: 2.2, capital: 'Bandar Lampung' },
    { name: 'Sumatera Selatan', pop: 9.03, area: 91592, gdpShare: 2.9, capital: 'Palembang' },
    { name: 'Riau', pop: 6.90, area: 87024, gdpShare: 4.0, capital: 'Pekanbaru' }
  ];

  var FACTS = {
    provinces: 38, districts: 514, islands: '17,000+', areaKm2: '1,904,569',
    medianAge: 30.1, urbanShare: 58.6, gdpPerCapita: 4960, gini: 0.379,
    meanSchooling: 9.0, expectedSchooling: 13.2, infantMortality: 16.7, stunting: 19.8
  };

  return {
    YEARS: YEARS, INDICATORS: INDICATORS, GROWTH_SERIES: GROWTH_SERIES,
    AGE_GROUPS: AGE_GROUPS, SECTORS: SECTORS, PROVINCES: PROVINCES, FACTS: FACTS
  };
})();
