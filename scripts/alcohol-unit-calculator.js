import { WEBSITE_DRINK_PRESETS, getDrinkPreset } from '/shared/alcohol/drinks.js?v=calculator-20260515';
import {
  buildDrinkTypeBreakdown,
  calculateDrinkResult,
  calculateWeeklyTotals,
} from '/shared/alcohol/formulas.js?v=calculator-20260515';
import {
  MAX_ABV_PERCENT,
  MAX_QUANTITY,
  MAX_VOLUME_ML,
  WEEKLY_LOW_MAX,
  WEEKLY_MODERATE_MAX,
} from '/shared/alcohol/constants.js?v=calculator-20260515';

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
    weeklyEmpty: 'Weekly total is optional. Add the drink above if you want to build a weekly estimate.',
    weeklyOptional: 'Optional: add the drink above to estimate a weekly total.',
    rowDetail: '{quantity} x {volume}ml at {abv}%',
    standardUnits: 'standard units',
    remove: 'Remove',
    byDrinkType: 'By drink type:',
    breakdown: '{count} drinks, {standard} standard units, {uk} UK units, {calories} calories',
    weeklyIncomplete: 'Some rows need volume, ABV, and quantity before they count.',
    low: 'Your weekly total is relatively low. Tracking over time can still help you understand patterns.',
    moderate: 'Your weekly total shows a noticeable pattern. Dry days can make weekly drinking easier to observe.',
    higher: 'Your weekly total is higher. Seeing patterns over time may help you decide what feels right for you.',
  },
  de: {
    drinks: { beer: 'Bier', wine: 'Wein', sparkling_wine: 'Sekt', cider: 'Cider', spirits: 'Spirituosen', cocktail: 'Cocktail', liqueur: 'Likör', fortified_wine: 'Likörwein', custom: 'Eigene Eingabe' },
    incomplete: 'Unvollständig',
    enterDetails: 'Getränkedaten eingeben, um Ergebnisse zu sehen.',
    limits: 'Nutze höchstens {volume} ml, {abv}% ABV und Menge {quantity}.',
    weeklyEmpty: 'Die Wochensumme ist freiwillig. Füge das Getränk oben hinzu, wenn du eine Woche schätzen möchtest.',
    weeklyOptional: 'Freiwillig: Füge das Getränk oben hinzu, um eine Wochensumme zu schätzen.',
    rowDetail: '{quantity} x {volume} ml bei {abv}%',
    standardUnits: 'Standardeinheiten',
    remove: 'Entfernen',
    byDrinkType: 'Nach Getränketyp:',
    breakdown: '{count} Getränke, {standard} Standardeinheiten, {uk} UK-Einheiten, {calories} Kalorien',
    weeklyIncomplete: 'Einige Zeilen brauchen Volumen, ABV und Anzahl.',
    low: 'Die Wochensumme ist relativ niedrig. Tracking kann trotzdem helfen, Muster zu verstehen.',
    moderate: 'Die Wochensumme zeigt ein sichtbares Muster. Trockene Tage machen es leichter lesbar.',
    higher: 'Die Wochensumme ist höher. Muster über Zeit können helfen zu entscheiden, was passt.',
  },
  fr: {
    drinks: { beer: 'Bière', wine: 'Vin', sparkling_wine: 'Vin pétillant', cider: 'Cidre', spirits: 'Spiritueux', cocktail: 'Cocktail', liqueur: 'Liqueur', fortified_wine: 'Vin fortifié', custom: 'Personnalisé' },
    incomplete: 'Incomplet',
    enterDetails: 'Saisissez les détails de la boisson pour voir les résultats.',
    limits: 'Utilisez jusqu’à {volume} ml, {abv}% ABV et une quantité de {quantity}.',
    weeklyEmpty: 'Le total hebdomadaire est facultatif. Ajoutez la boisson ci-dessus si vous voulez estimer une semaine.',
    weeklyOptional: 'Facultatif : ajoutez la boisson ci-dessus pour estimer un total hebdomadaire.',
    rowDetail: '{quantity} x {volume} ml à {abv}%',
    standardUnits: 'unités standard',
    remove: 'Retirer',
    byDrinkType: 'Par type de boisson :',
    breakdown: '{count} boissons, {standard} unités standard, {uk} unités UK, {calories} calories',
    weeklyIncomplete: 'Certaines lignes ont besoin du volume, de l’ABV et de la quantité.',
    low: 'Votre total hebdomadaire est relativement faible. Le suivi peut quand même aider à comprendre les schémas.',
    moderate: 'Votre total hebdomadaire montre un schéma notable. Les jours sans alcool peuvent le rendre plus lisible.',
    higher: 'Votre total hebdomadaire est plus élevé. Voir les schémas dans le temps peut aider à décider ce qui vous convient.',
  },
  es: {
    drinks: { beer: 'Cerveza', wine: 'Vino', sparkling_wine: 'Espumoso', cider: 'Sidra', spirits: 'Licores', cocktail: 'Cóctel', liqueur: 'Licor', fortified_wine: 'Vino fortificado', custom: 'Personalizado' },
    incomplete: 'Incompleto',
    enterDetails: 'Introduce los datos de la bebida para ver resultados.',
    limits: 'Usa hasta {volume} ml, {abv}% ABV y cantidad {quantity}.',
    weeklyEmpty: 'El total semanal es voluntario. Añade la bebida de arriba si quieres estimar una semana.',
    weeklyOptional: 'Voluntario: añade la bebida de arriba para estimar un total semanal.',
    rowDetail: '{quantity} x {volume} ml al {abv}%',
    standardUnits: 'unidades estándar',
    remove: 'Eliminar',
    byDrinkType: 'Por tipo de bebida:',
    breakdown: '{count} bebidas, {standard} unidades estándar, {uk} unidades UK, {calories} calorías',
    weeklyIncomplete: 'Algunas filas necesitan volumen, ABV y cantidad.',
    low: 'Tu total semanal es relativamente bajo. Registrar puede ayudarte a entender patrones.',
    moderate: 'Tu total semanal muestra un patrón visible. Los días sin alcohol pueden hacerlo más claro.',
    higher: 'Tu total semanal es más alto. Ver patrones en el tiempo puede ayudarte a decidir qué te conviene.',
  },
  pt: {
    drinks: { beer: 'Cerveja', wine: 'Vinho', sparkling_wine: 'Espumante', cider: 'Cidra', spirits: 'Destilados', cocktail: 'Coquetel', liqueur: 'Licor', fortified_wine: 'Vinho fortificado', custom: 'Personalizado' },
    incomplete: 'Incompleto',
    enterDetails: 'Insira os dados da bebida para ver os resultados.',
    limits: 'Use até {volume} ml, {abv}% ABV e quantidade {quantity}.',
    weeklyEmpty: 'O total semanal é voluntário. Adicione a bebida acima se quiser estimar uma semana.',
    weeklyOptional: 'Voluntário: adicione a bebida acima para estimar um total semanal.',
    rowDetail: '{quantity} x {volume} ml a {abv}%',
    standardUnits: 'unidades padrão',
    remove: 'Remover',
    byDrinkType: 'Por tipo de bebida:',
    breakdown: '{count} bebidas, {standard} unidades padrão, {uk} unidades UK, {calories} calorias',
    weeklyIncomplete: 'Algumas linhas precisam de volume, ABV e quantidade.',
    low: 'Seu total semanal é relativamente baixo. Registrar ainda pode ajudar a entender padrões.',
    moderate: 'Seu total semanal mostra um padrão perceptível. Dias sem álcool podem deixá-lo mais claro.',
    higher: 'Seu total semanal é mais alto. Ver padrões ao longo do tempo pode ajudar a decidir o que faz sentido.',
  },
  id: {
    drinks: { beer: 'Bir', wine: 'Anggur', sparkling_wine: 'Anggur bersoda', cider: 'Sider', spirits: 'Spirit', cocktail: 'Koktail', liqueur: 'Likur', fortified_wine: 'Anggur fortifikasi', custom: 'Kustom' },
    incomplete: 'Belum lengkap',
    enterDetails: 'Masukkan detail minuman untuk melihat hasil.',
    limits: 'Gunakan maksimal {volume} ml, ABV {abv}%, dan jumlah {quantity}.',
    weeklyEmpty: 'Total mingguan bersifat sukarela. Tambahkan minuman di atas jika ingin memperkirakan satu minggu.',
    weeklyOptional: 'Sukarela: tambahkan minuman di atas untuk memperkirakan total mingguan.',
    rowDetail: '{quantity} x {volume} ml pada {abv}%',
    standardUnits: 'unit standar',
    remove: 'Hapus',
    byDrinkType: 'Menurut jenis minuman:',
    breakdown: '{count} minuman, {standard} unit standar, {uk} unit UK, {calories} kalori',
    weeklyIncomplete: 'Beberapa baris membutuhkan volume, ABV, dan jumlah.',
    low: 'Total mingguan Anda relatif rendah. Mencatat tetap dapat membantu memahami pola.',
    moderate: 'Total mingguan Anda menunjukkan pola yang terlihat. Hari tanpa alkohol dapat membuatnya lebih mudah dibaca.',
    higher: 'Total mingguan Anda lebih tinggi. Melihat pola dari waktu ke waktu dapat membantu Anda memutuskan apa yang cocok.',
  },
  it: {
    drinks: { beer: 'Birra', wine: 'Vino', sparkling_wine: 'Spumante', cider: 'Sidro', spirits: 'Superalcolici', cocktail: 'Cocktail', liqueur: 'Liquore', fortified_wine: 'Vino fortificato', custom: 'Personalizzato' },
    incomplete: 'Incompleto',
    enterDetails: 'Inserisci i dettagli della bevanda per vedere i risultati.',
    limits: 'Usa fino a {volume} ml, {abv}% ABV e quantità {quantity}.',
    weeklyEmpty: 'Il totale settimanale è facoltativo. Aggiungi la bevanda sopra se vuoi stimare una settimana.',
    weeklyOptional: 'Facoltativo: aggiungi la bevanda sopra per stimare un totale settimanale.',
    rowDetail: '{quantity} x {volume} ml al {abv}%',
    standardUnits: 'unità standard',
    remove: 'Rimuovi',
    byDrinkType: 'Per tipo di bevanda:',
    breakdown: '{count} bevande, {standard} unità standard, {uk} unità UK, {calories} calorie',
    weeklyIncomplete: 'Alcune righe richiedono volume, ABV e quantità.',
    low: 'Il totale settimanale è relativamente basso. Registrare può comunque aiutare a capire i pattern.',
    moderate: 'Il totale settimanale mostra un pattern visibile. I giorni senza alcol possono renderlo più chiaro.',
    higher: 'Il totale settimanale è più alto. Vedere i pattern nel tempo può aiutarti a decidere cosa ti sembra giusto.',
  },
  ja: {
    drinks: { beer: 'ビール', wine: 'ワイン', sparkling_wine: 'スパークリングワイン', cider: 'サイダー', spirits: '蒸留酒', cocktail: 'カクテル', liqueur: 'リキュール', fortified_wine: '酒精強化ワイン', custom: 'カスタム' },
    incomplete: '未入力',
    enterDetails: '結果を見るには飲み物の詳細を入力してください。',
    limits: '容量は{volume}mlまで、ABVは{abv}%まで、数量は{quantity}までです。',
    weeklyEmpty: '週合計は任意です。1週間の目安を作りたい場合は、上の飲み物を追加してください。',
    weeklyOptional: '任意: 上の飲み物を追加して週合計を見積もれます。',
    rowDetail: '{quantity} x {volume}ml、{abv}%',
    standardUnits: '標準単位',
    remove: '削除',
    byDrinkType: '飲み物別:',
    breakdown: '{count}杯、{standard}標準単位、{uk} UK単位、{calories}カロリー',
    weeklyIncomplete: '一部の行に容量、ABV、数量が必要です。',
    low: '週合計は比較的低めです。記録するとパターンを理解しやすくなります。',
    moderate: '週合計に目立つパターンがあります。休肝日があると把握しやすくなります。',
    higher: '週合計は高めです。時間とともにパターンを見ると、自分に合う判断がしやすくなります。',
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
  weeklyRows: [],
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

function getWeeklyInterpretation(totalUkUnits) {
  if (totalUkUnits === null || totalUkUnits === undefined) return null;

  if (totalUkUnits < WEEKLY_LOW_MAX) {
    return {
      key: 'low',
      message: copy.low,
    };
  }

  if (totalUkUnits <= WEEKLY_MODERATE_MAX) {
    return {
      key: 'moderate',
      message: copy.moderate,
    };
  }

  return {
    key: 'higher',
    message: copy.higher,
  };
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
    return;
  }

  setText('selected-uk-units', formatNumber(result.ukUnits));
  setText('selected-global', formatNumber(result.globalStandardDrinks));
  setText('selected-us', formatNumber(result.usStandardDrinks));
  setText('selected-grams', formatNumber(result.alcoholGrams));
  setText('selected-calories', formatCalories(result.calories));
}

function renderWeeklyRows() {
  const container = document.getElementById('weekly-rows');
  if (!container) return;

  container.innerHTML = '';

  if (calculatorState.weeklyRows.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'weekly-empty';
    empty.textContent = copy.weeklyEmpty;
    container.appendChild(empty);
    return;
  }

  calculatorState.weeklyRows.forEach((row) => {
    const result = calculateDrinkResult(row);
    const item = document.createElement('div');
    item.className = 'weekly-row drink-list-row';

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
    remove.className = 'weekly-remove';
    remove.dataset.rowId = row.id;
    remove.textContent = copy.remove;

    item.append(name, detail, units, remove);
    container.appendChild(item);
  });
}

function renderWeeklyTotals() {
  const hasRows = calculatorState.weeklyRows.length > 0;
  const totals = calculateWeeklyTotals(calculatorState.weeklyRows);
  const rowHints = calculatorState.weeklyRows.map(getInputHint).filter(Boolean);
  const blockingHint = rowHints.find((message) => message !== copy.enterDetails) || '';
  const weeklyHint = blockingHint ||
    (!totals.isValid && rowHints.length > 0 ? copy.weeklyIncomplete : '');
  const breakdown = buildDrinkTypeBreakdown(
    calculatorState.weeklyRows.map((row) => ({ ...row, drinkLabel: getDrinkLabel(row.drinkType) }))
  );

  if (!hasRows) {
    setText('weekly-total-uk-units', '0.0');
    setText('weekly-total-global', '0.0');
    setText('weekly-total-us', '0.0');
    setText('weekly-total-grams', '0.0');
    setText('weekly-total-calories', '0');
  } else if (totals.isValid && weeklyHint === '') {
    setText('weekly-total-uk-units', formatNumber(totals.totalUkUnits));
    setText('weekly-total-global', formatNumber(totals.totalGlobalStandardDrinks));
    setText('weekly-total-us', formatNumber(totals.totalUsStandardDrinks));
    setText('weekly-total-grams', formatNumber(totals.totalAlcoholGrams));
    setText('weekly-total-calories', formatCalories(totals.totalCalories));
  } else {
    ['weekly-total-uk-units', 'weekly-total-global', 'weekly-total-us', 'weekly-total-grams', 'weekly-total-calories']
      .forEach((id) => setText(id, ''));
  }

  const interpretationEl = document.getElementById('weekly-interpretation');
  if (interpretationEl) {
    const interpretation = hasRows && weeklyHint === '' ? getWeeklyInterpretation(totals.totalUkUnits) : null;
    if (interpretation) {
      interpretationEl.textContent = interpretation.message;
      interpretationEl.className = `weekly-interpretation weekly-interpretation-${interpretation.key}`;
    } else {
      interpretationEl.textContent = weeklyHint || copy.weeklyOptional;
      interpretationEl.className = 'weekly-interpretation';
    }
  }

  const breakdownEl = document.getElementById('weekly-breakdown');
  if (breakdownEl && hasRows && totals.isValid && weeklyHint === '' && Object.keys(breakdown).length > 0) {
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
}

function renderCalculator() {
  syncEditorFields();
  renderDraftResults();
  renderWeeklyRows();
  renderWeeklyTotals();
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

function addDraftToWeeklyTotal() {
  const hint = getInputHint(calculatorState.draftDrink);
  const result = calculateDrinkResult(calculatorState.draftDrink);
  if (hint !== '' || !result.isValid) {
    renderCalculator();
    return;
  }

  calculatorState.weeklyRows.push({
    id: generateRowId(),
    ...calculatorState.draftDrink,
  });
  renderCalculator();
  trackCalculatorEvent('calculator_weekly_row_added');
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
  const addRowBtn = document.getElementById('weekly-add-row');
  const container = document.getElementById('weekly-rows');

  if (addRowBtn) {
    addRowBtn.addEventListener('click', addDraftToWeeklyTotal);
  }

  if (container) {
    container.addEventListener('click', (event) => {
      const removeButton = event.target.closest('.weekly-remove');
      if (!removeButton) return;

      calculatorState.weeklyRows = calculatorState.weeklyRows.filter((row) => row.id !== removeButton.dataset.rowId);
      renderCalculator();
      trackCalculatorEvent('calculator_weekly_row_deleted');
    });
  }
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
