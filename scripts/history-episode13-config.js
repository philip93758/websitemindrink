export const EPISODE13_SLUG = 'egypt-drinking-with-the-gods.html';
export const EPISODE13_SOURCE = 'Egypt - Drinking with the Gods';
export const EPISODE13_ASSETS = 'assets/science/history/episode-1-3';
export const EPISODE13_STYLES = 'egypt-20261019a';
export const episode13Prefix = locale => locale === 'en' ? '' : `${locale}/`;
export const episode13Widths = image => [...new Set([480, Math.min(960, image.width), Math.min(1440, image.width)])];
export const episode13Variant = (image, width) => `${image.file.replace(/\.(jpg|png)$/, '')}-${width}.webp`;

// Explicit human-selected editions, not an automatic choice of the latest file.
// V2 editorial handoffs are authorized for this dev implementation; no new
// pipeline acceptance or production approval is implied.
export const EPISODE13_SOURCES = {
  en: { file: `Approved/${EPISODE13_SOURCE}.md`, sha256: 'd617d2daf9fa2fefb25c12a02ac9d58a390d2f281b518bc908111be2ed94a86a' },
  de: { file: `editorial-review/${EPISODE13_SOURCE}.de.editorial-review-2026-10-19-v2.md`, sha256: '71dad7826315090d9bdee34cf436461bab73a57b0a50971a05a787b33d211f14' },
  es: { file: `editorial-review/${EPISODE13_SOURCE}.es.editorial-review-2026-10-19-v2.md`, sha256: 'c94f9bca60703076439e671676e3a98812af2fdd897b63a50b84f432e9a3eb4c' },
  fr: { file: `editorial-review/${EPISODE13_SOURCE}.fr.editorial-review-2026-10-19-v2.md`, sha256: 'aced16bb534658386b359b6c3b254672c155a767f6d92c86593bfb556b203311' },
  id: { file: `editorial-review/${EPISODE13_SOURCE}.id.editorial-review-2026-10-19-v2.md`, sha256: '5618875bbeac231ae4b6a82700cbe8424e75cebe0829320c30bfee8a5484dab5' },
  it: { file: `editorial-review/${EPISODE13_SOURCE}.it.editorial-review-2026-10-19-v2.md`, sha256: '480e98b8b2fb74b03714c48dbac76f29942c5f6a88f737b853ccac8f93fde522' },
  ja: { file: `editorial-review/${EPISODE13_SOURCE}.ja.editorial-review-2026-10-19-v2.md`, sha256: '2dc27434c7931af78d7da69a09d64ae58453550dd7dca537e1d066d09ee27bfd' },
  pt: { file: `editorial-review/${EPISODE13_SOURCE}.pt.editorial-review-2026-10-19-v2.md`, sha256: 'dff727654f0788ff3c8eb615a8ac0a596e7b71bd8b2db2cd8704d3df2a638019' },
};

// Interface/card copy only. The article itself comes entirely from the files above.
export const EPISODE13_LOCALES = {
  en: { previous: 'Previous episode', next: 'Next episode', reference: 'Reference', description: 'Beer, wine, banquet scenes and sacred intoxication: how ancient Egyptians embraced the pleasures of drinking, warned of its dangers and sought it in worship.' },
  de: { previous: 'Vorherige Folge', next: 'Nächste Folge', reference: 'Quelle', description: 'Bier, Wein und heiliger Rausch: Wie die Menschen im alten Ägypten das Trinken genossen, vor seinen Gefahren warnten und in religiösen Feiern die Trunkenheit suchten.' },
  es: { previous: 'Episodio anterior', next: 'Siguiente episodio', reference: 'Referencia', description: 'Cerveza, vino y embriaguez sagrada: cómo los antiguos egipcios disfrutaban de la bebida, advertían de sus peligros y la buscaban en el culto.' },
  fr: { previous: 'Épisode précédent', next: 'Épisode suivant', reference: 'Référence', description: 'Bière, vin et ivresse sacrée : comment les Égyptiens goûtaient aux plaisirs de la boisson, mettaient en garde contre ses dangers et la recherchaient dans le culte.' },
  id: { previous: 'Episode sebelumnya', next: 'Episode berikutnya', reference: 'Rujukan', description: 'Bir, anggur, dan kemabukan dalam ritual: bagaimana orang Mesir kuno menikmati minuman, memperingatkan bahayanya, dan mencari kemabukan dalam pemujaan.' },
  it: { previous: 'Episodio precedente', next: 'Episodio successivo', reference: 'Riferimento', description: 'Birra, vino ed ebbrezza sacra: come gli antichi egizi apprezzavano i piaceri del bere, ne riconoscevano i pericoli e cercavano l’ebbrezza nel culto.' },
  ja: { previous: '前のエピソード', next: '次のエピソード', reference: '参考文献', description: 'ビール、ワイン、宴席の絵、そして聖なる酩酊。古代エジプトの人々は酒の楽しみと危うさをどう捉え、なぜ礼拝の場で酔うことを求めたのでしょうか。' },
  pt: { previous: 'Episódio anterior', next: 'Episódio seguinte', reference: 'Referência', description: 'Cerveja, vinho e embriaguez sagrada: como os antigos egípcios apreciavam os prazeres da bebida, reconheciam os seus perigos e procuravam a embriaguez no culto.' },
};

// The four Met files come directly from the URLs embedded in the selected text.
// Wilkinson is the already selected, separately credited public-domain crop.
export const EPISODE13_IMAGES = {
  'nebamun-receiving-wine': { file: 'nebamun-receiving-wine-met.jpg', width: 848, height: 1200, sha256: '2e8e93ed59b47b3a069b15bdbc3d8e78370cc4855f4261d2e54314c0f92c79bc', source: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/548520/1921336/main-image', record: 'https://www.metmuseum.org/art/collection/search/548520' },
  'meketre-bakery-brewery': { file: 'meketre-bakery-brewery-met.jpg', width: 958, height: 1200, sha256: '937e133cb57750e47da8dc8dfa1aaa8fb847a600c960e76adffe4f90a638dea0', source: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/544258/1178720/main-image', record: 'https://www.metmuseum.org/art/collection/search/544258' },
  'women-at-banquet': { file: 'women-at-banquet-met.jpg', width: 1200, height: 873, sha256: '2023d0963e6436462bd8b4d7494e750d075af45d5df87e90f61d7aba80ff6db5', source: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/557623/1920901/main-image', record: 'https://www.metmuseum.org/art/collection/search/557623' },
  'wilkinson-banquet-excess': { file: 'wilkinson-vomiting-banquet-drawings.png', width: 1400, height: 1410, sha256: '8bc2f59d27deefdde03da95b23140cbb8435da257ab5dbebee65977ad34deae3', source: '../assets/wilkinson-vomiting-banquet-drawings.png', record: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Viticulture_and_brewing_in_the_ancient_Orient_%28IA_cu31924032345864%29.pdf#page=113' },
  sakhmet: { file: 'sakhmet-met.jpg', width: 900, height: 1200, sha256: 'aae916717ed03ae666b7ec48c403622c9e2a456bab2edad542e9d0e0e4019c74', source: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/544484/1158046/main-image', record: 'https://www.metmuseum.org/art/collection/search/544484' },
};
