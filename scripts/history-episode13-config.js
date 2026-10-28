export const EPISODE13_SLUG = 'egypt-drinking-with-the-gods.html';
export const EPISODE13_SOURCE = 'Egypt - Drinking with the Gods';
export const EPISODE13_ASSETS = 'assets/science/history/episode-1-3';
export const EPISODE13_STYLES = 'egypt-20261019a';
export const episode13Prefix = locale => locale === 'en' ? '' : `${locale}/`;
export const episode13Widths = image => [...new Set([480, Math.min(960, image.width), Math.min(1440, image.width)])];
export const episode13Variant = (image, width) => `${image.file.replace(/\.(jpg|png)$/, '')}-${width}.webp`;

// Exact human-selected web handoff, checked against its manifest before import.
// Source/edition dates do not authorize publication or set article dates.
export const EPISODE13_SOURCES = {
  en: { file: `${EPISODE13_SOURCE}.en.editorial-review-2026-10-23-v4.md`, sha256: '14fef8dde6be95ec7c2706bd666f65ba6c550cdef473ffb921d177201c1330fe' },
  de: { file: `${EPISODE13_SOURCE}.de.pipeline-output-2026-10-28-v5.md`, sha256: 'afe32c9a4026e9697f2abf6ea5d80ca28cecfd59da1c7331af455403e1485788' },
  es: { file: `${EPISODE13_SOURCE}.es.pipeline-output-2026-10-28-v5.md`, sha256: '71002097430c61d9dff646c220a2a51e37d929caa0251dc27ccb7b41f708d2ea' },
  fr: { file: `${EPISODE13_SOURCE}.fr.pipeline-output-2026-10-28-v5.md`, sha256: '76d3729688072abeb233cba2ca5eab4e718ae8f636880663b528e7c2bed7a502' },
  id: { file: `${EPISODE13_SOURCE}.id.pipeline-output-2026-10-28-v5.md`, sha256: 'fc511aafda17ae2654975c38e1023dc805d4af585f52a7dd3b9d2f5318ad5d3c' },
  it: { file: `${EPISODE13_SOURCE}.it.pipeline-output-2026-10-28-v5.md`, sha256: '38e91993dcbc0dec7f147ce40eb3c00319d9c82a53ece0489797ab853eafab1b' },
  ja: { file: `${EPISODE13_SOURCE}.ja.pipeline-output-2026-10-28-v5.md`, sha256: 'fcf4b6abcef529f9ee76a05dff699bcd7db069a1c9002346aef391f3b7fe7bf0' },
  pt: { file: `${EPISODE13_SOURCE}.pt.pipeline-output-2026-10-28-v5.md`, sha256: '656a6a0569b8ef930625f1692c738b43bfa188ed7892857317b3d8b8bb0a2207' },
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
