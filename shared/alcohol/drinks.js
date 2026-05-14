// Drink presets for the Alcohol Unit Calculator
// Based on app taxonomy, simplified for website V1

export const WEBSITE_DRINK_PRESETS = [
  { id: 'beer', label: 'Beer', defaultVolumeMl: 500, defaultAbvPercent: 5 },
  { id: 'wine', label: 'Wine', defaultVolumeMl: 175, defaultAbvPercent: 12 },
  { id: 'sparkling_wine', label: 'Sparkling wine', defaultVolumeMl: 125, defaultAbvPercent: 11 },
  { id: 'cider', label: 'Cider', defaultVolumeMl: 330, defaultAbvPercent: 4.5 },
  { id: 'spirits', label: 'Spirits', defaultVolumeMl: 25, defaultAbvPercent: 40 },
  { id: 'cocktail', label: 'Cocktail', defaultVolumeMl: 150, defaultAbvPercent: 15 },
  { id: 'liqueur', label: 'Liqueur', defaultVolumeMl: 40, defaultAbvPercent: 20 },
  { id: 'fortified_wine', label: 'Fortified wine', defaultVolumeMl: 60, defaultAbvPercent: 18 },
  { id: 'custom', label: 'Custom', defaultVolumeMl: '', defaultAbvPercent: '' },
];

// Get preset by ID
export function getDrinkPreset(id) {
  return WEBSITE_DRINK_PRESETS.find(p => p.id === id) || WEBSITE_DRINK_PRESETS[0];
}
