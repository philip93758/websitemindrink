import { WEBSITE_DRINK_PRESETS, getDrinkPreset } from '/shared/alcohol/drinks.js?v=calculator-20260620';
import {
  buildDrinkTypeBreakdown,
  calculateDrinkResult,
  calculateEquivalents,
  calculateTotals,
} from '/shared/alcohol/formulas.js?v=calculator-20260620';
import {
  MAX_ABV_PERCENT,
  MAX_QUANTITY,
  MAX_VOLUME_ML,
} from '/shared/alcohol/constants.js?v=calculator-20260620';

const LOCALES = {
  en: {
    drinks: {
      beer: 'Beer',
      wine: 'Wine',
      sparkling_wine: 'Sparkling wine',
      cider: 'Cider',
      spirits: 'Spirits',
      cocktail: 'Cocktail',
      liqueur: 'Liqueur',
      fortified_wine: 'Fortified wine',
      custom: 'Custom',
    },
    incomplete: 'Incomplete',
    enterDetails: 'Enter drink details to see results.',
    limits: 'Use volume up to {volume}ml, ABV up to {abv}%, and quantity up to {quantity}.',
    totalEmpty: 'Total is optional. Add the drink above if you want to build a total.',
    totalOptional: 'Optional: add the drink above to estimate a total.',
    rowDetail: '{quantity} x {volume}ml at {abv}%',
    standardUnits: 'standard units',
    remove: 'Remove',
    byDrinkType: 'By drink type:',
    breakdown: '{count} drinks, {standard} standard units, {uk} UK units, {calories} calories',
    totalIncomplete: 'Some rows need volume, ABV, and quantity before they count.',
    addToTotal: 'Add to total',
    equivalents: {
      heading: 'Equivalent to about',
      beer: '500 ml beer · 5% ABV',
      wine: '750 ml wine bottle · 12% ABV',
    },
  },
  de: {
    drinks: { beer: 'Bier', wine: 'Wein', sparkling_wine: 'Sekt', cider: 'Cider', spirits: 'Spirituosen', cocktail: 'Cocktail', liqueur: 'Likör', fortified_wine: 'Likörwein', custom: 'Eigene Eingabe' },
    incomplete: 'Unvollständig',
    enterDetails: 'Getränkedaten eingeben, um Ergebnisse zu sehen.',
    limits: 'Nutze höchstens {volume} ml, {abv}% ABV und Menge {quantity}.',
    totalEmpty: 'Die Gesamtsumme ist freiwillig. Füge das Getränk oben hinzu, wenn du eine Summe schätzen möchtest.',
    totalOptional: 'Freiwillig: Füge das Getränk oben hinzu, um eine Gesamtsumme zu schätzen.',
    rowDetail: '{quantity} x {volume} ml bei {abv}%',
    standardUnits: 'Standardeinheiten',
    remove: 'Entfernen',
    byDrinkType: 'Nach Getränketyp:',
    breakdown: '{count} Getränke, {standard} Standardeinheiten, {uk} UK-Einheiten, {calories} Kalorien',
    totalIncomplete: 'Einige Zeilen brauchen Volumen, ABV und Anzahl.',
    addToTotal: 'Zur Gesamtsumme hinzufügen',
    equivalents: {
      heading: 'Entspricht etwa',
      beer: '500ml Bier bei 5%',
      wine: '750ml Wein bei 12%',
    },
  },
  fr: {
    drinks: { beer: 'Bière', wine: 'Vin', sparkling_wine: 'Vin pétillant', cider: 'Cidre', spirits: 'Spiritueux', cocktail: 'Cocktail', liqueur: 'Liqueur', fortified_wine: 'Vin fortifié', custom: 'Personnalisé' },
    incomplete: 'Incomplet',
    enterDetails: 'Saisissez les détails de la boisson pour voir les résultats.',
    limits: 'Utilisez jusqu’à {volume} ml, {abv}% ABV et une quantité de {quantity}.',
    totalEmpty: 'Le total est facultatif. Ajoutez la boisson ci-dessus si vous voulez estimer un total.',
    totalOptional: 'Facultatif : ajoutez la boisson ci-dessus pour estimer un total.',
    rowDetail: '{quantity} x {volume} ml à {abv}%',
    standardUnits: 'unités standard',
    remove: 'Retirer',
    byDrinkType: 'Par type de boisson :',
    breakdown: '{count} boissons, {standard} unités standard, {uk} unités UK, {calories} calories',
    totalIncomplete: 'Certaines lignes ont besoin du volume, de l’ABV et de la quantité.',
    addToTotal: 'Ajouter au total',
    equivalents: {
      heading: 'Equivalent à environ',
      beer: '500ml de bière à 5%',
      wine: '750ml de vin à 12%',
    },
  },
  es: {
    drinks: { beer: 'Cerveza', wine: 'Vino', sparkling_wine: 'Espumoso', cider: 'Sidra', spirits: 'Licores', cocktail: 'Cóctel', liqueur: 'Licor', fortified_wine: 'Vino fortificado', custom: 'Personalizado' },
    incomplete: 'Incompleto',
    enterDetails: 'Introduce los datos de la bebida para ver resultados.',
    limits: 'Usa hasta {volume} ml, {abv}% ABV y cantidad {quantity}.',
    totalEmpty: 'El total es voluntario. Añade la bebida de arriba si quieres estimar un total.',
    totalOptional: 'Voluntario: añade la bebida de arriba para estimar un total.',
    rowDetail: '{quantity} x {volume} ml al {abv}%',
    standardUnits: 'unidades estándar',
    remove: 'Eliminar',
    byDrinkType: 'Por tipo de bebida:',
    breakdown: '{count} bebidas, {standard} unidades estándar, {uk} unidades UK, {calories} calorías',
    totalIncomplete: 'Algunas filas necesitan volumen, ABV y cantidad.',
    addToTotal: 'Añadir al total',
    equivalents: {
      heading: 'Equivalente aproximadamente a',
      beer: '500ml de cerveza al 5%',
      wine: '750ml de vino al 12%',
    },
  },
  pt: {
    drinks: { beer: 'Cerveja', wine: 'Vinho', sparkling_wine: 'Espumante', cider: 'Cidra', spirits: 'Destilados', cocktail: 'Coquetel', liqueur: 'Licor', fortified_wine: 'Vinho fortificado', custom: 'Personalizado' },
    incomplete: 'Incompleto',
    enterDetails: 'Insira os dados da bebida para ver os resultados.',
    limits: 'Use até {volume} ml, {abv}% ABV e quantidade {quantity}.',
    totalEmpty: 'O total é voluntário. Adicione a bebida acima se quiser estimar um total.',
    totalOptional: 'Voluntário: adicione a bebida acima para estimar um total.',
    rowDetail: '{quantity} x {volume} ml a {abv}%',
    standardUnits: 'unidades padrão',
    remove: 'Remover',
    byDrinkType: 'Por tipo de bebida:',
    breakdown: '{count} bebidas, {standard} unidades padrão, {uk} unidades UK, {calories} calorias',
    totalIncomplete: 'Algumas linhas precisam de volume, ABV e quantidade.',
    addToTotal: 'Adicionar ao total',
    equivalents: {
      heading: 'Equivalente aproximadamente a',
      beer: '500ml de cerveja a 5%',
      wine: '750ml de vinho a 12%',
    },
  },
  id: {
    drinks: { beer: 'Bir', wine: 'Anggur', sparkling_wine: 'Anggur bersoda', cider: 'Sider', spirits: 'Spirit', cocktail: 'Koktail', liqueur: 'Likur', fortified_wine: 'Anggur fortifikasi', custom: 'Kustom' },
    incomplete: 'Belum lengkap',
    enterDetails: 'Masukkan detail minuman untuk melihat hasil.',
    limits: 'Gunakan maksimal {volume} ml, ABV {abv}%, dan jumlah {quantity}.',
    totalEmpty: 'Total bersifat sukarela. Tambahkan minuman di atas jika ingin memperkirakan total.',
    totalOptional: 'Sukarela: tambahkan minuman di atas untuk memperkirakan total.',
    rowDetail: '{quantity} x {volume} ml pada {abv}%',
    standardUnits: 'unit standar',
    remove: 'Hapus',
    byDrinkType: 'Menurut jenis minuman:',
    breakdown: '{count} minuman, {standard} unit standar, {uk} unit UK, {calories} kalori',
    totalIncomplete: 'Beberapa baris membutuhkan volume, ABV, dan jumlah.',
    addToTotal: 'Tambahkan ke total',
    equivalents: {
      heading: 'Setara dengan sekitar',
      beer: '500ml bir pada 5%',
      wine: '750ml anggur pada 12%',
    },
  },
  it: {
    drinks: { beer: 'Birra', wine: 'Vino', sparkling_wine: 'Spumante', cider: 'Sidro', spirits: 'Superalcolici', cocktail: 'Cocktail', liqueur: 'Liquore', fortified_wine: 'Vino fortificato', custom: 'Personalizzato' },
    incomplete: 'Incompleto',
    enterDetails: 'Inserisci i dettagli della bevanda per vedere i risultati.',
    limits: 'Usa fino a {volume} ml, {abv}% ABV e quantità {quantity}.',
    totalEmpty: 'Il totale è facoltativo. Aggiungi la bevanda sopra se vuoi stimare un totale.',
    totalOptional: 'Facoltativo: aggiungi la bevanda sopra per stimare un totale.',
    rowDetail: '{quantity} x {volume} ml al {abv}%',
    standardUnits: 'unità standard',
    remove: 'Rimuovi',
    byDrinkType: 'Per tipo di bevanda:',
    breakdown: '{count} bevande, {standard} unità standard, {uk} unità UK, {calories} calorie',
    totalIncomplete: 'Alcune righe richiedono volume, ABV e quantità.',
    addToTotal: 'Aggiungi al totale',
    equivalents: {
      heading: 'Circa equivalente a',
      beer: '500ml di birra al 5%',
      wine: '750ml di vino al 12%',
    },
  },
  ja: {
    drinks: { beer: 'ビール', wine: 'ワイン', sparkling_wine: 'スパークリングワイン', cider: 'サイダー', spirits: '蒸留酒', cocktail: 'カクテル', liqueur: 'リキュール', fortified_wine: '酒精強化ワイン', custom: 'カスタム' },
    incomplete: '未入力',
    enterDetails: '結果を見るには飲み物の詳細を入力してください。',
    limits: '容量は{volume}mlまで、ABVは{abv}%まで、数量は{quantity}までです。',
    totalEmpty: '合計は任意です。合計を確認したい場合は、上の飲み物を追加してください。',
    totalOptional: '任意: 上の飲み物を追加して合計を見積もれます。',
    rowDetail: '{quantity} x {volume}ml、{abv}%',
    standardUnits: '標準単位',
    remove: '削除',
    byDrinkType: '飲み物別:',
    breakdown: '{count}杯、{standard}標準単位、{uk} UK単位、{calories}カロリー',
    totalIncomplete: '一部の行に容量、ABV、数量が必要です。',
    addToTotal: '合計に追加',
    equivalents: {
      heading: 'およそ次と同等',
      beer: '500mlのビール5%',
      wine: '750mlのワイン12%',
    },
  },
};

function getLocaleCopy() {
  const lang = document.documentElement.lang || 'en';
  return LOCALES[lang] || LOCALES.en;
}

function t(template, values = {}) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template
  );
}

const copy = getLocaleCopy();

function trackCalculatorEvent(eventName) {
  if (typeof window.mindrinkTrack === 'function') {
    window.mindrinkTrack(eventName);
  }
}

const calculatorState = {
  draftDrink: { drinkType: 'beer', volumeMl: 500, abvPercent: 5, quantity: 1 },
  totalRows: [],
  nextRowId: 1,
};

function formatNumber(value, decimals = 1) {
  if (value === null || value === undefined) return '';
  return value.toFixed(decimals);
}

function formatCalories(value) {
  if (value === null || value === undefined) return '';
  return Math.round(value).toString();
}

function generateRowId() {
  return `row-${calculatorState.nextRowId++}`;
}

function getDrinkLabel(drinkType) {
  return copy.drinks[drinkType] || getDrinkPreset(drinkType).label;
}

function getInputHint({ volumeMl, abvPercent, quantity }) {
  if (volumeMl === null || volumeMl === '' || abvPercent === null || abvPercent === '' || quantity === null || quantity === '') {
    return copy.enterDetails;
  }

  if (volumeMl > MAX_VOLUME_ML || abvPercent > MAX_ABV_PERCENT || quantity > MAX_QUANTITY) {
    return t(copy.limits, { volume: MAX_VOLUME_ML, abv: MAX_ABV_PERCENT, quantity: MAX_QUANTITY });
  }

  return '';
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function syncEditorFields() {
  const fields = {
    type: document.getElementById('selected-drink-type'),
    volume: document.getElementById('selected-volume'),
    abv: document.getElementById('selected-abv'),
    quantity: document.getElementById('selected-quantity'),
  };
  const draft = calculatorState.draftDrink;

  if (fields.type) fields.type.value = draft.drinkType;
  if (fields.volume) fields.volume.value = draft.volumeMl ?? '';
  if (fields.abv) fields.abv.value = draft.abvPercent ?? '';
  if (fields.quantity) fields.quantity.value = draft.quantity ?? '';
}

function renderEquivalents() {
  const draft = calculatorState.draftDrink;
  const result = calculateDrinkResult(draft);
  const container = document.getElementById('equivalent-container');

  if (!container) return;

  const hint = getInputHint(draft);

  if (!result.isValid || hint !== '') {
    container.hidden = true;
    return;
  }

  // Use UNROUNDED alcohol grams from the draft calculation
  const normalized = { volumeMl: draft.volumeMl, abvPercent: draft.abvPercent, quantity: draft.quantity };
  const alcoholGrams = (normalized.volumeMl * (normalized.abvPercent / 100) * 0.789) * normalized.quantity;

  const equiv = calculateEquivalents(alcoholGrams);
  const localeCopy = getLocaleCopy();

  // Set the heading
  const labelEl = document.getElementById('equivalent-label');
  if (labelEl) {
    labelEl.textContent = localeCopy.equivalents.heading;
  }

  // Set beer card
  const beerValueEl = document.getElementById('equivalent-beer');
  const beerDetailEl = document.getElementById('equivalent-beer-detail');
  if (beerValueEl && beerDetailEl) {
    beerValueEl.textContent = equiv.beer500mlAt5Percent !== null ? equiv.beer500mlAt5Percent.toFixed(1) : '';
    beerDetailEl.textContent = localeCopy.equivalents.beer;
  }

  // Set wine card
  const wineValueEl = document.getElementById('equivalent-wine');
  const wineDetailEl = document.getElementById('equivalent-wine-detail');
  if (wineValueEl && wineDetailEl) {
    wineValueEl.textContent = equiv.wine750mlAt12Percent !== null ? equiv.wine750mlAt12Percent.toFixed(1) : '';
    wineDetailEl.textContent = localeCopy.equivalents.wine;
  }

  container.hidden = false;
}

function renderDraftResults() {
  const draft = calculatorState.draftDrink;
  const hint = getInputHint(draft);
  const result = calculateDrinkResult(draft);
  const statusEl = document.getElementById('selected-calculator-status');
  const resultIds = [
    'selected-uk-units',
    'selected-global',
    'selected-us',
    'selected-grams',
    'selected-calories',
  ];

  if (statusEl) {
    statusEl.textContent = hint;
    statusEl.hidden = hint === '';
  }

  if (!result.isValid || hint !== '') {
    resultIds.forEach((id) => setText(id, ''));
    renderEquivalents();
    return;
  }

  setText('selected-uk-units', formatNumber(result.ukUnits));
  setText('selected-global', formatNumber(result.globalStandardDrinks));
  setText('selected-us', formatNumber(result.usStandardDrinks));
  setText('selected-grams', formatNumber(result.alcoholGrams));
  setText('selected-calories', formatCalories(result.calories));
  renderEquivalents();
}

function renderTotalRows() {
  const container = document.getElementById('total-rows');
  if (!container) return;

  const hasRows = calculatorState.totalRows.length > 0;
  container.hidden = !hasRows;
  container.innerHTML = '';
  if (!hasRows) return;

  calculatorState.totalRows.forEach((row) => {
    const result = calculateDrinkResult(row);
    const item = document.createElement('div');
    item.className = 'total-row drink-list-row';

    const name = document.createElement('span');
    name.className = 'drink-list-name';
    name.textContent = getDrinkLabel(row.drinkType);

    const detail = document.createElement('span');
    detail.className = 'drink-list-detail';
    detail.textContent = t(copy.rowDetail, {
      quantity: row.quantity ?? '-',
      volume: row.volumeMl ?? '-',
      abv: row.abvPercent ?? '-',
    });

    const units = document.createElement('span');
    units.className = 'drink-list-units';
    units.textContent = result.isValid
      ? `${formatNumber(result.globalStandardDrinks)} ${copy.standardUnits}`
      : copy.incomplete;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'total-remove';
    remove.dataset.rowId = row.id;
    remove.textContent = copy.remove;

    item.append(name, detail, units, remove);
    container.appendChild(item);
  });
}

function renderTotalTotals() {
  const hasRows = calculatorState.totalRows.length > 0;
  const totals = calculateTotals(calculatorState.totalRows);
  const rowHints = calculatorState.totalRows.map(getInputHint).filter(Boolean);
  const blockingHint = rowHints.find((message) => message !== copy.enterDetails) || '';
  const totalHint = blockingHint ||
    (!totals.isValid && rowHints.length > 0 ? copy.totalIncomplete : '');
  const breakdown = buildDrinkTypeBreakdown(
    calculatorState.totalRows.map((row) => ({ ...row, drinkLabel: getDrinkLabel(row.drinkType) }))
  );

  const totalsContainer = document.getElementById('total-totals');
  if (!totalsContainer) return;

  if (!hasRows) {
    totalsContainer.hidden = true;
    return;
  }

  if (totals.isValid && totalHint === '') {
    setText('total-global', formatNumber(totals.totalGlobalStandardDrinks));
    setText('total-uk-units', formatNumber(totals.totalUkUnits));
    setText('total-us', formatNumber(totals.totalUsStandardDrinks));
    setText('total-grams', formatNumber(totals.totalAlcoholGrams));
    setText('total-calories', formatCalories(totals.totalCalories));
  } else {
    ['total-global', 'total-uk-units', 'total-us', 'total-grams', 'total-calories']
      .forEach((id) => setText(id, ''));
  }

  const breakdownEl = document.getElementById('total-breakdown');
  if (breakdownEl && hasRows && totals.isValid && totalHint === '' && Object.keys(breakdown).length > 0) {
    breakdownEl.innerHTML = `<h4>${copy.byDrinkType}</h4>` +
      Object.values(breakdown).map((data) =>
        `<p><strong>${data.label}:</strong> ${t(copy.breakdown, {
          count: data.count,
          standard: formatNumber(data.alcoholGrams / 10),
          uk: formatNumber(data.ukUnits),
          calories: formatCalories(data.calories),
        })}</p>`
      ).join('');
  } else if (breakdownEl) {
    breakdownEl.innerHTML = '';
  }

  totalsContainer.hidden = !hasRows || totalHint !== '';
}

function renderCalculator() {
  syncEditorFields();
  renderDraftResults();
  renderTotalRows();
  renderTotalTotals();
}

function parseNumericInput(value, integer = false) {
  if (value === '') return null;
  const parsed = integer ? parseInt(value, 10) : parseFloat(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function updateDraft(updater) {
  updater(calculatorState.draftDrink);
  renderCalculator();
  trackCalculatorEvent('calculator_single_drink_changed');
}

function addDraftToTotal() {
  const hint = getInputHint(calculatorState.draftDrink);
  const result = calculateDrinkResult(calculatorState.draftDrink);
  if (hint !== '' || !result.isValid) {
    renderCalculator();
    return;
  }

  calculatorState.totalRows.push({
    id: generateRowId(),
    ...calculatorState.draftDrink,
  });
  renderCalculator();
  trackCalculatorEvent('calculator_total_row_added');
}

function setupEditorEvents() {
  const drinkSelect = document.getElementById('selected-drink-type');
  const volumeInput = document.getElementById('selected-volume');
  const abvInput = document.getElementById('selected-abv');
  const quantityInput = document.getElementById('selected-quantity');

  if (drinkSelect) {
    drinkSelect.innerHTML = WEBSITE_DRINK_PRESETS.map((preset) =>
      `<option value="${preset.id}">${getDrinkLabel(preset.id)}</option>`
    ).join('');

    drinkSelect.addEventListener('change', (event) => {
      updateDraft((draft) => {
        const preset = getDrinkPreset(event.target.value);
        draft.drinkType = preset.id;
        draft.volumeMl = preset.defaultVolumeMl;
        draft.abvPercent = preset.defaultAbvPercent;
      });
    });
  }

  if (volumeInput) {
    volumeInput.addEventListener('input', (event) => {
      updateDraft((draft) => {
        draft.volumeMl = parseNumericInput(event.target.value);
      });
    });
  }

  if (abvInput) {
    abvInput.addEventListener('input', (event) => {
      updateDraft((draft) => {
        draft.abvPercent = parseNumericInput(event.target.value);
      });
    });
  }

  if (quantityInput) {
    quantityInput.addEventListener('input', (event) => {
      updateDraft((draft) => {
        draft.quantity = parseNumericInput(event.target.value, true);
      });
    });
  }
}

function setupListEvents() {
  const addRowBtn = document.getElementById('total-add-row');
  const container = document.getElementById('total-rows');

  if (addRowBtn) {
    addRowBtn.textContent = copy.addToTotal;
    addRowBtn.setAttribute('aria-label', copy.addToTotal);
    addRowBtn.addEventListener('click', addDraftToTotal);
  }

  if (container) {
    container.addEventListener('click', (event) => {
      const removeButton = event.target.closest('.total-remove');
      if (!removeButton) return;

      calculatorState.totalRows = calculatorState.totalRows.filter((row) => row.id !== removeButton.dataset.rowId);
      renderCalculator();
      trackCalculatorEvent('calculator_total_row_deleted');
    });
  }
}

const DETAILS_SUMMARIES = {
  de: 'Mehr Details',
  en: 'More details',
  es: 'Más detalles',
  fr: 'Plus de détails',
  id: 'Detail selengkapnya',
  it: 'Più dettagli',
  ja: '詳細',
  pt: 'Mais detalhes',
};

function setupResultDetails() {
  const results = document.querySelector('.selected-results');
  if (!results || results.querySelector('.result-details')) return;

  const secondaryCards = ['selected-uk-units', 'selected-us', 'selected-calories']
    .map((id) => document.getElementById(id)?.closest('.calculator-result'))
    .filter(Boolean);
  if (secondaryCards.length !== 3) return;

  const details = document.createElement('details');
  details.className = 'result-details';
  const summary = document.createElement('summary');
  summary.textContent = DETAILS_SUMMARIES[document.documentElement.lang] || DETAILS_SUMMARIES.en;
  const grid = document.createElement('div');
  grid.className = 'result-details-grid';

  details.append(summary, grid);
  results.insertBefore(details, secondaryCards[0]);
  secondaryCards.forEach((card) => grid.appendChild(card));
}

function setupCTAEvent() {
  const ctaBtn = document.querySelector('.answer-cta a, .answer-cta button');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      trackCalculatorEvent('calculator_cta_clicked');
    });
  }
}

function initCalculator() {
  trackCalculatorEvent('calculator_page_view');
  setupResultDetails();
  setupEditorEvents();
  setupListEvents();
  setupCTAEvent();
  renderCalculator();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCalculator);
} else {
  initCalculator();
}
