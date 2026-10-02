import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source2018 = 'https://www.who.int/publications/i/item/9789241565639';
const source2024 = 'https://www.who.int/publications/i/item/9789240096745';
// Equivalent existing reference slot in every language: newer background is
// not a claim that the calculator thresholds have been rebased to a new report.
const notes = {
  en: 'The link above points to the 2018 edition. For newer background, see WHO’s 2024 report on alcohol, health and treatment of substance use disorders. The guideline sources for the thresholds on this page are unchanged.',
  de: 'Der obige Link führt zur Ausgabe von 2018. Neuere Hintergrundinformationen bietet der WHO-Bericht von 2024 zu Alkohol, Gesundheit und der Behandlung von Störungen durch Substanzkonsum. Die Leitlinien, auf denen die hier beschriebenen Schwellenwerte beruhen, bleiben unverändert.',
  fr: 'Le lien ci-dessus renvoie à l’édition de 2018. Pour des informations plus récentes, consultez le rapport de l’OMS de 2024 sur l’alcool, la santé et le traitement des troubles liés à l’usage de substances. Les recommandations qui fondent les seuils présentés sur cette page restent inchangées.',
  es: 'El enlace anterior corresponde a la edición de 2018. Para obtener información más reciente, consulta el informe de la OMS de 2024 sobre alcohol, salud y tratamiento de los trastornos por consumo de sustancias. Las guías en las que se basan los umbrales de esta página no han cambiado.',
  pt: 'O link acima remete para a edição de 2018. Para informações mais recentes, consulte o relatório da OMS de 2024 sobre álcool, saúde e tratamento de perturbações relacionadas com o consumo de substâncias. As diretrizes que fundamentam os limiares desta página permanecem inalteradas.',
  it: 'Il link sopra rimanda all’edizione del 2018. Per informazioni più recenti, consulta il rapporto OMS del 2024 su alcol, salute e trattamento dei disturbi da uso di sostanze. Le linee guida alla base delle soglie indicate in questa pagina restano invariate.',
  ja: '上のリンクは2018年版です。より新しい背景情報は、アルコール、健康、物質使用障害の治療に関するWHOの2024年報告書をご覧ください。このページの基準値の根拠として挙げているガイドラインに変更はありません。',
  id: 'Tautan di atas mengarah ke edisi 2018. Untuk informasi yang lebih baru, lihat laporan WHO tahun 2024 tentang alkohol, kesehatan, dan penanganan gangguan penggunaan zat. Pedoman yang menjadi dasar ambang batas pada halaman ini tidak berubah.',
};

for (const [locale, note] of Object.entries(notes)) {
  test(`${locale}: WHO reference retains the 2018 source and distinguishes 2024 background from guideline changes`, () => {
    const path = `${locale === 'en' ? '' : `${locale}/`}methodology.html`;
    const html = readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
    const block = html.match(/<a href="https:\/\/www\.who\.int\/publications\/i\/item\/9789241565639"[\s\S]*?<\/p>\s*<p class="small-muted"[^>]*>([\s\S]*?)<\/p>/);
    assert.ok(block, 'Retain both existing reference paragraphs');
    const oldAnchor = block[0].match(/<a\b[^>]*>([^<]*)<\/a>/)[1];
    assert.match(oldAnchor, /2018/);
    assert.equal(html.split(`href="${source2018}"`).length - 1, 1);
    assert.equal(html.split(`href="${source2024}"`).length - 1, 1);
    assert.ok(block[1].includes(`href="${source2024}" target="_blank" rel="noopener noreferrer"`));
    assert.equal(block[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(), note);
    const article = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map(match => JSON.parse(match[1])).find(data => data['@type'] === 'Article');
    assert.ok(article.dateModified >= '2026-10-02', 'Article modification date covers the source correction');
  });
}
