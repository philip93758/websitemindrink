// Alcohol Unit Calculator - Main Script
// Loads as ES module, manages calculator state and UI

import { WEBSITE_DRINK_PRESETS, getDrinkPreset } from '/shared/alcohol/drinks.js';
import {
  calculateDrinkResult,
  calculateWeeklyTotals,
  buildDrinkTypeBreakdown,
} from '/shared/alcohol/formulas.js';
import {
  MAX_ABV_PERCENT,
  MAX_QUANTITY,
  MAX_VOLUME_ML,
  WEEKLY_LOW_MAX,
  WEEKLY_MODERATE_MAX,
} from '/shared/alcohol/constants.js';

// ==========================================
// Analytics Wrapper (No-op for V1)
// ==========================================

function trackCalculatorEvent(eventName) {
  if (typeof window.mindrinkTrack === 'function') {
    window.mindrinkTrack(eventName);
  }
}

// ==========================================
// State Management
// ==========================================

const calculatorState = {
  // Single drink calculator
  singleDrink: {
    drinkType: 'beer',
    volumeMl: 500,
    abvPercent: 5,
    quantity: 1,
  },
  
  // Weekly builder
  weeklyRows: [
    { id: 'row-1', drinkType: 'beer', drinkLabel: 'Beer', volumeMl: 500, abvPercent: 5, quantity: 3 },
    { id: 'row-2', drinkType: 'wine', drinkLabel: 'Wine', volumeMl: 175, abvPercent: 12, quantity: 2 },
  ],
  
  // Row counter for generating unique IDs
  nextRowId: 3,
};

// ==========================================
// Default State
// ==========================================

function getDefaultSingleDrink() {
  return {
    drinkType: 'beer',
    volumeMl: 500,
    abvPercent: 5,
    quantity: 1,
  };
}

function getDefaultWeeklyRows() {
  return [
    { id: 'row-1', drinkType: 'beer', drinkLabel: 'Beer', volumeMl: 500, abvPercent: 5, quantity: 3 },
    { id: 'row-2', drinkType: 'wine', drinkLabel: 'Wine', volumeMl: 175, abvPercent: 12, quantity: 2 },
  ];
}

function resetState() {
  calculatorState.singleDrink = { ...getDefaultSingleDrink() };
  calculatorState.weeklyRows = JSON.parse(JSON.stringify(getDefaultWeeklyRows()));
  calculatorState.nextRowId = 3;
}

// ==========================================
// Utility Functions
// ==========================================

function formatNumber(value, decimals = 1) {
  if (value === null || value === undefined) {
    return '';
  }
  return value.toFixed(decimals);
}

function formatCalories(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return Math.round(value).toString();
}

function generateRowId() {
  return `row-${calculatorState.nextRowId++}`;
}

function getInputHint({ volumeMl, abvPercent, quantity }) {
  if (volumeMl === null || volumeMl === '' || abvPercent === null || abvPercent === '' || quantity === null || quantity === '') {
    return 'Enter drink details to see results.';
  }

  if (volumeMl > MAX_VOLUME_ML || abvPercent > MAX_ABV_PERCENT || quantity > MAX_QUANTITY) {
    return `Use volume up to ${MAX_VOLUME_ML}ml, ABV up to ${MAX_ABV_PERCENT}%, and quantity up to ${MAX_QUANTITY}.`;
  }

  return '';
}

// Get drink label from type
function getDrinkLabel(drinkType) {
  const preset = getDrinkPreset(drinkType);
  return preset ? preset.label : drinkType;
}

// ==========================================
// Weekly Interpretation
// ==========================================

function getWeeklyInterpretation(totalUkUnits) {
  if (totalUkUnits === null || totalUkUnits === undefined) {
    return null;
  }
  
  if (totalUkUnits < WEEKLY_LOW_MAX) {
    return {
      key: 'low',
      message: 'Your weekly total is relatively low. Tracking over time can still help you understand patterns.',
    };
  }
  
  if (totalUkUnits <= WEEKLY_MODERATE_MAX) {
    return {
      key: 'moderate',
      message: 'Your weekly total shows a noticeable pattern. Dry days can make weekly drinking easier to observe.',
    };
  }
  
  return {
    key: 'higher',
    message: 'Your weekly total is higher. Seeing patterns over time may help you decide what feels right for you.',
  };
}

// ==========================================
// Render Functions
// ==========================================

// Render single drink results
function renderSingleDrinkResults() {
  const result = calculateDrinkResult(calculatorState.singleDrink);
  const hint = getInputHint(calculatorState.singleDrink);
  const statusEl = document.getElementById('single-calculator-status');
  
  const resultElements = {
    ukUnits: document.getElementById('single-uk-units'),
    global: document.getElementById('single-global'),
    us: document.getElementById('single-us'),
    grams: document.getElementById('single-grams'),
    calories: document.getElementById('single-calories'),
  };

  if (statusEl) {
    statusEl.textContent = hint;
    statusEl.hidden = hint === '';
  }
  
  if (result.isValid && hint === '') {
    if (resultElements.ukUnits) resultElements.ukUnits.textContent = formatNumber(result.ukUnits);
    if (resultElements.global) resultElements.global.textContent = formatNumber(result.globalStandardDrinks);
    if (resultElements.us) resultElements.us.textContent = formatNumber(result.usStandardDrinks);
    if (resultElements.grams) resultElements.grams.textContent = formatNumber(result.alcoholGrams);
    if (resultElements.calories) resultElements.calories.textContent = formatCalories(result.calories);
  } else {
    if (resultElements.ukUnits) resultElements.ukUnits.textContent = '';
    if (resultElements.global) resultElements.global.textContent = '';
    if (resultElements.us) resultElements.us.textContent = '';
    if (resultElements.grams) resultElements.grams.textContent = '';
    if (resultElements.calories) resultElements.calories.textContent = '';
  }
}

// Render a single weekly row
function renderWeeklyRow(row) {
  const template = document.getElementById('weekly-row-template');
  if (!template) return null;
  
  const clone = template.content.cloneNode(true);
  const rowEl = clone.querySelector('.weekly-row');
  rowEl.dataset.rowId = row.id;
  
  // Drink type select
  const drinkSelect = clone.querySelector('.weekly-drink-type');
  if (drinkSelect) {
    drinkSelect.id = `weekly-drink-${row.id}`;
    drinkSelect.innerHTML = WEBSITE_DRINK_PRESETS.map(p => 
      `<option value="${p.id}" ${p.id === row.drinkType ? 'selected' : ''}>${p.label}</option>`
    ).join('');
    drinkSelect.value = row.drinkType;
    const label = clone.querySelector('.weekly-drink-label');
    if (label) label.setAttribute('for', drinkSelect.id);
  }
  
  // Volume input
  const volumeInput = clone.querySelector('.weekly-volume');
  if (volumeInput) {
    volumeInput.id = `weekly-volume-${row.id}`;
    volumeInput.value = row.volumeMl;
    const label = clone.querySelector('.weekly-volume-label');
    if (label) label.setAttribute('for', volumeInput.id);
  }
  
  // ABV input
  const abvInput = clone.querySelector('.weekly-abv');
  if (abvInput) {
    abvInput.id = `weekly-abv-${row.id}`;
    abvInput.value = row.abvPercent;
    const label = clone.querySelector('.weekly-abv-label');
    if (label) label.setAttribute('for', abvInput.id);
  }
  
  // Quantity input
  const quantityInput = clone.querySelector('.weekly-quantity');
  if (quantityInput) {
    quantityInput.id = `weekly-quantity-${row.id}`;
    quantityInput.value = row.quantity;
    const label = clone.querySelector('.weekly-quantity-label');
    if (label) label.setAttribute('for', quantityInput.id);
  }
  
  // Duplicate button
  const duplicateBtn = clone.querySelector('.weekly-duplicate');
  if (duplicateBtn) {
    duplicateBtn.dataset.rowId = row.id;
  }
  
  // Delete button
  const deleteBtn = clone.querySelector('.weekly-delete');
  if (deleteBtn) {
    deleteBtn.dataset.rowId = row.id;
  }
  
  return clone;
}

// Render all weekly rows
function renderWeeklyRows() {
  const container = document.getElementById('weekly-rows');
  if (!container) return;
  
  container.innerHTML = '';
  
  calculatorState.weeklyRows.forEach(row => {
    const rowEl = renderWeeklyRow(row);
    if (rowEl) {
      container.appendChild(rowEl);
    }
  });
  
  renderWeeklyTotals();
}

// Render weekly totals
function renderWeeklyTotals() {
  const totals = calculateWeeklyTotals(calculatorState.weeklyRows);
  const rowHints = calculatorState.weeklyRows.map(getInputHint).filter(Boolean);
  const blockingHint = rowHints.find((message) => message !== 'Enter drink details to see results.') || '';
  const weeklyHint = blockingHint ||
    (!totals.isValid && rowHints.length > 0 ? 'Some rows need volume, ABV, and quantity before they count.' : '');
  const breakdown = buildDrinkTypeBreakdown(
    calculatorState.weeklyRows.map(r => ({ ...r, drinkLabel: getDrinkLabel(r.drinkType) }))
  );
  
  // Update total elements
  const totalElements = {
    ukUnits: document.getElementById('weekly-total-uk-units'),
    global: document.getElementById('weekly-total-global'),
    us: document.getElementById('weekly-total-us'),
    grams: document.getElementById('weekly-total-grams'),
    calories: document.getElementById('weekly-total-calories'),
  };
  
  if (totals.isValid && weeklyHint === '') {
    if (totalElements.ukUnits) totalElements.ukUnits.textContent = formatNumber(totals.totalUkUnits);
    if (totalElements.global) totalElements.global.textContent = formatNumber(totals.totalGlobalStandardDrinks);
    if (totalElements.us) totalElements.us.textContent = formatNumber(totals.totalUsStandardDrinks);
    if (totalElements.grams) totalElements.grams.textContent = formatNumber(totals.totalAlcoholGrams);
    if (totalElements.calories) totalElements.calories.textContent = formatCalories(totals.totalCalories);
  } else {
    if (totalElements.ukUnits) totalElements.ukUnits.textContent = '';
    if (totalElements.global) totalElements.global.textContent = '';
    if (totalElements.us) totalElements.us.textContent = '';
    if (totalElements.grams) totalElements.grams.textContent = '';
    if (totalElements.calories) totalElements.calories.textContent = '';
  }
  
  // Update interpretation
  const interpretationEl = document.getElementById('weekly-interpretation');
  if (interpretationEl) {
    const interpretation = weeklyHint === '' ? getWeeklyInterpretation(totals.totalUkUnits) : null;
    if (interpretation) {
      interpretationEl.textContent = interpretation.message;
      interpretationEl.className = `weekly-interpretation weekly-interpretation-${interpretation.key}`;
    } else {
      interpretationEl.textContent = weeklyHint || 'Add drinks to see a weekly pattern summary.';
      interpretationEl.className = 'weekly-interpretation';
    }
  }
  
  // Update breakdown
  const breakdownEl = document.getElementById('weekly-breakdown');
  if (breakdownEl && totals.isValid && weeklyHint === '' && Object.keys(breakdown).length > 0) {
    breakdownEl.innerHTML = '<h4>By drink type:</h4>' + 
      Object.entries(breakdown).map(([id, data]) => 
        `<p><strong>${data.label}:</strong> ${data.count} drinks, ${formatNumber(data.ukUnits)} UK units, ${formatNumber(data.alcoholGrams)}g alcohol, ${formatCalories(data.calories)} calories</p>`
      ).join('');
  } else if (breakdownEl) {
    breakdownEl.innerHTML = '';
  }
}

// ==========================================
// Event Handlers
// ==========================================

function setupSingleDrinkEvents() {
  // Drink type select
  const drinkSelect = document.getElementById('single-drink-type');
  if (drinkSelect) {
    drinkSelect.addEventListener('change', (e) => {
      calculatorState.singleDrink.drinkType = e.target.value;
      const preset = getDrinkPreset(e.target.value);
      if (preset.defaultVolumeMl !== undefined) {
        calculatorState.singleDrink.volumeMl = preset.defaultVolumeMl;
        document.getElementById('single-volume').value = preset.defaultVolumeMl;
      }
      if (preset.defaultAbvPercent !== undefined) {
        calculatorState.singleDrink.abvPercent = preset.defaultAbvPercent;
        document.getElementById('single-abv').value = preset.defaultAbvPercent;
      }
      renderSingleDrinkResults();
      trackCalculatorEvent('calculator_single_drink_changed');
    });
  }
  
  // Volume input
  const volumeInput = document.getElementById('single-volume');
  if (volumeInput) {
    volumeInput.addEventListener('input', (e) => {
      const value = e.target.value === '' ? null : parseFloat(e.target.value);
      if (value !== null && !isNaN(value)) {
        calculatorState.singleDrink.volumeMl = value;
      } else {
        calculatorState.singleDrink.volumeMl = null;
      }
      renderSingleDrinkResults();
      trackCalculatorEvent('calculator_single_drink_changed');
    });
  }
  
  // ABV input
  const abvInput = document.getElementById('single-abv');
  if (abvInput) {
    abvInput.addEventListener('input', (e) => {
      const value = e.target.value === '' ? null : parseFloat(e.target.value);
      if (value !== null && !isNaN(value)) {
        calculatorState.singleDrink.abvPercent = value;
      } else {
        calculatorState.singleDrink.abvPercent = null;
      }
      renderSingleDrinkResults();
      trackCalculatorEvent('calculator_single_drink_changed');
    });
  }
  
  // Quantity input
  const quantityInput = document.getElementById('single-quantity');
  if (quantityInput) {
    quantityInput.addEventListener('input', (e) => {
      const value = e.target.value === '' ? null : parseInt(e.target.value, 10);
      if (value !== null && !isNaN(value)) {
        calculatorState.singleDrink.quantity = value;
      } else {
        calculatorState.singleDrink.quantity = null;
      }
      renderSingleDrinkResults();
      trackCalculatorEvent('calculator_single_drink_changed');
    });
  }
}

function setupWeeklyEvents() {
  // Add row button
  const addRowBtn = document.getElementById('weekly-add-row');
  if (addRowBtn) {
    addRowBtn.addEventListener('click', () => {
      const newRow = {
        id: generateRowId(),
        drinkType: 'beer',
        drinkLabel: 'Beer',
        volumeMl: 500,
        abvPercent: 5,
        quantity: 1,
      };
      calculatorState.weeklyRows.push(newRow);
      renderWeeklyRows();
      trackCalculatorEvent('calculator_weekly_row_added');
    });
  }
  
  // Duplicate row - event delegation
  const container = document.getElementById('weekly-rows');
  if (container) {
    container.addEventListener('click', (e) => {
      const duplicateBtn = e.target.closest('.weekly-duplicate');
      if (duplicateBtn) {
        const rowId = duplicateBtn.dataset.rowId;
        const rowToDuplicate = calculatorState.weeklyRows.find(r => r.id === rowId);
        if (rowToDuplicate) {
          const newRow = {
            ...rowToDuplicate,
            id: generateRowId(),
          };
          calculatorState.weeklyRows.push(newRow);
          renderWeeklyRows();
          trackCalculatorEvent('calculator_weekly_row_added');
        }
      }
      
      const deleteBtn = e.target.closest('.weekly-delete');
      if (deleteBtn) {
        const rowId = deleteBtn.dataset.rowId;
        calculatorState.weeklyRows = calculatorState.weeklyRows.filter(r => r.id !== rowId);
        renderWeeklyRows();
        trackCalculatorEvent('calculator_weekly_row_deleted');
      }
    });
  }
  
  // Row input changes - event delegation
  if (container) {
    function handleWeeklyInputChange(e) {
      if (e.type === 'input' && e.target.classList.contains('weekly-drink-type')) {
        return;
      }
      if (e.type === 'change' && !e.target.classList.contains('weekly-drink-type')) {
        return;
      }

      const rowEl = e.target.closest('.weekly-row');
      if (!rowEl) return;
      
      const rowId = rowEl.dataset.rowId;
      const row = calculatorState.weeklyRows.find(r => r.id === rowId);
      if (!row) return;
      
      if (e.target.classList.contains('weekly-drink-type')) {
        row.drinkType = e.target.value;
        row.drinkLabel = getDrinkLabel(e.target.value);
        const preset = getDrinkPreset(e.target.value);
        if (preset.defaultVolumeMl !== undefined) {
          row.volumeMl = preset.defaultVolumeMl;
          const volumeInput = rowEl.querySelector('.weekly-volume');
          if (volumeInput) volumeInput.value = preset.defaultVolumeMl;
        }
        if (preset.defaultAbvPercent !== undefined) {
          row.abvPercent = preset.defaultAbvPercent;
          const abvInput = rowEl.querySelector('.weekly-abv');
          if (abvInput) abvInput.value = preset.defaultAbvPercent;
        }
      } else if (e.target.classList.contains('weekly-volume')) {
        const value = e.target.value === '' ? null : parseFloat(e.target.value);
        row.volumeMl = value !== null && !isNaN(value) ? value : null;
      } else if (e.target.classList.contains('weekly-abv')) {
        const value = e.target.value === '' ? null : parseFloat(e.target.value);
        row.abvPercent = value !== null && !isNaN(value) ? value : null;
      } else if (e.target.classList.contains('weekly-quantity')) {
        const value = e.target.value === '' ? null : parseInt(e.target.value, 10);
        row.quantity = value !== null && !isNaN(value) ? value : null;
      }
      
      renderWeeklyTotals();
    }

    container.addEventListener('input', handleWeeklyInputChange);
    container.addEventListener('change', handleWeeklyInputChange);
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

// ==========================================
// Initialization
// ==========================================

function initCalculator() {
  // Track page view
  trackCalculatorEvent('calculator_page_view');
  
  // Setup single drink form defaults
  const drinkSelect = document.getElementById('single-drink-type');
  if (drinkSelect) {
    drinkSelect.innerHTML = WEBSITE_DRINK_PRESETS.map(p => 
      `<option value="${p.id}">${p.label}</option>`
    ).join('');
    drinkSelect.value = calculatorState.singleDrink.drinkType;
  }
  
  // Setup event listeners
  setupSingleDrinkEvents();
  setupWeeklyEvents();
  setupCTAEvent();
  
  // Initial render
  renderSingleDrinkResults();
  renderWeeklyRows();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCalculator);
} else {
  initCalculator();
}
