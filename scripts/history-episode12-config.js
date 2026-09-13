export const EPISODE12_SLUG = 'mesopotamia-beer-written-records.html';
export const EPISODE12_SOURCE = 'Mesopotamia - What the First Written Records Tell Us About Beer';
export const EPISODE12_ASSETS = 'assets/science/history/episode-1-2';
export const EPISODE12_STYLES = 'qa-20260913a';

// Interface copy only. Article titles, prose, captions and references come from
// the approved Atrium Markdown, not from a second editorial copy in this repo.
export const EPISODE12_LOCALES = {
  en: { previous: 'Previous episode', reference: 'Reference', description: 'What clay tablets, banquet scenes, hymns and laws reveal about beer in ancient Mesopotamia—and the limits of what these sources can tell us.' },
  de: { previous: 'Vorherige Folge', reference: 'Quelle', description: 'Was Tontafeln, Bankettszenen, Hymnen und Gesetze über Bier im alten Mesopotamien erzählen – und wo die Aussagekraft dieser Quellen endet.' },
  es: { previous: 'Episodio anterior', reference: 'Referencia', description: 'Qué revelan las tablillas, las escenas de banquete, los himnos y las leyes sobre la cerveza en Mesopotamia, y cuáles son los límites de esas fuentes.' },
  fr: { previous: 'Épisode précédent', reference: 'Référence', description: 'Ce que les tablettes, les scènes de banquet, les hymnes et les lois révèlent sur la bière en Mésopotamie, et les limites de ces sources.' },
  id: { previous: 'Episode sebelumnya', reference: 'Rujukan', description: 'Apa yang diungkap tablet tanah liat, adegan perjamuan, himne, dan hukum tentang bir di Mesopotamia kuno, serta batas informasi dari sumber-sumber itu.' },
  it: { previous: 'Episodio precedente', reference: 'Riferimento', description: 'Che cosa raccontano tavolette, scene di banchetto, inni e leggi sulla birra nell’antica Mesopotamia, e quali sono i limiti di queste fonti.' },
  ja: { previous: '前のエピソード', reference: '参考文献', description: '粘土板の帳簿、宴会の図像、賛歌、法律から、古代メソポタミアのビールと人々の暮らしをたどります。それぞれの史料から分かることと、確かめられないことを丁寧に読み解きます。' },
  pt: { previous: 'Episódio anterior', reference: 'Referência', description: 'O que as tabuletas, as cenas de banquete, os hinos e as leis revelam sobre a cerveja na Mesopotâmia antiga, e quais são os limites dessas fontes.' },
};

// Approved originals: never crop, retouch or silently replace these files.
// See assets/science/history/episode-1-2/README.md for attribution and licences.
export const EPISODE12_IMAGES = {
  'ur-ziggurat': { file: 'ur-ziggurat-lubinski.jpg', width: 3264, height: 2448, sha256: '6dc1f56764ef8ce186bc5a9b31f9397384e9d82b7d728488006ad7e31303b9c8' },
  'malt-barley-tablet': { file: 'uruk-malt-barley-tablet-met.jpg', width: 900, height: 1200, sha256: '9478a66ee72d0c010b1f7b39128f1c6fe7c4dcb1a74c69ab1e1e3ec867cd3cdf' },
  'ur-houses': { file: 'ur-houses-courtyard-1932.jpg', width: 4537, height: 3379, sha256: 'df11094226def97c1383e9f681c6a4499ab97b85d18c013aa10a4edc0a071ec7' },
  'puabi-related-seal': { file: 'puabi-inscribed-seal-mcphee.jpg', width: 816, height: 399, sha256: 'a531b5376d527f2b7638749afb8ff03d649e8815eb555c3d4477cb92cd4f3502' },
  'hammurabi-inscription': { file: 'hammurabi-inscription-rama.jpg', width: 5616, height: 3744, sha256: 'e93e208606fab1e2fb307da97fea03235177630ce34396929b111638bd7799c7' },
};

export const editionPrefix = locale => locale === 'en' ? '' : `${locale}/`;
export const imageWidths = image => [...new Set([480, Math.min(960, image.width), Math.min(1440, image.width)])];
export const imageVariant = (image, width) => `${image.file.replace(/\.jpg$/, '')}-${width}.webp`;
