import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const sourceDirectory = process.argv[2];

if (!sourceDirectory) {
  throw new Error('Usage: node scripts/sync-history-episode-content.js <episode-content-directory>');
}

const ROOT = resolve(import.meta.dirname, '..');
const modifiedDateParts = Object.fromEntries(new Intl.DateTimeFormat('en', {
  timeZone: 'Europe/Berlin',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).formatToParts(new Date()).map(({ type, value }) => [type, value]));
const MODIFIED_DATE = `${modifiedDateParts.year}-${modifiedDateParts.month}-${modifiedDateParts.day}`;
const MODIFIED_TIME = `${MODIFIED_DATE}T00:00:00Z`;

const figures = {
  jiahu: {
    file: 'china-jiahu-fermented-beverage-figure-1.jpg',
    width: 576,
    height: 658,
    source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC539767/',
    credit: 'Figure 1 from McGovern et al., “Fermented beverages of pre- and proto-historic China,” PNAS (2004), doi:10.1073/pnas.0407921102.',
    policy: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC515072/',
    policyText: 'Reproduced for noncommercial use under the PNAS reuse policy.',
  },
  georgia: {
    file: 'georgia-neolithic-wine-figure-2.jpg',
    width: 757,
    height: 604,
    source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5715782/',
    credit: 'Figure 2 from McGovern et al., PNAS (2017),',
    licence: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    licenceText: 'CC BY-NC-ND 4.0.',
    tail: 'Photographs by Mindia Jalabadze, courtesy of the National Museum of Georgia.',
  },
  enclosure: {
    file: 'turkey-gobekli-enclosure-d.jpg',
    width: 1575,
    height: 1054,
    source: 'https://www.dainst.blog/the-tepe-telegrams/photos/',
    credit: 'German Archaeological Institute, Nico Becker',
  },
  pillar: {
    file: 'turkey-gobekli-pillar-56.jpg',
    width: 1048,
    height: 1575,
    source: 'https://www.dainst.blog/the-tepe-telegrams/photos/',
    credit: 'German Archaeological Institute, Nico Becker',
    portrait: true,
  },
};

const editions = {
  en: {
    source: 'Who Invented Alcohol.md',
    target: 'science/who-invented-alcohol.html',
    captions: {
      jiahu: 'The Jiahu storage jar analysed for traces of a fermented drink appears at upper left; the remaining panels show a later bronze vessel and examples of the chemical evidence used to identify ancient contents.',
      georgia: 'An early Neolithic jar from Khramis Didi-Gora, shown alongside jar-base fragments from the Georgian sites studied for ancient wine residues. One base preserves a textile impression.',
      enclosure: 'Göbekli Tepe’s main excavation area, with Enclosure D in the foreground. Its monumental T-shaped pillars were erected by hunter-gatherer communities before agriculture became established in the region.',
      pillar: 'Pillar 56 in Göbekli Tepe’s Enclosure H. The close view reveals the monumental T-shape and the dense procession of animals carved across its surface.',
    },
    alt: {
      jiahu: 'Scientific figure showing a Jiahu storage jar, a later bronze vessel and chemical residue charts',
      georgia: 'Scientific figure showing an early Neolithic Georgian jar and three excavated jar fragments',
      enclosure: 'Wide view of Göbekli Tepe’s excavated stone enclosures and T-shaped pillars',
      pillar: 'Close view of Göbekli Tepe Pillar 56 with rows of carved animals',
    },
  },
  de: {
    source: 'Who Invented Alcohol.de.md',
    target: 'de/science/who-invented-alcohol.html',
    captions: {
      jiahu: 'Oben links ist der Vorratskrug aus Jiahu zu sehen, der auf Spuren eines Gärgetränks untersucht wurde; die übrigen Felder zeigen ein späteres Bronzegefäß und Beispiele der chemischen Befunde, mit denen antike Inhalte bestimmt wurden.',
      georgia: 'Ein frühneolithischer Krug aus Khramis Didi-Gora neben Bodenfragmenten von Krügen aus den georgischen Fundorten, die auf alte Weinrückstände untersucht wurden. Ein Boden bewahrt den Abdruck eines Textils.',
      enclosure: 'Das Hauptgrabungsareal von Göbekli Tepe mit Anlage D im Vordergrund. Die monumentalen T-förmigen Pfeiler wurden von Jäger-und-Sammler-Gemeinschaften errichtet, bevor sich die Landwirtschaft in der Region etablierte.',
      pillar: 'Pfeiler 56 in Anlage H von Göbekli Tepe. Die Nahaufnahme zeigt die monumentale T-Form und die dichte Folge von Tierdarstellungen auf seiner Oberfläche.',
    },
    alt: {
      jiahu: 'Wissenschaftliche Abbildung mit einem Vorratskrug aus Jiahu, einem späteren Bronzegefäß und Diagrammen chemischer Rückstände',
      georgia: 'Wissenschaftliche Abbildung mit einem frühneolithischen georgischen Krug und drei ausgegrabenen Krugfragmenten',
      enclosure: 'Weite Ansicht der ausgegrabenen Steinanlagen und T-förmigen Pfeiler von Göbekli Tepe',
      pillar: 'Nahaufnahme von Pfeiler 56 in Göbekli Tepe mit Reihen eingemeißelter Tiere',
    },
  },
  es: {
    source: 'Who Invented Alcohol.es.md',
    target: 'es/science/who-invented-alcohol.html',
    captions: {
      jiahu: 'En la parte superior izquierda aparece la jarra de almacenamiento de Jiahu analizada en busca de restos de una bebida fermentada; los demás paneles muestran un recipiente de bronce posterior y ejemplos de las pruebas químicas utilizadas para identificar contenidos antiguos.',
      georgia: 'Una jarra del Neolítico temprano de Khramis Didi-Gora, junto a fragmentos de bases de jarras procedentes de los yacimientos georgianos estudiados en busca de residuos de vino antiguo. Una de las bases conserva la impresión de un tejido.',
      enclosure: 'La principal zona de excavación de Göbekli Tepe, con el recinto D en primer plano. Sus monumentales pilares en forma de T fueron erigidos por comunidades de cazadores-recolectores antes de que la agricultura se estableciera en la región.',
      pillar: 'El pilar 56 del recinto H de Göbekli Tepe. La vista de cerca muestra la monumental forma de T y la densa sucesión de animales tallados en su superficie.',
    },
    alt: {
      jiahu: 'Figura científica con una jarra de Jiahu, un recipiente de bronce posterior y gráficos de residuos químicos',
      georgia: 'Figura científica con una jarra georgiana del Neolítico temprano y tres fragmentos excavados',
      enclosure: 'Vista amplia de los recintos de piedra excavados y los pilares en forma de T de Göbekli Tepe',
      pillar: 'Vista cercana del pilar 56 de Göbekli Tepe con hileras de animales tallados',
    },
  },
  fr: {
    source: 'Who Invented Alcohol.fr.md',
    target: 'fr/science/who-invented-alcohol.html',
    captions: {
      jiahu: 'La jarre de stockage de Jiahu analysée pour rechercher les traces d’une boisson fermentée apparaît en haut à gauche ; les autres panneaux montrent un récipient en bronze plus récent et des exemples des indices chimiques utilisés pour identifier des contenus anciens.',
      georgia: 'Une jarre du Néolithique ancien provenant de Khramis Didi-Gora, accompagnée de fragments de fonds de jarres issus des sites géorgiens étudiés pour leurs anciens résidus de vin. L’un des fonds conserve l’empreinte d’un textile.',
      enclosure: 'La principale zone de fouilles de Göbekli Tepe, avec l’enceinte D au premier plan. Ses piliers monumentaux en forme de T ont été dressés par des communautés de chasseurs-cueilleurs avant l’établissement de l’agriculture dans la région.',
      pillar: 'Le pilier 56 de l’enceinte H de Göbekli Tepe. Cette vue rapprochée révèle sa forme monumentale en T et la dense procession d’animaux sculptés sur sa surface.',
    },
    alt: {
      jiahu: 'Figure scientifique montrant une jarre de Jiahu, un récipient en bronze plus récent et des graphiques de résidus chimiques',
      georgia: 'Figure scientifique montrant une jarre géorgienne du Néolithique ancien et trois fragments mis au jour',
      enclosure: 'Vue générale des enceintes en pierre fouillées et des piliers en forme de T de Göbekli Tepe',
      pillar: 'Vue rapprochée du pilier 56 de Göbekli Tepe couvert de rangées d’animaux sculptés',
    },
  },
  id: {
    source: 'Who Invented Alcohol.id.md',
    target: 'id/science/who-invented-alcohol.html',
    captions: {
      jiahu: 'Kendi penyimpanan dari Jiahu yang dianalisis untuk mencari jejak minuman fermentasi terlihat di kiri atas; panel lainnya menampilkan bejana perunggu dari masa yang lebih kemudian serta contoh bukti kimia yang digunakan untuk mengenali isi benda purba.',
      georgia: 'Kendi Neolitikum awal dari Khramis Didi-Gora, ditampilkan bersama pecahan dasar kendi dari situs-situs Georgia yang diteliti untuk mencari residu anggur kuno. Salah satu dasarnya menyimpan jejak tenunan.',
      enclosure: 'Area penggalian utama Göbekli Tepe, dengan Kompleks D di bagian depan. Pilar-pilar monumental berbentuk T didirikan oleh komunitas pemburu-peramu sebelum pertanian berkembang di wilayah tersebut.',
      pillar: 'Pilar 56 di Kompleks H, Göbekli Tepe. Tampilan dekat memperlihatkan bentuk T yang monumental serta barisan padat hewan yang dipahat pada permukaannya.',
    },
    alt: {
      jiahu: 'Gambar ilmiah berisi kendi Jiahu, bejana perunggu yang lebih muda, dan grafik residu kimia',
      georgia: 'Gambar ilmiah berisi kendi Georgia dari Neolitikum awal dan tiga pecahan kendi hasil penggalian',
      enclosure: 'Tampilan luas kompleks batu dan pilar berbentuk T yang digali di Göbekli Tepe',
      pillar: 'Tampilan dekat Pilar 56 di Göbekli Tepe dengan barisan pahatan hewan',
    },
  },
  it: {
    source: 'Who Invented Alcohol.it.md',
    target: 'it/science/who-invented-alcohol.html',
    captions: {
      jiahu: 'In alto a sinistra compare l’orcio di Jiahu analizzato per individuare tracce di una bevanda fermentata; gli altri riquadri mostrano un recipiente in bronzo più tardo ed esempi delle prove chimiche utilizzate per riconoscere contenuti antichi.',
      georgia: 'Un orcio del primo Neolitico proveniente da Khramis Didi-Gora, accanto a frammenti di fondi di orci dei siti georgiani studiati per i residui di vino antico. Uno dei fondi conserva l’impronta di un tessuto.',
      enclosure: 'La principale area di scavo di Göbekli Tepe, con il Recinto D in primo piano. I monumentali pilastri a forma di T furono eretti da comunità di cacciatori-raccoglitori prima che l’agricoltura si affermasse nella regione.',
      pillar: 'Il pilastro 56 del Recinto H di Göbekli Tepe. La vista ravvicinata mostra la monumentale forma a T e la fitta processione di animali scolpiti sulla superficie.',
    },
    alt: {
      jiahu: 'Figura scientifica con un orcio di Jiahu, un recipiente in bronzo più tardo e grafici dei residui chimici',
      georgia: 'Figura scientifica con un orcio georgiano del primo Neolitico e tre frammenti rinvenuti negli scavi',
      enclosure: 'Veduta ampia dei recinti in pietra scavati e dei pilastri a forma di T di Göbekli Tepe',
      pillar: 'Vista ravvicinata del pilastro 56 di Göbekli Tepe con file di animali scolpiti',
    },
  },
  ja: {
    source: 'Who Invented Alcohol.ja.md',
    target: 'ja/science/who-invented-alcohol.html',
    captions: {
      jiahu: '左上は発酵飲料の痕跡が分析された賈湖の貯蔵甕。ほかのパネルには後代の青銅器と、古代の内容物を特定するために用いられた化学的証拠の例が示されている。',
      georgia: 'フラミス・ディディ・ゴラ出土の新石器時代初期の甕と、古代ワインの残留物が調べられたジョージア各地の遺跡の甕底片。甕底の一つには織物の圧痕が残っている。',
      enclosure: 'ギョベクリ・テペの主要発掘区。手前は囲い込みD。農耕がこの地域に定着する以前、狩猟採集民の共同体が記念碑的なT字形の柱を築いた。',
      pillar: 'ギョベクリ・テペ、囲い込みHの第56号柱。近景から、巨大なT字形と、表面に密集して刻まれた動物の列が分かる。',
    },
    alt: {
      jiahu: '賈湖の貯蔵甕、後代の青銅器、化学残留物のグラフを示す学術図版',
      georgia: 'ジョージアの新石器時代初期の甕と発掘された三つの甕片を示す学術図版',
      enclosure: 'ギョベクリ・テペで発掘された石造囲い込みとT字形の柱の全景',
      pillar: '動物の列が刻まれたギョベクリ・テペ第56号柱の近景',
    },
  },
  pt: {
    source: 'Who Invented Alcohol.pt.md',
    target: 'pt/science/who-invented-alcohol.html',
    captions: {
      jiahu: 'No canto superior esquerdo aparece o jarro de armazenamento de Jiahu analisado em busca de vestígios de uma bebida fermentada; os restantes painéis mostram um recipiente de bronze posterior e exemplos dos indícios químicos usados para identificar conteúdos antigos.',
      georgia: 'Um jarro do Neolítico antigo de Khramis Didi-Gora, ao lado de fragmentos de bases de jarros dos sítios georgianos estudados em busca de resíduos de vinho antigo. Uma das bases conserva a impressão de um tecido.',
      enclosure: 'A principal área de escavação de Göbekli Tepe, com o Recinto D em primeiro plano. Os seus pilares monumentais em forma de T foram erguidos por comunidades de caçadores-recoletores antes de a agricultura se estabelecer na região.',
      pillar: 'O pilar 56 do Recinto H de Göbekli Tepe. A vista aproximada revela a forma monumental em T e a densa sucessão de animais esculpidos na sua superfície.',
    },
    alt: {
      jiahu: 'Figura científica com um jarro de Jiahu, um recipiente de bronze posterior e gráficos de resíduos químicos',
      georgia: 'Figura científica com um jarro georgiano do Neolítico antigo e três fragmentos escavados',
      enclosure: 'Vista ampla dos recintos de pedra escavados e dos pilares em forma de T de Göbekli Tepe',
      pillar: 'Vista aproximada do pilar 56 de Göbekli Tepe com filas de animais esculpidos',
    },
  },
};

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function inline(markdown, { citations = true } = {}) {
  const links = [];
  let value = markdown.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, (_match, label, url) => {
    const token = `LINKTOKEN${links.length}ENDTOKEN`;
    links.push({ label, url });
    return token;
  });

  value = escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');

  if (citations) {
    value = value.replace(/\[(\d+)\]/g, '<a class="citation" href="#ref-$1" aria-label="Reference $1">[$1]</a>');
  }

  links.forEach(({ label, url }, index) => {
    value = value.replace(
      `LINKTOKEN${index}ENDTOKEN`,
      `<a href="${escapeHtml(url)}" rel="noopener noreferrer">${escapeHtml(label)}</a>`,
    );
  });

  return value;
}

function creditHtml(key) {
  const figure = figures[key];
  if (key === 'enclosure' || key === 'pillar') {
    return `Credit: <a href="${figure.source}" rel="noopener noreferrer">${figure.credit}</a>.`;
  }
  if (key === 'georgia') {
    return `<a href="${figure.source}" rel="noopener noreferrer">${figure.credit}</a> <a href="${figure.licence}" rel="noopener noreferrer">${figure.licenceText}</a> ${figure.tail}`;
  }
  return `<a href="${figure.source}" rel="noopener noreferrer">${figure.credit}</a> <a href="${figure.policy}" rel="noopener noreferrer">${figure.policyText}</a>`;
}

function figureHtml(key, edition) {
  const figure = figures[key];
  const portraitClass = figure.portrait ? ' history-figure--portrait' : '';
  return [
    `<figure class="history-figure${portraitClass}">`,
    `    <img src="/assets/science/history/${figure.file}" alt="${escapeHtml(edition.alt[key])}" width="${figure.width}" height="${figure.height}" loading="lazy" decoding="async">`,
    `    <figcaption>${escapeHtml(edition.captions[key])} <span class="history-image-credit">${creditHtml(key)}</span></figcaption>`,
    '</figure>',
  ].join('\n');
}

function argumentMapHtml(blocks) {
  const rows = blocks.map((block, index) => {
    const match = block.match(/^\*\*(.+?)\s*[:：]\*\*\s*(.+)$/s);
    if (!match) throw new Error(`Could not parse argument row: ${block}`);
    const conciseLabel = match[1].replace(/^.*?(?:—|――)\s*/u, '').trim();
    const label = conciseLabel
      ? `${conciseLabel[0].toLocaleUpperCase()}${conciseLabel.slice(1)}`
      : conciseLabel;
    const parts = match[2].split(/\s*(→|↔)\s*/);
    const path = parts
      .map((part, partIndex) =>
        partIndex % 2
          ? `<span class="history-argument-arrow">${part}</span>`
          : `<span class="history-argument-step">${inline(part, { citations: false })}</span>`,
      )
      .join('');
    const variants = ['thesis', 'antithesis', 'synthesis'];
    return [
      `    <div class="history-argument-row history-argument-row--${variants[index]}">`,
      `        <p class="history-argument-label">${inline(label, { citations: false })}</p>`,
      `        <div class="history-argument-path">${path}</div>`,
      '    </div>',
    ].join('\n');
  });
  return `<div class="history-argument-map">\n${rows.join('\n')}\n</div>`;
}

function nextHtml(block) {
  const text = block.replace(/^\*\*|\*\*$/g, '');
  const match = text.match(/^(.+?)\s*[:：]\s*(.+)$/s);
  if (!match) return `<div class="history-next"><strong>${inline(text, { citations: false })}</strong></div>`;
  return [
    '<div class="history-next">',
    `    <p>${inline(match[1], { citations: false })}</p>`,
    `    <strong>${inline(match[2], { citations: false })}</strong>`,
    '</div>',
  ].join('\n');
}

function parseEdition(markdown, edition) {
  const blocks = markdown
    .replaceAll('\r\n', '\n')
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const title = blocks.shift().replace(/^#\s+/, '');
  const subtitle = blocks.shift().replace(/^###\s+/, '');
  const intro = [];
  while (blocks.length && blocks[0] !== '---') intro.push(blocks.shift().replace(/\n/g, ' '));
  blocks.shift();
  if (intro.length !== 3) throw new Error(`Expected three introduction paragraphs for ${edition.target}`);

  const html = [];
  html.push(`                <p>${inline(intro[1])}</p>`);
  html.push(`                <p>${inline(intro[2])}</p>`);

  const sectionIds = ['when-title', 'what-title', 'why-title', 'conclusion-title', 'references-title'];
  let sectionIndex = -1;
  let sectionOpen = false;
  let referenceOpen = false;
  let subsectionIndex = 0;
  let afterFirstParagraph = null;

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index].replace(/\n/g, ' ');
    if (block === '---') continue;

    if (block.startsWith('## ')) {
      if (referenceOpen) {
        html.push('                    </ol>');
        html.push('                </section>');
        referenceOpen = false;
      } else if (sectionOpen) {
        html.push('                </section>');
      }
      sectionIndex += 1;
      const heading = block.slice(3);
      const id = sectionIds[sectionIndex];
      if (sectionIndex === 4) {
        html.push(`                <section class="history-references" aria-labelledby="${id}">`);
        html.push(`                    <h2 id="${id}">${inline(heading, { citations: false })}</h2>`);
        html.push('                    <ol>');
        referenceOpen = true;
        sectionOpen = false;
      } else {
        html.push(`                <section aria-labelledby="${id}">`);
        html.push(`                    <h2 id="${id}">${inline(heading, { citations: false })}</h2>`);
        sectionOpen = true;
      }
      continue;
    }

    if (referenceOpen) {
      const match = block.match(/^(\d+)\.\s+(.+)$/s);
      if (!match) throw new Error(`Could not parse reference in ${edition.target}: ${block}`);
      html.push(`                        <li id="ref-${match[1]}">${inline(match[2], { citations: false })}</li>`);
      continue;
    }

    if (block.startsWith('### ')) {
      subsectionIndex += 1;
      html.push(`                    <h3>${inline(block.slice(4), { citations: false })}</h3>`);
      if (subsectionIndex === 6) {
        html.push(figureHtml('enclosure', edition).split('\n').map((line) => `                    ${line}`).join('\n'));
        afterFirstParagraph = 'pillar';
      } else if (subsectionIndex === 2) {
        afterFirstParagraph = 'jiahu';
      } else if (subsectionIndex === 4) {
        afterFirstParagraph = 'georgia';
      } else {
        afterFirstParagraph = null;
      }
      continue;
    }

    if (/^\*\*/.test(block) && /[→↔]/.test(block)) {
      const argumentBlocks = [block, blocks[index + 1]?.replace(/\n/g, ' '), blocks[index + 2]?.replace(/\n/g, ' ')];
      if (argumentBlocks.some((entry) => !entry || !/[→↔]/.test(entry))) {
        throw new Error(`Expected a three-row argument map in ${edition.target}`);
      }
      html.push(argumentMapHtml(argumentBlocks).split('\n').map((line) => `                    ${line}`).join('\n'));
      index += 2;
      continue;
    }

    if (/^\*\*/.test(block)) {
      html.push(nextHtml(block).split('\n').map((line) => `                    ${line}`).join('\n'));
      continue;
    }

    html.push(`                    <p>${inline(block)}</p>`);
    if (afterFirstParagraph) {
      html.push(figureHtml(afterFirstParagraph, edition).split('\n').map((line) => `                    ${line}`).join('\n'));
      afterFirstParagraph = null;
    }
  }

  if (referenceOpen) {
    html.push('                    </ol>');
    html.push('                </section>');
  } else if (sectionOpen) {
    html.push('                </section>');
  }

  return { title, subtitle, deck: intro[0], body: html.join('\n') };
}

const sourceAssetDirectory = join(resolve(sourceDirectory), '_assets', 'selected');
const targetAssetDirectory = join(ROOT, 'assets', 'science', 'history');
mkdirSync(targetAssetDirectory, { recursive: true });
for (const figure of Object.values(figures)) {
  copyFileSync(join(sourceAssetDirectory, figure.file), join(targetAssetDirectory, figure.file));
}

for (const [locale, edition] of Object.entries(editions)) {
  const markdown = readFileSync(join(resolve(sourceDirectory), edition.source), 'utf8');
  const parsed = parseEdition(markdown, edition);
  const target = join(ROOT, edition.target);
  let page = readFileSync(target, 'utf8').replaceAll('\r\n', '\n');

  page = page
    .replace(/<meta property="article:modified_time" content="[^"]+">/, `<meta property="article:modified_time" content="${MODIFIED_TIME}">`)
    .replace(/"dateModified": "[^"]+"/, `"dateModified": "${MODIFIED_DATE}"`)
    .replace(/<h1 class="history-title">[\s\S]*?<\/h1>/, `<h1 class="history-title">${inline(parsed.title, { citations: false })}</h1>`)
    .replace(/<p class="history-subtitle">[\s\S]*?<\/p>/, `<p class="history-subtitle">${inline(parsed.subtitle, { citations: false })}</p>`)
    .replace(/<p class="history-deck">[\s\S]*?<\/p>/, `<p class="history-deck">${inline(parsed.deck)}</p>`)
    .replace(
      /<div class="history-copy">[\s\S]*?<\/div>\s*<\/article>/,
      `<div class="history-copy">\n${parsed.body}\n            </div>\n        </article>`,
    );

  writeFileSync(target, page.replaceAll('\n', '\r\n'));
  console.log(`Updated ${locale}: ${edition.target}`);
}
